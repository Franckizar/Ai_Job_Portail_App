import { MapPin, Clock, DollarSign, Bookmark } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter } from "./AppRouter";

export function FeaturedJobs() {
  const { navigateTo } = useRouter();

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      logo: "/home_logo/1.png",
      tags: ["React", "TypeScript", "Remote"]
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $110k",
      posted: "1 day ago",
      logo: "/home_logo/2.png",
      tags: ["Figma", "User Research", "Prototyping"]
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "3 days ago",
      logo: "/home_logo/3.png",
      tags: ["Strategy", "Analytics", "Agile"]
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$140k - $170k",
      posted: "1 day ago",
      logo: "/home_logo/4.png",
      tags: ["AWS", "Docker", "Kubernetes"]
    },
    {
      id: 5,
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$85k - $105k",
      posted: "4 days ago",
      logo: "/home_logo/5.png",
      tags: ["Digital Marketing", "SEO", "Analytics"]
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "DataInsights",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$125k - $155k",
      posted: "2 days ago",
      logo: "/home_logo/6.png",
      tags: ["Python", "Machine Learning", "SQL"]
    }
  ];

  return (
    <section className="py-16 bg-zinc-100 text-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-black">Featured Jobs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular job opportunities from top companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-lg transition-shadow rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-lamaPurpleLight border border-lamaPurple">
                      {typeof job.logo === "string" && job.logo.startsWith("/") ? (
                        <img src={job.logo} alt={`${job.company} logo`} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-lg font-bold">{job.company.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-black">{job.title}</h3>
                      <p className="text-lamaPurple font-medium">{job.company}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-lamaYellow hover:bg-lamaYellowLight/20 rounded-full"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-3 mb-5 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-lamaPurple" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-lamaPurple" />
                    <span>{job.type} • {job.posted}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-lamaPurple" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="text-xs bg-lamaSkyLight text-gray-800 border border-lamaSky rounded-full px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full bg-lamaYellow hover:bg-lamaYellow/90 text-black font-medium transition-colors"
                  onClick={() => navigateTo(`job/${job.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-lamaPurple text-lamaPurple hover:bg-lamaPurpleLight hover:text-lamaPurple font-medium"
            onClick={() => navigateTo('jobs')}
          >
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
}