'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';
import { toast } from 'react-toastify';
import {
  Briefcase, Users, FileText, BarChart2, Settings, Mail, Bell, Shield,
  DollarSign, MapPin, Activity, ClipboardList, MessageSquare, Database,
  Search, Filter, Download, Plus, MoreVertical, ChevronDown, ChevronUp, ChevronRight,
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Seeker Dashboard</h1>
          <p className="text-gray-600">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  // If user hasn't registered as job seeker yet
  if (!dashboardData.profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Job Seeker Dashboard</h1>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Complete Your Job Seeker Profile</h2>
            <p className="text-gray-600 mb-6">
              To access the full dashboard features, you need to register as a job seeker first.
            </p>
            <button
              onClick={() => {
                toast.info('Registration feature coming soon!');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Register as Job Seeker
            </button>
          </div>

          {/* Show recommended jobs even without profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recommended Jobs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.recommendedJobs?.slice(0, 6).map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{job.employerName}</p>
                  <p className="text-gray-500 text-sm mb-2">{job.city}, {job.state}</p>
                  <p className="text-green-600 font-semibold">${job.salaryMin} - ${job.salaryMax}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData.applicationStats || { total: 0, pending: 0, accepted: 0, rejected: 0 };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Seeker Dashboard</h1>
          <p className="text-gray-600">Welcome back, {dashboardData?.profile?.fullName || 'Job Seeker'}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.total}
          change={0}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          change={0}
          icon={<Clock className="h-6 w-6" />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          change={0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          change={0}
          icon={<AlertCircle className="h-6 w-6" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <button 
              onClick={fetchMoreApplications}
              disabled={applicationsLoading}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
            >
              {applicationsLoading ? 'Loading...' : 'View all'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.applications?.length > 0 ? (
              dashboardData.applications.map((app) => (
                <ActivityItem
                  key={app.id}
                  activity={{
                    id: app.id,
                    type: 'application',
                    title: app.jobTitle,
                    description: `Applied to ${app.companyName}`,
                    time: new Date(app.appliedAt).toLocaleDateString(),
                    icon: app.status === 'ACCEPTED' ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                          app.status === 'REJECTED' ? <AlertCircle className="h-5 w-5 text-red-500" /> :
                          <Clock className="h-5 w-5 text-yellow-500" />
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No applications yet</p>
                <p className="text-sm">Start browsing jobs to apply!</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile & Quick Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center select-none">
            <span className="text-white text-lg font-semibold">
              {(() => {
                const firstName = localStorage.getItem('user_firstname') || '';
                const lastName = localStorage.getItem('user_lastname') || '';
                const fullName = firstName && lastName ? `${firstName} ${lastName}` : '';
                return fullName ? fullName.charAt(0) : '?';
              })()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {(() => {
                const firstName = localStorage.getItem('user_firstname') || '';
                const lastName = localStorage.getItem('user_lastname') || '';
                return firstName && lastName ? `${firstName} ${lastName}` : 'registered';
                // return firstName && lastName ? `${firstName} ${lastName}` : 'Not registered';
              })()}
            </h3>
            <p className="text-sm text-gray-600">{localStorage.getItem('email') || 'No email'}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {localStorage.getItem('user_bio') || 'No bio available'}
        </p>
      </div>


          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                icon={<Search className="h-5 w-5" />}
                label="Browse Jobs"
                color="bg-blue-100 text-blue-600"
              />
              <ActionButton
                icon={<FileText className="h-5 w-5" />}
                label="My Applications"
                color="bg-green-100 text-green-600"
              />
              <ActionButton
                icon={<Settings className="h-5 w-5" />}
                label="Update Profile"
                color="bg-purple-100 text-purple-600"
              />
              <ActionButton
                icon={<Download className="h-5 w-5" />}
                label="Download Resume"
                color="bg-gray-100 text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View all jobs
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.recommendedJobs?.slice(0, 6).map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{job.employerName}</p>
              <p className="text-gray-500 text-sm mb-2">{job.city}, {job.state}</p>
              <p className="text-green-600 font-semibold">${job.salaryMin} - ${job.salaryMax}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  isCurrency = false, 
  color = "text-blue-600", 
  bgColor = "bg-blue-100" 
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">
          {isCurrency ? `${value} XAF` : value}
        </p>
      </div>
      <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex-shrink-0 mt-1">
      {activity.icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
      <p className="text-sm text-gray-500 truncate">{activity.description}</p>
    </div>
    <div className="flex-shrink-0 text-xs text-gray-400">
      {activity.time}
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ icon, label, color }) => (
  <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-opacity`}>
    <div className="p-2 rounded-full bg-white/50">
      {icon}
    </div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </button>
);

export default JobSeekerPage;