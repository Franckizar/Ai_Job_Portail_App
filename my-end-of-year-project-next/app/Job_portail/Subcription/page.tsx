'use client';
import { Check, Zap, Star, BadgeCheck, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";
import { useState, useEffect } from 'react';
import { SubscriptionService, UserSubscriptionInfo, SubscriptionPaymentResponse } from '@/lib/services/subscriptionService';
import PaymentForm from '@/components/subscription/PaymentForm';
import SubscriptionTest from '@/components/subscription/SubscriptionTest';

interface PlanData {
  name: string;
  type: 'FREE' | 'STANDARD' | 'PREMIUM';
  price: string;
  numericPrice: number;
  duration: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export default function SubscriptionPage() {
  const [userInfo, setUserInfo] = useState<UserSubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [userId, setUserId] = useState<number | null>(null);

  const plans: PlanData[] = [
    {
      name: "Basic",
      type: "FREE",
      price: "Free",
      numericPrice: 0,
      duration: "forever",
      features: [
        "Access to job listings",
        "5 job applications/month",
        "Basic profile visibility",
        "Email support"
      ],
      cta: "Current Plan",
      popular: false
    },
    {
      name: "Premium",
      type: "STANDARD",
      price: "5,000",
      numericPrice: 5000,
      duration: "month",
      features: [
        "50 job applications/month",
        "Priority in search results",
        "Enhanced profile visibility",
        "Direct messaging with employers",
        "Priority support"
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Enterprise",
      type: "PREMIUM",
      price: "15,000",
      numericPrice: 15000,
      duration: "month",
      features: [
        "Unlimited job applications",
        "Top priority in search results",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 premium support"
      ],
      cta: "Upgrade Now",
      popular: false
    }
  ];

  useEffect(() => {
    loadUserSubscriptionInfo();
  }, []);

  const loadUserSubscriptionInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user info including subscription details
      const userSubscriptionInfo = await SubscriptionService.getCurrentUserInfo();
      setUserInfo(userSubscriptionInfo);

      // Set a default userId for testing - you can modify this as needed
      setUserId(1);

    } catch (err) {
      console.error('Error loading user subscription info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: PlanData) => {
    if (plan.type === 'FREE') {
      // Handle free plan selection if needed
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentForm(true);
    setPaymentStatus({ type: null, message: '' });
  };

  const handlePaymentSuccess = (response: SubscriptionPaymentResponse) => {
    setShowPaymentForm(false);
    setPaymentStatus({
      type: 'success',
      message: `Payment initiated successfully! Subscription ID: ${response.subscriptionId}, Amount: ${response.amount} XAF. Please proceed to complete the payment on your phone.`
    });
    
    // Reload user info after successful payment
    setTimeout(() => {
      loadUserSubscriptionInfo();
    }, 5000); // Give more time for user to complete phone payment
  };

  const handlePaymentError = (errorMessage: string) => {
    setShowPaymentForm(false);
    setPaymentStatus({
      type: 'error',
      message: errorMessage
    });
  };

  const isCurrentPlan = (planType: 'FREE' | 'STANDARD' | 'PREMIUM'): boolean => {
    return userInfo?.currentPlan === planType;
  };

  const getPlanButtonText = (plan: PlanData): string => {
    if (isCurrentPlan(plan.type)) {
      return 'Current Plan';
    }
    return plan.cta;
  };

  const isPlanDisabled = (plan: PlanData): boolean => {
    return isCurrentPlan(plan.type) || plan.type === 'FREE';
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-primary)] py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-lamaYellow)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-bg-primary)] py-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Unable to Load Subscription Plans
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
          <Button
            onClick={loadUserSubscriptionInfo}
            className="bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-[var(--color-text-primary)]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-primary)] py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Temporary API Test Component - Remove this after testing */}
        <div className="mb-8">
          <SubscriptionTest />
        </div>
        {/* Payment Status Messages */}
        {paymentStatus.type && (
          <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 ${
            paymentStatus.type === 'success'
              ? 'bg-green-100 border border-green-300 text-green-800'
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            {paymentStatus.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm">{paymentStatus.message}</p>
          </div>
        )}

        {/* Current Subscription Status */}
        {userInfo && (
          <div className="mb-8 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-light)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              Current Subscription
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text-secondary)]">Plan:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userInfo.currentPlan === 'PREMIUM'
                  ? 'bg-[var(--color-lamaYellow)] text-[var(--color-text-primary)]'
                  : userInfo.currentPlan === 'STANDARD'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userInfo.currentPlan}
              </span>
              {userInfo.subscriptionExpiresAt && (
                <>
                  <span className="text-[var(--color-text-secondary)]">Expires:</span>
                  <span className="text-[var(--color-text-primary)]">
                    {new Date(userInfo.subscriptionExpiresAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Choose Your Plan
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Select the subscription that fits your job search needs. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-8 border ${
                isCurrentPlan(plan.type)
                  ? "border-green-500 bg-green-50"
                  : plan.popular
                  ? "border-[var(--color-lamaYellow)] bg-[var(--color-lamaYellowLight)]"
                  : "border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]"
              }`}
            >
              {isCurrentPlan(plan.type) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Current Plan
                  </div>
                </div>
              )}
              
              {plan.popular && !isCurrentPlan(plan.type) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[var(--color-lamaYellow)] text-[var(--color-text-primary)] px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                  {plan.name}
                </h2>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                    {plan.price}
                  </span>
                  {plan.duration && (
                    <span className="text-[var(--color-text-secondary)] mb-1">
                      /{plan.duration}
                    </span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[var(--color-lamaGreenDark)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full ${
                  isCurrentPlan(plan.type)
                    ? "bg-gray-400 cursor-not-allowed"
                    : plan.popular
                    ? "bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-[var(--color-text-primary)]"
                    : "bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]"
                }`}
                disabled={isPlanDisabled(plan)}
              >
                {getPlanButtonText(plan)}
                {plan.popular && !isCurrentPlan(plan.type) && <Zap className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedPlan && userId && (
          <PaymentForm
            planType={selectedPlan.type as 'STANDARD' | 'PREMIUM'}
            planName={selectedPlan.name}
            amount={selectedPlan.numericPrice}
            userId={userId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={() => setShowPaymentForm(false)}
          />
        )}

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept Mobile Money (MTN and Orange) for payments in Cameroon."
              },
              {
                question: "Is there a free trial?",
                answer: "We don't offer a free trial for Premium, but you can use our Basic plan for free to test our platform."
              },
              {
                question: "How do I cancel my subscription?",
                answer: "You can cancel anytime from your account settings. No hidden fees or penalties."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-[var(--color-border-light)] pb-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {item.question}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-[var(--color-lamaGreenDark)]" />
            <span className="text-[var(--color-text-secondary)]">Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-[var(--color-lamaGreenDark)]" />
            <span className="text-[var(--color-text-secondary)]">30-day money back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-[var(--color-lamaGreenDark)]" />
            <span className="text-[var(--color-text-secondary)]">24/7 customer support</span>
          </div>
        </div>
      </div>
    </div>
  );
}