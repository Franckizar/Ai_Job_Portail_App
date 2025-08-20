// components/Job/JobList.tsx
'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import JobCard from './JobCard';
import JobFilters from './JobFilters';

// Define types
type JobSkill = {
  skillId: number;
  skillName: string;
  required: boolean;
};

type Job = {
  id: number;
  title: string;
  description: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  employerName: string;
  enterpriseId: number | null;
  personalEmployerId: number | null;
  category: string | null;
  skills: JobSkill[];
  status: string;
  createdAt: string;
};

type EnhancedJob = Job & {
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  deadline: string;
  applicants: number;
  requirements: string;
  benefits: string;
  aboutCompany: string;
  applicationProcess: string;
  contactEmail: string;
  website: string;
};

// Shared utility functions
const detectCategory = (job: Job): string => {
  const title = job.title.toLowerCase();
  const skills = job.skills?.map(s => s.skillName.toLowerCase()) || [];

  if (job.category && job.category !== 'General') {
    return job.category;
  }

  if (
    title.includes('developer') ||
    title.includes('programmer') ||
    title.includes('engineer') ||
    title.includes('software') ||
    title.includes('java') ||
    title.includes('python') ||
    skills.some(skill =>
      ['java', 'python', 'javascript', 'react', 'node', 'docker', 'kubernetes'].includes(skill)
    )
  ) {
    return 'Technology';
  }

  if (
    title.includes('designer') ||
    title.includes('ui/ux') ||
    title.includes('graphic') ||
    skills.some(skill => ['photoshop', 'figma', 'sketch', 'illustrator'].includes(skill))
  ) {
    return 'Design';
  }

  if (
    title.includes('marketing') ||
    title.includes('seo') ||
    title.includes('social media') ||
    title.includes('content') ||
    title.includes('digital marketing')
  ) {
    return 'Marketing';
  }

  if (
    title.includes('manager') ||
    title.includes('analyst') ||
    title.includes('business') ||
    title.includes('consultant') ||
    title.includes('director')
  ) {
    return 'Business';
  }

  if (
    title.includes('support') ||
    title.includes('service') ||
    title.includes('customer') ||
    title.includes('representative')
  ) {
    return 'Customer Service';
  }

  return 'General';
};

const formatSalary = (min: number, max: number, country: string): string => {
  const currency = country === 'Cameroon' ? 'XAF' : 'USD';
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return `${num.toLocaleString()}`;
  };

  if (min && max) {
    return `${currency} ${formatNumber(min)} - ${formatNumber(max)}/year`;
  } else if (min) {
    return `${currency} ${formatNumber(min)}+/year`;
  } else if (max) {
    return `${currency} Up to ${formatNumber(max)}/year`;
  }
  return 'Salary negotiable';
};

