'use client'
import { useState } from "react";
import { fakeJobs } from "@/lib/fakeJobs";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";

export default function JobList() {
  const [filteredJobs, setFilteredJobs] = useState(fakeJobs);

  const handleSearch = (filters: any) => {
    const results = fakeJobs.filter((job) => {
      return (
        (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.type || job.type.toLowerCase().includes(filters.type.toLowerCase())) &&
        (!filters.category || job.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.company || job.company.toLowerCase().includes(filters.company.toLowerCase()))
      );
    });
    setFilteredJobs(results);
  };

  return (
    <div>
      <JobFilters onSearch={handleSearch} />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">No jobs match your filters.</p>
        )}
      </div>
    </div>
  );
}
