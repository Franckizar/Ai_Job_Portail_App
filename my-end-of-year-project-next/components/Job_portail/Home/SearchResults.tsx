'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useSearch } from '../../../components/Job_portail/Home/context/SearchContext';

type Job = {
  id: number;
  title: string;
  description?: string;
  company?: string;
  city?: string;
  jobType?: string;
  salary?: string;
  createdAt?: string;
};

export function SearchResults() {
  const { filters } = useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // If no filters, clear jobs and error immediately
    if (
      !filters.skill?.trim() &&
      !filters.city?.trim() &&
      (!filters.type || filters.type === '')
    ) {
      setJobs([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Debounce search by 500ms after user stops typing/changing filters
    debounceTimeout.current = setTimeout(() => {
      // Abort previous request if any
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters.skill?.trim()) {
        params.append('skill', filters.skill.trim());
      }
      if (filters.city?.trim()) {
        params.append('city', filters.city.trim());
      }
      if (filters.type?.trim() && filters.type !== '') {
        params.append('type', filters.type.trim());
      }

      // Always filter by ACTIVE status per your backend contract
      params.append('status', 'ACTIVE');

      fetch(`http://localhost:8088/api/v1/auth/jobs/filter?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth if needed
        },
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 400) {
              throw new Error('Invalid search parameters');
            } else if (res.status === 404) {
              throw new Error('No jobs found');
            } else {
              throw new Error(`Server error: ${res.status}`);
            }
          }
          return res.json();
        })
        .then((data: Job[]) => {
          setJobs(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            // Ignore aborted requests
            return;
          }
          setError(err.message);
          setLoading(false);
          console.error('Search error:', err);
        });
    }, 500);

    // Cleanup on unmount or filters change
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [filters]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Searching for jobs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Search Error</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </section>
    );
  }

  // If no jobs yet (e.g. on initial load), show nothing or some placeholder
  if (jobs.length === 0) {
    return (
      <section className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search filters or broadening your search terms.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
        <p className="text-gray-600">Found {jobs.length} job(s)</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">{job.title}</h3>

                {job.company && <p className="text-gray-600 font-medium mb-2">{job.company}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  {job.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.city}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {job.jobType.replace('_', ' ')}
                    </span>
                  )}
                  {job.salary && <span className="font-medium text-green-600">{job.salary}</span>}
                </div>

                {job.description && <p className="text-gray-600 line-clamp-2">{job.description}</p>}
              </div>

              <div className="ml-4 text-right">
                {job.createdAt && (
                  <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
