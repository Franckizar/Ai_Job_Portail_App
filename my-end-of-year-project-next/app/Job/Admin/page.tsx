// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Shield,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
} from 'lucide-react';
// import UserCard from '../../components/UserCard';
import UserCard from '@/components/UserCard';
import ActivityItem from '@/components/ActivityItem';
import ActionButton from '@/components/ActionButton';
import StatusItem from '@/components/StatusItem';

const AdminDashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call for recent activities
        await new Promise(resolve => setTimeout(resolve, 800));

        setRecentActivities([
          {
            id: 1,
            type: 'new_user',
            title: 'New premium user',
            description: 'Tech Solutions Inc. upgraded to enterprise plan',
            time: '5 mins ago',
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          },
          {
            id: 2,
            type: 'job_post',
            title: 'Job requires approval',
            description: 'Senior DevOps Engineer at Cloud Innovations',
            time: '25 mins ago',
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          },
          {
            id: 3,
            type: 'payment',
            title: 'Payment received',
            description: '25,000 XAF from Digital Marketing Pros',
            time: '1 hour ago',
            icon: <DollarSign className="h-5 w-5 text-blue-500" />,
          },
          {
            id: 4,
            type: 'new_enterprise',
            title: 'New enterprise registered',
            description: 'Data Analytics Co. joined the platform',
            time: '3 hours ago',
            icon: <Database className="h-5 w-5 text-purple-500" />,
          },
        ]);
      } catch (error) {
        console.error('Failed to load recent activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  return (
    <div className="p-6 space-y-6">
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
              onChange={e => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserCard
          type="Total Users"
          endpoint="http://localhost:8088/api/v1/auth/test/total-users"
          key="total-users"
        />
        <UserCard
          type="Active Jobs"
          endpoint="http://localhost:8088/api/v1/auth/jobs/active/count"
          key="active-jobs"
        />
        <UserCard
          type="Pending Approvals"
          endpoint="http://localhost:8080/api/v1/stats/pending-approvals"
          key="pending-approvals"
        />
        <UserCard
          type="Revenue"
          endpoint="http://localhost:8080/api/v1/auth/subscriptions/total-amount"
          isCurrency={true}
          key="revenue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading activities...</p>
            ) : (
              recentActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>

        {/* Quick Actions and System Status */}
        <div className="space-y-6">
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
                icon={<Shield className="h-5 w-5" />}
                label="Settings"
                color="bg-gray-100 text-gray-600"
              />
            </div>
          </div>

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

export default AdminDashboard;