// import JobFilters from "@/components/Job/JobFilters";
import JobList from "@/components/Job/JobList";

export default function JobsPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>
      <JobList />
    </main>
  );
}

