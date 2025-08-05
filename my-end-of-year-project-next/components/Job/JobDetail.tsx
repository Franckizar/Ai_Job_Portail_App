'use client';
import Link from "next/link";

export default function JobDetail({ job }: { job: any }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
      {/* Title and Meta */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <p className="text-gray-500">{job.company} • {job.location}</p>
        <span className="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {job.type}
        </span>
      </div>

      {/* Description */}
      {job.description && (
        <div>
          <h2 className="text-xl font-semibold mb-1">📄 Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div>
          <h2 className="text-xl font-semibold mb-1">✅ Requirements</h2>
          <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && (
        <div>
          <h2 className="text-xl font-semibold mb-1">🎁 Benefits</h2>
          <p className="text-gray-700 leading-relaxed">{job.benefits}</p>
        </div>
      )}

      {/* Apply Button */}
      <div className="pt-4">
        <Link
          href={`/Job_portail/Find_Jobs/${job.id}/apply`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium text-center"
        >
          🚀 Apply Now
        </Link>
      </div>
    </div>
  );
}
