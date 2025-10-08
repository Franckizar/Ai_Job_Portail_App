// ```typescriptreact
'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Briefcase,
  MapPin,
  Tag,
  RefreshCw,
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
  const router = useRouter();
  const [jobMatches, setJobMatches] = useState<AiJobMatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get user ID from localStorage
  const getUserIdFromStorage = () => {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id, 10) : null;
  };

  // Fetch job matches
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

      const userIdFromContext = user.userId;
      const userIdFromStorage = getUserIdFromStorage();
      const effectiveUserId = userIdFromStorage || userIdFromContext;

      if (!effectiveUserId) {
        console.log('No userId found for user');
        setError('User ID not found for job recommendations. Please re-login or contact support.');
        setLoading(false);
        return;
      }

      console.log(`Fetching job matches for userId: ${effectiveUserId}, role: ${user.role}`);

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8088/api/v1/auth/ai-job-match/user/ai/${effectiveUserId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log('Fetch API response status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fetch API error response:', errorData);
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
        toast.error(err instanceof Error ? err.message : 'Failed to load job recommendations');
        setError('Failed to load job recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, [user, authLoading]);

  // Trigger AI job matching
  const handleGenerateJobMatches = async () => {
    if (!user) {
      toast.error('Please log in to generate job recommendations.');
      router.push('/Job_portail/Login');
      return;
    }

    if (!['JOB_SEEKER', 'TECHNICIAN'].includes(user.role)) {
      toast.error('Only Job Seekers and Technicians can generate job recommendations.');
      return;
    }

    const userIdFromStorage = getUserIdFromStorage();
    const userIdFromContext = user.userId;
    const effectiveUserId = userIdFromStorage || userIdFromContext;

    if (!effectiveUserId) {
      toast.error('User ID not found. Please re-login or contact support.');
      router.push('/Job_portail/Login');
      return;
    }

    setMatchingLoading(true);
    setError(null);

    try {
      console.log('Generating matches for jobseeker/2');
      const response = await fetch(
        `http://localhost:8088/api/v1/auth/ai-job-match/match-and-save/2/jobseeker`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Match API response status:', response.status);
      const responseBody = await response.text();
      console.log('Match API response body:', responseBody);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseBody);
        } catch {
          throw new Error('Invalid response format from server');
        }
        console.error('Match generation error:', errorData);
        throw new Error(errorData.message || 'Failed to generate job matches');
      }

      const matches: AiJobMatchDto[] = JSON.parse(responseBody);
      console.log('Generated matches:', matches);
      setJobMatches(matches);
      toast.success('Job recommendations generated successfully!');
      if (matches.length === 0) {
        setError('No job recommendations found after generating.');
      }
    } catch (err) {
      console.error('Error generating job matches:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to generate job recommendations');
      setError('Failed to generate job recommendations');
    } finally {
      setMatchingLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Job Recommendations</h1>
          <p className="text-gray-600">
            AI-powered job matches based on your profile and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateJobMatches}
            disabled={matchingLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              matchingLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            aria-label="Generate new job recommendations"
          >
            <RefreshCw className={`h-4 w-4 ${matchingLoading ? 'animate-spin' : ''}`} />
            {matchingLoading ? 'Generating...' : 'Generate New Matches'}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/jobs')}
            aria-label="Browse all jobs"
          >
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
          value={jobMatches.filter((match) => match.matchScore >= 0.8).length}
          change={0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Medium Matches"
          value={jobMatches.filter((match) => match.matchScore >= 0.5 && match.matchScore < 0.8).length}
          change={0}
          icon={<Clock className="h-6 w-6" />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Low Matches"
          value={jobMatches.filter((match) => match.matchScore < 0.5).length}
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
            onClick={handleGenerateJobMatches}
            disabled={matchingLoading}
            className={`mt-4 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              matchingLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-label="Try generating recommendations again"
          >
            Try Again
          </button>
        </div>
      ) : jobMatches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations available</h3>
          <p className="text-gray-600">
            We couldn't find any job matches at this time. Please generate new matches or update your profile.
          </p>
          <button
            onClick={handleGenerateJobMatches}
            disabled={matchingLoading}
            className={`mt-4 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              matchingLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            aria-label="Generate job recommendations"
          >
            <RefreshCw className={`h-4 w-4 inline mr-2 ${matchingLoading ? 'animate-spin' : ''}`} />
            {matchingLoading ? 'Generating...' : 'Generate Matches'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
                <span className="text-sm text-gray-500">{jobMatches.length} matches found</span>
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
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  isCurrency?: boolean;
  color?: string;
  bgColor?: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  isCurrency = false,
  color = 'text-blue-600',
  bgColor = 'bg-blue-100',
}: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{isCurrency ? `${value} XAF` : value}</p>
      </div>
      <div className={`p-2 rounded-lg ${bgColor} ${color}`}>{icon}</div>
    </div>
  </div>
);

// Job Match Card Component
interface JobMatchCardProps {
  match: AiJobMatchDto;
}

const JobMatchCard = ({ match }: JobMatchCardProps) => {
  const router = useRouter();
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
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(match.matchScore)}`}>
          {getMatchLabel(match.matchScore)}
        </span>
        <span className="text-sm font-semibold text-gray-700">
          {(match.matchScore * 100).toFixed(0)}%
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {match.job.title}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="h-4 w-4 text-gray-400" />
        <p className="text-sm text-gray-600">{match.job.employerName}</p>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-gray-400" />
        <p className="text-sm text-gray-600">
          {match.job.city}
          {match.job.state && `, ${match.job.state}`}
          {match.job.country && `, ${match.job.country}`}
        </p>
      </div>
      {(match.job.salaryMin || match.job.salaryMax) && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-green-600">
            {match.job.salaryMin ? `${match.job.salaryMin.toLocaleString()} XAF` : 'N/A'} -{' '}
            {match.job.salaryMax ? `${match.job.salaryMax.toLocaleString()} XAF` : 'N/A'}
          </p>
        </div>
      )}
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
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={() => router.push(`/jobs/${match.job.id}/apply`)}
          aria-label={`Apply for ${match.job.title}`}
        >
          Apply Now
        </button>
        <button
          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => router.push(`/jobs/${match.job.id}`)}
          aria-label={`View details for ${match.job.title}`}
        >
          Details
        </button>
      </div>
    </div>
  );
};
// ```