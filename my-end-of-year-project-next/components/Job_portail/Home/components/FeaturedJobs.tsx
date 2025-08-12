'use client';
import { Briefcase } from 'lucide-react';
import { Button } from "./ui/button";
// import JobCard from "./JobCard"; // Import your JobCard component
// import JobCard from "../../../components/Job/JobCard";
import JobCard from "../../../Job/JobCard";

export function FeaturedJobs() {
  const jobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      category: "Technology",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      postedDate: "2 days ago",
      tags: ["React", "TypeScript", "Remote"]
    },
    {
      id: "2",
      title: "UX Designer",
      company: "Design Studio",
      category: "Design",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $110k",
      postedDate: "1 day ago",
      tags: ["Figma", "User Research", "Prototyping"]
    },
    {
      id: "3",
      title: "Product Manager",
      company: "StartupXYZ",
      category: "Business",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$130k - $160k",
      postedDate: "3 days ago",
      tags: ["Strategy", "Analytics", "Agile"]
    },
    {
      id: "4",
      title: "DevOps Engineer",
      company: "CloudTech",
      category: "Technology",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$140k - $170k",
      postedDate: "1 day ago",
      tags: ["AWS", "Docker", "Kubernetes"]
    },
    {
      id: "5",
      title: "Marketing Manager",
      company: "GrowthCo",
      category: "Marketing",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$85k - $105k",
      postedDate: "4 days ago",
      tags: ["Digital Marketing", "SEO", "Analytics"]
    },
    {
      id: "6",
      title: "Data Scientist",
      company: "DataInsights",
      category: "Technology",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$125k - $155k",
      postedDate: "2 days ago",
      tags: ["Python", "Machine Learning", "SQL"]
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-lamaSkyLight)] rounded-full mb-4">
            <Briefcase className="h-8 w-8 text-[var(--color-lamaSkyDark)]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">Featured Jobs</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Explore our most popular job opportunities from top companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id}
              job={{
                ...job,
                description: "", // Empty since we're not showing it in cards
                applicants: 0 // Default value
              }}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="border-[var(--color-lamaPurpleDark)] text-[var(--color-lamaPurpleDark)] hover:bg-[var(--color-lamaPurpleLight)] hover:text-[var(--color-lamaPurpleDark)] font-medium px-8 py-3"
          >
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
}