import { NextRequest, NextResponse } from "next/server";

// JWT parsing function for server-side
function parseJwt(token: string): { roles?: string[]; role?: string; exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

// Define protected routes with their allowed roles
const protectedRoutes: Record<string, string[]> = {
  "/Job": [
    "ADMIN",
    "TECHNICIAN",
    "JOB_SEEKER",
    "JOBSEEKER",
    "ENTERPRISE",
    "RECRUITER",
    "PERSONAL_EMPLOYER"
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root path to Job_portail/Home
  if (pathname === '/') {
    console.log('🔀 Middleware: Redirecting root path to /Job_portail/Home');
    return NextResponse.redirect(new URL('/Job_portail/Home', request.url));
  }

  for (const route in protectedRoutes) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      console.log(`🔒 Middleware: Protecting route ${pathname}`);

      // Read JWT token only from cookies
      const token = request.cookies.get("jwt_token")?.value;

      if (!token) {
        console.log(`❌ Middleware: No token cookie found for ${pathname}`);
        return NextResponse.redirect(new URL("/Job_portail/Home", request.url));
      }

      if (isTokenExpired(token)) {
        console.log(`⏰ Middleware: Token expired for ${pathname}`);
        const response = NextResponse.redirect(new URL("/Job_portail/Home", request.url));
        response.cookies.delete("jwt_token");
        response.cookies.delete("email");
        return response;
      }

      const payload = parseJwt(token);
      if (!payload) {
        console.log(`❌ Middleware: Invalid token payload for ${pathname}`);
        return NextResponse.redirect(new URL("/Job_portail/Home", request.url));
      }

      // Extract roles and normalize to uppercase string array
      let userRoles: string[] = [];

      if (payload.roles && Array.isArray(payload.roles)) {
        userRoles = payload.roles;
      } else if (payload.role) {
        userRoles = [payload.role];
      }

      userRoles = userRoles
        .map(role => {
          if (typeof role === 'string') {
            let normalizedRole = role.toUpperCase();
            if (normalizedRole.startsWith('ROLE_')) {
              normalizedRole = normalizedRole.replace('ROLE_', '');
            }
            return normalizedRole;
          }
          return '';
        })
        .filter(role => role !== '');

      const allowedRoles = protectedRoutes[route].map(r => r.toUpperCase());

      // Check if user has any of the required roles
      const hasAccess = userRoles.some(role => allowedRoles.includes(role));

      if (!hasAccess) {
        console.log(`🚫 Middleware: Access denied for ${pathname}. User roles: ${userRoles.join(', ')}, Required: ${allowedRoles.join(', ')}`);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      console.log(`✅ Middleware: Access granted for ${pathname}. User role: ${userRoles.join(', ')}`);
      break; // Route matched and validated; no need to check further
    }
  }

  // No protected route matched or access granted
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/Job",
    "/Job/:path*"
  ],
};