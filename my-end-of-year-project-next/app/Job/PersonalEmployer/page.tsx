'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';
import { toast } from 'react-toastify';
import {
  User, Users, FileText, TrendingUp, Plus, Eye, Edit, MapPin,
  Calendar, DollarSign, Briefcase, Star, Award, Target, BarChart3,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, AlertCircle,
  MessageSquare, Settings, Search, Heart, Bookmark
} from 'lucide-react';

interface PersonalEmployerProfile {
  id: number;
  user: {
    id: number;
    email: string;
  };
  fullName: string;
  bio: string;
  companyName?: string;
  location: string;
  profileImageUrl: string;
}

interface JobResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  status: string;
  createdAt: string;
}

interface ApplicationDTO {
  id: number;
  jobSeekerId: number;
  jobId: number;
  status: string;
  appliedAt: string;
  jobTitle: string;
  jobSeekerName: string;
}

interface DashboardData {
  profile: PersonalEmployerProfile;
  jobs: JobResponse[];
  activeJobsCount: number;
  applications: ApplicationDTO[];
  totalApplications: number;
  recentApplications: ApplicationDTO[];
}

const PersonalEmployerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.userId) {
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchWithAuth(`http://localhost:8088/api/v1/auth/personal-employer/dashboard/${user.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your personal dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-6">Failed to load personal employer dashboard data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome back, {dashboardData.profile.fullName}
              </h1>
              <p className="text-gray-600 mt-2">Manage your job postings and find the perfect candidates</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-50 font-semibold transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Post New Job
              </button>
              <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 font-semibold transition-colors flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Candidates
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Job Postings"
            value={dashboardData.activeJobsCount}
            change={18}
            icon={<Briefcase className="w-8 h-8" />}
            gradient="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Total Applications"
            value={dashboardData.totalApplications}
            change={32}
            icon={<FileText className="w-8 h-8" />}
            gradient="from-teal-500 to-teal-600"
            bgColor="bg-teal-50"
          />
          <StatCard
            title="Profile Views"
            value={247}
            change={15}
            icon={<Eye className="w-8 h-8" />}
            gradient="from-cyan-500 to-cyan-600"
            bgColor="bg-cyan-50"
          />
          <StatCard
            title="Hiring Success"
            value="68%"
            change={12}
            icon={<Award className="w-8 h-8" />}
            gradient="from-green-500 to-green-600"
            bgColor="bg-green-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {dashboardData.profile.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{dashboardData.profile.fullName}</h3>
                    <p className="text-emerald-100">Personal Employer</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">About Me</label>
                  <p className="text-gray-900 mt-1">{dashboardData.profile.bio}</p>
                </div>

                {dashboardData.profile.companyName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900 mt-1">{dashboardData.profile.companyName}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {dashboardData.profile.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-semibold transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 font-semibold transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Active Jobs */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Job Postings</h2>
                <button className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2">
                  View All Jobs
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              {dashboardData.jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-6">Start your hiring journey by posting your first job</p>
                  <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 font-semibold transition-colors">
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.location}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                <button className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2">
                  Manage All Applications
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              {dashboardData.recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">Applications will appear here once candidates apply to your jobs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.recentApplications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.jobTitle}</h3>
                          <p className="text-gray-600 mb-2">Applicant: {app.jobSeekerName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group">
                  <div className="p-3 bg-emerald-600 rounded-xl mb-3 group-hover:bg-emerald-700 transition-colors">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Find Candidates</span>
                  <span className="text-sm text-gray-600 mt-1">Browse talent pool</span>
                </button>

                <button className="flex flex-col items-center justify-center p-6 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors group">
                  <div className="p-3 bg-teal-600 rounded-xl mb-3 group-hover:bg-teal-700 transition-colors">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Saved Candidates</span>
                  <span className="text-sm text-gray-600 mt-1">View bookmarked profiles</span>
                </button>

                <button className="flex flex-col items-center justify-center p-6 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors group">
                  <div className="p-3 bg-cyan-600 rounded-xl mb-3 group-hover:bg-cyan-700 transition-colors">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Hiring Analytics</span>
                  <span className="text-sm text-gray-600 mt-1">Track your success</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, change, icon, gradient, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span className="font-medium">{Math.abs(change)}%</span>
          <span className="text-gray-500">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-2xl ${bgColor}`}>
        <div className={`p-2 rounded-xl bg-gradient-to-r ${gradient} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export default PersonalEmployerDashboard;
