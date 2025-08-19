
import JobList from "@/components/Job/JobList";

export default function JobsPage() {
  return (
    <div className="bg-[var(--color-bg-secondary)] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Find Your Dream Job</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              Browse through our latest job opportunities in Cameroon
            </p>
          </div>
          <div className="flex gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] transition-colors">
              <img src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] transition-colors">
              <img src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
          </div>
        </div>

     
        <JobList />
      </main>
    </div>
  );
}