import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

// Define the base Job type from the API
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

// Define the enhanced Job type
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

// Function to detect category based on job data
const detectCategory = (job: Job): string => {
  const title = job.title.toLowerCase();
  const description = job.description.toLowerCase();
  const skills = job.skills?.map(s => s.skillName.toLowerCase()) || [];

  // First check if category is explicitly set
  if (job.category && job.category !== 'General') {
    return job.category;
  }

  // Technology category detection
  if (
    title.includes('developer') ||
    title.includes('programmer') ||
    title.includes('engineer') ||
    title.includes('software') ||
    title.includes('java') ||
    title.includes('python') ||
    title.includes('react') ||
    title.includes('node') ||
    description.includes('backend') ||
    description.includes('frontend') ||
    description.includes('full stack') ||
    skills.some(skill => 
      ['java', 'python', 'javascript', 'react', 'node', 'docker', 'kubernetes', 'spring', 'angular', 'vue'].includes(skill)
    )
  ) {
    return 'Technology';
  }

  // Design category detection
  if (
    title.includes('designer') ||
    title.includes('ui/ux') ||
    title.includes('graphic') ||
    title.includes('creative') ||
    skills.some(skill => ['photoshop', 'figma', 'sketch', 'illustrator', 'adobe'].includes(skill))
  ) {
    return 'Design';
  }

  // Marketing category detection
  if (
    title.includes('marketing') ||
    title.includes('seo') ||
    title.includes('social media') ||
    title.includes('content') ||
    title.includes('digital marketing') ||
    title.includes('campaign')
  ) {
    return 'Marketing';
  }

  // Business category detection
  if (
    title.includes('manager') ||
    title.includes('analyst') ||
    title.includes('business') ||
    title.includes('consultant') ||
    title.includes('director') ||
    title.includes('coordinator')
  ) {
    return 'Business';
  }

  // Customer Service category detection
  if (
    title.includes('support') ||
    title.includes('service') ||
    title.includes('customer') ||
    title.includes('representative') ||
    title.includes('help desk')
  ) {
    return 'Customer Service';
  }

  return 'General';
};

// Function to format salary for display
const formatSalary = (min: number, max: number, country: string): string => {
  const currency = country === 'Cameroon' ? 'XAF' : 'USD';
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return `${num.toLocaleString()}`;
  };

  if (min && max && min !== max) {
    return `${currency} ${formatNumber(min)} - ${formatNumber(max)}/year`;
  } else if (min) {
    return `${currency} ${formatNumber(min)}+/year`;
  } else if (max) {
    return `${currency} Up to ${formatNumber(max)}/year`;
  }
  return 'Salary negotiable';
};

// Function to calculate days ago
const getDaysAgo = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date('2025-08-19'); // Current date
  const diffTime = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  return `Posted ${diffDays} days ago`;
};

