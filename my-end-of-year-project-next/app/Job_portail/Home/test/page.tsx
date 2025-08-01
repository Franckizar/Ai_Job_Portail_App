"use client";
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
      </AppRouterProvider>
    </AuthProvider>
  );
}