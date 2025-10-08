// app/Job_portail/layout.tsx
import { Header } from '@/components/Job_portail/Home/components/Header';
import { Footer } from '@/components/Job_portail/Home/components/Footer';
import { AuthProvider } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { AppRouterProvider } from '@/components/Job_portail/Home/components/AppRouter';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import CookieConsentBanner from '@/components/Job_portail/Home/components/CookieConsentBanner';

export default function JobPortailLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppRouterProvider>
        <Header />
        <main className="min-h-screen bg-background">
          {children}
        </main>
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
      </AppRouterProvider>
    </AuthProvider>
  );
}