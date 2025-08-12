// // app/jobs/[jobId]/page.tsx
// import { notFound } from "next/navigation";
// import Link from "next/link";

// const fakeJobs = [
//   {
//     id: "1",
//     title: "Senior Frontend Developer (React)",
//     company: "TechVision Inc.",
//     location: "Douala, Cameroon (Hybrid)",
//     type: "Full-time",
//     category: "Engineering",
//     salary: "XAF 4,500,000 - 6,200,000/month",
//     postedDate: "2 days ago",
//     deadline: "May 30, 2024",
//     applicants: 24,
//     description: `
//       We're looking for an experienced Frontend Developer to join our growing team. You'll be responsible for building 
//       and maintaining our web applications using modern React.js, working closely with designers and backend engineers 
//       to deliver exceptional user experiences.
      
//       Key Responsibilities:
//       - Develop new user-facing features using React.js
//       - Build reusable components and front-end libraries
//       - Optimize applications for maximum performance
//       - Collaborate with the design team to implement pixel-perfect UIs
//       - Participate in code reviews and mentor junior developers
//     `,
//     requirements: `
//       - 5+ years of professional frontend development experience
//       - Strong proficiency in React.js, TypeScript, and modern JavaScript
//       - Experience with state management (Redux, Context API)
//       - Familiarity with RESTful APIs and GraphQL
//       - Knowledge of modern authorization mechanisms (JWT)
//       - Familiarity with modern frontend build pipelines and tools
//       - Experience with testing frameworks (Jest, React Testing Library)
//       - Degree in Computer Science or related field preferred
//     `,
//     benefits: `
//       - Competitive salary with performance bonuses
//       - Health insurance coverage
//       - Flexible work arrangements (3 days office, 2 days remote)
//       - Professional development budget
//       - Modern equipment of your choice
//       - Free snacks and drinks in office
//       - Team building activities
//     `,
//     aboutCompany: `
//       TechVision is a leading software development company in Central Africa, specializing in fintech solutions. 
//       We've been operating for 8 years with clients across Africa and Europe. Our team of 50+ engineers is 
//       passionate about building products that solve real problems.
//     `,
//     applicationProcess: `
//       1. Submit your application with CV and portfolio
//       2. Initial screening call (30min)
//       3. Technical assessment (take-home)
//       4. Technical interview (90min)
//       5. Final interview with CTO (60min)
      
//       The entire process typically takes 2-3 weeks.
//     `,
//     contactEmail: "careers@techvision.cm",
//     website: "https://techvision.cm"
//   },
//   // Add other job listings here as needed
// ];

// export default function JobDetailPage({ params }: { params: { jobId: string } }) {
//   const job = fakeJobs.find((j) => j.id === params.jobId);

//   if (!job) return notFound();

//   return (
//     <div className="bg-[var(--color-bg-secondary)] min-h-screen py-12">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <Link 
//             href="/Job_portail/Find_Jobs" 
//             className="inline-flex items-center gap-2 text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] transition-colors group"
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               className="h-5 w-5 transition-transform group-hover:-translate-x-1" 
//               viewBox="0 0 20 20" 
//               fill="currentColor"
//             >
//               <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             <span className="font-medium">Back to all jobs</span>
//           </Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--color-border-light)]">
//           {/* Job Header */}
//           <div className="p-8 border-b border-[var(--color-border-light)]">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-lamaSky)] text-[var(--color-text-primary)] mb-3">
//                     {job.category}
//                   </span>
//                   <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{job.title}</h1>
//                   <p className="text-xl text-[var(--color-lamaSkyDark)] mt-2">{job.company}</p>
//                 </div>
                
