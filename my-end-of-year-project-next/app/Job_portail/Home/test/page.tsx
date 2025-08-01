'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "../../../../components/Job_portail/Home/components/Header";
import { HeroSection } from "../../../../components/Job_portail/Home/components/HeroSection";
import { FeaturedJobs } from "../../../../components/Job_portail/Home/components/FeaturedJobs";
import { JobCategories } from "../../../../components/Job_portail/Home/components/JobCategories";
import { StatsSection } from "../../../../components/Job_portail/Home/components/StatsSection";
import { Footer } from "../../../../components/Job_portail/Home/components/Footer";
import { JobSearchPage } from "../../../../components/Job_portail/Home/components/JobSearchPage";
import { JobDetailPage } from "../../../../components/Job_portail/Home/components/JobDetailPage";
import { UserProfilePage } from "../../../../components/Job_portail/Home/components/UserProfilePage";
import { AuthProvider } from "../../../../components/Job_portail/Home/components/auth/AuthContext";
import { AppRouterProvider, useRouter } from "../../../../components/Job_portail/Home/components/AppRouter";

import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import CSS

// Cookie Consent Banner Component
function CookieConsentBanner() {
  const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';
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
          href="/cookie-policy"
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


function AppContent() {
  const { currentView } = useRouter();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'jobs':
        return <JobSearchPage />;
      case 'job-detail':
        return <JobDetailPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'home':
      default:
        return (
          <main>
            <HeroSection />
            <FeaturedJobs />
            <JobCategories />
            <StatsSection />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {renderCurrentView()}
      {currentView === 'home' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouterProvider>
        <AppContent />
        <CookieConsentBanner />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AppRouterProvider>
    </AuthProvider>
  );
}
