'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Calendar, UserCheck, Plus, ChevronDown, ChevronRight,
  ArrowUp, ArrowDown, Eye, Edit, Trash2, Clock, Zap, Building,
  Star, AlertCircle, Target, TrendingUp, Sparkles, BarChart3,
  Crown, Rocket, Shield, Award, MapPin, DollarSign, Users2
} from 'lucide-react';
import { fetchWithAuth } from '../../../fetchWithAuth';

const EnterpriseDashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiredThisMonth: 0,
    profileViews: 0,
    responseRate: 0,
    premiumUntil: null as string | null,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeView, setActiveView] = useState('overview');

  // Get user role and ID from localStorage
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
    
    if (role === 'ENTERPRISE') {
      const enterpriseId = localStorage.getItem('enterprise_id');
      setUserId(enterpriseId ? parseInt(enterpriseId) : null);
    } else if (role === 'PERSONAL_EMPLOYER') {
      const personalEmployerId = localStorage.getItem('personal_employer_id');
      setUserId(personalEmployerId ? parseInt(personalEmployerId) : null);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userRole || !userId) return;
      
      setIsLoading(true);
      
      try {
        // Determine base endpoint based on role
        const baseEndpoint = userRole === 'ENTERPRISE' 
          ? `/api/v1/auth/jobs/enterprise/${userId}`
          : `/api/v1/auth/jobs/employer/${userId}`;

        // Fetch stats
        const statsResponse = await fetchWithAuth(`${baseEndpoint}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Failed to fetch stats, using mock data');
          setStats(getMockStats(userRole));
        }

        // Fetch recent applications
        const applicationsResponse = await fetchWithAuth(`${baseEndpoint}/recent-applications?limit=5`);
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setRecentApplications(applicationsData);
        } else {
          console.error('Failed to fetch applications, using mock data');
          setRecentApplications(getMockApplications(userRole));
        }

        // Fetch active jobs
        const jobsResponse = await fetchWithAuth(`${baseEndpoint}/active-jobs`);
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setActiveJobs(jobsData.map((job: any) => ({
            ...job,
            salaryMin: parseFloat(job.salary.split(' - ')[0]) || 0,
            salaryMax: parseFloat(job.salary.split(' - ')[1]) || 0,
            createdAt: job.postedDate,
          })));
        } else {
          console.error('Failed to fetch active jobs, using mock data');
          setActiveJobs(getMockJobs(userRole));
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userRole) {
      fetchDashboardData();
    }
  }, [userRole, userId, timeRange]);

  // Mock data generators
  const getMockStats = (role: string) => ({
    activeJobs: role === 'ENTERPRISE' ? 8 : 3,
    totalApplications: role === 'ENTERPRISE' ? 156 : 45,
    interviewsScheduled: role === 'ENTERPRISE' ? 12 : 4,
    hiredThisMonth: role === 'ENTERPRISE' ? 3 : 1,
    profileViews: role === 'ENTERPRISE' ? 245 : 120,
    responseRate: role === 'ENTERPRISE' ? 85 : 78,
    premiumUntil: role === 'ENTERPRISE' ? '2024-12-31' : null
  });

  const getMockApplications = (role: string) => [
    { 
      id: 1, 
      candidateName: 'John Smith', 
      jobTitle: role === 'ENTERPRISE' ? 'Senior Frontend Developer' : 'Home Renovation Specialist', 
      status: 'new', 
      applicationDate: '2024-01-15T10:30:00',
      matchScore: 92,
      experience: '5 years',
      skills: role === 'ENTERPRISE' ? ['React', 'TypeScript', 'Node.js'] : ['Carpentry', 'Painting', 'Plumbing']
    },
    { 
      id: 2, 
      candidateName: 'Sarah Johnson', 
      jobTitle: role === 'ENTERPRISE' ? 'Product Manager' : 'Electrical Technician', 
      status: 'reviewed', 
      applicationDate: '2024-01-14T14:20:00',
      matchScore: 88,
      experience: '7 years',
      skills: role === 'ENTERPRISE' ? ['Product Strategy', 'Agile', 'UX Research'] : ['Electrical', 'Wiring', 'Safety']
    },
    { 
      id: 3, 
      candidateName: 'Mike Chen', 
      jobTitle: role === 'ENTERPRISE' ? 'DevOps Engineer' : 'Plumbing Specialist', 
      status: 'interview', 
      applicationDate: '2024-01-14T09:15:00',
      matchScore: 95,
      experience: '6 years',
      skills: role === 'ENTERPRISE' ? ['AWS', 'Kubernetes', 'Docker'] : ['Plumbing', 'Installation', 'Repair']
    }
  ];

  const getMockJobs = (role: string) => [
    { 
      id: 1, 
      title: role === 'ENTERPRISE' ? 'Senior Frontend Developer' : 'Home Renovation Specialist',
      department: role === 'ENTERPRISE' ? 'Engineering' : 'Home Services', 
      applicationCount: role === 'ENTERPRISE' ? 42 : 8, 
      status: 'active', 
      postedDate: '2024-01-10T09:00:00',
      type: role === 'ENTERPRISE' ? 'Full-time' : 'Contract',
      location: role === 'ENTERPRISE' ? 'Remote' : 'Local',
      salary: role === 'ENTERPRISE' ? '$90,000 - $120,000' : '$25 - $35/hour'
    },
    { 
      id: 2, 
      title: role === 'ENTERPRISE' ? 'Product Manager' : 'Electrical Technician',
      department: role === 'ENTERPRISE' ? 'Product' : 'Electrical Services', 
      applicationCount: role === 'ENTERPRISE' ? 28 : 5, 
      status: 'active', 
      postedDate: '2024-01-08T14:00:00',
      type: role === 'ENTERPRISE' ? 'Full-time' : 'Part-time',
      location: role === 'ENTERPRISE' ? 'New York, NY' : 'On-site',
      salary: role === 'ENTERPRISE' ? '$110,000 - $140,000' : '$30 - $45/hour'
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'post-job':
        window.location.href = '/Job/sjobss';
        break;
      case 'view-applications':
        window.location.href = '/applications';
        break;
      case 'analytics':
        window.location.href = '/analytics';
        break;
      default:
        break;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your hiring command center...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userRole || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load dashboard</h2>
          <p className="text-gray-600">Please check your authentication and try again.</p>
        </div>
      </div>
    );
  }

  const isEnterprise = userRole === 'ENTERPRISE';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 space-y-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Glass Morphism */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                {isEnterprise ? 'Talent Command Center' : 'Hiring Hub'}
              </h1>
              <p className="text-gray-600">
                {isEnterprise 
                  ? 'Strategic hiring intelligence & talent pipeline' 
                  : 'Manage your talent acquisition efficiently'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100/50 rounded-lg">
              {['overview', 'candidates', 'analytics', 'jobs'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    activeView === view
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="relative group">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 group-hover:shadow-md"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button 
              onClick={() => handleQuickAction('post-job')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Post New Role
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Positions"
          value={stats.activeJobs}
          trend={12.5}
          icon={<Briefcase className="h-6 w-6" />}
          gradient="from-blue-500 to-cyan-600"
          description="Open roles"
        />
        <MetricCard
          title="Total Candidates"
          value={stats.totalApplications}
          trend={8.3}
          icon={<Users2 className="h-6 w-6" />}
          gradient="from-green-500 to-emerald-600"
          description="Applications received"
        />
        <MetricCard
          title="Interviews"
          value={stats.interviewsScheduled}
          trend={15.2}
          icon={<Calendar className="h-6 w-6" />}
          gradient="from-purple-500 to-pink-600"
          description="Scheduled sessions"
        />
        <MetricCard
          title="Successful Hires"
          value={stats.hiredThisMonth}
          trend={25.7}
          icon={<UserCheck className="h-6 w-6" />}
          gradient="from-orange-500 to-red-600"
          description="This month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Applications & Jobs */}
        <div className="xl:col-span-2 space-y-6">
          {/* Talent Pipeline */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Talent Pipeline</h2>
              </div>
              <button 
                onClick={() => handleQuickAction('view-applications')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View Pipeline
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentApplications.map(application => (
                <TalentCard 
                  key={application.id} 
                  application={application}
                />
              ))}
            </div>
          </div>

          {/* Active Opportunities */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Active Opportunities</h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                Manage All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruitment Toolkit</h2>
            <div className="grid grid-cols-2 gap-4">
              <ToolkitAction
                icon={<Plus className="h-5 w-5" />}
                label="Create Role"
                description="Post new position"
                gradient="from-blue-500 to-blue-600"
                onClick={() => handleQuickAction('post-job')}
              />
              <ToolkitAction
                icon={<Users className="h-5 w-5" />}
                label="Candidates"
                description="Review applicants"
                gradient="from-green-500 to-green-600"
                onClick={() => handleQuickAction('view-applications')}
              />
              <ToolkitAction
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                description="View insights"
                gradient="from-purple-500 to-purple-600"
                onClick={() => handleQuickAction('analytics')}
              />
              <ToolkitAction
                icon={<Calendar className="h-5 w-5" />}
                label="Schedule"
                description="Plan interviews"
                gradient="from-orange-500 to-orange-600"
              />
            </div>
          </div>

          {/* Premium Status */}
          {isEnterprise && stats.premiumUntil && (
            <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Enterprise Elite</h3>
                    <p className="text-blue-100 text-sm">Premium Features Active</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100">Enhanced Analytics</span>
                    <Shield className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100">Priority Support</span>
                    <Star className="h-4 w-4 text-yellow-300" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100">AI Matching</span>
                    <Zap className="h-4 w-4 text-purple-300" />
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 mb-4">
                  <p className="text-xs text-blue-100 mb-1">Premium until</p>
                  <p className="font-bold">
                    {new Date(stats.premiumUntil).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 rounded-xl text-sm font-bold transition-all duration-200 transform hover:-translate-y-0.5">
                  Upgrade Features
                </button>
              </div>
            </div>
          )}

          {/* Performance Stats */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              <PerformanceMetric
                label="Profile Views"
                value={stats.profileViews}
                trend={12.5}
                icon={<Eye className="h-4 w-4" />}
              />
              <PerformanceMetric
                label="Response Rate"
                value={`${stats.responseRate}%`}
                trend={8.3}
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <PerformanceMetric
                label="Avg. Time to Hire"
                value="18 days"
                trend={-5.2}
                icon={<Clock className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Component: Metric Card
const MetricCard = ({ title, value, trend, icon, gradient, description }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 rotate-180" />}
      <span>{Math.abs(trend)}% this month</span>
    </div>
  </div>
);

// New Component: Talent Card
const TalentCard = ({ application }) => {
  const statusConfig = {
    new: { color: 'bg-blue-500', label: 'New', icon: <Sparkles className="h-3 w-3" /> },
    reviewed: { color: 'bg-yellow-500', label: 'Reviewed', icon: <Eye className="h-3 w-3" /> },
    interview: { color: 'bg-purple-500', label: 'Interview', icon: <Calendar className="h-3 w-3" /> },
    rejected: { color: 'bg-red-500', label: 'Rejected', icon: <AlertCircle className="h-3 w-3" /> },
    hired: { color: 'bg-green-500', label: 'Hired', icon: <Award className="h-3 w-3" /> }
  };

  const status = statusConfig[application.status] || statusConfig.new;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {application.candidateName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={`absolute -top-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-white flex items-center justify-center`}>
            {status.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {application.candidateName}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{application.jobTitle}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700">{application.matchScore}% match</span>
            </div>
            <span className="text-xs text-gray-500">{application.experience}</span>
          </div>

          <div className="flex gap-1 mt-2">
            {application.skills.slice(0, 3).map((skill: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                {skill}
              </span>
            ))}
            {application.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{application.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View profile">
          <Eye className="h-4 w-4" />
        </button>
        {application.status === 'reviewed' && (
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Schedule interview">
            <Calendar className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// New Component: Job Card
const JobCard = ({ job }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    closed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{job.department}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="h-4 w-4" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium text-green-600">{job.salary}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{job.applicationCount} applicants</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// New Component: Toolkit Action
const ToolkitAction = ({ icon, label, description, gradient, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
  >
    <div className="p-2 rounded-full bg-white/20 mb-2">
      {icon}
    </div>
    <span className="text-sm font-medium mb-1">{label}</span>
    <span className="text-xs opacity-90 text-center">{description}</span>
  </button>
);

// New Component: Performance Metric
const PerformanceMetric = ({ label, value, trend, icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-white transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
    <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
      <span>{Math.abs(trend)}%</span>
    </div>
  </div>
);

export default EnterpriseDashboard;