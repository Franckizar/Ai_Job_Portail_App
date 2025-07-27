'use client';

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/fetchWithAuth"; // Adjust import path as needed

export default function AdminHello() {
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // Check for token on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem("jwt_token");
      if (currentToken) {
        setToken(currentToken);
        setHasToken(true);
        // Automatically test the endpoint if token exists
        checkSecureEndpoint();
      } else {
        setError("No JWT token found in localStorage. Please login first.");
      }
    }
  }, []);

  async function checkSecureEndpoint() {
    setLoading(true);
    setError(null);
    setMessage(null);

    // Get token from localStorage and store in state for display
    const currentToken =
      typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
    setToken(currentToken);

    if (!currentToken) {
      setError("No JWT token found in localStorage. Please login first.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetchWithAuth(
        "https://modest-integral-ibex.ngrok-free.app/api/v1/admin/hello_admin"
        // "http://localhost:8086/api/v1/admin/hello_admin"
      );

      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized: Token is invalid or expired. Please login again.");
        } else if (res.status === 403) {
          setError("Forbidden: You don't have admin privileges for this endpoint.");
        } else {
          setError(`Error ${res.status}: ${res.statusText}`);
        }
      } else {
        const text = await res.text();
        setMessage(text);
      }
    } catch (err) {
      console.error("Fetch failed", err);
      setError("Network error: Backend not reachable or CORS issue.");
    } finally {
      setLoading(false);
    }
  }

  function clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      setToken(null);
      setHasToken(false);
      setMessage(null);
      setError("Token removed from localStorage.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Secure Endpoint Test
            </h1>
            <p className="text-blue-100 mt-1">Test your admin authentication and access to protected endpoints</p>
          </div>

          <div className="p-6">
            {/* Token Status Card */}
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${hasToken ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${hasToken ? 'text-green-800' : 'text-red-800'}`}>
                    Token Status: {hasToken ? 'Found' : 'Not Found'}
                  </h3>
                  <p className={`text-sm ${hasToken ? 'text-green-600' : 'text-red-600'}`}>
                    {hasToken ? 'JWT token is present in localStorage' : 'No JWT token found in localStorage'}
                  </p>
                </div>
                {hasToken && (
                  <button
                    onClick={clearToken}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Clear Token
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={checkSecureEndpoint}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                } text-white shadow-md hover:shadow-lg flex items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test Admin Endpoint
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow-md"
              >
                Refresh Page
              </button>
            </div>

            {/* Token Display */}
            {token && (
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">JWT Token</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Bearer Token
                    </span>
                  </div>
                  <div className="bg-black rounded p-3 overflow-x-auto">
                    <code className="text-green-400 text-sm font-mono break-all">
                      {token}
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This token is automatically included in the Authorization header for protected endpoints
                  </p>
                </div>
              </div>
            )}

            {/* Response Section */}
            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Success</h4>
                      <p className="text-green-700 font-medium">{message}</p>
                      <p className="text-green-600 text-sm mt-1">
                        ✅ You have successfully authenticated as an admin user!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* API Endpoint Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Endpoint Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>URL:</strong> <code className="bg-blue-100 px-1 rounded">https://modest-integral-ibex.ngrok-free.app/api/v1/admin/hello_admin</code></p>
                <p><strong>Method:</strong> <code className="bg-blue-100 px-1 rounded">GET</code></p>
                <p><strong>Required Role:</strong> <code className="bg-blue-100 px-1 rounded">admin</code></p>
                <p><strong>Authentication:</strong> <code className="bg-blue-100 px-1 rounded">Bearer JWT Token</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}