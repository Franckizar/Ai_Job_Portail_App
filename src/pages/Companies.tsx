import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  MapPin,
  Users,
  Building2,
  Star,
  ExternalLink,
  Filter,
  Globe,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  size: string;
  founded: string;
  website: string;
  rating: number;
  reviewCount: number;
  openJobs: number;
  benefits: string[];
  tags: string[];
}

export function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("all");
  const [companySize, setCompanySize] = useState("all");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockCompanies: Company[] = [
    {
      id: "1",
      name: "TechCorp Inc.",
      description: "Leading technology company specializing in AI and machine learning solutions.",
      industry: "Technology",
      location: "San Francisco, CA",
      size: "1000-5000",
      founded: "2010",
      website: "https://techcorp.com",
      rating: 4.5,
      reviewCount: 234,
      openJobs: 45,
      benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
      tags: ["AI", "Machine Learning", "Cloud", "Innovation"],
    },
    {
      id: "2",
      name: "StartupXYZ",
      description: "Fast-growing startup revolutionizing the fintech industry.",
      industry: "Finance",
      location: "New York, NY",
      size: "50-200",
      founded: "2018",
      website: "https://startupxyz.com",
      rating: 4.2,
      reviewCount: 89,
      openJobs: 23,
      benefits: ["Equity", "Flexible Hours", "Learning Budget", "Catered Meals"],
      tags: ["Fintech", "Blockchain", "Mobile", "Growth"],
    },
    {
      id: "3",
      name: "DesignStudio",
      description: "Creative agency focused on digital experiences and brand design.",
      industry: "Design",
      location: "Los Angeles, CA",
      size: "10-50",
      founded: "2015",
      website: "https://designstudio.com",
      rating: 4.7,
      reviewCount: 156,
      openJobs: 12,
      benefits: ["Creative Freedom", "Flexible Schedule", "Design Tools", "Team Retreats"],
      tags: ["Design", "Branding", "UX/UI", "Creative"],
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchQuery, location, industry, companySize, companies]);

  const filterCompanies = () => {
    let filtered = companies;

    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (location) {
      filtered = filtered.filter(company =>
        company.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (industry !== "all") {
      filtered = filtered.filter(company => 
        company.industry.toLowerCase() === industry.toLowerCase()
      );
    }

    if (companySize !== "all") {
      filtered = filtered.filter(company => company.size === companySize);
    }

    setFilteredCompanies(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterCompanies();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Great Companies</h1>
        <p className="text-muted-foreground">
          Explore {filteredCompanies.length} companies and find your next career opportunity
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Company name or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger>
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="10-50">10-50 employees</SelectItem>
                  <SelectItem value="50-200">50-200 employees</SelectItem>
                  <SelectItem value="200-1000">200-1000 employees</SelectItem>
                  <SelectItem value="1000-5000">1000-5000 employees</SelectItem>
                  <SelectItem value="5000+">5000+ employees</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{company.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {company.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{company.rating}</span>
                      <span className="text-sm text-muted-foreground">({company.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.size} employees</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Founded {company.founded}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.openJobs} open jobs</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.industry}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-1">
                      {company.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <Badge key={benefitIndex} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {company.benefits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{company.benefits.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      View Jobs ({company.openJobs})
                    </Button>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredCompanies.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Companies
          </Button>
        </div>
      )}
    </div>
  );
}