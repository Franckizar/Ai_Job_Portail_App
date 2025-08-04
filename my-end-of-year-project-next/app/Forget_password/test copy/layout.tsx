// app/layout.tsx
'use client';

import React from 'react';
import { Header } from '@/components/Job_portail/Home/components/Header';
import { Footer } from '@/components/Job_portail/Home/components/Footer';
import { AuthProvider } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { AppRouterProvider } from '@/components/Job_portail/Home/components/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import CookieConsentBanner from '@/components/Job_portail/Home/components/CookieConsentBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">
        <AuthProvider>
          <AppRouterProvider>
            <Header />
            {children}
            <Footer />
            {/* <CookieConsentBanner /> */}
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
      </body>
    </html>
  );
}
