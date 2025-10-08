'use client';
import React, { useState } from 'react';
import { Phone, CreditCard, Loader2, X } from 'lucide-react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";
import { SubscriptionService, SubscriptionPaymentResponse } from '@/lib/services/subscriptionService';

interface PaymentFormProps {
  planType: 'STANDARD' | 'PREMIUM';
  planName: string;
  amount: number;
  userId: number;
  onPaymentSuccess: (response: SubscriptionPaymentResponse) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  planType,
  planName,
  amount,
  userId,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}: PaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePhoneNumber = (phone: string): boolean => {
    // Cameroon phone number validation (9 digits starting with 6 or 7)
    const phoneRegex = /^[67]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate phone number
    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setErrors({ phone: 'Please enter a valid Cameroon phone number (e.g., 677123456 or 652972651)' });
      return;
    }

    setIsProcessing(true);

    try {
      // Use the SubscriptionService to process payment
      const paymentResponse = await SubscriptionService.processSubscriptionPayment(
        userId,
        planType,
        phoneNumber
      );

      if (paymentResponse.success) {
        onPaymentSuccess(paymentResponse);
      } else {
        onPaymentError(paymentResponse.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Payment processing failed. Please check your connection and try again.';
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 9 digits
    return cleaned.slice(0, 9);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-bg-secondary)] rounded-xl p-8 max-w-md w-full mx-4 border border-[var(--color-border-light)] relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          disabled={isProcessing}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--color-lamaYellow)] rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-[var(--color-text-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Subscribe to {planName}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Complete your payment to activate your subscription
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-[var(--color-bg-primary)] rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-text-secondary)]">Plan:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{planName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-text-secondary)]">Amount:</span>
            <span className="font-bold text-2xl text-[var(--color-lamaYellow)]">{amount.toLocaleString()} XAF</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-text-secondary)]">Duration:</span>
            <span className="text-[var(--color-text-primary)]">1 Month</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border-light)]">
            <span className="text-[var(--color-text-secondary)]">Plan Type:</span>
            <span className="text-[var(--color-text-primary)] font-medium">{planType}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Mobile Money Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" />
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="677123456"
                maxLength={9}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaYellow)] transition-all ${
                  errors.phone ? 'border-red-500' : 'border-[var(--color-border-light)]'
                }`}
                disabled={isProcessing}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Enter your MTN or Orange Money number (9 digits, without +237)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-[var(--color-text-primary)] font-semibold"
              disabled={isProcessing || !phoneNumber.trim() || phoneNumber.length !== 9}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${amount.toLocaleString()} XAF`
              )}
            </Button>
          </div>
        </form>

        {/* Payment Instructions */}
        <div className="mt-6 p-4 bg-[var(--color-lamaYellowLight)] rounded-lg border border-[var(--color-lamaYellow)]">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            📱 Payment Instructions:
          </p>
          <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <li>• You will receive a payment prompt on your phone</li>
            <li>• Enter your Mobile Money PIN to confirm</li>
            <li>• Payment must be completed within 2 minutes</li>
            <li>• Your subscription will be activated automatically</li>
            <li>• Keep your transaction ID for reference</li>
          </ul>
        </div>

        {/* Support Info */}
        <div className="mt-4 text-center text-xs text-[var(--color-text-secondary)]">
          Need help? Contact support at <span className="text-[var(--color-lamaYellow)]">support@example.com</span>
        </div>
      </div>
    </div>
  );
}