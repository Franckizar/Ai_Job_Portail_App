'use client'
import { cameroonTowns } from "@/lib/cameroonTowns";

// Updated job types to match your API data format
const jobTypes = [
  { value: "", label: "All Job Types" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" }
];

// Updated categories to match the categories in your system
const categories = [
  { value: "", label: "All Categories" },
  { value: "Technology", label: "Technology" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Business", label: "Business" },
  { value: "Marketing", label: "Marketing" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "General", label: "General" }
];

const companies = ["", "TechCorp", "DesignHub", "MarketMakers"];

export default function JobFilters({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (filters: any) => void;
}) {
  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Job Type */}
      <div className="relative">
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaSky)] focus:border-transparent appearance-none"
        >
          {jobTypes.map((typeOption) => (
            <option key={typeOption.value} value={typeOption.value}>
              {typeOption.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div className="relative">
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-3 rounded-lg w-full focus:ring-2 focus:ring-[var(--color-lamaPurple)] focus:border-transparent appearance-none"
        >
          {categories.map((categoryOption) => (
            <option key={categoryOption.value} value={categoryOption.value}>
              {categoryOption.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Location */}
      <div className="relative">
        <select
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
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

      {/* Company */}
      <div className="relative">
        <select
          value={filters.company}
          onChange={(e) => handleChange("company", e.target.value)}
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
    </div>
  );
}