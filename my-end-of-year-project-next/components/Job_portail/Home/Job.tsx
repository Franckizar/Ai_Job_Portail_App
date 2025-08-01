// components/JobList.tsx
'use client';

const jobs = [
  { title: 'Frontend Developer', company: 'Google', location: 'Remote', type: 'Full Time' },
  { title: 'UI/UX Designer', company: 'Facebook', location: 'London, UK', type: 'Part Time' },
  { title: 'Backend Engineer', company: 'Amazon', location: 'New York, USA', type: 'Full Time' },
];

export default function JobList() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Latest Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <div key={i} className="border p-6 rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
              <p className="mt-1 text-gray-600">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location} · {job.type}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Apply</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
