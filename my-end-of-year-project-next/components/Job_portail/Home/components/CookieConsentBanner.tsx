'use client';

import React, { useEffect, useState } from 'react';

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

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        maxWidth: '320px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 9999,
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <p style={{ margin: 0 }}>
        We use cookies to improve your experience. By continuing to use this site, you accept our&nbsp;
        <a
          href="/Job_portail/cookie-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#90caf9', textDecoration: 'underline' }}
        >
          cookie policy
        </a>.
      </p>
      <div style={{ alignSelf: 'flex-end' }}>
        <button
          onClick={acceptCookies}
          style={{
            backgroundColor: '#4caf50',
            border: 'none',
            padding: '0.4rem 1rem',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
