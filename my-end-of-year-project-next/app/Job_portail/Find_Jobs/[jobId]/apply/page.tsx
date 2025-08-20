// ```tsx
'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/fetchWithAuth';

interface Application {
  id: number;
  resumeUrl: string;
  portfolioUrl: string;
  status: string;
  appliedAt: string;
  coverLetter: string;
  jobId: number;
}

export default function ApplyPage({ params: paramsPromise }: { params: Promise<{ jobid: string }> }) {
  const params = use(paramsPromise);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<{ id: number; title: string } | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ resume?: string }>({});
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch job details from backend
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:8088/api/v1/auth/jobs/${params.jobid}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error('Job not found');
          throw new Error(`Failed to fetch job: ${response.status}`);
        }
        const data = await response.json();
        if (!data?.id || !data?.title) throw new Error('Invalid job data');
        setJob({ id: Number(params.jobid), title: data.title });
      } catch (err) {
        console.error('Error fetching job:', err);
        toast.error('Failed to load job details');
        notFound();
      }
    };
    fetchJob();
  }, [params.jobid]);

  // Check if user has already applied
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!isAuthenticated || !user || !['JOB_SEEKER', 'TECHNICIAN'].includes(user.role)) return;

      try {
        const userId = user.jobSeekerId || user.technicianId;
        if (!userId) {
          throw new Error('User ID is missing');
        }
        const endpoint =
          user.role === 'JOB_SEEKER'
            ? `http://localhost:8088/api/v1/auth/applications/by-jobseeker/${user.jobSeekerId}`
            : `http://localhost:8088/api/v1/auth/applications/by-technician/${user.technicianId}`;
        
        const response = await fetchWithAuth(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.error('Application check failed:', response.status, await response.text());
          throw new Error('Failed to check existing applications');
        }

        const applications: Application[] = await response.json();
        console.log('Fetched applications:', applications);
        const jobId = Number(params.jobid);
        const alreadyApplied = applications.some((app) => app.jobId === jobId);
        setHasApplied(alreadyApplied);
        if (alreadyApplied) {
          toast.info('You have already applied for this job');
        }
      } catch (err) {
        console.error('Error checking applications:', err);
        toast.error('Failed to verify existing applications');
      }
    };
    checkExistingApplication();
  }, [isAuthenticated, user, params.jobid]);

  // Validate resume
  const validateForm = () => {
    const newErrors: { resume?: string } = {};
    if (!resume) {
      newErrors.resume = 'Resume is required';
    } else if (!resume.type.includes('pdf')) {
      newErrors.resume = 'Only PDF files are allowed';
    } else if (resume.size === 0) {
      newErrors.resume = 'Resume file is empty';
    } else if (resume.size > 5 * 1024 * 1024) {
      newErrors.resume = 'Resume file size exceeds 5MB';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (application + CV upload)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('Please log in to apply');
      router.push('/Job_portail/Login');
      return;
    }

    if (!['JOB_SEEKER', 'TECHNICIAN'].includes(user.role)) {
      toast.error('Only job seekers or technicians can apply');
      return;
    }

    if (hasApplied) {
      toast.error('You have already applied for this job');
      return;
    }

    if (!user.jobSeekerId && !user.technicianId) {
      toast.error('User ID is missing. Please re-login or contact support.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Step 1: Submit application
      const applicationPayload = {
        jobId: Number(params.jobid),
        ...(user.jobSeekerId ? { jobSeekerId: user.jobSeekerId } : { technicianId: user.technicianId }),
      };
      console.log('Submitting application with payload:', applicationPayload);

      const applicationResponse = await fetchWithAuth('http://localhost:8088/api/v1/auth/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationPayload),
      });

      if (!applicationResponse.ok) {
        const data = await applicationResponse.json();
        throw new Error(data.message || 'Failed to submit application');
      }

      // Step 2: Upload CV
      const formData = new FormData();
      if (resume) {
        formData.append('file', resume);
      }
      const userId = user.jobSeekerId || user.technicianId || '';
      const userType = user.role === 'JOB_SEEKER' ? 'jobseeker' : 'technician';
      formData.append('userId', userId.toString());
      formData.append('userType', userType);
      console.log('Submitting CV upload with userId:', userId, 'userType:', userType);

      const cvResponse = await fetchWithAuth('http://localhost:8088/api/v1/auth/cv/upload', {
        method: 'POST',
        body: formData,
      });

      if (!cvResponse.ok) {
        const data = await cvResponse.json();
        throw new Error(data.message || 'Failed to upload CV');
      }

      const cvResult = await cvResponse.text();
      toast.success(cvResult);
      toast.success('Application submitted successfully!');
      router.push(user.role === 'JOB_SEEKER' ? '/Job/Job_Seeker' : '/Job/TECHNICIAN');
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/Job_portail/Login');
    return null;
  }

  if (!['JOB_SEEKER', 'TECHNICIAN'].includes(user?.role || '')) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-100 rounded-lg">
        <h1 className="text-2xl font-bold text-red-700">Unauthorized</h1>
        <p className="text-red-600">Only job seekers or technicians can apply for jobs.</p>
      </div>
    );
  }

  if (!job) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading job details...</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100">
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to job listing
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply for {job.title}</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {hasApplied ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Application Already Submitted</h2>
              <p className="text-gray-600">You have already applied for this job. You cannot submit another application.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume (PDF) <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-md p-4 ${errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                    <input
                      id="resume"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                    <label htmlFor="resume" className="flex flex-col items-center justify-center cursor-pointer">
                      <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        {resume ? (
                          <span className="font-medium text-blue-600">{resume.name}</span>
                        ) : (
                          <>
                            <span className="font-medium text-blue-600">Upload a PDF file</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">PDF only (max. 5MB)</p>
                    </label>
                  </div>
                  {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application and CV'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
// ```