// app/Find_Jobs/[jobId]/apply/page.tsx

'use client';

import { useState } from 'react';
import { fakeJobs } from '@/lib/fakeJobs';
import { notFound, useRouter } from 'next/navigation';

export default function ApplyPage({ params }: { params: { jobId: string } }) {
  const job = fakeJobs.find((j) => j.id === params.jobId);
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !resume) {
      alert('Please fill out all required fields.');
      return;
    }

    console.log({
      jobId: job?.id,
      fullName,
      email,
      resume,
      coverLetter,
    });

    alert('Application submitted successfully!');
    router.push('/Find_Jobs'); // redirect back to jobs
  };

  if (!job) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Apply for: {job.title}</h1>
      <p className="text-gray-600 mb-6">{job.company} — {job.location}</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-medium">Full Name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email Address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Resume (PDF or DOCX) *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cover Letter (optional)</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </main>
  );
}
