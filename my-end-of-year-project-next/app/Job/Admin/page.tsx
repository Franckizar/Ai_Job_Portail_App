'use client';
import { useState, useEffect } from 'react';
import { 
  Briefcase, Users, FileText, BarChart2, Settings, Mail, Bell, Shield, 
  DollarSign, MapPin, Activity, ClipboardList, MessageSquare, Database,
  Search, Filter, Download, Plus, MoreVertical, ChevronDown, ChevronUp, ChevronRight,
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle, Eye, UserPlus, TrendingUp,
  Calendar, Building, CreditCard, FileCheck
} from 'lucide-react';
import UserCard from '@/components/UserCard';
import { fetchWithAuth, getJwtToken } from '../../../fetchWithAuth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    pendingApprovals: 0,
    totalApplications: 0,
    premiumEnterprises: 0,
    revenue: 0,
    matchesMade: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topEnterprises, setTopEnterprises] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch stats data
        const statsResponse = await fetchWithAuth('/api/v1/admin/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Failed to fetch stats');
          // Fallback to mock data if API fails
          setStats({
            totalUsers: 2458,
            activeJobs: 189,
            pendingApprovals: 23,
            totalApplications: 3421,
            premiumEnterprises: 56,
            revenue: 1254000,
            matchesMade: 843
          });
        }

        // Fetch recent activities
        const activitiesResponse = await fetchWithAuth('/api/v1/admin/activities');
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        } else {
          console.error('Failed to fetch activities');
          // Fallback to mock data
          setRecentActivities([
            { 
              id: 1, 
              type: 'new_user', 
              title: 'New premium user', 
              description: 'Tech Solutions Inc. upgraded to enterprise plan', 
              time: '5 mins ago',
              icon: 'CheckCircle'
            },
            { 
              id: 2, 
              type: 'job_post', 
              title: 'Job requires approval', 
              description: 'Senior DevOps Engineer at Cloud Innovations', 
              time: '25 mins ago',
              icon: 'AlertCircle'
            },
            { 
              id: 3, 
              type: 'payment', 
              title: 'Payment received', 
              description: '25,000 XAF from Digital Marketing Pros', 
              time: '1 hour ago',
              icon: 'DollarSign'
            },
            { 
              id: 4, 
              type: 'new_enterprise', 
              title: 'New enterprise registered', 
              description: 'Data Analytics Co. joined the platform', 
              time: '3 hours ago',
              icon: 'Database'
            }
          ]);
        }

        // Fetch top enterprises
        const enterprisesResponse = await fetchWithAuth('/api/v1/admin/top-enterprises');
        if (enterprisesResponse.ok) {
          const enterprisesData = await enterprisesResponse.json();
          setTopEnterprises(enterprisesData);
        } else {
          console.error('Failed to fetch top enterprises');
          // Fallback to mock data
          setTopEnterprises([
            { id: 1, name: 'Tech Solutions Inc.', jobs: 24, members: 15, joined: '2023-05-12' },
            { id: 2, name: 'Cloud Innovations', jobs: 18, members: 12, joined: '2023-08-21' },
            { id: 3, name: 'Data Analytics Co.', jobs: 15, members: 9, joined: '2023-11-05' },
            { id: 4, name: 'Digital Marketing Pros', jobs: 12, members: 7, joined: '2024-01-15' }
          ]);
        }

        // Fetch recent jobs
        const jobsResponse = await fetchWithAuth('/api/v1/admin/recent-jobs');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setRecentJobs(jobsData);
        } else {
          console.error('Failed to fetch recent jobs');
          // Fallback to mock data
          setRecentJobs([
            { id: 1, title: 'Senior Frontend Developer', company: 'Tech Solutions Inc.', applications: 42, status: 'active', posted: '2 days ago' },
            { id: 2, title: 'DevOps Engineer', company: 'Cloud Innovations', applications: 28, status: 'active', posted: '3 days ago' },
            { id: 3, title: 'Data Scientist', company: 'Data Analytics Co.', applications: 35, status: 'pending', posted: '1 day ago' },
            { id: 4, title: 'Marketing Manager', company: 'Digital Marketing Pros', applications: 19, status: 'active', posted: '4 days ago' }
          ]);
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Map icon names to components
  const iconMap = {
    CheckCircle: <CheckCircle className="h-5 w-5 text-green-500" />,
    AlertCircle: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    DollarSign: <DollarSign className="h-5 w-5 text-blue-500" />,
    Database: <Database className="h-5 w-5 text-purple-500" />,
    UserPlus: <UserPlus className="h-5 w-5 text-indigo-500" />,
    Briefcase: <Briefcase className="h-5 w-5 text-orange-500" />,
    FileCheck: <FileCheck className="h-5 w-5 text-teal-500" />
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform activity and metrics</p>
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserCard 
          type="Total Users" 
          endpoint="/api/v1/admin/stats/users" 
        />
        <UserCard 
          type="Active Jobs" 
          endpoint="/api/v1/admin/stats/jobs" 
        />
        <UserCard 
          type="Premium Enterprises" 
          endpoint="/api/v1/admin/stats/enterprises" 
        />
        <UserCard 
          type="Revenue" 
          endpoint="/api/v1/admin/stats/revenue" 
          isCurrency={true}
        />
      </div>

    
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <ActivityItem 
                  key={activity.id} 
                  activity={{
                    ...activity,
                    icon: iconMap[activity.icon] || <Activity className="h-5 w-5 text-gray-500" />
                  }} 
                />
              ))}
            </div>
          </div>

          {/* Recent Jobs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recently Posted Jobs</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Job Title</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Company</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Applications</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Posted</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map(job => (
                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium">{job.title}</td>
                      <td className="py-3 text-sm text-gray-500">{job.company}</td>
                      <td className="py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {job.applications}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{job.posted}</td>
                      <td className="py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
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
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton 
                icon={<Users className="h-5 w-5" />}
                label="Manage Users"
                color="bg-blue-100 text-blue-600"
              />
              <ActionButton 
                icon={<Briefcase className="h-5 w-5" />}
                label="Approve Jobs"
                color="bg-green-100 text-green-600"
              />
              <ActionButton 
                icon={<DollarSign className="h-5 w-5" />}
                label="View Payments"
                color="bg-purple-100 text-purple-600"
              />
              <ActionButton 
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                color="bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Top Enterprises */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Top Enterprises</h2>
            <div className="space-y-4">
              {topEnterprises.map(enterprise => (
                <div key={enterprise.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{enterprise.name}</h3>
                      <p className="text-xs text-gray-500">{enterprise.jobs} jobs • {enterprise.members} members</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{enterprise.joined}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <StatusItem 
                label="API Service" 
                status="operational" 
                lastChecked="2 mins ago" 
              />
              <StatusItem 
                label="Database" 
                status="operational" 
                lastChecked="5 mins ago" 
              />
              <StatusItem 
                label="Payment Gateway" 
                status="degraded" 
                lastChecked="10 mins ago" 
              />
              <StatusItem 
                label="AI Matching" 
                status="operational" 
                lastChecked="15 mins ago" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, isCurrency = false }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">
          {isCurrency ? `${value} XAF` : value.toLocaleString()}
        </p>
      </div>
      <div className={`p-2 rounded-lg ${change >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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
    <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400">
      <Clock className="h-3 w-3" />
      <span>{activity.time}</span>
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

// Status Item Component
const StatusItem = ({ label, status, lastChecked }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`h-2.5 w-2.5 rounded-full ${
        status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
      }`}></div>
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-sm text-gray-500">{lastChecked}</span>
  </div>
);

export default AdminDashboard;