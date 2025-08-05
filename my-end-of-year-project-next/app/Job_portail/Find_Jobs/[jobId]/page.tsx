// app/jobs/[jobId]/page.tsx

import { fakeJobs } from "@/lib/fakeJobs";
import JobDetail from "@/components/Job/JobDetail";
import { notFound } from "next/navigation";

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = fakeJobs.find((j) => j.id === params.jobId);

  if (!job) return notFound();

  return (
    <main className="p-6">
      <JobDetail job={job} />
    </main>
  );
}
 