const enhanceJob = (job: Job): EnhancedJob => {
  const category = detectCategory(job);
  const company = job.employerName.replace('PERSONAL_EMPLOYER PERSONAL_EMPLOYER', 'Innovate Solutions') || 'Innovate Solutions';
  const location = [job.city, job.state, job.country === 'USA' ? '' : job.country]
    .filter(part => part && part.trim())
    .join(', ') + (category === 'Technology' ? ' (Hybrid)' : '') || 'Remote / Location TBD';
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.country);
  const postedDate = job.createdAt && !isNaN(new Date(job.createdAt).getTime())
    ? format(new Date(job.createdAt), 'MMM d, yyyy')
    : 'Recently posted';
  const deadline = format(
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
    'MMM d, yyyy'
  );
  const applicants = Math.floor(Math.random() * 50) + 10;

  let description: string;
  let requirements: string;
  let benefits: string;
  let aboutCompany: string;
  let applicationProcess: string;
  let contactEmail: string;
  let website: string;

  switch (category) {
    case 'Technology':
      description = `
        Join our dynamic tech team to build cutting-edge solutions. You'll be responsible for developing and maintaining 
        high-performance applications, collaborating with cross-functional teams to deliver scalable software solutions.

        Key Responsibilities:
        - Design and implement robust software solutions
        - Write clean, maintainable, and efficient code
        - Collaborate with product managers and designers
        - Participate in code reviews and agile ceremonies
        - Optimize systems for performance and scalability
      `;
      requirements = `
        - 3+ years of professional software development experience
        - Proficiency in ${job.skills.map(s => s.skillName).join(', ') || 'modern programming languages'}
        - Strong understanding of software development lifecycle
        - Experience with cloud platforms (AWS, Azure, or GCP)
        - Familiarity with CI/CD pipelines
        - Strong problem-solving skills
        - Bachelor's degree in Computer Science or related field
      `;
      benefits = `
        - Competitive salary with performance bonuses
        - Comprehensive health insurance
        - Flexible hybrid work options
        - Professional development budget
        - Latest hardware of your choice
        - Team-building events and hackathons
        - Wellness programs
      `;
      aboutCompany = `
        ${company} is a leading technology firm specializing in innovative software solutions. 
        With a focus on excellence, we serve clients globally, delivering products that drive digital transformation.
      `;
      applicationProcess = `
        1. Submit your application with CV and GitHub portfolio
        2. Initial screening call (30min)
        3. Technical coding assessment (take-home)
        4. Technical interview (90min)
        5. Final interview with engineering leadership (60min)
        
        The process typically takes 2-3 weeks.
      `;
      contactEmail = `careers@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;

    case 'Design':
      description = `
        We're seeking a creative designer to craft visually stunning and user-friendly interfaces. 
        You'll work closely with product teams to create designs that enhance user experience and brand identity.

        Key Responsibilities:
        - Create wireframes, prototypes, and final designs
        - Collaborate with developers to ensure design fidelity
        - Conduct user research and usability testing
        - Maintain and evolve our design system
        - Stay updated with design trends and tools
      `;
      requirements = `
        - 3+ years of experience in UI/UX or graphic design
        - Proficiency in ${job.skills.map(s => s.skillName).join(', ') || 'design tools like Figma, Sketch'}
        - Strong portfolio showcasing design projects
        - Understanding of user-centered design principles
        - Experience with prototyping tools
        - Excellent communication and collaboration skills
        - Degree in Design or related field preferred
      `;
      benefits = `
        - Competitive salary with project-based bonuses
        - Health and dental insurance
        - Flexible work hours
        - Annual design conference budget
        - Subscription to premium design tools
        - Creative workspace with top equipment
        - Team-building retreats
      `;
      aboutCompany = `
        ${company} is a design-driven company focused on creating intuitive and beautiful user experiences. 
        Our team is passionate about pushing creative boundaries to deliver impactful designs.
      `;
      applicationProcess = `
        1. Submit your application with CV and portfolio
        2. Initial screening call (30min)
        3. Design challenge (take-home)
        4. Design review interview (60min)
        5. Final interview with creative director (45min)
        
        The process typically takes 2-3 weeks.
      `;
      contactEmail = `design@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;

    case 'Marketing':
      description = `
        We're looking for a talented marketer to drive our brand's growth. You'll develop and execute marketing strategies 
        to increase engagement and conversions across various channels.

        Key Responsibilities:
        - Develop and manage marketing campaigns
        - Analyze market trends and customer insights
        - Create compelling content for digital channels
        - Optimize SEO and paid ad campaigns
        - Collaborate with sales and product teams
      `;
      requirements = `
        - 3+ years of marketing experience
        - Strong knowledge of digital marketing channels
        - Experience with SEO, SEM, and social media advertising
        - Proficiency in analytics tools (Google Analytics, etc.)
        - Excellent written and verbal communication skills
        - Creative thinking and problem-solving abilities
        - Degree in Marketing, Business, or related field
      `;
      benefits = `
        - Competitive salary with performance incentives
        - Comprehensive health benefits
        - Flexible remote work options
        - Marketing conference and training budget
        - Access to premium marketing tools
        - Collaborative and creative team environment
        - Company-sponsored events
      `;
      aboutCompany = `
        ${company} is a fast-growing company dedicated to innovative marketing solutions. 
        We help brands connect with their audiences through strategic and creative campaigns.
      `;
      applicationProcess = `
        1. Submit your application with CV and campaign examples
        2. Initial screening call (30min)
        3. Marketing strategy assessment (take-home)
        4. Strategy review interview (60min)
        5. Final interview with marketing leadership (45min)
        
        The process typically takes 2-3 weeks.
      `;
      contactEmail = `marketing@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;

    case 'Business':
      description = `
        Join our business team to drive strategic initiatives and growth. You'll work on high-impact projects, 
        analyzing data and collaborating with stakeholders to achieve business objectives.

        Key Responsibilities:
        - Conduct market and competitor analysis
        - Develop business strategies and plans
        - Manage cross-functional projects
        - Present insights to leadership
        - Drive process improvements
      `;
      requirements = `
        - 4+ years of experience in business analysis or management
        - Strong analytical and problem-solving skills
        - Proficiency in data analysis tools (Excel, Tableau, etc.)
        - Excellent project management skills
        - Strong communication and presentation skills
        - MBA or related advanced degree preferred
      `;
      benefits = `
        - Competitive salary with performance bonuses
        - Comprehensive health and wellness benefits
        - Flexible work arrangements
        - Professional development opportunities
        - Leadership training programs
        - Team-building and networking events
        - Modern office environment
      `;
      aboutCompany = `
        ${company} is a leader in business innovation, providing strategic solutions to global clients. 
        Our team is dedicated to driving growth and operational excellence.
      `;
      applicationProcess = `
        1. Submit your application with CV and case studies
        2. Initial screening call (30min)
        3. Business case analysis (take-home)
        4. Case presentation interview (60min)
        5. Final interview with executive team (45min)
        
        The process typically takes 2-3 weeks.
      `;
      contactEmail = `careers@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;

    case 'Customer Service':
      description = `
        We're seeking a dedicated customer service professional to provide exceptional support to our clients. 
        You'll handle inquiries, resolve issues, and ensure customer satisfaction.

        Key Responsibilities:
        - Respond to customer inquiries via multiple channels
        - Resolve customer issues promptly and professionally
        - Maintain accurate customer records
        - Collaborate with support teams to improve processes
        - Provide feedback to enhance customer experience
      `;
      requirements = `
        - 2+ years of customer service experience
        - Excellent communication and interpersonal skills
        - Proficiency in CRM software
        - Ability to handle high-pressure situations
        - Strong problem-solving skills
        - High school diploma or equivalent; degree preferred
      `;
      benefits = `
        - Competitive salary with performance bonuses
        - Health and dental insurance
        - Flexible shift options
        - Training and career development programs
        - Supportive team environment
        - Employee discounts and perks
        - Wellness initiatives
      `;
      aboutCompany = `
        ${company} is committed to delivering outstanding customer experiences. 
        Our support team is the backbone of our client relationships, ensuring satisfaction and loyalty.
      `;
      applicationProcess = `
        1. Submit your application with CV
        2. Initial screening call (30min)
        3. Customer service scenario assessment
        4. Behavioral interview (45min)
        5. Final interview with support manager (30min)
        
        The process typically takes 1-2 weeks.
      `;
      contactEmail = `support@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;

    default:
      description = `
        Join our team to contribute to exciting projects. You'll work in a collaborative environment, 
        leveraging your skills to drive success across various initiatives.

        Key Responsibilities:
        - Collaborate on cross-functional projects
        - Contribute to team goals and objectives
        - Participate in process improvements
        - Engage in continuous learning
        - Support team initiatives
      `;
      requirements = `
        - 2+ years of relevant experience
        - Strong communication and collaboration skills
        - Ability to adapt to changing priorities
        - Proficiency in relevant tools and technologies
        - Problem-solving mindset
        - Degree in a related field preferred
      `;
      benefits = `
        - Competitive salary
        - Health insurance coverage
        - Flexible work options
        - Professional development opportunities
        - Collaborative team environment
        - Team-building activities
        - Employee wellness programs
      `;
      aboutCompany = `
        ${company} is a dynamic organization focused on delivering value to our clients. 
        We foster a culture of innovation and collaboration to achieve our goals.
      `;
      applicationProcess = `
        1. Submit your application with CV
        2. Initial screening call (30min)
        3. Skills assessment (take-home or interview)
        4. Behavioral interview (45min)
        5. Final interview with team lead (30min)
        
        The process typically takes 2-3 weeks.
      `;
      contactEmail = `careers@${company.toLowerCase().replace(/\s/g, '')}.com`;
      website = `https://${company.toLowerCase().replace(/\s/g, '')}.com`;
      break;
  }

  return {
    ...job,
    company,
    location,
    salary,
    postedDate,
    deadline,
    applicants,
    description,
    requirements,
    benefits,
    aboutCompany,
    applicationProcess,
    contactEmail,
    website,
  };
};

