'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      role="dialog"
      aria-labelledby="cookie-consent-heading"
      className="fixed bottom-6 right-6 max-w-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-light)] z-50"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-6 w-6 text-[var(--color-lamaSkyDark)]" aria-hidden="true" />
          <h3 id="cookie-consent-heading" className="font-bold">We Value Your Privacy</h3>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          aria-label="Close cookie consent banner"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Learn more in our{' '}
        <a 
          href="/Job_portail/cookie-policy" 
          className="text-[var(--color-lamaSkyDark)] underline hover:text-[var(--color-lamaSky)]"
        >
          Cookie Policy
        </a>.
      </p>
      
      <div className="flex gap-3">
        <Button 
          variant="outline"
          type="button"
          className="border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          onClick={rejectCookies}
        >
          Reject
        </Button>
        <Button 
          type="button"
          className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]"
          onClick={acceptCookies}
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}