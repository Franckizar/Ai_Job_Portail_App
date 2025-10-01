// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
// import { fetchWithAuth } from '@/fetchWithAuth';
// import { toast } from 'react-toastify';
// import {
//   Users, Building2, FileText, TrendingUp, Plus, Eye, Edit, MapPin,
//   Calendar, DollarSign, Briefcase, Star, Award, Target, BarChart3,
//   ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, AlertCircle,
//   MessageSquare, Settings, Search, Heart, Bookmark, Shield, Crown,
//   Globe, UserCheck, Zap, PieChart, Activity, Layers
// } from 'lucide-react';

// interface EnterpriseEmployerProfile {
//   id: number;
//   user: {
//     id: number;
//     email: string;
//   };
//   companyName: string;
//   companyDescription: string;
//   industryType: string;
//   companySize: string;
//   location: string;
//   website?: string;
//   logoUrl: string;
//   hrContactName: string;
//   hrContactEmail: string;
//   establishedYear?: number;
// }

// interface JobResponse {
//   id: number;
//   title: string;
//   description: string;
//   location: string;
//   salary: number;
//   status: string;
//   createdAt: string;
//   department?: string;
//   jobType: string;
// }

// interface ApplicationDTO {
//   id: number;
//   jobSeekerId: number;
//   jobId: number;
//   status: string;
//   appliedAt: string;
//   jobTitle: string;
//   jobSeekerName: string;
//   department?: string;
// }

// interface TeamMember {
//   id: number;
//   name: string;
//   role: string;
//   department: string;
//   avatar?: string;
// }

// interface EnterpriseDashboardData {
//   profile: EnterpriseEmployerProfile;
//   jobs: JobResponse[];
//   activeJobsCount: number;
//   applications: ApplicationDTO[];
//   totalApplications: number;
//   recentApplications: ApplicationDTO[];
//   teamMembers?: TeamMember[];
//   departmentStats: { [key: string]: number };
//   hiringPipeline: {
//     applied: number;
//     screening: number;
//     interview: number;
//     offer: number;
//     hired: number;
//   };
// }

// const EnterpriseEmployerDashboard = () => {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState<EnterpriseDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       if (!user?.userId) {
//         toast.error('User not authenticated');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetchWithAuth(`http://localhost:8088/api/v1/auth/enterprise-employer/dashboard/${user.userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch dashboard data');
//         }
//         const data: EnterpriseDashboardData = await response.json();
//         setDashboardData(data);
//       } catch (error) {
//         console.error('Error fetching dashboard:', error);
        
//         // Fallback to mock data for development/testing
//         console.log('Using mock data for development');
//         const mockData: EnterpriseDashboardData = {
//           profile: {
//             id: 1,
//             user: { id: user.userId, email: user.email || 'hr@company.com' },
//             companyName: "TechCorp Enterprise",
//             companyDescription: "Leading technology solutions provider with innovative products and services.",
//             industryType: "Technology",
//             companySize: "1000-5000",
//             location: "San Francisco, CA",
//             website: "https://techcorp.com",
//             logoUrl: "",
//             hrContactName: "Sarah Johnson",
//             hrContactEmail: "sarah.johnson@techcorp.com",
//             establishedYear: 2010
//           },
//           jobs: [
//             {
//               id: 1,
//               title: "Senior Software Engineer",
//               description: "Looking for experienced software engineer",
//               location: "San Francisco, CA",
//               salary: 120000,
//               status: "ACTIVE",
//               createdAt: new Date().toISOString(),
//               department: "Engineering",
//               jobType: "Full-time"
//             },
//             {
//               id: 2,
//               title: "Product Manager",
//               description: "Lead our product development team",
//               location: "Remote",
//               salary: 130000,
//               status: "ACTIVE",
//               createdAt: new Date().toISOString(),
//               department: "Product",
//               jobType: "Full-time"
//             },
//             {
//               id: 3,
//               title: "UX Designer",
//               description: "Create amazing user experiences",
//               location: "New York, NY",
//               salary: 95000,
//               status: "ACTIVE",
//               createdAt: new Date().toISOString(),
//               department: "Design",
//               jobType: "Full-time"
//             }
//           ],
//           activeJobsCount: 8,
//           applications: [],
//           totalApplications: 156,
//           recentApplications: [
//             {
//               id: 1,
//               jobSeekerId: 1,
//               jobId: 1,
//               status: "PENDING",
//               appliedAt: new Date().toISOString(),
//               jobTitle: "Senior Software Engineer",
//               jobSeekerName: "John Doe",
//               department: "Engineering"
//             },
//             {
//               id: 2,
//               jobSeekerId: 2,
//               jobId: 2,
//               status: "INTERVIEW",
//               appliedAt: new Date().toISOString(),
//               jobTitle: "Product Manager",
//               jobSeekerName: "Jane Smith",
//               department: "Product"
//             }
//           ],
//           departmentStats: {
//             "Engineering": 4,
//             "Product": 2,
//             "Design": 1,
//             "Marketing": 1
//           },
//           hiringPipeline: {
//             applied: 45,
//             screening: 28,
//             interview: 15,
//             offer: 8,
//             hired: 5
//           }
//         };
        
