'use client'
import Link from "next/link";

type JobSkill = {
  skillId: number;
  skillName: string;
  required: boolean;
};

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
  skills: JobSkill[];
  status: string;
  createdAt?: string;
};

export default function JobCard({ job }: { job: Job }) {
  // Enhanced category detection based on job title and skills
  const detectCategory = (job: Job): string => {
    const title = job.title.toLowerCase();
    const skills = job.skills?.map(s => s.skillName.toLowerCase()) || [];
    
    // If category is explicitly set, use it
    if (job.category && job.category !== 'General') {
      return job.category;
    }
    
    // Technology-related keywords
    if (title.includes('developer') || title.includes('programmer') || title.includes('engineer') ||
        title.includes('software') || title.includes('java') || title.includes('python') ||
        skills.some(skill => ['java', 'python', 'javascript', 'react', 'node', 'docker', 'kubernetes','docker',].includes(skill))) {
      return 'Technology';
    }
    
    // Design-related keywords
    if (title.includes('designer') || title.includes('ui/ux') || title.includes('graphic') ||
        skills.some(skill => ['photoshop', 'figma', 'sketch', 'illustrator'].includes(skill))) {
      return 'Design';
    }
    
    // Marketing-related keywords
    if (title.includes('marketing') || title.includes('seo') || title.includes('social media') ||
        title.includes('content') || title.includes('digital marketing')) {
      return 'Marketing';
    }
    
    // Business-related keywords
    if (title.includes('manager') || title.includes('analyst') || title.includes('business') ||
        title.includes('consultant') || title.includes('director')) {
      return 'Business';
    }
    
    // Customer service keywords
    if (title.includes('support') || title.includes('service') || title.includes('customer') ||
        title.includes('representative')) {
      return 'Customer Service';
    }
    
    return 'General';
  };

  // Function to generate a consistent color based on job category
  const getCategoryColor = (category: string | null) => {
    const detectedCategory = detectCategory(job);
    
    const colorMap: Record<string, { bg: string, text: string }> = {
      'Technology': { bg: 'bg-[var(--color-lamaSky)]', text: 'text-[var(--color-text-primary)]' },
      'Design': { bg: 'bg-[var(--color-lamaPurple)]', text: 'text-[var(--color-text-primary)]' },
      'Business': { bg: 'bg-[var(--color-lamaGreen)]', text: 'text-[var(--color-text-primary)]' },
      'Marketing': { bg: 'bg-[var(--color-lamaOrange)]', text: 'text-[var(--color-text-primary)]' },
      'Customer Service': { bg: 'bg-[var(--color-lamaRed)]', text: 'text-[var(--color-text-primary)]' },
      'General': { bg: 'bg-[var(--color-lamaYellow)]', text: 'text-[var(--color-text-primary)]' }
    };
    
    return colorMap[detectedCategory] || colorMap['General'];
  };

  // Format salary range
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
      }
      return `$${num.toLocaleString()}`;
    };
    
    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)}`;
    } else if (min) {
      return `${formatNumber(min)}+`;
    } else if (max) {
      return `Up to ${formatNumber(max)}`;
    }
    return 'Salary negotiable';
  };

  // Format job type
  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Calculate days since posting - Enhanced with better error handling
  const getDaysAgo = (createdAt?: string) => {
    if (!createdAt) return 'Recently posted';
    
    try {
      const created = new Date(createdAt);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(created.getTime())) {
        return 'Recently posted';
      }
      
      const diffTime = now.getTime() - created.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Posted today';
      if (diffDays === 1) return 'Posted 1 day ago';
      if (diffDays <= 7) return `Posted ${diffDays} days ago`;
      if (diffDays <= 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
      return `Posted ${Math.floor(diffDays / 30)} months ago`;
    } catch (error) {
      console.error('Date parsing error:', error, 'for date:', createdAt);
      return 'Recently posted';
    }
  };

  // Format location - Enhanced to handle missing data better
  const formatLocation = () => {
    const parts = [];
    
    if (job.city && job.city.trim()) parts.push(job.city);
    if (job.state && job.state.trim()) parts.push(job.state);
    if (job.country && job.country !== 'USA' && job.country.trim()) parts.push(job.country);
    
    const location = parts.join(', ');
    return location || 'Remote / Location TBD';
  };

  const detectedCategory = detectCategory(job);
  const categoryColors = getCategoryColor(job.category);
  const location = formatLocation();
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link 
      href={`/Job_portail/Find_Jobs/${job.id}`} 
      className="block border border-[var(--color-border-light)] rounded-xl p-6 bg-[var(--color-bg-primary)] hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
    >
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${categoryColors.bg}`}></div>
      
      <div className="flex justify-between items-start ml-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-lamaSkyDark)] transition-colors">
            {job.title}
          </h3>
          <p className="text-md text-[var(--color-text-secondary)] mt-1">{job.employerName}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text} ml-4 flex-shrink-0`}>
          {detectedCategory}
        </span>
      </div>

      {/* Job details */}
      <div className="mt-4 ml-3">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaSkyLight)] px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-lamaSkyDark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaPurpleLight)] px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-lamaPurpleDark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatJobType(job.type)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaGreenLight)] px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-lamaGreenDark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {salary}
          </span>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 3).map((skill) => (
              <span 
                key={skill.skillId}
                className="inline-flex items-center text-xs bg-[var(--color-lamaOrangeLight)] text-[var(--color-text-secondary)] px-2 py-1 rounded"
              >
                {skill.skillName}
                {skill.required && <span className="ml-1 text-[var(--color-lamaOrangeDark)]">*</span>}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="inline-flex items-center text-xs bg-[var(--color-border-light)] text-[var(--color-text-tertiary)] px-2 py-1 rounded">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Description preview */}
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
          {job.description}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center ml-3">
        <span className="text-sm text-[var(--color-text-tertiary)] bg-[var(--color-lamaYellowLight)] px-2 py-1 rounded">
          {getDaysAgo(job.createdAt)}
        </span>
        <button className="text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] font-medium text-sm transition-colors flex items-center gap-1">
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