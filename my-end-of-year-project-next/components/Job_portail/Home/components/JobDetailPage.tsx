import { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Share2, Bookmark, Users, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useRouter } from './AppRouter';
import { useAuth } from './auth/AuthContext';

export function JobDetailPage() {
  const { navigateTo, selectedJobId } = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeFile: null as File | null,
    expectedSalary: '',
    availableStartDate: ''
  });

  // Mock job data - in real app this would be fetched based on selectedJobId
  const job = {
    job_id: selectedJobId || 1,
    title: "Senior Frontend Developer",
    company: {
      name: "TechCorp Inc.",
      logo: "T",
      description: "TechCorp is a leading technology company focused on building innovative solutions for the modern world.",
      size: "201-500 employees",
      industry: "Technology",
      website: "https://techcorp.com",
      founded: "2015"
    },
    description: `We are looking for an experienced Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining user-facing applications using modern JavaScript frameworks.

Key Responsibilities:
• Develop high-quality, responsive web applications using React and TypeScript
• Collaborate with designers and backend developers to implement new features
• Optimize applications for maximum speed and scalability
• Mentor junior developers and conduct code reviews
• Stay up-to-date with the latest frontend technologies and best practices`,
    requirements: [
      "5+ years of experience in frontend development",
      "Expert knowledge of React, JavaScript, and TypeScript",
      "Experience with modern CSS frameworks (Tailwind, CSS-in-JS)",
      "Familiarity with version control systems (Git)",
      "Strong problem-solving and communication skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    nice_to_have: [
      "Experience with Next.js or similar frameworks",
      "Knowledge of testing frameworks (Jest, Cypress)",
      "Familiarity with GraphQL",
      "Experience with CI/CD pipelines",
      "Previous startup experience"
    ],
    type: "full-time" as const,
    salary_min: 120000,
    salary_max: 150000,
    location: {
      city: "San Francisco",
      state: "CA",
      remote: true
    },
    benefits: [
      "Health, dental, and vision insurance",
      "401(k) with company matching",
      "Unlimited PTO",
      "Remote work flexibility",
      "Professional development budget",
      "Stock options",
      "Free lunch and snacks",
      "Gym membership reimbursement"
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git"],
    posted_date: "2025-01-25",
    applications_count: 23,
    status: "active" as const
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would submit to your API
    console.log('Application submitted:', applicationData);
    setShowApplicationModal(false);
    // Show success message or redirect
  };

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
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
      {/* Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => navigateTo('jobs')}
        className="mb-6 -ml-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-xl font-medium">{job.company.logo}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-medium mb-2">{job.title}</h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {job.company.name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location.city}, {job.location.state}</span>
                  {job.location.remote && (
                    <Badge variant="secondary" className="ml-2">Remote OK</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeAgo(job.posted_date)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="capitalize">
                  {job.type}
                </Badge>
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{job.applications_count} applications</span>
                </div>
                
                {isAuthenticated ? (
                  <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
                    <DialogTrigger asChild>
                      <Button size="lg">Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Submit your application to {job.company.name}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleApplicationSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="coverLetter">Cover Letter</Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Tell us why you're a great fit for this role..."
                            className="min-h-32"
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({
                              ...applicationData,
                              coverLetter: e.target.value
                            })}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expectedSalary">Expected Salary</Label>
                            <Input
                              id="expectedSalary"
                              placeholder="e.g. $130,000"
                              value={applicationData.expectedSalary}
                              onChange={(e) => setApplicationData({
                                ...applicationData,
                                expectedSalary: e.target.value
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Available Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={applicationData.availableStartDate}
                              onChange={(e) => setApplicationData({
                                ...applicationData,
                                availableStartDate: e.target.value
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowApplicationModal(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Submit Application</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="lg" onClick={() => navigateTo('home')}>
                    Sign In to Apply
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-line">
                {job.description}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Nice to Have */}
          <Card>
            <CardHeader>
              <CardTitle>Nice to Have</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.nice_to_have.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{job.company.description}</p>
              
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span>{job.company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Size</span>
                  <span>{job.company.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded</span>
                  <span>{job.company.founded}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Apply */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Quick Apply</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Apply with your existing profile information
              </p>
              {isAuthenticated ? (
                <Button className="w-full" onClick={() => setShowApplicationModal(true)}>
                  Apply Now
                </Button>
              ) : (
                <Button className="w-full" onClick={() => navigateTo('home')}>
                  Sign In to Apply
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Share */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Share this Job</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}