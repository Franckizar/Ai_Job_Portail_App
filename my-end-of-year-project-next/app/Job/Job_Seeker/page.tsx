'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';
import { toast } from 'react-toastify';
import {
  Briefcase, Users, FileText, BarChart2, Settings, Mail, Bell, Shield,
  DollarSign, MapPin, Activity, ClipboardList, MessageSquare, Database,
  Search, Filter, Download, Plus, MoreVertical, ChevronDown, ChevronUp, ChevronRight,
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle, Target, TrendingUp,
  Zap, Sparkles, Award, Map, Building2, Calendar, Eye, UserCheck
} from 'lucide-react';

interface JobSeekerProfile {
  id: number;
  user: {
    id: number;
    email: string;
  };
  fullName: string;
  bio: string;
  resumeUrl: string;
  profileImageUrl: string;
}

interface ApplicationDTO {
  id: number;
  jobSeekerId: number;
  jobId: number;
  status: string;
  appliedAt: string;
  jobTitle: string;
  companyName: string;
}

interface JobResponse {
  id: number;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  employerName: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

interface DashboardData {
  profile: JobSeekerProfile;
  applications: ApplicationDTO[];
  applicationStats: ApplicationStats;
  recommendedJobs: JobResponse[];
}

const JobSeekerPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.jobSeekerId) {
        toast.error('Job seeker profile not found');
        setLoading(false);
        return;
      }

      try {
        // Fetch dashboard data (profile and recommended jobs)
        const dashboardResponse = await fetchWithAuth(`http://localhost:8088/api/v1/auth/jobseeker/dashboard/${user.userId}`);
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await dashboardResponse.json();

        // Fetch application statistics
        const statsResponse = await fetchWithAuth(`http://localhost:8088/api/v1/auth/jobs/jobseeker/${user.jobSeekerId}/application-stats`);
        const applicationStats = statsResponse.ok ? await statsResponse.json() : { total: 0, pending: 0, accepted: 0, rejected: 0 };

        // Fetch recent applications
        const applicationsResponse = await fetchWithAuth(`http://localhost:8088/api/v1/auth/jobs/jobseeker/${user.jobSeekerId}/recent-applications?limit=5`);
        const applications = applicationsResponse.ok ? await applicationsResponse.json() : [];

        setDashboardData({
          ...dashboardData,
          applicationStats,
          applications
        });

      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.userId, user?.jobSeekerId]);

  const fetchMoreApplications = async () => {
    if (!user?.jobSeekerId) return;
    
    setApplicationsLoading(true);
    try {
      const response = await fetchWithAuth(`http://localhost:8088/api/v1/auth/jobs/jobseeker/${user.jobSeekerId}/recent-applications?limit=20`);
      if (response.ok) {
        const applications = await response.json();
        setDashboardData(prev => prev ? { ...prev, applications } : null);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your career dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Career Dashboard</h1>
          <p className="text-gray-600">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  // If user hasn't registered as job seeker yet
  if (!dashboardData.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
              Welcome to Your Career Journey
            </h1>
            <p className="text-gray-600 text-lg">Start your path to finding the perfect job</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserCheck className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Complete Your Professional Profile</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Unlock your full career potential by creating your job seeker profile
            </p>
            <button
              onClick={() => {
                toast.info('Registration feature coming soon!');
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Your Journey
            </button>
          </div>

          {/* Show recommended jobs even without profile */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Discover Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recommendedJobs?.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData.applicationStats || { total: 0, pending: 0, accepted: 0, rejected: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 space-y-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200/10 rounded-full blur-3xl"></div>
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
                Career Command Center
              </h1>
              <p className="text-gray-600">Welcome back, {dashboardData?.profile?.fullName || 'Career Explorer'}</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100/50 rounded-lg">
            {['overview', 'applications', 'jobs', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Application Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Applications"
          value={stats.total}
          trend={8.2}
          icon={<FileText className="h-6 w-6" />}
          gradient="from-blue-500 to-cyan-600"
          description="Career moves made"
        />
        <MetricCard
          title="Under Review"
          value={stats.pending}
          trend={12.5}
          icon={<Clock className="h-6 w-6" />}
          gradient="from-yellow-500 to-orange-600"
          description="Opportunities in progress"
        />
        <MetricCard
          title="Accepted"
          value={stats.accepted}
          trend={25.7}
          icon={<CheckCircle className="h-6 w-6" />}
          gradient="from-green-500 to-emerald-600"
          description="Successful matches"
        />
        <MetricCard
          title="Not Selected"
          value={stats.rejected}
          trend={-5.3}
          icon={<AlertCircle className="h-6 w-6" />}
          gradient="from-red-500 to-pink-600"
          description="Learning experiences"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Application Timeline */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Application Journey</h2>
              <button 
                onClick={fetchMoreApplications}
                disabled={applicationsLoading}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                {applicationsLoading ? 'Loading...' : 'View Complete History'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.applications?.length > 0 ? (
                dashboardData.applications.map((app, index) => (
                  <TimelineItem
                    key={app.id}
                    application={app}
                    isLast={index === dashboardData.applications.length - 1}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">No applications yet</p>
                  <p className="text-sm">Start your journey by applying to exciting opportunities</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Profile</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">
                  {(() => {
                    const firstName = localStorage.getItem('user_firstname') || '';
                    const lastName = localStorage.getItem('user_lastname') || '';
                    const fullName = firstName && lastName ? `${firstName} ${lastName}` : '';
                    return fullName ? fullName.charAt(0).toUpperCase() : '?';
                  })()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {(() => {
                    const firstName = localStorage.getItem('user_firstname') || '';
                    const lastName = localStorage.getItem('user_lastname') || '';
                    return firstName && lastName ? `${firstName} ${lastName}` : 'Complete Your Profile';
                  })()}
                </h3>
                <p className="text-sm text-gray-600">{localStorage.getItem('email') || 'No email'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50/50 rounded-xl p-4">
              {localStorage.getItem('user_bio') || 'Your professional bio will appear here. Update your profile to stand out to employers.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Toolkit</h2>
            <div className="grid grid-cols-2 gap-4">
              <ToolkitAction
                icon={<Search className="h-5 w-5" />}
                label="Discover Jobs"
                description="Find your next role"
                gradient="from-blue-500 to-blue-600"
              />
              <ToolkitAction
                icon={<FileText className="h-5 w-5" />}
                label="Applications"
                description="Track your progress"
                gradient="from-green-500 to-green-600"
              />
              <ToolkitAction
                icon={<Settings className="h-5 w-5" />}
                label="Profile"
                description="Optimize your presence"
                gradient="from-purple-500 to-purple-600"
              />
              <ToolkitAction
                icon={<Download className="h-5 w-5" />}
                label="Resume"
                description="Download CV"
                gradient="from-orange-500 to-orange-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Curated Opportunities</h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            Explore All Positions
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.recommendedJobs?.slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
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
        <p className="text-2xl font-bold text-gray-900">{value}</p>
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

// New Component: Timeline Item
const TimelineItem = ({ application, isLast }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${
        application.status === 'ACCEPTED' ? 'bg-green-500' :
        application.status === 'REJECTED' ? 'bg-red-500' :
        'bg-yellow-500'
      } group-hover:scale-125 transition-transform`}></div>
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
    </div>
    <div className="flex-1 bg-gray-50/50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {application.jobTitle}
        </h3>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
          {new Date(application.appliedAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{application.companyName}</p>
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
        application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {application.status === 'ACCEPTED' ? <CheckCircle className="h-3 w-3" /> :
         application.status === 'REJECTED' ? <AlertCircle className="h-3 w-3" /> :
         <Clock className="h-3 w-3" />}
        {application.status || 'PENDING'}
      </div>
    </div>
  </div>
);

// New Component: Toolkit Action
const ToolkitAction = ({ icon, label, description, gradient }) => (
  <button className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}>
    <div className="p-2 rounded-full bg-white/20 mb-2">
      {icon}
    </div>
    <span className="text-sm font-medium mb-1">{label}</span>
    <span className="text-xs opacity-90 text-center">{description}</span>
  </button>
);

// New Component: Job Card
const JobCard = ({ job }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group cursor-pointer">
    <div className="flex justify-between items-start mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <Building2 className="h-6 w-6 text-white" />
      </div>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {job.status}
      </span>
    </div>
    
    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
      {job.title}
    </h3>
    <p className="text-gray-600 text-sm mb-3 font-medium">{job.employerName}</p>
    
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
      <MapPin className="h-4 w-4" />
      <span>{job.city}, {job.state}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-green-600 font-bold text-lg">
        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
      </span>
      <button className="text-blue-600 hover:text-blue-800 transition-colors">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default JobSeekerPage;