export default function JobList() {
  const [allJobs, setAllJobs] = useState<EnhancedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<EnhancedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: '',
    company: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8088/api/v1/auth/jobs', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch jobs: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('API response is not an array.');
        }

        const mappedJobs = data.map((job: any, index: number) => ({
          id: Number(job.id) || index + 1,
          title: String(job.title || 'No title available'),
          description: String(job.description || 'No description provided'),
          type: String(job.type || 'FULL_TIME'),
          salaryMin: Number(job.salaryMin) || 0,
          salaryMax: Number(job.salaryMax) || 0,
          city: String(job.city || ''),
          state: String(job.state || ''),
          postalCode: String(job.postalCode || ''),
          country: String(job.country || 'USA'),
          addressLine1: String(job.addressLine1 || ''),
          addressLine2: job.addressLine2 ? String(job.addressLine2) : undefined,
          employerName: String(job.employerName || 'Company not specified'),
          enterpriseId: job.enterpriseId ? Number(job.enterpriseId) : null,
          personalEmployerId: job.personalEmployerId ? Number(job.personalEmployerId) : null,
          category: job.category ? String(job.category) : null,
          skills: Array.isArray(job.skills)
            ? job.skills.map((skill: any) => ({
                skillId: Number(skill.skillId) || 0,
                skillName: String(skill.skillName || 'Unknown skill'),
                required: Boolean(skill.required),
              }))
            : [],
          status: String(job.status || 'ACTIVE'),
          createdAt: String(job.createdAt || new Date().toISOString()),
        }));

        const enhancedJobs = mappedJobs.map(enhanceJob);
        setAllJobs(enhancedJobs);
        setFilteredJobs(enhancedJobs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    try {
      const results = allJobs.filter((job: EnhancedJob) => {
        const jobLocation = job.location || 'Remote / Location TBD';
        const jobType = String(job.type).replace('_', ' ').toLowerCase();
        const jobCategory = String(job.category || detectCategory(job)).toLowerCase();
        const jobCompany = String(job.company).toLowerCase();

        return (
          (!filters.location || jobLocation.toLowerCase().includes(filters.location.toLowerCase())) &&
          (!filters.type || jobType.includes(filters.type.toLowerCase())) &&
          (!filters.category || jobCategory.includes(filters.category.toLowerCase())) &&
          (!filters.company || jobCompany.includes(filters.company.toLowerCase()))
        );
      });
      setFilteredJobs(results);
    } catch (err) {
      console.error('Error filtering jobs:', err);
    }
  }, [filters, allJobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lamaSky)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Jobs</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <JobFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: EnhancedJob) => {
            if (!job || typeof job !== 'object' || !job.id) {
              console.error('Invalid job object:', job);
              return null;
            }
            return <JobCard key={`job-${job.id}`} job={job} />;
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(filter => filter)
                ? 'Try adjusting your filters to see more results.'
                : 'No job listings are currently available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}