// lib/services/subscriptionService.ts

// Types based on backend implementation
export interface SubscriptionPlan {
  name: string;
  type: 'FREE' | 'STANDARD' | 'PREMIUM';
  monthlyPrice: number;
  applicationLimit: number;
  description: string;
}

export interface Subscription {
  id: number;
  planType: 'FREE' | 'STANDARD' | 'PREMIUM';
  startDate: string;
  endDate: string;
  subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  amount: number;
  transactionId?: string;
  createdAt: string;
}

export interface SubscriptionPaymentResponse {
  success: boolean;
  subscriptionId: number;
  transactionId: string;
  amount: number;
  message: string;
}

export interface UserSubscriptionInfo {
  currentPlan: 'FREE' | 'STANDARD' | 'PREMIUM';
  isFreeSubscribed: boolean;
  isStandardSubscribed: boolean;
  isPremiumSubscribed: boolean;
  subscriptionExpiresAt?: string;
  activeSubscription?: Subscription;
}

// API Base URL - Updated to port 8088
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088';

export class SubscriptionService {
  
  /**
   * Get available subscription plans
   */
  static async getAvailablePlans(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/plans`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription plans: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  /**
   * Get user's subscriptions
   */
  static async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user subscriptions: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(userId: number, planType: 'FREE' | 'STANDARD' | 'PREMIUM'): Promise<Subscription> {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/subscriptions/create?userId=${userId}&planType=${planType}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create subscription: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Process subscription payment
   * Endpoint: /api/v1/auth/subscription-payments/process?userId=1&planType=STANDARD&phoneNumber=652972651
   */
  static async processSubscriptionPayment(
    userId: number,
    planType: 'STANDARD' | 'PREMIUM',
    phoneNumber: string
  ): Promise<SubscriptionPaymentResponse> {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/subscription-payments/process?userId=${userId}&planType=${planType}&phoneNumber=${phoneNumber}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Check if user can apply for jobs
   */
  static async canUserApply(userId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/can-apply/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to check user application eligibility: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error checking user eligibility:', error);
      throw error;
    }
  }

  /**
   * Check expired subscriptions (admin function)
   */
  static async checkExpiredSubscriptions(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/expire-check`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check expired subscriptions: ${response.status}`);
      }
      
      return response.text();
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get total payments amount (admin function)
   */
  static async getTotalPaymentsAmount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/total-amount`);
      
      if (!response.ok) {
        throw new Error(`Failed to get total payments amount: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting total payments:', error);
      throw error;
    }
  }

  /**
   * Get current user subscription info with actual data from backend
   */
  static async getCurrentUserInfo(userId: number): Promise<UserSubscriptionInfo> {
    try {
      const subscriptions = await this.getUserSubscriptions(userId);
      
      // Find the active subscription
      const activeSubscription = subscriptions.find(
        sub => sub.subscriptionStatus === 'ACTIVE'
      );

      if (!activeSubscription) {
        // No active subscription - user is on FREE plan
        return {
          currentPlan: 'FREE',
          isFreeSubscribed: true,
          isStandardSubscribed: false,
          isPremiumSubscribed: false,
          subscriptionExpiresAt: undefined,
          activeSubscription: undefined
        };
      }

      return {
        currentPlan: activeSubscription.planType,
        isFreeSubscribed: activeSubscription.planType === 'FREE',
        isStandardSubscribed: activeSubscription.planType === 'STANDARD',
        isPremiumSubscribed: activeSubscription.planType === 'PREMIUM',
        subscriptionExpiresAt: activeSubscription.endDate,
        activeSubscription: activeSubscription
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Return default FREE plan on error
      return {
        currentPlan: 'FREE',
        isFreeSubscribed: true,
        isStandardSubscribed: false,
        isPremiumSubscribed: false,
        subscriptionExpiresAt: undefined
      };
    }
  }

  /**
   * Get subscription plan details
   */
  static getSubscriptionPlanDetails(): SubscriptionPlan[] {
    return [
      {
        name: "Basic",
        type: "FREE",
        monthlyPrice: 0,
        applicationLimit: 5,
        description: "Basic features"
      },
      {
        name: "Premium",
        type: "STANDARD",
        monthlyPrice: 5000,
        applicationLimit: 50,
        description: "Enhanced features"
      },
      {
        name: "Enterprise",
        type: "PREMIUM",
        monthlyPrice: 15000,
        applicationLimit: -1,
        description: "All features + priority"
      }
    ];
  }
}