//         setDashboardData(mockData);
//         toast.info('Using demo data - Please ensure backend is running');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [user?.userId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading your enterprise dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <XCircle className="w-10 h-10 text-red-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
//             <p className="text-gray-600 mb-6">Failed to load enterprise dashboard data. Please try again.</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <div className="max-w-7xl mx-auto p-8">

//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
//                 <Building2 className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   {dashboardData.profile.companyName}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-2">
//                   <Crown className="w-5 h-5 text-yellow-500" />
//                   <p className="text-gray-600">Enterprise Account • {dashboardData.profile.industryType}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 font-semibold transition-colors flex items-center gap-2">
//                 <Plus className="w-5 h-5" />
//                 Post Job Opening
//               </button>
//               <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-colors flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 Talent Pipeline
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <EnterpriseStatCard
//             title="Active Job Postings"
//             value={dashboardData.activeJobsCount}
//             change={24}
//             icon={<Briefcase className="w-8 h-8" />}
//             gradient="from-blue-500 to-blue-600"
//             bgColor="bg-blue-50"
//           />
//           <EnterpriseStatCard
//             title="Total Applications"
//             value={dashboardData.totalApplications}
//             change={45}
//             icon={<FileText className="w-8 h-8" />}
//             gradient="from-indigo-500 to-indigo-600"
//             bgColor="bg-indigo-50"
//           />
//           <EnterpriseStatCard
//             title="Company Profile Views"
//             value="1.2K"
//             change={28}
//             icon={<Eye className="w-8 h-8" />}
//             gradient="from-purple-500 to-purple-600"
//             bgColor="bg-purple-50"
//           />
//           <EnterpriseStatCard
//             title="Hiring Success Rate"
//             value="85%"
//             change={18}
//             icon={<Award className="w-8 h-8" />}
//             gradient="from-emerald-500 to-emerald-600"
//             bgColor="bg-emerald-50"
//           />
//         </div>

//         {/* Hiring Pipeline Overview */}
//         <div className="mb-8">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                 <Activity className="w-7 h-7 text-blue-600" />
//                 Hiring Pipeline
//               </h2>
//               <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
//                 View Detailed Analytics
//                 <ArrowUpRight className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-5 gap-4">
//               {Object.entries(dashboardData.hiringPipeline || {
//                 applied: 45,
//                 screening: 28,
//                 interview: 15,
//                 offer: 8,
//                 hired: 5
//               }).map(([stage, count], index) => (
//                 <div key={stage} className="text-center">
//                   <div className={`w-full h-2 rounded-full mb-3 ${
//                     index === 0 ? 'bg-blue-200' :
//                     index === 1 ? 'bg-indigo-200' :
//                     index === 2 ? 'bg-purple-200' :
//                     index === 3 ? 'bg-emerald-200' :
//                     'bg-green-200'
//                   }`}>
//                     <div className={`h-full rounded-full transition-all duration-500 ${
//                       index === 0 ? 'bg-blue-600' :
//                       index === 1 ? 'bg-indigo-600' :
//                       index === 2 ? 'bg-purple-600' :
//                       index === 3 ? 'bg-emerald-600' :
//                       'bg-green-600'
//                     }`} style={{ width: `${(count / 45) * 100}%` }}></div>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">{count}</div>
//                   <div className="text-sm font-medium text-gray-600 capitalize">{stage}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Company Profile Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                     <Building2 className="w-8 h-8 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white">{dashboardData.profile.companyName}</h3>
//                     <div className="flex items-center gap-2">
//                       <Shield className="w-4 h-4 text-blue-200" />
//                       <p className="text-blue-100">Enterprise Verified</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Company Description</label>
//                   <p className="text-gray-900 mt-1 text-sm leading-relaxed">{dashboardData.profile.companyDescription}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Industry</label>
//                     <p className="text-gray-900 mt-1 text-sm">{dashboardData.profile.industryType}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Company Size</label>
//                     <p className="text-gray-900 mt-1 text-sm">{dashboardData.profile.companySize}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Headquarters</label>
//                   <p className="text-gray-900 mt-1 flex items-center gap-2 text-sm">
//                     <MapPin className="w-4 h-4 text-gray-400" />
//                     {dashboardData.profile.location}
//                   </p>
//                 </div>

//                 {dashboardData.profile.website && (
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Website</label>
//                     <p className="text-gray-900 mt-1 flex items-center gap-2 text-sm">
//                       <Globe className="w-4 h-4 text-gray-400" />
//                       {dashboardData.profile.website}
//                     </p>
//                   </div>
//                 )}

