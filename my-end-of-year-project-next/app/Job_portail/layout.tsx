// app/layout.tsx
'use client'; // Add this since we're using client-side hooks
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Job_portail/Home/components/Header';
import { Footer } from '@/components/Job_portail/Home/components/Footer';
import { AuthProvider } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { AppRouterProvider } from '@/components/Job_portail/Home/components/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CookieConsentBanner from '@/components/Job_portail/Home/components/CookieConsentBanner';
// import Loader from '@/components/Job_portail/Home/components/Loader';
// import Loader from "@/components/Job_portail/Home/components/loader"; // Import your Loader component
import Loader from "@/components/Loader"; // Impo

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="bg-background min-h-screen">
          <AuthProvider>
            <AppRouterProvider>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Header />
                  {children}
                  <Footer />
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
                </>
              )}
            </AppRouterProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}