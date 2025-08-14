'use client'
import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";

export default function JobList() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    location: "",
    company: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8088/api/v1/auth/jobs", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();

        const mappedJobs = data.map((job: any) => ({
          id: job.id,
          title: job.title || "No title available",
          company: job.employerName || "Company not specified",
          category: "General",
          location: job.city || "Location not specified",
          type: job.type ? job.type.replace("_", " ") : "Type not specified",
          salary: job.salaryMin && job.salaryMax 
                    ? `$${job.salaryMin} - $${job.salaryMax}` 
                    : "Salary not specified",
          postedDate: "Posted date not available",
          description: job.description || "No description provided",
          tags: job.skills?.map((s: any) => s.skillName) || [],
          logo: undefined
        }));

        setAllJobs(mappedJobs);
        setFilteredJobs(mappedJobs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  // Update filtered jobs instantly whenever filters change
  useEffect(() => {
    const results = allJobs.filter((job: any) => {
      return (
        (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.type || job.type.toLowerCase().includes(filters.type.toLowerCase())) &&
        (!filters.category || job.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.company || job.company.toLowerCase().includes(filters.company.toLowerCase()))
      );
    });
    setFilteredJobs(results);
  }, [filters, allJobs]);

  return (
    <div>
      <JobFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job: any) => (
          <JobCard key={job.id} job={job} />
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">No jobs match your filters.</p>
        )}
      </div>
    </div>
  );
}
