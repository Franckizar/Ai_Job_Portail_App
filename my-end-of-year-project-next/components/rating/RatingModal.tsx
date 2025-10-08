'use client';

import React, { useState, useEffect } from 'react';
import RatingForm from './RatingForm';
import RatingDisplay from './RatingDisplay';
import { ratingService, RatingDTO } from '../../lib/services/ratingService';
import { useAuth } from '../Job_portail/Home/components/auth/AuthContext';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  userType: 'JOB_SEEKER' | 'TECHNICIAN';
  mode?: 'view' | 'rate' | 'both';
  category?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userType,
  mode = 'both',
  category
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'rate'>('view');
  const [existingRating, setExistingRating] = useState<RatingDTO | null>(null);
  const [canRate, setCanRate] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      checkRatingPermissions();
    }
  }, [isOpen, userId, category]);

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

  const checkRatingPermissions = async () => {
    setLoading(true);
    
    try {
      const currentUserId = getCurrentUserId();
      
      if (category) {
        // Check if user can rate for specific category
        const canRateResult = await ratingService.canRateUser(currentUserId, userId, category);
        setCanRate(canRateResult);

        // Check if there's an existing rating
        const existingRatingResult = await ratingService.getRatingBetweenUsers(currentUserId, userId, category);
        setExistingRating(existingRatingResult);
      } else {
        // For general rating, assume they can rate
        setCanRate(true);
      }
    } catch (error) {
      console.error('Failed to check rating permissions:', error);
      setCanRate(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmitted = () => {
    // Refresh the display and close the form
    checkRatingPermissions();
    if (mode === 'rate') {
      onClose();
    } else {
      setActiveTab('view');
    }
  };

  const handleClose = () => {
    setActiveTab('view');
    setExistingRating(null);
    setCanRate(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {userName} - {userType === 'JOB_SEEKER' ? 'Job Seeker' : 'Technician'} Ratings
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs (only show if mode is 'both') */}
        {mode === 'both' && !loading && (
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'view'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              View Ratings
            </button>
            {(canRate || existingRating) && (
              <button
                onClick={() => setActiveTab('rate')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'rate'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {existingRating ? 'Update Rating' : 'Rate User'}
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <>
              {/* View Mode or View Tab */}
              {(mode === 'view' || (mode === 'both' && activeTab === 'view')) && (
                <RatingDisplay
                  userId={userId}
                  userName={userName}
                  showStats={true}
                  showRecentRatings={true}
                  maxRecentRatings={10}
                />
              )}

              {/* Rate Mode or Rate Tab */}
              {(mode === 'rate' || (mode === 'both' && activeTab === 'rate')) && (
                <>
                  {canRate || existingRating ? (
                    <RatingForm
                      ratedUserId={userId}
                      ratedUserName={userName}
                      ratedUserType={userType}
                      onRatingSubmitted={handleRatingSubmitted}
                      onCancel={mode === 'rate' ? handleClose : () => setActiveTab('view')}
                      existingRating={existingRating || undefined}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🚫</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Cannot Rate This User
                      </h3>
                      <p className="text-gray-600">
                        You may have already rated this user for the selected category,
                        or you don&apos;t have permission to rate them.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;