// Function to generate category-specific fake data
const generateCategoryData = (category: string, job: Job) => {
  const company = job.employerName.replace('PERSONAL_EMPLOYER PERSONAL_EMPLOYER', getCompanyName(category));
  
  switch (category) {
    case 'Technology':
      return {
        company,
        requirements: `
• 3+ years of professional software development experience
• Proficiency in ${job.skills.length > 0 ? job.skills.map(s => s.skillName).join(', ') : 'Java, Spring Boot, and related technologies'}
• Strong understanding of software development lifecycle and best practices
• Experience with cloud platforms (AWS, Azure, or GCP)
• Familiarity with CI/CD pipelines and DevOps practices
• Experience with databases (SQL and NoSQL)
• Strong problem-solving and analytical skills
• Bachelor's degree in Computer Science, Engineering, or related field
        `,
        benefits: `
• Competitive salary with performance-based bonuses
• Comprehensive health, dental, and vision insurance
• Flexible hybrid work arrangements
• Professional development budget ($3,000/year)
• Latest MacBook Pro or PC of your choice
• Home office setup allowance
• Stock options or equity participation
• Unlimited PTO policy
• Team-building events and tech conferences
        `,
        aboutCompany: `
${company} is a leading technology solutions provider specializing in enterprise software development and digital transformation. Founded in 2015, we've grown to serve over 200+ clients worldwide, from startups to Fortune 500 companies. Our engineering team is passionate about building scalable, maintainable solutions using cutting-edge technologies.
        `,
        applicationProcess: `
1. Submit your application with CV and GitHub/portfolio links
2. Initial technical screening call (30 minutes)
3. Take-home coding challenge (2-3 hours)
4. Technical interview with senior developers (90 minutes)
5. Final interview with engineering leadership (60 minutes)
6. Reference checks and offer

The entire process typically takes 2-3 weeks. We provide feedback at each stage.
        `,
        contactEmail: `careers@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };

    case 'Design':
      return {
        company,
        requirements: `
• 3+ years of experience in UI/UX or graphic design
• Proficiency in design tools: Figma, Sketch, Adobe Creative Suite
• Strong portfolio showcasing design projects and process
• Understanding of user-centered design principles
• Experience with prototyping and wireframing
• Knowledge of design systems and component libraries
• Excellent communication and presentation skills
• Degree in Design, HCI, or related field preferred
        `,
        benefits: `
• Competitive salary with creative project bonuses
• Health and wellness benefits package
• Flexible work hours and remote options
• Annual design conference and workshop budget
• Premium design software subscriptions covered
• Modern creative workspace with latest equipment
• Mentorship and career growth opportunities
• Creative freedom and ownership of projects
        `,
        aboutCompany: `
${company} is a creative agency dedicated to crafting beautiful, user-centered digital experiences. Our diverse team of designers, researchers, and strategists collaborate to solve complex design challenges for brands across various industries. We believe great design has the power to transform businesses and improve lives.
        `,
        applicationProcess: `
1. Submit application with CV and design portfolio
2. Portfolio review and initial screening call (30 minutes)
3. Design challenge relevant to our work (take-home)
4. Design presentation and critique session (60 minutes)
5. Cultural fit interview with team (45 minutes)
6. Final interview with creative director

Portfolio quality is our primary evaluation criteria. Process takes 2-3 weeks.
        `,
        contactEmail: `design@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };

    case 'Marketing':
      return {
        company,
        requirements: `
• 3+ years of digital marketing experience
• Strong knowledge of SEO, SEM, and social media advertising
• Experience with marketing automation tools (HubSpot, Mailchimp)
• Proficiency in Google Analytics, Google Ads, Facebook Ads Manager
• Content creation and copywriting skills
• Data analysis and reporting abilities
• Understanding of conversion optimization
• Bachelor's degree in Marketing, Communications, or related field
        `,
        benefits: `
• Competitive base salary with performance incentives
• Comprehensive health and dental coverage
• Flexible remote work arrangements
• Marketing conferences and certification budget
• Access to premium marketing tools and platforms
• Results-driven bonus structure
• Professional development opportunities
• Dynamic and collaborative team culture
        `,
        aboutCompany: `
${company} is a full-service digital marketing agency helping businesses grow their online presence and drive measurable results. With expertise across all digital channels, we've helped over 150 companies achieve their marketing goals through data-driven strategies and creative campaigns.
        `,
        applicationProcess: `
1. Submit application with CV and campaign portfolio
2. Initial screening and culture fit call (30 minutes)
3. Marketing strategy case study (take-home)
4. Strategy presentation and discussion (60 minutes)
5. Final interview with marketing leadership (45 minutes)

We value creativity, analytical thinking, and results orientation. Process takes 2-3 weeks.
        `,
        contactEmail: `marketing@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };

    case 'Business':
      return {
        company,
        requirements: `
• 4+ years of experience in business analysis, consulting, or management
• Strong analytical and quantitative skills
• Proficiency in data analysis tools (Excel, Tableau, Power BI)
• Experience with project management methodologies (Agile, Scrum)
• Excellent presentation and communication skills
• Strategic thinking and problem-solving abilities
• MBA or advanced degree in Business, Economics, or related field preferred
        `,
        benefits: `
• Competitive salary with performance-based bonuses
• Comprehensive benefits package including 401(k) matching
• Flexible work arrangements and unlimited PTO
• Leadership development and mentorship programs
• Tuition reimbursement for continued education
• Health and wellness programs
• Modern office environment with latest technology
• Team building and networking events
        `,
        aboutCompany: `
${company} is a premier business consulting firm providing strategic advisory services to organizations across various industries. We help companies optimize operations, drive growth, and navigate complex business challenges through data-driven insights and proven methodologies.
        `,
        applicationProcess: `
1. Submit application with CV and relevant case studies
2. Initial screening and fit assessment (30 minutes)
3. Business case analysis (take-home assignment)
4. Case presentation and technical interview (90 minutes)
5. Final interview with senior leadership (60 minutes)

We look for analytical rigor, strategic thinking, and leadership potential. Process takes 2-3 weeks.
        `,
        contactEmail: `careers@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };

    case 'Customer Service':
      return {
        company,
        requirements: `
• 2+ years of customer service or support experience
• Excellent verbal and written communication skills
• Proficiency in CRM software and help desk tools
• Ability to handle multiple tasks and prioritize effectively
• Problem-solving skills and patience with customers
• Experience with live chat, email, and phone support
• High school diploma required; college degree preferred
• Bilingual capabilities a plus
        `,
        benefits: `
• Competitive hourly wage with performance bonuses
• Full health benefits package
• Paid time off and flexible scheduling options
• Comprehensive training and development programs
• Career advancement opportunities
• Employee recognition and reward programs
• Modern contact center with ergonomic workstations
• Team-building activities and company events
        `,
        aboutCompany: `
${company} is committed to delivering exceptional customer experiences across all touchpoints. Our support team is the heart of our customer relationships, ensuring satisfaction, retention, and loyalty through personalized service and quick problem resolution.
        `,
        applicationProcess: `
1. Submit application with CV highlighting customer service experience
2. Initial phone screening (20 minutes)
3. Customer service scenario assessment
4. Behavioral interview focusing on communication skills (45 minutes)
5. Final interview with support team manager (30 minutes)

We prioritize empathy, communication skills, and problem-solving ability. Process takes 1-2 weeks.
        `,
        contactEmail: `support@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };

    default:
      return {
        company,
        requirements: `
• 2+ years of relevant professional experience
• Strong communication and interpersonal skills
• Ability to work independently and as part of a team
• Proficiency in Microsoft Office Suite
• Problem-solving mindset and attention to detail
• Adaptability to changing business needs
• Bachelor's degree preferred but not required
        `,
        benefits: `
• Competitive salary based on experience
• Health insurance coverage
• Paid vacation and sick leave
• Professional development opportunities
• Flexible work arrangements where possible
• Collaborative and supportive work environment
• Employee recognition programs
• Company-sponsored social events
        `,
        aboutCompany: `
${company} is a growing organization dedicated to excellence in service delivery. We value our employees and foster a culture of collaboration, innovation, and continuous improvement to achieve our business objectives.
        `,
        applicationProcess: `
1. Submit your application with updated CV
2. Initial screening call (30 minutes)
3. Skills or competency assessment
4. In-person or virtual interview (45 minutes)
5. Reference check and final decision

We focus on cultural fit, relevant experience, and growth potential. Process typically takes 2-3 weeks.
        `,
        contactEmail: `careers@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
      };
  }
};

