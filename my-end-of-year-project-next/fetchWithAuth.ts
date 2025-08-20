// utils/fetchWithAuth.ts

/**
 * Get JWT token from localStorage
 * @returns JWT token string or null if not found
 */
function getJwtToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem('jwt_token');
  }
  return null;
}

/**
 * List all your API route prefixes that require authentication.
 * Only requests to these endpoints will include the JWT from storage.
 */
const protectedEndpoints = [
  "/api/user/profile",
  "/api/jobs",
  // "/api/applications",
  "/api/v1/auth/verify-user",
  "/api/v1/auth/logout",
  "/api/v1/auth/profile",
  "/api/v1/auth/change-password",
  "/api/v1/sharedPlus/me", // Add your /me endpoint
  "/api/v1/admin", // Add admin routes here
  // Add all other protected API routes here
  // Note: /authenticate should NOT be in protected endpoints as it's used to GET the token
];

/**
 * Checks if the given URL path is one of the protected routes.
 * This check is prefix-based; e.g., if "/api/jobs" is protected,
 * then "/api/jobs/123" will also be considered protected.
 * 
 * @param url - The URL string to check (can be absolute or relative path)
 */
function isProtectedEndpoint(url: string): boolean {
  try {
    // Support absolute URLs by extracting pathname
    const pathname = new URL(url, window.location.origin).pathname;
    return protectedEndpoints.some(path => pathname.startsWith(path));
  } catch {
    // If URL constructor fails (invalid url), fallback to simple check
    return protectedEndpoints.some(path => url.startsWith(path));
  }
}

/**
 * Wrapper around fetch that automatically adds the JWT token as 
 * Authorization header for protected endpoints.
 *
 * @param url - The request URL, can be relative or absolute
 * @param options - Fetch options
 * @returns Response from fetch
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  // Always add ngrok header to skip browser warning (if you want)
  headers.set("ngrok-skip-browser-warning", "true");
  
  // Check if this endpoint requires authentication
  if (isProtectedEndpoint(url)) {
    if (typeof window !== "undefined") {
      const token = getJwtToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(`Adding Bearer token to request: ${url}`);
      } else {
        console.warn(`No JWT token found for protected endpoint: ${url}`);
      }
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Log the request details for debugging
    console.log(`Request to ${url}:`, {
      method: options.method || 'GET',
      hasAuth: headers.has('Authorization'),
      status: response.status
    });
    
    return response;
  } catch (error) {
    console.error(`Network error for ${url}:`, error);
    throw new Error("Network error or failed to fetch resource.");
  }
}

// Export the getJwtToken function in case you need it elsewhere
export { getJwtToken };