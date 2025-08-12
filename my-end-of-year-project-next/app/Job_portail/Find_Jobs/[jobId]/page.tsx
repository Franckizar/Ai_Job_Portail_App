// app/jobs/[jobId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

// Enhanced fake job data
const fakeJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer (React)",
    company: "TechVision Inc.",
    location: "Douala, Cameroon (Hybrid)",
    type: "Full-time",
    category: "Engineering",
    salary: "XAF 4,500,000 - 6,200,000/month",
    postedDate: "2 days ago",
    deadline: "May 30, 2024",
    applicants: 24,
    description: `
      We're looking for an experienced Frontend Developer to join our growing team. You'll be responsible for building 
      and maintaining our web applications using modern React.js, working closely with designers and backend engineers 
      to deliver exceptional user experiences.
      
      Key Responsibilities:
      - Develop new user-facing features using React.js
      - Build reusable components and front-end libraries
      - Optimize applications for maximum performance
      - Collaborate with the design team to implement pixel-perfect UIs
      - Participate in code reviews and mentor junior developers
    `,
    requirements: `
      - 5+ years of professional frontend development experience
      - Strong proficiency in React.js, TypeScript, and modern JavaScript
      - Experience with state management (Redux, Context API)
      - Familiarity with RESTful APIs and GraphQL
      - Knowledge of modern authorization mechanisms (JWT)
      - Familiarity with modern frontend build pipelines and tools
      - Experience with testing frameworks (Jest, React Testing Library)
      - Degree in Computer Science or related field preferred
    `,
    benefits: `
      - Competitive salary with performance bonuses
      - Health insurance coverage
      - Flexible work arrangements (3 days office, 2 days remote)
      - Professional development budget
      - Modern equipment of your choice
      - Free snacks and drinks in office
      - Team building activities
    `,
    aboutCompany: `
      TechVision is a leading software development company in Central Africa, specializing in fintech solutions. 
      We've been operating for 8 years with clients across Africa and Europe. Our team of 50+ engineers is 
      passionate about building products that solve real problems.
    `,
    applicationProcess: `
      1. Submit your application with CV and portfolio
      2. Initial screening call (30min)
      3. Technical assessment (take-home)
      4. Technical interview (90min)
      5. Final interview with CTO (60min)
      
      The entire process typically takes 2-3 weeks.
    `,
    contactEmail: "careers@techvision.cm",
    website: "https://techvision.cm"
  }
];

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = fakeJobs.find((j) => j.id === params.jobId);

  if (!job) return notFound();

  return (
    <div className="bg-[var(--color-bg-secondary)] min-h-screen py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/Job_portail/Find_Jobs" 
            className="inline-flex items-center text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all jobs
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-[var(--color-border-light)]">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{job.title}</h1>
                <p className="text-lg text-[var(--color-text-secondary)] mt-1">{job.company}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaSkyLight)] px-3 py-1 rounded-full">
                    {job.location}
                  </span>
                  <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaPurpleLight)] px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                  <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaYellowLight)] px-3 py-1 rounded-full">
                    {job.salary}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-lamaSky)] text-[var(--color-text-primary)]">
                {job.category}
              </span>
            </div>
          </div>

          {/* Job Meta */}
          <div className="p-6 border-b border-[var(--color-border-light)] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-text-tertiary)]">Posted</p>
              <p className="text-[var(--color-text-primary)] font-medium">{job.postedDate}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)]">Deadline</p>
              <p className="text-[var(--color-text-primary)] font-medium">{job.deadline}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)]">Applicants</p>
              <p className="text-[var(--color-text-primary)] font-medium">{job.applicants}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)]">Job ID</p>
              <p className="text-[var(--color-text-primary)] font-medium">#{job.id}</p>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-6 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Job Description</h2>
              <div className="prose text-[var(--color-text-secondary)]">
                {job.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-secondary)]">
                {job.requirements.split('\n').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Benefits</h2>
              <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-secondary)]">
                {job.benefits.split('\n').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* About Company */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">About {job.company}</h2>
              <div className="prose text-[var(--color-text-secondary)]">
                {job.aboutCompany.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Application Process */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Application Process</h2>
              <div className="prose text-[var(--color-text-secondary)]">
                {job.applicationProcess.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[var(--color-text-tertiary)]">Email</p>
                  <a href={`mailto:${job.contactEmail}`} className="text-[var(--color-lamaSkyDark)] hover:underline">
                    {job.contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-[var(--color-text-tertiary)]">Website</p>
                  <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-lamaSkyDark)] hover:underline">
                    {job.website}
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Apply Button */}
          <div className="p-6 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
            <Link
              href={`/Job_portail/Find_Jobs/${job.id}/apply`}
              className="inline-flex items-center justify-center w-full md:w-auto bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}