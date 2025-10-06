'use client';

import { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Download, Eye, CheckCircle, XCircle,
  Clock, FileText, ExternalLink, ChevronLeft, ChevronRight,
  Calendar, Mail, Phone, MapPin, Star, MoreVertical
} from 'lucide-react';
import { fetchWithAuth } from '../../../fetchWithAuth';

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  // CV Viewer States
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [currentJobSeekerId, setCurrentJobSeekerId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const baseURL = 'http://localhost:8088';

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
    } else if (role === 'ADMIN') {
      setUserId(null);
    }
  }, []);

  // Fetch applications based on user role
  const fetchApplications = async (status = 'ALL', page = 1) => {
    if (!userRole || (userRole !== 'ADMIN' && !userId)) return;

    setLoading(true);
    try {
      let url;
      if (userRole === 'ADMIN') {
        if (status === 'ALL') {
          url = `${baseURL}/api/v1/auth/applications/all?page=${page - 1}&size=${itemsPerPage}`;
        } else {
          url = `${baseURL}/api/v1/auth/applications/by-status/${status}?page=${page - 1}&size=${itemsPerPage}`;
        }
      } else if (userRole === 'ENTERPRISE') {
        url = `${baseURL}/api/v1/auth/jobs/enterprise/${userId}/recent-applications?limit=${itemsPerPage}&page=${page - 1}`;
        if (status !== 'ALL') {
          url += `&status=${status}`;
        }
      } else if (userRole === 'PERSONAL_EMPLOYER') {
        url = `${baseURL}/api/v1/auth/jobs/employer/${userId}/recent-applications?limit=${itemsPerPage}&page=${page - 1}`;
        if (status !== 'ALL') {
          url += `&status=${status}`;
        }
      }

      const response = await fetchWithAuth(url);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      const paginatedData = Array.isArray(data) ? data : [];
      
      setApplications(paginatedData);
      setFilteredApplications(paginatedData);
      setTotalApplications(data.totalElements || paginatedData.length);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setFilteredApplications([]);
      setTotalApplications(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch CV for job seeker
  const fetchCv = async (jobSeekerId: number) => {
    setCvLoading(true);
    setCvError(null);
    setCurrentJobSeekerId(jobSeekerId);
    
    try {
      const response = await fetchWithAuth(`${baseURL}/api/v1/auth/cv/${jobSeekerId}/jobseeker`);

      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received CV data, content length:', data.content?.length);

      // Convert base64 string to binary
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob from binary data
      const blob = new Blob([bytes], { type: 'application/pdf' });
      console.log('Created blob, type:', blob.type, 'size:', blob.size);

      // Create object URL for display
      const url = URL.createObjectURL(blob);
      setCvUrl(url);
      setShowCvModal(true);
    } catch (err) {
      console.error('Fetch CV error:', err);
      setCvError('Error fetching or displaying CV. Please try again.');
    } finally {
      setCvLoading(false);
    }
  };

  // Download CV
  const downloadCv = () => {
    if (!cvUrl || !currentJobSeekerId) return;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `jobseeker_${currentJobSeekerId}_cv.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close CV modal
  const closeCvModal = () => {
    if (cvUrl) URL.revokeObjectURL(cvUrl);
    setCvUrl(null);
    setShowCvModal(false);
    setCvError(null);
    setCurrentJobSeekerId(null);
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetchWithAuth(`${baseURL}/api/v1/auth/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchApplications(selectedStatus, currentPage);
      } else {
        console.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate time ago
  const timeAgo = (dateString) => {
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
        app.id.toString().includes(searchQuery.toLowerCase()) ||
        (app.coverLetter && app.coverLetter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.candidateName && app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredApplications(filtered);
    }
  }, [searchQuery, applications]);

  // Initial load
  useEffect(() => {
    if (userRole) {
      fetchApplications();
    }
  }, [userRole, userId]);

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    fetchApplications(status, 1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchApplications(selectedStatus, newPage);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      SUBMITTED: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
      },
      ACCEPTED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.SUBMITTED;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // CV Viewer Modal
  const CvViewerModal = () => {
    if (!showCvModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Candidate CV {currentJobSeekerId && `(Job Seeker #${currentJobSeekerId})`}
            </h2>
            <div className="flex gap-4">
              {cvUrl && (
                <button
                  onClick={downloadCv}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Download CV"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
              )}
              <button
                onClick={closeCvModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {cvLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading CV...</p>
                </div>
              </div>
            )}
            {cvError && (
              <div className="flex items-center justify-center h-96">
                <p className="text-red-600">{cvError}</p>
              </div>
            )}
            {cvUrl && !cvLoading && !cvError && (
              <iframe
                src={cvUrl}
                width="100%"
                height="600px"
                className="rounded-lg border-0"
                title="CV PDF Viewer"
              />
            )}
          </div>
        </div>
      </div>
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
                  Application #{selectedApplication.id}
                </h2>
                <p className="text-gray-600">
                  Applied {formatDate(selectedApplication.appliedAt)}
                </p>
                {selectedApplication.jobTitle && (
                  <p className="text-gray-600 mt-1">
                    For: {selectedApplication.jobTitle}
                  </p>
                )}
                {selectedApplication.candidateName && (
                  <p className="text-gray-600 mt-1">
                    By: {selectedApplication.candidateName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedApplication.status} />
              <span className="text-sm text-gray-600">
                {timeAgo(selectedApplication.appliedAt)}
              </span>
            </div>

            {selectedApplication.coverLetter && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{selectedApplication.coverLetter}</p>
                </div>
              </div>
            )}

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
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {selectedApplication.status === 'SUBMITTED' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'ACCEPTED');
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, 'REJECTED');
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Show loading if user info not loaded yet
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalApplications / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === 'ADMIN' ? 'Applications Management' : 'Your Job Applications'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'ADMIN'
                ? `Manage and review job applications (${totalApplications} total)`
                : `View and manage applications for your job postings (${totalApplications} total)`}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
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
              placeholder="Search applications by ID, cover letter, job title, or candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-6 py-4 font-medium">Application ID</th>
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Applied Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Documents</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                    No applications found
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
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          #{application.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {application.jobTitle || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {application.candidateName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">
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
                        {application.resumeUrl && (
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
                          >
                            <FileText className="h-3 w-3" />
                            Resume
                          </a>
                        )}
                        {application.portfolioUrl && (
                          <a
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Portfolio
                          </a>
                        )}
                        {!application.resumeUrl && !application.portfolioUrl && (
                          <span className="text-gray-400 text-xs">No documents</span>
                        )}
                      </div>
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
                        {application.jobSeekerId && (
                          <button
                            onClick={() => fetchCv(application.jobSeekerId)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View CV"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        {application.status === 'SUBMITTED' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Accept"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalApplications)} of {totalApplications}{' '}
                applications
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showDetailModal && <ApplicationDetailModal />}
      
      {/* CV Viewer Modal */}
      <CvViewerModal />
    </div>
  );
};

export default ApplicationsManagement;