// Function to get company name based on category
const getCompanyName = (category: string): string => {
  const companyNames = {
    'Technology': 'TechInnovate Solutions',
    'Design': 'Creative Design Studio',
    'Marketing': 'Digital Growth Agency',
    'Business': 'Strategic Business Partners',
    'Customer Service': 'Excellence Support Services',
    'General': 'Professional Services Group'
  };
  return companyNames[category as keyof typeof companyNames] || 'Innovate Solutions';
};

// Function to enhance job data with additional fields
const enhanceJob = (job: Job): EnhancedJob => {
  const category = detectCategory(job);
  const categoryData = generateCategoryData(category, job);
  
  // Use actual location data from the API
  const locationParts = [
    job.city,
    job.state,
    job.country === 'USA' ? '' : job.country
  ].filter(part => part && part.trim());
  
  const location = locationParts.length > 0 
    ? locationParts.join(', ') + (category === 'Technology' ? ' (Hybrid)' : '')
    : 'Remote / Location TBD';
  
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.country);
  const postedDate = getDaysAgo(job.createdAt);
  const deadline = format(
    new Date('2025-08-19').setMonth(new Date('2025-08-19').getMonth() + 1),
    'MMM d, yyyy'
  );
  const applicants = Math.floor(Math.random() * 50) + 10;

  return {
    ...job,
    company: categoryData.company,
    location,
    salary,
    postedDate,
    deadline,
    applicants,
    requirements: categoryData.requirements,
    benefits: categoryData.benefits,
    aboutCompany: categoryData.aboutCompany,
    applicationProcess: categoryData.applicationProcess,
    contactEmail: categoryData.contactEmail,
    website: categoryData.website,
  };
};

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const res = await fetch(`http://localhost:8088/api/v1/auth/jobs/${params.jobId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch job: ${res.status}`);
  }

  const data = await res.json();

  // Validate and map the job object using actual API data
  const mappedJob: Job = {
    id: Number(data.id) || 0,
    title: String(data.title || 'No title available'),
    description: String(data.description || 'No description provided'),
    type: String(data.type || 'FULL_TIME'),
    salaryMin: Number(data.salaryMin) || 0,
    salaryMax: Number(data.salaryMax) || 0,
    city: String(data.city || ''),
    state: String(data.state || ''),
    postalCode: String(data.postalCode || ''),
    country: String(data.country || 'USA'),
    addressLine1: String(data.addressLine1 || ''),
    addressLine2: data.addressLine2 ? String(data.addressLine2) : undefined,
    employerName: String(data.employerName || 'Company not specified'),
    enterpriseId: data.enterpriseId ? Number(data.enterpriseId) : null,
    personalEmployerId: data.personalEmployerId ? Number(data.personalEmployerId) : null,
    category: data.category ? String(data.category) : null,
    skills: Array.isArray(data.skills)
      ? data.skills.map((skill: any) => ({
          skillId: Number(skill.skillId) || 0,
          skillName: String(skill.skillName || 'Unknown skill'),
          required: Boolean(skill.required),
        }))
      : [],
    status: String(data.status || 'ACTIVE'),
    createdAt: String(data.createdAt || new Date().toISOString()),
  };

  // Enhance the job with additional fields
  const job = enhanceJob(mappedJob);

  return (
    <div className="bg-[var(--color-bg-secondary)] min-h-screen py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
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
                    📍 {job.location}
                  </span>
                  <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaPurpleLight)] px-3 py-1 rounded-full">
                    💼 {job.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaYellowLight)] px-3 py-1 rounded-full">
                    💰 {job.salary}
                  </span>
                  {job.skills.length > 0 && (
                    <span className="inline-flex items-center text-sm text-[var(--color-text-secondary)] bg-gray-100 px-3 py-1 rounded-full">
                      🔧 {job.skills.length} skill{job.skills.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-lamaSky)] text-[var(--color-text-primary)]">
                {detectCategory(job)}
              </span>
            </div>
          </div>

          {/* Job Meta */}
          <div className="p-6 border-b border-[var(--color-border-light)] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-text-tertiary)] font-medium">Posted</p>
              <p className="text-[var(--color-text-primary)]">{job.postedDate}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)] font-medium">Deadline</p>
              <p className="text-[var(--color-text-primary)]">{job.deadline}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)] font-medium">Applicants</p>
              <p className="text-[var(--color-text-primary)]">{job.applicants}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)] font-medium">Job ID</p>
              <p className="text-[var(--color-text-primary)]">#{job.id}</p>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-6 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Job Description</h2>
              <div className="prose max-w-none text-[var(--color-text-secondary)] whitespace-pre-line">
                {job.description}
              </div>
              {/* Skills section if available */}
              {job.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill.skillId}
                        className={`px-3 py-1 rounded-full text-sm ${
                          skill.required
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {skill.skillName}
                        {skill.required && ' *'}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Required skills</p>
                </div>
              )}
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Requirements</h2>
              <div className="prose max-w-none text-[var(--color-text-secondary)] whitespace-pre-line">
                {job.requirements}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Benefits & Perks</h2>
              <div className="prose max-w-none text-[var(--color-text-secondary)] whitespace-pre-line">
                {job.benefits}
              </div>
            </section>

            {/* About Company */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">About {job.company}</h2>
              <div className="prose max-w-none text-[var(--color-text-secondary)] whitespace-pre-line">
                {job.aboutCompany}
              </div>
            </section>

            {/* Application Process */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Application Process</h2>
              <div className="prose max-w-none text-[var(--color-text-secondary)] whitespace-pre-line">
                {job.applicationProcess}
              </div>
            </section>

            {/* Location Details */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[var(--color-text-tertiary)] font-medium">Address</p>
                  <p className="text-[var(--color-text-primary)]">
                    {job.addressLine1}
                    {job.addressLine2 && <><br />{job.addressLine2}</>}
                    <br />
                    {job.city}, {job.state} {job.postalCode}
                    <br />
                    {job.country}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--color-text-tertiary)] font-medium">Work Type</p>
                  <p className="text-[var(--color-text-primary)]">
                    {job.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    {detectCategory(job) === 'Technology' && ' (Hybrid Available)'}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[var(--color-text-tertiary)] font-medium">Email</p>
                  <a href={`mailto:${job.contactEmail}`} className="text-[var(--color-lamaSkyDark)] hover:underline">
                    {job.contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-[var(--color-text-tertiary)] font-medium">Website</p>
                  <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-lamaSkyDark)] hover:underline">
                    {job.website}
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Apply Button */}
          <div className="p-6 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/Job_portail/Find_Jobs/${job.id}/apply`}
                className="inline-flex items-center justify-center flex-1 bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Apply Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: job.title,
                      text: `Check out this ${job.title} position at ${job.company}`,
                      url: window.location.href
                    });
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('Job link copied to clipboard!');
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 border border-[var(--color-border-light)] rounded-lg font-medium text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47A3 3 0 1015 8z" />
                </svg>
                Share Job
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};