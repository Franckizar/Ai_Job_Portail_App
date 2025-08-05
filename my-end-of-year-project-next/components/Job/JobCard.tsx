// components/JobCard.tsx
'use client'
import Link from "next/link";

export default function JobCard({ job }: { job: any }) {
  return (
    <Link href={`/Job_portail/Find_Jobs/${job.id}`} className="block border rounded-xl p-5 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company}</p>
      <div className="flex gap-4 text-sm mt-2 text-gray-600">
        <span>📍 {job.location}</span>
        <span>🕒 {job.type}</span>
      </div>
      <p className="text-sm text-gray-400 mt-2">{job.category}</p>
    </Link>
  );
}
