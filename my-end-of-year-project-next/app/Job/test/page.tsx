'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';

const CvViewerPage = () => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = 'http://localhost:8088';

  const fetchCv = async () => {
    const jobSeekerId = localStorage.getItem('job_seeker_id');
    
    if (!jobSeekerId) {
      setError('Job Seeker ID not found in localStorage. Please ensure you are logged in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/cv/${jobSeekerId}/jobseeker`, {
        method: 'GET',
      });

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
    } catch (err) {
      console.error('Fetch CV error:', err);
      setError('Error fetching or displaying CV. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCv = () => {
    const jobSeekerId = localStorage.getItem('job_seeker_id');
    if (!cvUrl || !jobSeekerId) return;
    
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `jobseeker_${jobSeekerId}_cv.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch CV automatically when component mounts
  useEffect(() => {
    fetchCv();
    
    // Cleanup function to revoke object URL
    return () => {
      if (cvUrl) {
        URL.revokeObjectURL(cvUrl);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your CV...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Unable to Load CV
                </h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchCv}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {cvUrl && !loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">My CV</h1>
              </div>
              <button
                onClick={downloadCv}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Download CV"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            </div>
            <div className="p-4 bg-gray-100">
              <iframe
                src={cvUrl}
                width="100%"
                height="800px"
                className="rounded-lg border border-gray-300 bg-white"
                title="CV PDF Viewer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvViewerPage;