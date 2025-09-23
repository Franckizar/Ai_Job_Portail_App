"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { fetchWithAuth } from '@/fetchWithAuth';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  ChevronRight,
  Briefcase,
  MapPin,
  Tag
} from 'lucide-react';

interface JobResponse {
  id: number;
  title: string;
  employerName: string;
  city: string;
  state: string;
  country: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  status: string;
}

interface AiJobMatchDto {
  matchId: number;
  userId: number;
  job: JobResponse;
  matchScore: number;
  keywordsMatched: string;
  generatedAt: string;
}

export default function JobRecommendations() {
  const { user, isLoading: authLoading } = useAuth();
  const [jobMatches, setJobMatches] = useState<AiJobMatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobMatches = async () => {
      if (authLoading) {
        console.log('Waiting for auth to complete...');
        return;
      }

      if (!user) {
        console.log('No user found in AuthContext');
        setError('Please log in to view job recommendations.');
        setLoading(false);
        return;
      }

      if (!['JOB_SEEKER', 'TECHNICIAN'].includes(user.role)) {
        console.log(`User role ${user.role} not allowed for job recommendations`);
        setError('Job recommendations are only available for Job Seekers and Technicians.');
        setLoading(false);
        return;
      }

      const userId = user.role === 'JOB_SEEKER' ? user.jobSeekerId : user.technicianId;
      if (!userId) {
        console.log(`No ${user.role === 'JOB_SEEKER' ? 'jobSeekerId' : 'technicianId'} found for user`);
        setError('User ID not found for job recommendations.');
        setLoading(false);
        return;
      }

      const test = 12;
      console.log(`Fetching job matches for userId: ${userId}, role: ${user.role}`);

      setLoading(true);
      try {
        const response = await fetchWithAuth(
          `http://localhost:8088/api/v1/auth/ai-job-match/user/ai/${test}`
        );
        console.log('API response status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch job matches');
        }
        const matches: AiJobMatchDto[] = await response.json();
        console.log('Fetched job matches:', matches);
        setJobMatches(matches);
        if (matches.length === 0) {
          console.log('No job matches returned from API');
          setError('No job recommendations available at this time.');
        }
      } catch (err) {
        console.error('Error fetching job matches:', err);
        toast.error('Failed to load job recommendations');
        setError('Failed to load job recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Job Recommendations</h1>
          <p className="text-gray-600">
            AI-powered job matches based on your profile and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Search className="h-4 w-4" />
            Browse All Jobs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Matches"
          value={jobMatches.length}
          change={0}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="High Matches"
          value={jobMatches.filter(match => match.matchScore >= 0.8).length}
          change={0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Medium Matches"
          value={jobMatches.filter(match => match.matchScore >= 0.5 && match.matchScore < 0.8).length}
          change={0}
          icon={<Clock className="h-6 w-6" />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Low Matches"
          value={jobMatches.filter(match => match.matchScore < 0.5).length}
          change={0}
          icon={<AlertCircle className="h-6 w-6" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Main Content */}
      {error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load recommendations</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : jobMatches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations available</h3>
          <p className="text-gray-600">
            We couldn't find any job matches at this time. Please check back later or update your profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Recommendations Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
                <span className="text-sm text-gray-500">
                  {jobMatches.length} matches found
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobMatches.map((match) => (
                  <JobMatchCard key={match.matchId} match={match} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

// Job Match Card Component
const JobMatchCard = ({ match }: { match: AiJobMatchDto }) => {
  const getMatchColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.5) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 group">
      {/* Header with Match Score */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(match.matchScore)}`}>
          {getMatchLabel(match.matchScore)}
        </span>
        <span className="text-sm font-semibold text-gray-700">
          {(match.matchScore * 100).toFixed(0)}%
        </span>
      </div>

      {/* Job Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {match.job.title}
      </h3>

      {/* Company Name */}
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="h-4 w-4 text-gray-400" />
        <p className="text-sm text-gray-600">{match.job.employerName}</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-gray-400" />
        <p className="text-sm text-gray-600">{match.job.city}</p>
      </div>

      {/* Salary */}
      {(match.job.salaryMin || match.job.salaryMax) && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-green-600">
            ${match.job.salaryMin?.toLocaleString() || 'N/A'} - ${match.job.salaryMax?.toLocaleString() || 'N/A'}
          </p>
        </div>
      )}

      {/* Keywords Matched */}
      {match.keywordsMatched && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Matched Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {match.keywordsMatched.split(',').slice(0, 3).map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
              >
                {keyword.trim()}
              </span>
            ))}
            {match.keywordsMatched.split(',').length > 3 && (
              <span className="text-xs text-gray-500">
                +{match.keywordsMatched.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={() => alert(`Apply for ${match.job.title} at ${match.job.employerName}`)}
        >
          Apply Now
        </button>
        <button
          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => alert(`View details for ${match.job.title}`)}
        >
          Details
        </button>
      </div>
    </div>
  );
};