'use client'
import { useState } from "react";
import { cameroonTowns } from "@/lib/cameroonTowns";

const jobTypes = ["", "Full-Time", "Part-Time", "Internship"];
const categories = ["", "Engineering", "Design", "Marketing"];
const locations = ["", "New York", "Remote", "San Francisco"];
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
      <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded w-full">
        {jobTypes.map((typeOption) => (
          <option key={typeOption} value={typeOption}>
            {typeOption || "All Types"}
          </option>
        ))}
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded w-full">
        {categories.map((categoryOption) => (
          <option key={categoryOption} value={categoryOption}>
            {categoryOption || "All Categories"}
          </option>
        ))}
      </select>

    <select
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="border p-2 rounded w-full"
>
  <option value="">All Towns</option>
  {cameroonTowns.map((town) => (
    <option key={town} value={town}>
      {town}
    </option>
  ))}
</select>

      <select value={company} onChange={(e) => setCompany(e.target.value)} className="border p-2 rounded w-full">
        {companies.map((companyOption) => (
          <option key={companyOption} value={companyOption}>
            {companyOption || "All Companies"}
          </option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        🔍 Search
      </button>
    </div>
  );
}