//                 <div className="pt-4 border-t border-gray-200 space-y-3">
//                   <button className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-semibold transition-colors flex items-center justify-center gap-2">
//                     <Edit className="w-5 h-5" />
//                     Edit Company Profile
//                   </button>
//                   <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2">
//                     <BarChart3 className="w-5 h-5" />
//                     Advanced Analytics
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">

//             {/* Active Jobs with Department Breakdown */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                   <Layers className="w-7 h-7 text-blue-600" />
//                   Job Openings by Department
//                 </h2>
//                 <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
//                   Manage All Openings
//                   <ArrowUpRight className="w-5 h-5" />
//                 </button>
//               </div>

//               {dashboardData.jobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No job openings posted</h3>
//                   <p className="text-gray-600 mb-6">Start building your talent pipeline by posting job openings</p>
//                   <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors">
//                     Post First Job Opening
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {dashboardData.jobs.slice(0, 4).map((job) => (
//                     <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
//                             {job.department && (
//                               <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
//                                 {job.department}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-gray-600 mb-2 flex items-center gap-2">
//                             <MapPin className="w-4 h-4" />
//                             {job.location}
//                           </p>
//                           <div className="flex items-center gap-4 text-sm text-gray-500">
//                             <span className="flex items-center gap-1">
//                               <DollarSign className="w-4 h-4" />
//                               ${job.salary.toLocaleString()}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Calendar className="w-4 h-4" />
//                               {new Date(job.createdAt).toLocaleDateString()}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Briefcase className="w-4 h-4" />
//                               {job.jobType}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {job.status}
//                           </span>
//                           <button className="text-gray-400 hover:text-gray-600">
//                             <Eye className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Recent Applications */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                   <UserCheck className="w-7 h-7 text-blue-600" />
//                   Recent Applications
//                 </h2>
//                 <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
//                   Application Management
//                   <ArrowUpRight className="w-5 h-5" />
//                 </button>
//               </div>

//               {dashboardData.recentApplications.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent applications</h3>
//                   <p className="text-gray-600">Applications will appear here once candidates apply to your job openings</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {dashboardData.recentApplications.map((app) => (
//                     <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-1">
//                             <h3 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h3>
//                             {app.department && (
//                               <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
//                                 {app.department}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-gray-600 mb-2">Candidate: {app.jobSeekerName}</p>
//                           <div className="flex items-center gap-4 text-sm text-gray-500">
//                             <span className="flex items-center gap-1">
//                               <Clock className="w-4 h-4" />
//                               Applied {new Date(app.appliedAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
//                             app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
//                             app.status === 'INTERVIEW' ? 'bg-blue-100 text-blue-800' :
//                             'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {app.status}
//                           </span>
//                           <button className="text-gray-400 hover:text-gray-600">
//                             <MessageSquare className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Enterprise Quick Actions */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                 <Zap className="w-7 h-7 text-blue-600" />
//                 Enterprise Tools
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
//                   <div className="p-3 bg-blue-600 rounded-xl mb-3 group-hover:bg-blue-700 transition-colors">
//                     <Search className="w-6 h-6 text-white" />
//                   </div>
//                   <span className="font-semibold text-gray-900">Advanced Search</span>
//                   <span className="text-sm text-gray-600 mt-1">AI-powered talent matching</span>
//                 </button>

//                 <button className="flex flex-col items-center justify-center p-6 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group">
//                   <div className="p-3 bg-indigo-600 rounded-xl mb-3 group-hover:bg-indigo-700 transition-colors">
//                     <PieChart className="w-6 h-6 text-white" />
//                   </div>
//                   <span className="font-semibold text-gray-900">HR Analytics</span>
//                   <span className="text-sm text-gray-600 mt-1">Comprehensive reporting</span>
//                 </button>

//                 <button className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
//                   <div className="p-3 bg-purple-600 rounded-xl mb-3 group-hover:bg-purple-700 transition-colors">
//                     <Users className="w-6 h-6 text-white" />
//                   </div>
//                   <span className="font-semibold text-gray-900">Team Management</span>
//                   <span className="text-sm text-gray-600 mt-1">Collaborative hiring</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced Enterprise Stat Card Component
// const EnterpriseStatCard = ({ title, value, change, icon, gradient, bgColor }) => (
//   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//     <div className="flex justify-between items-start">
//       <div className="flex-1">
//         <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
//         <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
//         <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//           {change >= 0 ? (
//             <ArrowUpRight className="w-4 h-4" />
//           ) : (
//             <ArrowDownRight className="w-4 h-4" />
//           )}
//           <span className="font-medium">{Math.abs(change)}%</span>
//           <span className="text-gray-500">vs last month</span>
//         </div>
//       </div>
//       <div className={`p-3 rounded-2xl ${bgColor}`}>
//         <div className={`p-2 rounded-xl bg-gradient-to-r ${gradient} text-white`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default EnterpriseEmployerDashboard;