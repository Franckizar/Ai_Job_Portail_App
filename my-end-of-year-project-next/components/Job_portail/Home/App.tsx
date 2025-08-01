import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturedJobs } from "./components/FeaturedJobs";
import { JobCategories } from "./components/JobCategories";
import { StatsSection } from "./components/StatsSection";
import { Footer } from "./components/Footer";
import { JobSearchPage } from "./components/JobSearchPage";
import { JobDetailPage } from "./components/JobDetailPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { AuthProvider } from "./components/auth/AuthContext";
import { AppRouterProvider, useRouter } from "./components/AppRouter";

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