'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Calendar, UserCheck, Plus, ChevronDown, ChevronRight,
  ArrowUp, ArrowDown, Eye, Edit, Trash2, Clock, Zap, Building,
  Star, AlertCircle
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userRole || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Unable to load dashboard</h2>
          <p className="mt-2 text-gray-600">Please check your authentication and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'ENTERPRISE' ? 'Enterprise Dashboard' : 'Employer Dashboard'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'ENTERPRISE' 
              ? 'Manage your hiring pipeline and track performance' 
              : 'Manage your job postings and applicants'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Jobs" 
          value={stats.activeJobs} 
          change={12}
          icon={<Briefcase className="h-5 w-5" />}
          color="blue"
        />
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          change={8}
          icon={<Users className="h-5 w-5" />}
          color="green"
        />
        <StatCard 
          title="Interviews Scheduled" 
          value={stats.interviewsScheduled} 
          change={-3}
          icon={<Calendar className="h-5 w-5" />}
          color="purple"
        />
        <StatCard 
          title="Hired This Month" 
          value={stats.hiredThisMonth} 
          change={25}
          icon={<UserCheck className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <button 
                onClick={() => handleQuickAction('view-applications')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentApplications.map(application => (
                <ApplicationItem 
                  key={application.id} 
                  application={application}
                />
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                Manage jobs
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Job Title</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Department</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Applications</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Posted</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeJobs.map(job => (
                    <JobRow 
                      key={job.id} 
                      job={job}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton 
                icon={<Plus className="h-5 w-5" />}
                label="Post Job"
                color="bg-blue-100 text-blue-600"
                onClick={() => handleQuickAction('post-job')}
              />
              <ActionButton 
                icon={<Users className="h-5 w-5" />}
                label="View Candidates"
                color="bg-green-100 text-green-600"
                onClick={() => handleQuickAction('view-applications')}
              />
              <ActionButton 
                icon={<Building className="h-5 w-5" />}
                label="Analytics"
                color="bg-orange-100 text-orange-600"
                onClick={() => handleQuickAction('analytics')}
              />
            </div>
          </div>

          {/* Premium Status */}
          {userRole === 'ENTERPRISE' && stats.premiumUntil && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-6 w-6" />
                <h3 className="font-semibold">Premium Enterprise</h3>
              </div>
              <p className="text-sm opacity-90 mb-2">
                Enhanced features active until
              </p>
              <p className="font-bold text-lg mb-4">
                {new Date(stats.premiumUntil).toLocaleDateString()}
              </p>
              <button className="w-full bg-white text-blue-600 hover:bg-gray-100 py-2 rounded-md text-sm font-medium transition-colors">
                Manage Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className={`flex items-center mt-3 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(change)}% from last period</span>
      </div>
    </div>
  );
};

// Application Item Component
const ApplicationItem = ({ application }) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {application.candidateName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">{application.candidateName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-800'}`}>
              {application.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{application.jobTitle}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-gray-500">{application.experience}</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700">{application.matchScore}% match</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View application">
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

// Job Row Component
const JobRow = ({ job }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    closed: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{job.title}</p>
          <p className="text-xs text-gray-500">{job.type} • {job.location}</p>
        </div>
      </td>
      <td className="py-3 text-sm text-gray-600">{job.department}</td>
      <td className="py-3 text-sm">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {job.applicationCount}
        </span>
      </td>
      <td className="py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
          {job.status}
        </span>
      </td>
      <td className="py-3 text-sm text-gray-500">
        {new Date(job.postedDate).toLocaleDateString()}
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit job">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete job">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Action Button Component
const ActionButton = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-all duration-200 hover:scale-105`}
  >
    <div className="p-2 rounded-full bg-white/50">
      {icon}
    </div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </button>
);


export default EnterpriseDashboard;