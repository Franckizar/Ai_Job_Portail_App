import { fetchWithAuth } from '../../fetchWithAuth';

export interface RatingCategory {
  value: string;
  label: string;
}

export interface CreateRatingRequest {
  ratedUserId: number;
  rating: number;
  comment?: string;
  category: string;
  ratedUserType: 'JOB_SEEKER' | 'TECHNICIAN';
}

export interface RatingDTO {
  id: number;
  raterId: number;
  raterName: string;
  raterEmail: string;
  ratedUserId: number;
  ratedUserName: string;
  ratedUserEmail: string;
  rating: number;
  comment?: string;
  category: string;
  categoryDisplayName: string;
  ratedUserType: 'JOB_SEEKER' | 'TECHNICIAN';
  createdAt: string;
  updatedAt: string;
}

export interface RatingStatsDTO {
  userId: number;
  userName: string;
  userEmail: string;
  userType: 'JOB_SEEKER' | 'TECHNICIAN';
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  categoryAverages: Record<string, number>;
  categoryCounts: Record<string, number>;
  formattedAverageRating: string;
  starDisplay: string;
  ratingLevel: string;
}

class RatingService {
  private baseUrl = '/api/v1/auth/ratings';

  async createRating(raterId: number, request: CreateRatingRequest): Promise<RatingDTO> {
    const response = await fetchWithAuth(`${this.baseUrl}/${raterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create rating');
    }

    return response.json();
  }

  async getRatingsForUser(userId: number): Promise<RatingDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ratings');
    }

    return response.json();
  }

  async getRatingsForUserByCategory(userId: number, category: string): Promise<RatingDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/user/${userId}/category/${category}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ratings by category');
    }

    return response.json();
  }

  async getRatingsGivenByUser(userId: number): Promise<RatingDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/user/${userId}/given-ratings`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ratings given by user');
    }

    return response.json();
  }

  async getRatingStats(userId: number): Promise<RatingStatsDTO> {
    const response = await fetchWithAuth(`${this.baseUrl}/user/${userId}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch rating stats');
    }

    return response.json();
  }

  async getRecentRatingsForUser(userId: number, limit: number = 5): Promise<RatingDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/user/${userId}/recent?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent ratings');
    }

    return response.json();
  }

  async getTopRatedJobSeekers(limit: number = 10, minRatings: number = 3): Promise<RatingStatsDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/top-job-seekers?limit=${limit}&minRatings=${minRatings}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch top rated job seekers');
    }

    return response.json();
  }

  async getTopRatedTechnicians(limit: number = 10, minRatings: number = 3): Promise<RatingStatsDTO[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/top-technicians?limit=${limit}&minRatings=${minRatings}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch top rated technicians');
    }

    return response.json();
  }

  async updateRating(ratingId: number, userId: number, request: CreateRatingRequest): Promise<RatingDTO> {
    const response = await fetchWithAuth(`${this.baseUrl}/${ratingId}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to update rating');
    }

    return response.json();
  }

  async deleteRating(ratingId: number, userId: number): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/${ratingId}/user/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete rating');
    }
  }

  async canRateUser(raterId: number, userId: number, category: string): Promise<boolean> {
    const response = await fetchWithAuth(`${this.baseUrl}/can-rate/${raterId}/${userId}/category/${category}`);
    
    if (!response.ok) {
      throw new Error('Failed to check if user can be rated');
    }

    const result = await response.json();
    return result.canRate;
  }

  async getRatingBetweenUsers(raterId: number, userId: number, category: string): Promise<RatingDTO | null> {
    const response = await fetchWithAuth(`${this.baseUrl}/between/${raterId}/${userId}/category/${category}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch rating between users');
    }

    return response.json();
  }

  async getRatingCategories(): Promise<RatingCategory[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch rating categories');
    }

    return response.json();
  }

  // Removed getMyRatingStats - use getRatingStats(userId) instead

  // Helper methods
  renderStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating - fullStars) >= 0.5;
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars && i < 5; i++) {
      stars += '★';
    }
    
    // Add half star if needed
    if (hasHalfStar && fullStars < 5) {
      stars += '☆';
    }
    
    // Add empty stars
    const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
    for (let i = totalStars; i < 5; i++) {
      stars += '☆';
    }
    
    return stars;
  }

  getRatingLevel(rating: number): string {
    if (rating === 0) {
      return 'Not Rated';
    } else if (rating < 2.0) {
      return 'Poor';
    } else if (rating < 3.0) {
      return 'Fair';
    } else if (rating < 4.0) {
      return 'Good';
    } else if (rating < 4.5) {
      return 'Very Good';
    } else {
      return 'Excellent';
    }
  }

  getRatingColor(rating: number): string {
    if (rating === 0) {
      return 'text-gray-400';
    } else if (rating < 2.0) {
      return 'text-red-500';
    } else if (rating < 3.0) {
      return 'text-orange-500';
    } else if (rating < 4.0) {
      return 'text-yellow-500';
    } else if (rating < 4.5) {
      return 'text-blue-500';
    } else {
      return 'text-green-500';
    }
  }
}

export const ratingService = new RatingService();