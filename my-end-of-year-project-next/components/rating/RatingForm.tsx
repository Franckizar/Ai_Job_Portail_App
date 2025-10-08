'use client';

import React, { useState, useEffect } from 'react';
import { ratingService, CreateRatingRequest, RatingCategory, RatingDTO } from '../../lib/services/ratingService';
import { useAuth } from '../Job_portail/Home/components/auth/AuthContext';

interface RatingFormProps {
  ratedUserId: number;
  ratedUserName: string;
  ratedUserType: 'JOB_SEEKER' | 'TECHNICIAN';
  onRatingSubmitted?: () => void;
  onCancel?: () => void;
  existingRating?: RatingDTO;
}

const RatingForm: React.FC<RatingFormProps> = ({
  ratedUserId,
  ratedUserName,
  ratedUserType,
  onRatingSubmitted,
  onCancel,
  existingRating
}) => {
  const [rating, setRating] = useState<number>(existingRating?.rating || 0);
  const [comment, setComment] = useState<string>(existingRating?.comment || '');
  const [category, setCategory] = useState<string>(existingRating?.category || '');
  const [categories, setCategories] = useState<RatingCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  // Get current user ID
  const getCurrentUserId = (): number => {
    if (user?.userId) {
      return user.userId;
    }
    // Fallback to localStorage
    const userIdStr = localStorage.getItem('user_id');
    if (userIdStr) {
      return parseInt(userIdStr);
    }
    throw new Error('User not authenticated');
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await ratingService.getRatingCategories();
      setCategories(categoriesData);
      if (!category && categoriesData.length > 0) {
        setCategory(categoriesData[0].value);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const request: CreateRatingRequest = {
        ratedUserId,
        rating,
        comment: comment.trim() || undefined,
        category,
        ratedUserType
      };

      const currentUserId = getCurrentUserId();
      
      if (existingRating) {
        await ratingService.updateRating(existingRating.id, currentUserId, request);
      } else {
        await ratingService.createRating(currentUserId, request);
      }

      onRatingSubmitted?.();
    } catch (error) {
      setError('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-colors duration-200 ${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } hover:text-yellow-400`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {existingRating ? 'Update Rating' : 'Rate'} {ratedUserName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Select rating category"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          {renderStars()}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RatingForm;