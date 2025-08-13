'use client';
import { Check, Zap, Star, BadgeCheck } from 'lucide-react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";

export default function SubscriptionPage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
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
      price: "9,990",
      duration: "month",
      features: [
        "Unlimited job applications",
        "Priority in search results",
        "Advanced analytics",
        "Direct messaging with employers",
        "24/7 support"
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      duration: "",
      features: [
        "All Premium features",
        "Dedicated account manager",
        "Custom integrations",
        "Bulk applications",
        "Advanced reporting"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] py-16">
      <div className="container mx-auto px-4 max-w-6xl">
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
                plan.popular 
                  ? "border-[var(--color-lamaYellow)] bg-[var(--color-lamaYellowLight)]" 
                  : "border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]"
              }`}
            >
              {plan.popular && (
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
                className={`w-full ${
                  plan.popular 
                    ? "bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-[var(--color-text-primary)]"
                    : "bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]"
                }`}
                disabled={plan.name === "Basic"}
              >
                {plan.cta}
                {plan.popular && <Zap className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          ))}
        </div>

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
                answer: "We accept all major credit cards, mobile money, and bank transfers for payments."
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