//                 <div className="flex flex-wrap gap-3">
//                   <span className="inline-flex items-center gap-2 text-sm bg-[var(--color-lamaSkyLight)] px-4 py-2 rounded-full">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {job.location}
//                   </span>
//                   <span className="inline-flex items-center gap-2 text-sm bg-[var(--color-lamaPurpleLight)] px-4 py-2 rounded-full">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {job.type}
//                   </span>
//                   <span className="inline-flex items-center gap-2 text-sm bg-[var(--color-lamaYellowLight)] px-4 py-2 rounded-full">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {job.salary}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="bg-[var(--color-bg-secondary)] p-5 rounded-lg border border-[var(--color-border-light)] md:w-80 flex-shrink-0">
//                 <h3 className="font-medium text-[var(--color-text-primary)] mb-4">Quick Facts</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)]">Posted</p>
//                     <p className="text-[var(--color-text-primary)] font-medium">{job.postedDate}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)]">Deadline</p>
//                     <p className="text-[var(--color-text-primary)] font-medium">{job.deadline}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)]">Applicants</p>
//                     <p className="text-[var(--color-text-primary)] font-medium">{job.applicants}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)]">Job ID</p>
//                     <p className="text-[var(--color-text-primary)] font-medium">#{job.id}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Job Content */}
//           <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-10">
//               <section className="prose max-w-none">
//                 <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6 pb-2 border-b border-[var(--color-border-light)]">
//                   Job Description
//                 </h2>
//                 {job.description.split('\n').map((paragraph, i) => (
//                   <p key={i} className="text-[var(--color-text-secondary)] mb-4">{paragraph}</p>
//                 ))}
//               </section>

//               <section>
//                 <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6 pb-2 border-b border-[var(--color-border-light)]">
//                   Requirements
//                 </h2>
//                 <ul className="space-y-3 text-[var(--color-text-secondary)]">
//                   {job.requirements.split('\n').map((item, i) => (
//                     <li key={i} className="flex items-start gap-3">
//                       <svg className="w-5 h-5 text-[var(--color-lamaSkyDark)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </section>

//               <section>
//                 <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6 pb-2 border-b border-[var(--color-border-light)]">
//                   Benefits
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {job.benefits.split('\n').map((item, i) => (
//                     <div key={i} className="flex items-start gap-3 p-4 bg-[var(--color-lamaSkyLight)] rounded-lg">
//                       <svg className="w-5 h-5 text-[var(--color-lamaSkyDark)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span className="text-[var(--color-text-secondary)]">{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-8">
//               <section className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border-light)]">
//                 <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">About {job.company}</h2>
//                 <div className="prose text-[var(--color-text-secondary)]">
//                   {job.aboutCompany.split('\n').map((paragraph, i) => (
//                     <p key={i} className="mb-4">{paragraph}</p>
//                   ))}
//                 </div>
//               </section>

//               <section className="bg-[var(--color-lamaPurpleLight)] p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Application Process</h2>
//                 <ol className="space-y-4 text-[var(--color-text-secondary)]">
//                   {job.applicationProcess.split('\n').filter(p => p.trim()).map((step, i) => (
//                     <li key={i} className="flex gap-3">
//                       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-lamaPurple)] text-[var(--color-text-primary)] font-medium text-sm flex-shrink-0">
//                         {i + 1}
//                       </span>
//                       <span>{step}</span>
//                     </li>
//                   ))}
//                 </ol>
//               </section>

//               <section className="bg-white p-6 rounded-lg border border-[var(--color-border-light)]">
//                 <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Contact</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)] mb-1">Email</p>
//                     <a 
//                       href={`mailto:${job.contactEmail}`} 
//                       className="inline-flex items-center gap-2 text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] transition-colors"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       {job.contactEmail}
//                     </a>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[var(--color-text-tertiary)] mb-1">Website</p>
//                     <a 
//                       href={job.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer" 
//                       className="inline-flex items-center gap-2 text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] transition-colors"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
//                       </svg>
//                       {job.website}
//                     </a>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           </div>

//           {/* Apply Button */}
//           <div className="sticky bottom-0 bg-white border-t border-[var(--color-border-light)] p-6 shadow-lg">
//             <div className="max-w-7xl mx-auto flex justify-end">
//               <Link
//                 href={`/Job_portail/Find_Jobs/${job.id}/apply`}
//                 className="inline-flex items-center justify-center bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
//               >
//                 Apply Now
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }