// utils/fetchWithAuth.ts

/** 
 * List all your API route prefixes that require authentication.
 * Only requests to these endpoints will include the JWT from localStorage.
 */
const protectedEndpoints = [
  "/api/user/profile",
  "/api/jobs",
  "/api/applications",
  // "/api/v1/auth/appointments",
  "/api/v1/admin",                      // <-- Added admin routes here
  // Add all other protected API routes here
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

  // Always add ngrok header to skip browser warning
  headers.set("ngrok-skip-browser-warning", "true");

  if (isProtectedEndpoint(url)) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  }

  try {
    return await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    // Catch errors but intentionally ignore the error object to fix ESLint no-unused-vars
    // You may optionally log here if you want:
    // console.error("Fetch failed", _err);
    throw new Error("Network error or failed to fetch resource.");
  }
}