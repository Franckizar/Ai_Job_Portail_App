// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Briefcase, Users, Calendar, 
//   Search, Download, Eye, Edit, Trash2,
//   Clock, RefreshCw, AlertTriangle, BarChart3,
//   ChevronLeft, ChevronRight, MoreVertical, MapPin,
//   Plus, CheckCircle, XCircle, DollarSign, Building, Zap
// } from 'lucide-react';
// // Import JobModal if you have it, otherwise we'll create a simple version
// // import { JobModal } from '@/components/Job_portail/Home/components/JobModal';

// const JobManagement = () => {
//   const [userRole, setUserRole] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     activeJobs: 0,
//     draftJobs: 0,
//     closedJobs: 0,
//     totalApplications: 0,
//     avgSalary: 0
//   });
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedType, setSelectedType] = useState('ALL');
//   const [selectedStatus, setSelectedStatus] = useState('ALL');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
  
//   const itemsPerPage = 10;

//   // Mock data generators (ONLY for fallback when API fails)
//   const getMockStats = (role) => ({
//     totalJobs: role === 'ENTERPRISE' ? 8 : 3,
//     activeJobs: role === 'ENTERPRISE' ? 5 : 2,
//     draftJobs: role === 'ENTERPRISE' ? 2 : 1,
//     closedJobs: role === 'ENTERPRISE' ? 1 : 0,
//     totalApplications: role === 'ENTERPRISE' ? 156 : 45,
//     avgSalary: role === 'ENTERPRISE' ? 105000 : 35000
//   });

//   const getMockJobs = (role) => [
//     { 
//       id: 1, 
//       title: role === 'ENTERPRISE' ? 'Senior Frontend Developer' : 'Home Renovation Specialist',
//       description: role === 'ENTERPRISE' ? 'Build responsive UIs with modern frameworks' : 'Handle home improvement projects',
//       type: role === 'ENTERPRISE' ? 'FULL_TIME' : 'CONTRACT',
//       salaryMin: role === 'ENTERPRISE' ? 90000 : 25,
//       salaryMax: role === 'ENTERPRISE' ? 120000 : 35,
//       city: role === 'ENTERPRISE' ? 'New York' : 'Austin',
//       state: role === 'ENTERPRISE' ? 'NY' : 'TX',
//       postalCode: '10001',
//       country: 'USA',
//       addressLine1: '123 Main St',
//       addressLine2: '',
//       employerName: role === 'ENTERPRISE' ? 'Tech Corp' : 'Local Services',
//       status: 'ACTIVE',
//       createdAt: '2025-09-15T09:00:00Z',
//       applicationCount: role === 'ENTERPRISE' ? 42 : 8,
//       skills: [{ skillId: 1, skillName: 'React', required: true }, { skillId: 2, skillName: 'JavaScript', required: true }],
//       category: { id: 1, name: 'Engineering', description: 'Tech roles' },
//       department: role === 'ENTERPRISE' ? 'Engineering' : 'Home Services'
//     },
//     { 
//       id: 2, 
//       title: role === 'ENTERPRISE' ? 'Product Manager' : 'Electrical Technician',
//       description: role === 'ENTERPRISE' ? 'Lead product strategy and development' : 'Install and maintain electrical systems',
//       type: role === 'ENTERPRISE' ? 'FULL_TIME' : 'PART_TIME',
//       salaryMin: role === 'ENTERPRISE' ? 110000 : 30,
//       salaryMax: role === 'ENTERPRISE' ? 140000 : 45,
//       city: role === 'ENTERPRISE' ? 'San Francisco' : 'Dallas',
//       state: role === 'ENTERPRISE' ? 'CA' : 'TX',
//       postalCode: '94105',
//       country: 'USA',
//       addressLine1: '456 Oak Ave',
//       addressLine2: '',
//       employerName: role === 'ENTERPRISE' ? 'Tech Corp' : 'Local Services',
//       status: 'DRAFT',
//       createdAt: '2025-09-10T14:00:00Z',
//       applicationCount: role === 'ENTERPRISE' ? 28 : 5,
//       skills: [{ skillId: 3, skillName: 'Agile', required: false }, { skillId: 4, skillName: 'UX Design', required: true }],
//       category: { id: 2, name: 'Product', description: 'Management roles' },
//       department: role === 'ENTERPRISE' ? 'Product' : 'Electrical Services'
//     },
//     { 
//       id: 3, 
//       title: role === 'ENTERPRISE' ? 'DevOps Engineer' : 'Plumbing Specialist',
//       description: role === 'ENTERPRISE' ? 'Manage cloud infrastructure and CI/CD' : 'Repair and install plumbing systems',
//       type: role === 'ENTERPRISE' ? 'CONTRACT' : 'TEMPORARY',
//       salaryMin: role === 'ENTERPRISE' ? 95000 : 28,
//       salaryMax: role === 'ENTERPRISE' ? 125000 : 40,
//       city: role === 'ENTERPRISE' ? 'Remote' : 'Houston',
//       state: role === 'ENTERPRISE' ? 'Remote' : 'TX',
//       postalCode: '00000',
//       country: 'USA',
//       addressLine1: '',
//       addressLine2: '',
//       employerName: role === 'ENTERPRISE' ? 'Tech Corp' : 'Local Services',
//       status: 'ACTIVE',
//       createdAt: '2025-09-05T10:30:00Z',
//       applicationCount: role === 'ENTERPRISE' ? 15 : 3,
//       skills: [{ skillId: 5, skillName: 'AWS', required: true }, { skillId: 6, skillName: 'Docker', required: true }],
//       category: { id: 3, name: 'Operations', description: 'Infrastructure roles' },
//       department: role === 'ENTERPRISE' ? 'Operations' : 'Plumbing Services'
//     }
//   ];

