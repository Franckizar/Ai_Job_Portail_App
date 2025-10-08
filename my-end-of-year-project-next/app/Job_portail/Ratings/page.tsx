'use client';

import React, { useState, useEffect } from 'react';
import { ratingService, RatingStatsDTO } from '../../../lib/services/ratingService';
import RatingModal from '../../../components/rating/RatingModal';
import { fetchWithAuth } from '../../../fetchWithAuth';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
}

interface UserWithRating extends User {
  averageRating: number;
  totalRatings: number;
  ratingStats?: RatingStatsDTO;
}

const RatingsPage: React.FC = () => {
  const [allJobSeekers, setAllJobSeekers] = useState<UserWithRating[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<UserWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    type: 'JOB_SEEKER' | 'TECHNICIAN';
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'job_seekers' | 'technicians'>('job_seekers');

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all users from the backend
      const response = await fetchWithAuth('/api/v1/auth/ratings/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users: User[] = await response.json();
      
      // Separate job seekers and technicians
      const jobSeekers = users.filter(user =>
        user.roles.includes('JOB_SEEKER')
      );
      const technicians = users.filter(user =>
        user.roles.includes('TECHNICIAN')
      );

      // Get rating stats for each user
      const jobSeekersWithRatings = await Promise.all(
        jobSeekers.map(async (user) => {
          try {
            const stats = await ratingService.getRatingStats(user.id);
            return {
              ...user,
              averageRating: stats.averageRating || 0,
              totalRatings: stats.totalRatings || 0,
              ratingStats: stats
            };
          } catch {
            return {
              ...user,
              averageRating: 0,
              totalRatings: 0
            };
          }
        })
      );

      const techniciansWithRatings = await Promise.all(
        technicians.map(async (user) => {
          try {
            const stats = await ratingService.getRatingStats(user.id);
            return {
              ...user,
              averageRating: stats.averageRating || 0,
              totalRatings: stats.totalRatings || 0,
              ratingStats: stats
            };
          } catch {
            return {
              ...user,
              averageRating: 0,
              totalRatings: 0
            };
          }
        })
      );

      // Sort by rating (highest first), then by name
      jobSeekersWithRatings.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      });

      techniciansWithRatings.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      });

      setAllJobSeekers(jobSeekersWithRatings);
      setAllTechnicians(techniciansWithRatings);
    } catch (error) {
      setError('Failed to load users');
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: UserWithRating, type: 'JOB_SEEKER' | 'TECHNICIAN') => {
    setSelectedUser({
      id: user.id,
      name: `${user.firstname} ${user.lastname}`,
      type
    });
    setModalOpen(true);
  };

  const refreshUserRatings = () => {
    loadAllUsers();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number): string => {
    if (rating === 0) return 'text-gray-400';
    if (rating < 2.0) return 'text-red-500';
    if (rating < 3.0) return 'text-orange-500';
    if (rating < 4.0) return 'text-yellow-500';
    if (rating < 4.5) return 'text-blue-500';
    return 'text-green-500';
  };

  const UserCard: React.FC<{ user: UserWithRating; type: 'JOB_SEEKER' | 'TECHNICIAN'; rank: number }> = ({
    user,
    type,
    rank
  }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleUserClick(user, type)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
            #{rank}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.firstname} {user.lastname}</h3>
            <p className="text-sm text-gray-600">
              {type === 'JOB_SEEKER' ? 'Job Seeker' : 'Technician'}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getRatingColor(user.averageRating)}`}>
            {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {user.totalRatings} review{user.totalRatings !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        {user.averageRating > 0 ? renderStars(user.averageRating) : (
          <div className="flex items-center text-gray-400">
            <span className="text-sm">No ratings yet</span>
          </div>
        )}
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {user.totalRatings > 0 ? 'View/Rate →' : 'Rate User →'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading top rated users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAllUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Users</h1>
          <p className="text-gray-600">
            Rate job seekers and technicians to help build our community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setActiveTab('job_seekers')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'job_seekers'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Seekers ({allJobSeekers.length})
            </button>
            <button
              onClick={() => setActiveTab('technicians')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'technicians'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Technicians ({allTechnicians.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'job_seekers' && (
            <div>
              {allJobSeekers.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {allJobSeekers.map((user, index) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      type="JOB_SEEKER"
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Job Seekers Found
                  </h3>
                  <p className="text-gray-600">
                    No job seekers are currently registered in the system.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technicians' && (
            <div>
              {allTechnicians.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {allTechnicians.map((user, index) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      type="TECHNICIAN"
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Technicians Found
                  </h3>
                  <p className="text-gray-600">
                    No technicians are currently registered in the system.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        {selectedUser && (
          <RatingModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedUser(null);
              refreshUserRatings(); // Refresh the list after rating
            }}
            userId={selectedUser.id}
            userName={selectedUser.name}
            userType={selectedUser.type}
            mode="both"
          />
        )}
      </div>
    </div>
  );
};

export default RatingsPage;