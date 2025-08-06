// components/JobCard.tsx
'use client'
import Link from "next/link";

export default function JobCard({ job }: { job: any }) {
  // Function to generate a consistent color based on job category
  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-[var(--color-lamaSky)] text-[var(--color-lamaSky-600)]',
      'bg-[var(--color-lamaPurple)] text-[var(--color-lamaPurple-600)]',
      'bg-[var(--color-lamaYellow)] text-[var(--color-lamaYellow-600)]'
    ];
    const index = category?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <Link 
      href={`/Job_portail/Find_Jobs/${job.id}`} 
      className="block border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300 ease-[var(--ease-snappy)] group overflow-hidden relative"
    >
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getCategoryColor(job.category)}`}></div>
      
      <div className="flex justify-between items-start ml-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-[var(--color-avocado-600)] transition-colors">
            {job.title}
          </h3>
          <p className="text-md text-gray-600 mt-1">{job.company}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(job.category)} bg-opacity-20`}>
          {job.category}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 ml-3">
        <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-[var(--color-lamaSkyLight)] px-3 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-lamaSky)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-[var(--color-lamaPurpleLight)] px-3 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-lamaPurple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.type}
        </span>
      </div>

      <div className="mt-6 flex justify-between items-center ml-3">
        <span className="text-sm text-gray-500 bg-[var(--color-lamaYellowLight)] px-2 py-1 rounded">
          Posted 2 days ago
        </span>
        <button className="text-[var(--color-avocado-600)] hover:text-[var(--color-avocado-400)] font-medium text-sm transition-colors flex items-center gap-1">
          View Details 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-lamaSkyLight)]/10 to-[var(--color-lamaPurpleLight)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );
}