'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Briefcase } from 'lucide-react'; // Added Briefcase import
import { useSearch } from '../../../components/Job_portail/Home/context/SearchContext';
import { Skeleton } from '../../../components/Job_portail/Home/components/ui/skeleton';
import { Button } from '../../../components/Job_portail/Home/components/ui/button'; // Added Button import
import JobCard from "../../../components/Job/JobCard";

type Job = {
  id: number;
  title: string;
  description?: string;
  company?: string;
  city?: string;
  jobType?: string;
  salary?: string;
  createdAt?: string;
  category?: string;
  tags?: string[];
  logo?: string;
};

export function SearchResults() {
  const { filters, triggerSearch, searchTriggered } = useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchJobs = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
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

      params.append('status', 'ACTIVE');

      const response = await fetch(
        `http://localhost:8088/api/v1/auth/jobs/filter?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      setJobs(data.map((job: Job) => ({
        ...job,
        location: job.city || 'Location not specified',
        type: job.jobType ? job.jobType.replace('_', ' ') : 'Type not specified',
        postedDate: job.createdAt ? formatDate(job.createdAt) : 'Posted date not available',
        category: job.category || 'General',
        tags: job.tags || [],
      })));
      setHasSearched(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        setHasSearched(true);
        console.error('Search error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (
      !filters.skill?.trim() &&
      !filters.city?.trim() &&
      (!filters.type || filters.type === '')
    ) {
      setJobs([]);
      setError(null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    debounceTimeout.current = setTimeout(fetchJobs, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [filters, searchTriggered]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-200">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Search Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={fetchJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  if (hasSearched && jobs.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Jobs Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any jobs matching your search criteria.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h4 className="font-medium text-gray-800 mb-2">Search Tips:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Try different keywords or job titles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Expand your location range
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Check your spelling
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
        </h2>
        <p className="text-gray-600">
          Matching your search criteria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard 
            key={job.id}
            job={{
              id: job.id.toString(),
              title: job.title || 'No title available',
              company: job.company || 'Company not specified',
              category: job.category || 'General',
              location: job.city || 'Location not specified',
              type: job.jobType ? job.jobType.replace('_', ' ') : 'Type not specified',
              salary: job.salary || 'Salary not specified',
              postedDate: job.createdAt ? formatDate(job.createdAt) : 'Posted date not available',
              description: job.description || 'No description provided',
              tags: job.tags || [],
              logo: job.logo || undefined,
              applicants: 0
            }}
          />
        ))}
      </div>
    </section>
  );
}