'use client';

import React, { useState, useEffect } from 'react';
import { ratingService, RatingDTO, RatingStatsDTO } from '../../lib/services/ratingService';

interface RatingDisplayProps {
  userId: number;
  userName?: string;
  showStats?: boolean;
  showRecentRatings?: boolean;
  maxRecentRatings?: number;
  compact?: boolean;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  userId,
  userName,
  showStats = true,
  showRecentRatings = true,
  maxRecentRatings = 5,
  compact = false
}) => {
  const [stats, setStats] = useState<RatingStatsDTO | null>(null);
  const [recentRatings, setRecentRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadRatingData();
  }, [userId]);

  const loadRatingData = async () => {
    setLoading(true);
    setError('');

    try {
      const promises = [];
      
      if (showStats) {
        promises.push(ratingService.getRatingStats(userId));
      }
      
      if (showRecentRatings) {
        promises.push(ratingService.getRecentRatingsForUser(userId, maxRecentRatings));
      }

      const results = await Promise.all(promises);
      
      if (showStats) {
        setStats(results[0] as RatingStatsDTO);
      }
      
      if (showRecentRatings) {
        const ratingsIndex = showStats ? 1 : 0;
        setRecentRatings(results[ratingsIndex] as RatingDTO[]);
      }
    } catch (error) {
      setError('Failed to load rating data');
      console.error('Rating data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl'
    };

    return (
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
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

  const getRatingLevel = (rating: number): string => {
    if (rating === 0) return 'Not Rated';
    if (rating < 2.0) return 'Poor';
    if (rating < 3.0) return 'Fair';
    if (rating < 4.0) return 'Good';
    if (rating < 4.5) return 'Very Good';
    return 'Excellent';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
        {error}
      </div>
    );
  }

  if (compact && stats) {
    return (
      <div className="flex items-center space-x-2">
        {renderStars(Math.round(stats.averageRating), 'sm')}
        <span className={`text-sm font-medium ${getRatingColor(stats.averageRating)}`}>
          {stats.averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">
          ({stats.totalRatings} review{stats.totalRatings !== 1 ? 's' : ''})
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {userName ? `${userName}'s Ratings` : 'User Ratings'}
        </h3>
      </div>

      {/* Rating Stats */}
      {showStats && stats && (
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {getRatingLevel(stats.averageRating)}
              </div>
            </div>
            
            <div className="flex-1">
              {renderStars(Math.round(stats.averageRating), 'lg')}
              <div className="text-sm text-gray-600 mt-1">
                Based on {stats.totalRatings} review{stats.totalRatings !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          {stats.ratingDistribution && Object.keys(stats.ratingDistribution).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution[star] || 0;
                const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center space-x-2 text-sm">
                    <span className="w-8">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Category Averages */}
          {stats.categoryAverages && Object.keys(stats.categoryAverages).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category Ratings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(stats.categoryAverages).map(([category, average]) => {
                  if (average === null || average === 0) return null;
                  
                  const categoryCount = stats.categoryCounts[category] || 0;
                  if (categoryCount === 0) return null;

                  return (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.round(average), 'sm')}
                        <span className="text-gray-500">({categoryCount})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Ratings */}
      {showRecentRatings && recentRatings.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Reviews</h4>
          <div className="space-y-3">
            {recentRatings.map((rating) => (
              <div key={rating.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {renderStars(rating.rating, 'sm')}
                    <span className="text-sm font-medium">{rating.raterName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="text-xs text-gray-600 mb-1">
                  {rating.categoryDisplayName}
                </div>
                
                {rating.comment && (
                  <p className="text-sm text-gray-700">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Ratings Message */}
      {(!stats || stats.totalRatings === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⭐</div>
          <p>No ratings yet</p>
          <p className="text-sm">Be the first to leave a review!</p>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;