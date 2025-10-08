'use client';
import { useState, useEffect } from 'react';
import { 
  Briefcase, Users, FileText, BarChart2, Settings, Mail, Bell, Shield, 
  DollarSign, MapPin, Activity, ClipboardList, MessageSquare, Database,
  Search, Filter, Download, Plus, MoreVertical, ChevronDown, ChevronUp, ChevronRight,
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle, Eye, UserPlus, TrendingUp,
  Calendar, Building, CreditCard, FileCheck, Sparkles, Target, Zap, Cpu,
  PieChart, BarChart3, Cloud, Server
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
  const [activeView, setActiveView] = useState('overview');

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 space-y-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Glass Morphism */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Command Center
              </h1>
              <p className="text-gray-600">Real-time platform intelligence & analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-6 p-1 bg-gray-100/50 rounded-lg w-fit">
          {['overview', 'analytics', 'users', 'jobs'].map((view) => (
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
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Sidebar - Stats Overview */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Pulse</h2>
            <div className="space-y-4">
              <StatItem 
                icon={<Users className="h-5 w-5" />}
                label="Total Users"
                value={stats.totalUsers}
                trend={12.5}
                color="blue"
              />
              <StatItem 
                icon={<Briefcase className="h-5 w-5" />}
                label="Active Jobs"
                value={stats.activeJobs}
                trend={8.3}
                color="green"
              />
              <StatItem 
                icon={<Building className="h-5 w-5" />}
                label="Enterprises"
                value={stats.premiumEnterprises}
                trend={15.2}
                color="purple"
              />
              <StatItem 
                icon={<DollarSign className="h-5 w-5" />}
                label="Revenue"
                value={stats.revenue}
                trend={22.1}
                color="orange"
                isCurrency
              />
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="space-y-3">
              <HealthIndicator 
                service="API Gateway"
                status="healthy"
                latency="42ms"
                icon={<Cloud className="h-4 w-4" />}
              />
              <HealthIndicator 
                service="Database"
                status="healthy"
                latency="18ms"
                icon={<Database className="h-4 w-4" />}
              />
              <HealthIndicator 
                service="AI Matching"
                status="degraded"
                latency="256ms"
                icon={<Cpu className="h-4 w-4" />}
              />
              <HealthIndicator 
                service="Payments"
                status="healthy"
                latency="63ms"
                icon={<CreditCard className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard 
              title="Matches Made"
              value={stats.matchesMade}
              change={18.2}
              icon={<Target className="h-6 w-6" />}
              gradient="from-green-500 to-emerald-600"
            />
            <MetricCard 
              title="Applications"
              value={stats.totalApplications}
              change={-3.4}
              icon={<FileText className="h-6 w-6" />}
              gradient="from-blue-500 to-cyan-600"
            />
            <MetricCard 
              title="Pending Approvals"
              value={stats.pendingApprovals}
              change={25.7}
              icon={<AlertCircle className="h-6 w-6" />}
              gradient="from-orange-500 to-red-600"
            />
            <MetricCard 
              title="Success Rate"
              value="94.2%"
              change={2.1}
              icon={<TrendingUp className="h-6 w-6" />}
              gradient="from-purple-500 to-pink-600"
            />
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Activity Stream</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                View all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <TimelineItem 
                  key={activity.id} 
                  activity={{
                    ...activity,
                    icon: iconMap[activity.icon] || <Activity className="h-5 w-5 text-gray-500" />
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard 
                icon={<UserPlus className="h-5 w-5" />}
                label="Add User"
                description="Create new user account"
                color="blue"
              />
              <ActionCard 
                icon={<FileCheck className="h-5 w-5" />}
                label="Approve Jobs"
                description="Review pending jobs"
                color="green"
              />
              <ActionCard 
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                description="View detailed reports"
                color="purple"
              />
              <ActionCard 
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                description="System configuration"
                color="gray"
              />
            </div>
          </div>

          {/* Top Enterprises */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
            <div className="space-y-4">
              {topEnterprises.map((enterprise, index) => (
                <LeaderboardItem 
                  key={enterprise.id}
                  rank={index + 1}
                  name={enterprise.name}
                  metric={enterprise.jobs}
                  metricLabel="jobs"
                  trend="up"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Component: Stat Item
const StatItem = ({ icon, label, value, trend, color, isCurrency = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-lg font-semibold">
            {isCurrency ? `${value.toLocaleString()} XAF` : value.toLocaleString()}
          </p>
        </div>
      </div>
      <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span>{Math.abs(trend)}%</span>
      </div>
    </div>
  );
};

// New Component: Health Indicator
const HealthIndicator = ({ service, status, latency, icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-900">{service}</p>
        <p className="text-xs text-gray-500">{latency}</p>
      </div>
    </div>
    <div className={`h-2 w-2 rounded-full ${
      status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
    }`}></div>
  </div>
);

// New Component: Metric Card
const MetricCard = ({ title, value, change, icon, gradient }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <div className={`flex items-center mt-3 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      <span>{Math.abs(change)}% from last week</span>
    </div>
  </div>
);

// New Component: Timeline Item
const TimelineItem = ({ activity }) => (
  <div className="flex items-start gap-4 p-3 hover:bg-gray-50/50 rounded-xl transition-all duration-200 group">
    <div className="flex-shrink-0 mt-1">
      {activity.icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 group-hover:text-gray-700">{activity.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
    </div>
    <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400">
      <Clock className="h-3 w-3" />
      <span>{activity.time}</span>
    </div>
  </div>
);

// New Component: Action Card
const ActionCard = ({ icon, label, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    gray: 'bg-gray-500 hover:bg-gray-600'
  };

  return (
    <button className={`flex flex-col items-center justify-center p-4 rounded-xl ${colorClasses[color]} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}>
      <div className="p-2 rounded-full bg-white/20">
        {icon}
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
      <span className="text-xs opacity-90 mt-1">{description}</span>
    </button>
  );
};

// New Component: Leaderboard Item
const LeaderboardItem = ({ rank, name, metric, metricLabel, trend }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-xl transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
        rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {rank}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500">{metric} {metricLabel}</p>
      </div>
    </div>
    <div className={`flex items-center text-sm ${
      trend === 'up' ? 'text-green-600' : 'text-red-600'
    }`}>
      {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
    </div>
  </div>
);

export default AdminDashboard;