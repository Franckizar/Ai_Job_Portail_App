'use client'
import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";

// Define the Job type to match what JobCard expects
type Job = {
  id: number;
  title: string;
  description: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  employerName: string;
  enterpriseId: number | null;
  personalEmployerId: number | null;
  category: string | null;
  skills: Array<{
    skillId: number;
    skillName: string;
    required: boolean;
  }>;
  status: string;
  createdAt: string;
};

export default function JobList() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    location: "",
    company: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8088/api/v1/auth/jobs", {
          cache: "no-store",
        });
        
        if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
        
        const data = await res.json();
        console.log('Raw API response:', data);

        // Validate that data is an array
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }

        // Map and validate each job object
        const mappedJobs = data.map((job: any, index: number) => {
          console.log(`Processing job ${index}:`, job);
          
          // Ensure all required fields exist and are the correct type
          const mappedJob: Job = {
            id: Number(job.id) || index,
            title: String(job.title || "No title available"),
            description: String(job.description || "No description provided"),
            type: String(job.type || "FULL_TIME"),
            salaryMin: Number(job.salaryMin) || 0,
            salaryMax: Number(job.salaryMax) || 0,
            city: String(job.city || ""),
            state: String(job.state || ""),
            postalCode: String(job.postalCode || ""),
            country: String(job.country || "USA"),
            addressLine1: String(job.addressLine1 || ""),
            addressLine2: job.addressLine2 ? String(job.addressLine2) : undefined,
            employerName: String(job.employerName || "Company not specified"),
            enterpriseId: job.enterpriseId ? Number(job.enterpriseId) : null,
            personalEmployerId: job.personalEmployerId ? Number(job.personalEmployerId) : null,
            category: job.category ? String(job.category) : null,
            skills: Array.isArray(job.skills) ? job.skills.map((skill: any) => ({
              skillId: Number(skill.skillId) || 0,
              skillName: String(skill.skillName || "Unknown skill"),
              required: Boolean(skill.required)
            })) : [],
            status: String(job.status || "ACTIVE"),
            createdAt: String(job.createdAt || new Date().toISOString()),
          };

          console.log(`Mapped job ${index}:`, mappedJob);
          return mappedJob;
        });

        console.log('All mapped jobs:', mappedJobs);
        setAllJobs(mappedJobs);
        setFilteredJobs(mappedJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to format location for filtering
  const getJobLocation = (job: Job) => {
    const parts = [];
    if (job.city && job.city.trim()) parts.push(job.city);
    if (job.state && job.state.trim()) parts.push(job.state);
    if (job.country && job.country !== 'USA' && job.country.trim()) parts.push(job.country);
    return parts.join(', ') || 'Remote / Location TBD';
  };

  // Update filtered jobs instantly whenever filters change
  useEffect(() => {
    try {
      const results = allJobs.filter((job: Job) => {
        const jobLocation = getJobLocation(job);
        const jobType = String(job.type).replace('_', ' ').toLowerCase();
        const jobCategory = String(job.category || '').toLowerCase();
        const jobCompany = String(job.employerName).toLowerCase();

        return (
          (!filters.location || jobLocation.toLowerCase().includes(filters.location.toLowerCase())) &&
          (!filters.type || jobType.includes(filters.type.toLowerCase())) &&
          (!filters.category || jobCategory.includes(filters.category.toLowerCase())) &&
          (!filters.company || jobCompany.includes(filters.company.toLowerCase()))
        );
      });
      setFilteredJobs(results);
    } catch (err) {
      console.error('Error filtering jobs:', err);
    }
  }, [filters, allJobs]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lamaSky)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Jobs</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <JobFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: Job) => {
            // Additional safety check before rendering
            if (!job || typeof job !== 'object' || !job.id) {
              console.error('Invalid job object:', job);
              return null;
            }
            
            return <JobCard key={`job-${job.id}`} job={job} />;
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(filter => filter) 
                ? "Try adjusting your filters to see more results." 
                : "No job listings are currently available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}