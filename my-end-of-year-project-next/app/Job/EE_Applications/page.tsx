'use client';

import { useState } from 'react';
import { FileText, XCircle, Download } from 'lucide-react';

interface CVResponse {
  content: string;
  contentType: string;
}

const CvViewer = () => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = 'http://localhost:8088';
  const jobSeekerId = 2; // replace with dynamic ID
  const userType = 'jobseeker';

  const fetchCv = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/cv/${jobSeekerId}/${userType}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.statusText}`);
      }

      const data: CVResponse = await response.json();
      console.log('Received base64 content, length:', data.content.length);

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
      setShowModal(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching or displaying CV. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCv = () => {
    if (!cvUrl) return;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `jobseeker_${jobSeekerId}_cv.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => {
    if (cvUrl) URL.revokeObjectURL(cvUrl);
    setCvUrl(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          View Job Seeker CV
        </h1>

        <button
          onClick={fetchCv}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[var(--color-lamaSky)] hover:bg-[var(--color-lamaSkyDark)] text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          {loading ? 'Loading CV...' : 'View CV for Job Seeker'}
        </button>

        {error && <p className="mt-4 text-[var(--color-lamaRed)]">{error}</p>}

        {showModal && cvUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-[var(--color-border-light)] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Job Seeker CV
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={downloadCv}
                    className="flex items-center gap-2 text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)]"
                    title="Download CV"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <iframe
                  src={cvUrl}
                  width="100%"
                  height="600px"
                  className="rounded-lg border-0"
                  title="CV PDF Viewer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvViewer;  