'use client';

import React, { useState, useEffect } from 'react';
import { ratingService, RatingStatsDTO } from '../../lib/services/ratingService';
import RatingModal from './RatingModal';

interface RatingButtonProps {
  userId: number;
  userName: string;
  userType: 'JOB_SEEKER' | 'TECHNICIAN';
  variant?: 'compact' | 'full' | 'button-only';
  showRatingCount?: boolean;
  className?: string;
}

const RatingButton: React.FC<RatingButtonProps> = ({
  userId,
  userName,
  userType,
  variant = 'compact',
  showRatingCount = true,
  className = ''
}) => {
  const [stats, setStats] = useState<RatingStatsDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatingStats();
  }, [userId]);

  const loadRatingStats = async () => {
    setLoading(true);
    try {
      const statsData = await ratingService.getRatingStats(userId);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load rating stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
    
    return (
      <div className={`flex items-center ${sizeClass}`}>
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

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  // Button-only variant
  if (variant === 'button-only') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className={`bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm ${className}`}
        >
          Rate User
        </button>
        
        <RatingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
          userName={userName}
          userType={userType}
          mode="both"
        />
      </>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <>
        <div 
          className={`flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
          onClick={() => setModalOpen(true)}
        >
          {stats && stats.totalRatings > 0 ? (
            <>
              {renderStars(stats.averageRating)}
              <span className={`text-sm font-medium ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating.toFixed(1)}
              </span>
              {showRatingCount && (
                <span className="text-xs text-gray-500">
                  ({stats.totalRatings})
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">No ratings</span>
          )}
        </div>
        
        <RatingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
          userName={userName}
          userType={userType}
          mode="both"
        />
      </>
    );
  }

  // Full variant
  return (
    <>
      <div 
        className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">User Rating</h4>
            {stats && stats.totalRatings > 0 ? (
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(stats.averageRating, 'md')}
                <span className={`font-semibold ${getRatingColor(stats.averageRating)}`}>
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">No ratings yet</p>
            )}
          </div>
          
          <div className="text-right">
            {showRatingCount && stats && (
              <div className="text-sm text-gray-600">
                {stats.totalRatings} review{stats.totalRatings !== 1 ? 's' : ''}
              </div>
            )}
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
              View/Rate →
            </button>
          </div>
        </div>
      </div>
      
      <RatingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={userId}
        userName={userName}
        userType={userType}
        mode="both"
      />
    </>
  );
};

export default RatingButton;