//   // Get user role and ID (EXACTLY like dashboard)
//   useEffect(() => {
//     const getUserInfo = async () => {
//       try {
//         // Replace with your actual user info endpoint
//         const userResponse = await fetch('/api/v1/auth/me', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (userResponse.ok) {
//           const userData = await userResponse.json();
//           setUserRole(userData.role);
//           if (userData.role === 'ENTERPRISE') {
//             setUserId(userData.enterpriseId || userData.id);
//           } else if (userData.role === 'PERSONAL_EMPLOYER') {
//             setUserId(userData.personalEmployerId || userData.id);
//           }
//         } else {
//           // Fallback for testing - remove in production
//           console.error('Failed to fetch user info, using fallback');
//           setUserRole('ENTERPRISE');
//           setUserId(1);
//         }
//       } catch (error) {
//         console.error('Failed to get user info:', error);
//         // Fallback for testing
//         setUserRole('ENTERPRISE');
//         setUserId(1);
//       }
//     };
//     getUserInfo();
//   }, []);

//   // Fetch stats from API (with fallback like dashboard)
//   const fetchStats = async () => {
//     try {
//       if (!userRole || !userId) return;
      
//       let endpoint = '';
//       if (userRole === 'ENTERPRISE') {
//         endpoint = `/api/v1/auth/jobs/enterprise/${userId}/stats`;
//       } else if (userRole === 'PERSONAL_EMPLOYER') {
//         endpoint = `/api/v1/auth/jobs/employer/${userId}/stats`;
//       } else {
//         return;
//       }

//       const response = await fetch(endpoint, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const statsData = await response.json();
//         setStats(statsData);
//       } else {
//         console.error('Failed to fetch stats, using mock data');
//         setStats(getMockStats(userRole));
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       setStats(getMockStats(userRole)); // Fallback on error
//     }
//   };

//   // Fetch jobs from API (EXACTLY like dashboard)
//   const fetchJobs = async () => {
//     if (!userRole || !userId) return;
    
//     setLoading(true);
    
//     try {
//       // Determine base endpoint based on role
//       let endpoint = '';
      
//       if (userRole === 'ENTERPRISE') {
//         endpoint = `/api/v1/auth/jobs/enterprise/${userId}/active-jobs`;
//       } else if (userRole === 'PERSONAL_EMPLOYER') {
//         endpoint = `/api/v1/auth/jobs/employer/${userId}/active-jobs`;
//       } else {
//         console.error('Invalid user role or missing user ID');
//         return;
//       }

//       const response = await fetch(endpoint, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const jobsData = await response.json();
//         setJobs(jobsData);
//       } else {
//         console.error('Failed to fetch jobs, using mock data');
//         setJobs(getMockJobs(userRole));
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       setJobs(getMockJobs(userRole)); // Fallback on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data when user info is available
//   useEffect(() => {
//     if (userRole && userId) {
//       fetchStats();
//       fetchJobs();
//     }
//   }, [userRole, userId]);

