'use client'
import { useState } from "react";
import { cameroonTowns } from "@/lib/cameroonTowns";

const jobTypes = ["", "Full-Time", "Part-Time", "Internship"];
const categories = ["", "Engineering", "Design", "Marketing"];
const locations = ["", ...cameroonTowns];
const companies = ["", "TechCorp", "DesignHub", "MarketMakers"];

export default function JobFilters({ onSearch }: { onSearch: (filters: any) => void }) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");

  const handleSearch = () => {
    onSearch({ type, category, location, company });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Job Type Filter */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaSky)] focus:border-transparent appearance-none"
        >
          {jobTypes.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption || "All Job Types"}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaPurple)] focus:border-transparent appearance-none"
        >
          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption || "All Categories"}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Location Filter */}
      <div className="relative">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaGreen)] focus:border-transparent appearance-none"
        >
          <option value="">All Locations</option>
          {cameroonTowns.map((town) => (
            <option key={town} value={town}>
              {town}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Company Filter */}
      <div className="relative">
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaOrange)] focus:border-transparent appearance-none"
        >
          {companies.map((companyOption) => (
            <option key={companyOption} value={companyOption}>
              {companyOption || "All Companies"}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Jobs
      </button>
    </div>
  );
}