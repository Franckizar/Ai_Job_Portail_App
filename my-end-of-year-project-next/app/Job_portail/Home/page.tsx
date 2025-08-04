


'use client';
import { AuthProvider } from '../../../components/Job_portail/Home/components/auth/AuthContext';
// import { AuthProvider } from '../components/Job_portail/Home/components/auth/AuthContext';
import { FeaturedCompanies, Footer, Hero, Navbar1 } from '@/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar1 />
          {children}
          <FeaturedCompanies />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
