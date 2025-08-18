'use client';
import { useState, useEffect } from 'react';
import JobCardContent from './JobCardContent';
import type { Job } from './types';

export default function JobCardClientWrapper({ job }: { job: Job }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-white h-[300px] animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-4 bg-gray-200 rounded-full w-20"></div>
            <div className="h-4 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return <JobCardContent job={job} />;
}