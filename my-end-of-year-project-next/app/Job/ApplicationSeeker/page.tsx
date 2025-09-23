'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';
import {
  FileText, Search, Filter, Download, Eye, CheckCircle, XCircle,
  Clock, ExternalLink, ChevronLeft, ChevronRight, Calendar,
  MapPin, DollarSign, Building, Star, MoreVertical, Briefcase
} from 'lucide-react';

interface JobSeekerApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobSalaryMin: number;
  jobSalaryMax: number;
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  coverLetter: string;
  resumeUrl: string;
  portfolioUrl: string;
}

interface ApplicationStats {
  total: number;
  submitted: number;
  accepted: number;
  rejected: number;
}

const JobSeekerApplications = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<JobSeekerApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobSeekerApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({ total: 0, submitted: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<JobSeekerApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const itemsPerPage = 8;
  const baseURL = 'http://localhost:8088/api/v1/auth/applications';

  // Fetch applications and stats
  const fetchApplications = async (status = 'ALL', page = 1) => {
    if (!user?.jobSeekerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch applications
      const appsResponse = await fetchWithAuth(
        `${baseURL}/jobseeker/${user.jobSeekerId}/dashboard?status=${status}`
      );
      
      if (appsResponse.ok) {
        const appsData: JobSeekerApplication[] = await appsResponse.json();
        
        // Simulate pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = appsData.slice(startIndex, endIndex);
        
        setApplications(paginatedData);
        setFilteredApplications(paginatedData);
      }

      // Fetch stats
      const statsResponse = await fetchWithAuth(
        `${baseURL}/jobseeker/${user.jobSeekerId}/stats`
      );
      
      if (statsResponse.ok) {
        const statsData: ApplicationStats = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  // Filter applications based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => 
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [searchQuery, applications]);

  // Initial load
  useEffect(() => {
    if (!authLoading && user) {
      fetchApplications();
    }
  }, [authLoading, user]);

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    fetchApplications(status, 1);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      SUBMITTED: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        icon: Clock
      },
      ACCEPTED: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        icon: CheckCircle
      },
      REJECTED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        icon: XCircle
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SUBMITTED;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  // Application detail modal
  const ApplicationDetailModal = () => {
    if (!selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedApplication.jobTitle}
                </h2>
                <p className="text-gray-600">
                  Applied {formatDate(selectedApplication.appliedAt)}
                </p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Company Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedApplication.companyName}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedApplication.jobLocation}
                </p>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-600">
                ${selectedApplication.jobSalaryMin?.toLocaleString() || 'N/A'} - ${selectedApplication.jobSalaryMax?.toLocaleString() || 'N/A'}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedApplication.status} />
              <span className="text-sm text-gray-500">
                {timeAgo(selectedApplication.appliedAt)}
              </span>
            </div>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedApplication.resumeUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume
                  </h4>
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Resume <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedApplication.portfolioUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Portfolio
                  </h4>
                  <a 
                    href={selectedApplication.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPages = Math.ceil(stats.total / itemsPerPage);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.jobSeekerId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Seeker Profile Required</h2>
            <p className="text-gray-600 mb-4">
              You need to complete your job seeker profile to view your applications.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Job Applications</h1>
              <p className="text-gray-600">
                Track and manage your job applications ({stats.total} total)
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export Applications
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-semibold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold mt-1">{stats.submitted}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Accepted</p>
                <p className="text-2xl font-semibold mt-1">{stats.accepted}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold mt-1">{stats.rejected}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              {['ALL', 'SUBMITTED', 'ACCEPTED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium">Job Title</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Salary</th>
                  <th className="px-6 py-4 font-medium">Applied Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Loading your applications...
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {searchQuery || selectedStatus !== 'ALL' 
                        ? 'No applications match your filters' 
                        : 'You haven\'t applied to any jobs yet'}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr 
                      key={application.id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {application.jobTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{application.companyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {application.jobLocation}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-green-600 font-semibold">
                          ${application.jobSalaryMin?.toLocaleString() || 'N/A'} - ${application.jobSalaryMax?.toLocaleString() || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-700">
                            {formatDate(application.appliedAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {timeAgo(application.appliedAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
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
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} applications
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {showDetailModal && <ApplicationDetailModal />}
    </div>
  );
};

export default JobSeekerApplications;