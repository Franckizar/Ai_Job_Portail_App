// app/home/page.tsx
'use client';

import { HeroSection } from '@/components/Job_portail/Home/components/HeroSection';
import { FeaturedJobs } from '@/components/Job_portail/Home/components/FeaturedJobs';
import { JobCategories } from '@/components/Job_portail/Home/components/JobCategories';
import { StatsSection } from '@/components/Job_portail/Home/components/StatsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedJobs />
      <JobCategories />
      <StatsSection />
    </main>
  );
}
