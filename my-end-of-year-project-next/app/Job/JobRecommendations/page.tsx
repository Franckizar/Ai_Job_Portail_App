"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';

interface JobResponse {
  id: number;
  title: string;
  employerName: string;
  city: string;
}

interface AiJobMatchDto {
  matchId: number;
  userId: number;
  job: JobResponse;
  matchScore: number;
  keywordsMatched: string;
  generatedAt: string;
}

export default function JobRecommendations() {
  const { user, isLoading: authLoading } = useAuth();
  const [jobMatches, setJobMatches] = useState<AiJobMatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobMatches = async () => {
      if (authLoading) {
        console.log('Waiting for auth to complete...');
        return;
      }

      if (!user) {
        console.log('No user found in AuthContext');
        setError('Please log in to view job recommendations.');
        setLoading(false);
        return;
      }

      if (!['JOB_SEEKER', 'TECHNICIAN'].includes(user.role)) {
        console.log(`User role ${user.role} not allowed for job recommendations`);
        setError('Job recommendations are only available for Job Seekers and Technicians.');
        setLoading(false);
        return;
      }

      const userId = user.role === 'JOB_SEEKER' ? user.jobSeekerId : user.technicianId;
      if (!userId) {
        console.log(`No ${user.role === 'JOB_SEEKER' ? 'jobSeekerId' : 'technicianId'} found for user`);
        setError('User ID not found for job recommendations.');
        setLoading(false);
        return;
      }
const test = 12;
      console.log(`Fetching job matches for userId: ${userId}, role: ${user.role}`);

      setLoading(true);
      try {
        const response = await fetchWithAuth(
        //   `http://localhost:8088/api/v1/auth/ai-job-match/user/ai/${userId}`
          `http://localhost:8088/api/v1/auth/ai-job-match/user/ai/${test}`
        );
        console.log('API response status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch job matches');
        }
        const matches: AiJobMatchDto[] = await response.json();
        console.log('Fetched job matches:', matches);
        setJobMatches(matches);
        if (matches.length === 0) {
          console.log('No job matches returned from API');
          setError('No job recommendations available at this time.');
        }
      } catch (err) {
        console.error('Error fetching job matches:', err);
        toast.error('Failed to load job recommendations');
        setError('Failed to load job recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, [user, authLoading]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
        Your Job Recommendations
      </h2>
      {authLoading || loading ? (
        <div className="text-center text-base sm:text-lg text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-base sm:text-lg text-red-600">{error}</div>
      ) : jobMatches.length === 0 ? (
        <p className="text-center text-gray-600">No job recommendations available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobMatches.map((match) => (
            <div
              key={match.matchId}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-lg font-semibold text-blue-600 mb-2 line-clamp-1">
                {match.job.title}
              </h4>
              <p className="text-sm text-gray-700">
                <strong>Company:</strong> {match.job.employerName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {match.job.city}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Match Score:</strong> {(match.matchScore * 100).toFixed(0)}%
              </p>
              {match.keywordsMatched && (
                <p className="text-sm text-gray-700 line-clamp-1">
                  <strong>Keywords:</strong> {match.keywordsMatched}
                </p>
              )}
              <button
                className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => alert(`Apply for ${match.job.title}`)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}