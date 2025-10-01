'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase, Users, TrendingUp, Calendar, 
  Search, Filter, Download, Eye, Edit, Trash2,
  Clock, RefreshCw, AlertTriangle, BarChart3, PieChart,
  ChevronLeft, ChevronRight, MoreVertical, User, MapPin,
  Plus, CheckCircle, XCircle, DollarSign, Building
} from 'lucide-react';
import { JobModal } from '@/components/Job_portail/Home/components/JobModal';

interface Job {
  id: number;
  title: string;
  description: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  employerName: string;
  enterpriseId?: number;
  personalEmployerId?: number;
  category?: {
    id: number;
    name: string;
    description: string;
  };
  skills: {
    skillId: number;
    skillName: string;
    required: boolean;
  }[];
  status: string;
  createdAt: string;
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  const baseURL = 'http://localhost:8088';

  // Get user info from localStorage
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

  // Fetch jobs from API based on user role
  const fetchJobs = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      
      if (userRole === 'ENTERPRISE' && userId) {
        endpoint = `${baseURL}/api/v1/auth/jobs/enterprise/${userId}/active-jobs`;
      } else if (userRole === 'PERSONAL_EMPLOYER' && userId) {
        endpoint = `${baseURL}/api/v1/auth/jobs/employer/${userId}/active-jobs`;
      } else if (userRole === 'ADMIN') {
        endpoint = `${baseURL}/api/v1/auth/jobs`;
      } else {
        console.error('Invalid user role or missing user ID');
        return;
      }

      const token = localStorage.getItem('jwt_token');
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (jobId: number) => {
    try {
      setDeletingId(jobId);
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${baseURL}/api/v1/auth/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId));
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Update job status
  const updateJobStatus = async (jobId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${baseURL}/api/v1/auth/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
      } else {
        console.error('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  // Handle job save (create/update)
  const handleJobSave = async (jobData: any) => {
    try {
      await fetchJobs(); // Refresh the list
      setShowJobModal(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get job type color
  const getJobTypeColor = (type: string) => {
    const colors = {
      FULL_TIME: { bg: 'bg-green-100', text: 'text-green-800' },
      PART_TIME: { bg: 'bg-blue-100', text: 'text-blue-800' },
      CONTRACT: { bg: 'bg-purple-100', text: 'text-purple-800' },
      TEMPORARY: { bg: 'bg-orange-100', text: 'text-orange-800' },
      INTERNSHIP: { bg: 'bg-pink-100', text: 'text-pink-800' },
      REMOTE: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      FREELANCE: { bg: 'bg-teal-100', text: 'text-teal-800' }
    };
    return colors[type as keyof typeof colors] || colors.FULL_TIME;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      DRAFT: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      CLOSED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    return colors[status as keyof typeof colors] || colors.ACTIVE;
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'ALL' || job.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || job.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'ACTIVE').length,
    draftJobs: jobs.filter(job => job.status === 'DRAFT').length,
    closedJobs: jobs.filter(job => job.status === 'CLOSED').length,
    avgSalary: jobs.length > 0 ? 
      jobs.reduce((sum, job) => sum + ((job.salaryMin + job.salaryMax) / 2), 0) / jobs.length : 0
  };

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Initial load
  useEffect(() => {
    if (userRole && userId) {
      fetchJobs();
    }
  }, [userRole, userId]);

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = getStatusColor(status);
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // Job Type Badge Component
  const JobTypeBadge = ({ type }: { type: string }) => {
    const config = getJobTypeColor(type);
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  // Job Detail Modal
  const JobDetailModal = () => {
    if (!selectedJob) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-gray-600 mt-1">{selectedJob.employerName}</p>
                <div className="flex gap-2 mt-2">
                  <JobTypeBadge type={selectedJob.type} />
                  <StatusBadge status={selectedJob.status} />
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Salary Information</h3>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedJob.salaryMin)} - {formatCurrency(selectedJob.salaryMax)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p>{selectedJob.city}, {selectedJob.state}</p>
                      {selectedJob.addressLine1 && (
                        <p className="text-sm text-gray-600">{selectedJob.addressLine1}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">
                    {selectedJob.category?.name || 'No category specified'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Posted Date</h3>
                  <p className="text-gray-900">{formatDate(selectedJob.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.length > 0 ? (
                  selectedJob.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        skill.required 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {skill.skillName} {skill.required && '• Required'}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Job Description</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading if user info not loaded yet
  if (!userRole || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'ENTERPRISE' ? 'Enterprise Job Management' : 
               userRole === 'PERSONAL_EMPLOYER' ? 'My Job Postings' : 
               'Job Management'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'ENTERPRISE' ? 'Manage your enterprise job postings and track performance' : 
               userRole === 'PERSONAL_EMPLOYER' ? 'Create and manage your job postings' : 
               'Manage and monitor all job postings across the platform'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setRefreshing(true);
                fetchJobs().finally(() => setRefreshing(false));
              }}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => {
                setEditingJob(null);
                setShowJobModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeJobs}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft Jobs</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.draftJobs}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {formatCurrency(stats.avgSalary)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs by title, description, location, or employer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="ALL">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
              <option value="FREELANCE">Freelance</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600 text-sm font-medium">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Salary Range</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Posted Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p>Loading jobs...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900">No jobs found</p>
                      <p className="text-gray-600">
                        {searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL' 
                          ? 'Try adjusting your search filters' 
                          : 'Get started by creating your first job posting'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{job.employerName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <JobTypeBadge type={job.type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {job.city}, {job.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setShowJobModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <select
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Change Status"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="DRAFT">Draft</option>
                          <option value="CLOSED">Closed</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                        
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
                              deleteJob(job.id);
                            }
                          }}
                          disabled={deletingId === job.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors min-w-[40px] ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && <JobDetailModal />}
      
      {showJobModal && (
        <JobModal
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setEditingJob(null);
          }}
          job={editingJob}
          onSave={handleJobSave}
        />
      )}
    </div>
  );
};

export default JobManagement;