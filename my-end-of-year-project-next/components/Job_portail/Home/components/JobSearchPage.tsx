import { useState, useMemo } from 'react';
import { Search, MapPin, Filter, Bookmark, Clock, DollarSign, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useRouter } from './AppRouter';

interface Job {
  job_id: number;
  title: string;
  enterprise_id: number;
  company_name: string;
  company_logo: string;
  description: string;
  type: 'full-time' | 'part-time' | 'internship';
  salary_min: number;
  salary_max: number;
  city: string;
  state: string;
  status: 'active' | 'closed';
  created_at: string;
  skills: string[];
  requirements: string[];
}

export function JobSearchPage() {
  const { navigateTo } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState<string>('');
  const [salaryRange, setSalaryRange] = useState([50000, 200000]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock job data that matches your database schema
  const jobs: Job[] = [
    {
      job_id: 1,
      title: "Senior Frontend Developer",
      enterprise_id: 1,
      company_name: "TechCorp Inc.",
      company_logo: "T",
      description: "We are looking for an experienced frontend developer to join our team. You will be responsible for building user-facing applications using React and TypeScript.",
      type: "full-time",
      salary_min: 120000,
      salary_max: 150000,
      city: "San Francisco",
      state: "CA",
      status: "active",
      created_at: "2025-01-27",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      requirements: ["5+ years experience", "Bachelor's degree", "Strong problem-solving skills"]
    },
    {
      job_id: 2,
      title: "UX Designer",
      enterprise_id: 2,
      company_name: "Design Studio",
      company_logo: "D",
      description: "Join our creative team as a UX Designer. You'll be designing user experiences for web and mobile applications.",
      type: "full-time",
      salary_min: 90000,
      salary_max: 110000,
      city: "New York",
      state: "NY",
      status: "active",
      created_at: "2025-01-26",
      skills: ["Figma", "User Research", "Prototyping", "Wireframing"],
      requirements: ["3+ years experience", "Portfolio required", "Strong communication skills"]
    },
    {
      job_id: 3,
      title: "Full Stack Developer",
      enterprise_id: 3,
      company_name: "StartupXYZ",
      company_logo: "S",
      description: "Looking for a versatile full-stack developer to work on our core platform. Experience with Node.js and React required.",
      type: "full-time",
      salary_min: 100000,
      salary_max: 130000,
      city: "Austin",
      state: "TX",
      status: "active",
      created_at: "2025-01-25",
      skills: ["React", "Node.js", "MongoDB", "JavaScript", "AWS"],
      requirements: ["4+ years experience", "Startup experience preferred", "Self-motivated"]
    },
    {
      job_id: 4,
      title: "DevOps Engineer",
      enterprise_id: 4,
      company_name: "CloudTech",
      company_logo: "C",
      description: "We need a DevOps engineer to help scale our infrastructure. Experience with Kubernetes and AWS required.",
      type: "full-time",
      salary_min: 140000,
      salary_max: 170000,
      city: "Seattle",
      state: "WA",
      status: "active",
      created_at: "2025-01-24",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Python"],
      requirements: ["5+ years experience", "Cloud certification preferred", "Experience with CI/CD"]
    },
    {
      job_id: 5,
      title: "Marketing Intern",
      enterprise_id: 5,
      company_name: "GrowthCo",
      company_logo: "G",
      description: "Summer internship opportunity in digital marketing. Perfect for students looking to gain real-world experience.",
      type: "internship",
      salary_min: 20000,
      salary_max: 25000,
      city: "Chicago",
      state: "IL",
      status: "active",
      created_at: "2025-01-23",
      skills: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
      requirements: ["Currently enrolled in college", "Basic marketing knowledge", "Eager to learn"]
    },
  ];

  const availableSkills = ["React", "TypeScript", "JavaScript", "Python", "Java", "AWS", "Docker", "Kubernetes", "Figma", "Node.js", "MongoDB", "SEO"];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = !locationQuery || 
        job.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
        job.state.toLowerCase().includes(locationQuery.toLowerCase());
      
      const matchesType = !jobType || job.type === jobType;
      
      const matchesSalary = job.salary_min >= salaryRange[0] && job.salary_max <= salaryRange[1];
      
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => job.skills.includes(skill));

      return matchesSearch && matchesLocation && matchesType && matchesSalary && matchesSkills;
    });
  }, [searchQuery, locationQuery, jobType, salaryRange, selectedSkills, jobs]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
      }
      return `$${num.toLocaleString()}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-4">Find Your Perfect Job</h1>
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Job title, keywords, or company" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="City or state" 
                className="pl-10"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-4">Salary Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={200000}
                    min={20000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${salaryRange[0].toLocaleString()}</span>
                    <span>${salaryRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Skills</h3>
                <div className="space-y-3">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setLocationQuery('');
                  setJobType('');
                  setSalaryRange([50000, 200000]);
                  setSelectedSkills([]);
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {filteredJobs.length} jobs
            </p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.job_id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent 
                  className="p-6"
                  onClick={() => navigateTo('job-detail', job.job_id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-medium">{job.company_logo}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {job.company_name}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.city}, {job.state}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(job.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {job.type}
                    </Badge>
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('job-detail', job.job_id);
                        }}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setLocationQuery('');
                  setJobType('');
                  setSalaryRange([50000, 200000]);
                  setSelectedSkills([]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}