//   // Handle refresh
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchStats(), fetchJobs()]);
//     setRefreshing(false);
//   };

//   // Delete job
//   const handleDeleteJob = async (jobId) => {
//     if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
//       return;
//     }
    
//     setDeletingId(jobId);
    
//     try {
//       const response = await fetch(`/api/v1/auth/jobs/${jobId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         setJobs(jobs.filter(job => job.id !== jobId));
//         fetchStats(); // Refresh stats after deletion
//       } else {
//         console.error('Failed to delete job');
//         alert('Failed to delete job. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error deleting job:', error);
//       alert('Error deleting job. Please try again.');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update job status
//   const handleStatusChange = async (jobId, newStatus) => {
//     try {
//       const response = await fetch(`/api/v1/auth/jobs/${jobId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
      
//       if (response.ok) {
//         setJobs(jobs.map(job => 
//           job.id === jobId ? { ...job, status: newStatus } : job
//         ));
//         fetchStats(); // Refresh stats after status update
//       } else {
//         console.error('Failed to update job status');
//         alert('Failed to update job status. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error updating job status:', error);
//       alert('Error updating job status. Please try again.');
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get job type color
//   const getJobTypeColor = (type) => {
//     const colors = {
//       FULL_TIME: { bg: 'bg-green-100', text: 'text-green-800' },
//       PART_TIME: { bg: 'bg-blue-100', text: 'text-blue-800' },
//       CONTRACT: { bg: 'bg-purple-100', text: 'text-purple-800' },
//       TEMPORARY: { bg: 'bg-orange-100', text: 'text-orange-800' }
//     };
//     return colors[type] || colors.FULL_TIME;
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const colors = {
//       ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
//       DRAFT: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
//       CLOSED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
//     };
//     return colors[status] || colors.ACTIVE;
//   };

//   // Filter jobs
//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = 
//       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.employerName.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesType = selectedType === 'ALL' || job.type === selectedType;
//     const matchesStatus = selectedStatus === 'ALL' || job.status === selectedStatus;
    
//     return matchesSearch && matchesType && matchesStatus;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
//   const paginatedJobs = filteredJobs.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Components
//   const StatusBadge = ({ status }) => {
//     const config = getStatusColor(status);
//     const IconComponent = config.icon;

//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//         <IconComponent className="h-3 w-3" />
//         {status}
//       </span>
//     );
//   };

//   const JobTypeBadge = ({ type }) => {
//     const config = getJobTypeColor(type);
//     return (
//       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//         {type.replace('_', ' ')}
//       </span>
//     );
//   };

//   // Job Detail Modal
//   const JobDetailModal = () => {
//     if (!selectedJob) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
//                 <p className="text-gray-600 mt-1">{selectedJob.employerName}</p>
//                 <div className="flex gap-2 mt-2">
//                   <JobTypeBadge type={selectedJob.type} />
//                   <StatusBadge status={selectedJob.status} />
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowDetailModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <XCircle className="h-6 w-6" />
//               </button>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Salary Information</h3>
//                   <p className="text-lg font-semibold text-green-600">
//                     {formatCurrency(selectedJob.salaryMin)} - {formatCurrency(selectedJob.salaryMax)}
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
//                   <div className="flex items-center gap-2 text-gray-900">
//                     <MapPin className="h-4 w-4 text-gray-400" />
//                     <div>
//                       <p>{selectedJob.city}, {selectedJob.state}</p>
//                       {selectedJob.addressLine1 && (
//                         <p className="text-sm text-gray-600">{selectedJob.addressLine1}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
//                   <p className="text-gray-900">{selectedJob.department}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Posted Date</h3>
//                   <p className="text-gray-900">{formatDate(selectedJob.createdAt)}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Applications</h3>
//                   <p className="text-gray-900">{selectedJob.applicationCount || 0}</p>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {selectedJob.skills && selectedJob.skills.length > 0 ? (
//                   selectedJob.skills.map((skill, index) => (
//                     <span 
//                       key={index}
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         skill.required 
//                           ? 'bg-red-100 text-red-800 border border-red-200' 
//                           : 'bg-blue-100 text-blue-800 border border-blue-200'
//                       }`}
//                     >
//                       {skill.skillName} {skill.required && '• Required'}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-gray-500 text-sm">No skills specified</span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-medium text-gray-500 mb-2">Job Description</h3>
//               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
//                   {selectedJob.description}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading state
//   if (!userRole || !userId) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading user information...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               {userRole === 'ENTERPRISE' ? 'Enterprise Job Management' : 'My Job Postings'}
//             </h1>
//             <p className="text-gray-600 mt-2">
//               {userRole === 'ENTERPRISE' 
//                 ? 'Manage your enterprise job postings and track performance' 
//                 : 'Create and manage your job postings'}
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button 
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <button 
//               onClick={() => window.location.href = '/Job/sjobss'}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               <Plus className="h-4 w-4" />
//               Create Job
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Jobs</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <Briefcase className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Jobs</p>
//               <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeJobs}</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Draft Jobs</p>
//               <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.draftJobs}</p>
//             </div>
//             <div className="bg-yellow-100 p-3 rounded-lg">
//               <Clock className="h-6 w-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Closed Jobs</p>
//               <p className="text-2xl font-bold text-red-600 mt-1">{stats.closedJobs}</p>
//             </div>
//             <div className="bg-red-100 p-3 rounded-lg">
//               <XCircle className="h-6 w-6 text-red-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Applications</p>
//               <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalApplications}</p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <Users className="h-6 w-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search jobs by title, description, location, or employer..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
          
//           <div className="flex gap-3 flex-wrap">
//             <select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
//             >
//               <option value="ALL">All Types</option>
//               <option value="FULL_TIME">Full Time</option>
//               <option value="PART_TIME">Part Time</option>
//               <option value="CONTRACT">Contract</option>
//               <option value="TEMPORARY">Temporary</option>
//             </select>

//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
//             >
//               <option value="ALL">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="DRAFT">Draft</option>
//               <option value="CLOSED">Closed</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Jobs Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr className="text-left text-gray-600 text-sm font-medium">
//                 <th className="px-6 py-4">Job Title</th>
//                 <th className="px-6 py-4">Type</th>
//                 <th className="px-6 py-4">Salary Range</th>
//                 <th className="px-6 py-4">Applications</th>
//                 <th className="px-6 py-4">Location</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Posted Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                       <p>Loading jobs...</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginatedJobs.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center gap-2">
//                       <Briefcase className="h-12 w-12 text-gray-300" />
//                       <p className="text-lg font-medium text-gray-900">No jobs found</p>
//                       <p className="text-gray-600">
//                         {searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL' 
//                           ? 'Try adjusting your search filters' 
//                           : 'Get started by creating your first job posting'}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedJobs.map((job) => (
//                   <tr 
//                     key={job.id} 
//                     className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-semibold text-gray-900">{job.title}</p>
//                         <p className="text-sm text-gray-500 mt-1">{job.employerName}</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <JobTypeBadge type={job.type} />
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm">
//                         <p className="font-medium text-gray-900">
//                           {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                         {job.applicationCount || 0}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <MapPin className="h-4 w-4" />
//                         {job.city}, {job.state}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <StatusBadge status={job.status} />
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {formatDate(job.createdAt)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => {
//                             setSelectedJob(job);
//                             setShowDetailModal(true);
//                           }}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
                        
//                         <button
//                           onClick={() => window.location.href = '/Job/sjobss'}
//                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Edit Job"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
                        
//                         <select
//                           value={job.status}
//                           onChange={(e) => handleStatusChange(job.id, e.target.value)}
//                           className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           title="Change Status"
//                         >
//                           <option value="ACTIVE">Active</option>
//                           <option value="DRAFT">Draft</option>
//                           <option value="CLOSED">Closed</option>
//                         </select>
                        
//                         <button
//                           onClick={() => handleDeleteJob(job.id)}
//                           disabled={deletingId === job.id}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                           title="Delete Job"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </button>
                
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
//                     const pageNumber = Math.max(1, Math.min(totalPages, currentPage - 3 + i));
//                     const isActive = pageNumber === currentPage;
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => setCurrentPage(pageNumber)}
//                         className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                           isActive 
//                             ? 'w-8 bg-blue-600' 
//                             : 'w-2 bg-gray-300 hover:bg-gray-400'
//                         }`}
//                       />
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </button>
                
//                 <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Job Detail Modal */}
//       {showDetailModal && <JobDetailModal />}
//     </div>
//   );
// };

// export default JobManagement;