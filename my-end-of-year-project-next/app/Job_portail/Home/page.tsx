'use client';

import { SearchProvider } from '@/components/Job_portail/Home/context/SearchContext';
import { HeroSection } from '@/components/Job_portail/Home/components/HeroSection';
import { FeaturedJobs } from '@/components/Job_portail/Home/components/FeaturedJobs';
import { JobCategories } from '@/components/Job_portail/Home/components/JobCategories';
import { StatsSection } from '@/components/Job_portail/Home/components/StatsSection';
import { SearchResults } from '@/components/Job_portail/Home/SearchResults';

export default function HomePage() {
  return (
    <SearchProvider>
      <main>
        <HeroSection />
        <SearchResults />
        <FeaturedJobs />
        <JobCategories />
        <StatsSection />
      </main>
    </SearchProvider>
  );
}