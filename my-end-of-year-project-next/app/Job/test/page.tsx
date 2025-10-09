'use client';

import { useState, useEffect } from 'react';

interface CVResponse {
  content: string;
  contentType: string;
}

const CvViewer = () => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = 'http://localhost:8088';

  const fetchCv = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user_account_id from localStorage
      const userAccountId = localStorage.getItem('user_account_id');
      
      if (!userAccountId) {
        throw new Error('User account ID not found. Please log in.');
      }

      // Fetch CV from API
      const response = await fetch(
        `${baseURL}/api/v1/auth/cv/${userAccountId}/jobseeker`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CV not found. Please upload your CV first.');
        }
        throw new Error(`Failed to fetch CV: ${response.statusText}`);
      }

      const data: CVResponse = await response.json();

      // Validate response
      if (!data.content) {
        throw new Error('CV content is empty');
      }

      // Convert base64 to blob
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob with correct MIME type
      const blob = new Blob([bytes], { type: data.contentType || 'application/pdf' });
      
      // Create object URL
      const url = URL.createObjectURL(blob);
      setCvUrl(url);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('CV fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCv();

    // Cleanup function to revoke object URL
    return () => {
      if (cvUrl) {
        URL.revokeObjectURL(cvUrl);
      }
    };
  }, []);

  const handleRetry = () => {
    fetchCv();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Your CV
          </h1>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading your CV...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Error Loading CV
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {cvUrl && !error && !loading && (
            <div className="w-full">
              <div className="mb-4 flex justify-end">
                <a
                  href={cvUrl}
                  download="CV.pdf"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download CV
                </a>
              </div>
              
              <div className="w-full h-[80vh] border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={`${cvUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  width="100%"
                  height="100%"
                  className="border-0"
                  title="Your CV"
                  style={{ display: 'block' }}
                />
              </div>
              
              <div className="mt-4 text-sm text-gray-500 text-center">
                Having trouble viewing? Try downloading the CV instead.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvViewer;