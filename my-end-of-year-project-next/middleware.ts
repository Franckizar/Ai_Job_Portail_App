import { NextRequest, NextResponse } from "next/server";

// JWT parsing function for server-side
function parseJwt(token: string): { roles?: string[]; role?: string } | null {
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

const protectedRoutes: Record<string, string[]> = {
  "/Admin": ["admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const token = request.cookies.get("jwt_token")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      const payload = parseJwt(token);
      const userRoles: string[] =
        payload?.roles?.map((r) => r.toLowerCase()) ||
        (payload?.role ? [payload.role.toLowerCase()] : []);
      const allowedRoles = protectedRoutes[route];
      if (!userRoles.some((role) => allowedRoles.includes(role))) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin/:path*",
  ],
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { NextRequest, NextResponse } from "next/server";

// // JWT parsing function for server-side
// function parseJwt(token: string): { roles?: string[]; role?: string } | null {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }

// // Key: base route path, Value: allowed roles array
// const protectedRoutes: Record<string, string[]> = {
//   "/Admin": ["admin"],
//   "/Employer": ["employer"],
//   "/Candidate": ["candidate", "jobseeker"], // example roles, adjust as per your setup
// };

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   for (const route in protectedRoutes) {
//     if (pathname.startsWith(route)) {
//       const token = request.cookies.get("jwt_token")?.value;

//       if (!token) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }

//       const payload = parseJwt(token);
//       const userRoles: string[] =
//         payload?.roles?.map((r) => r.toLowerCase()) ||
//         (payload?.role ? [payload.role.toLowerCase()] : []);

//       const allowedRoles = protectedRoutes[route].map(r => r.toLowerCase());

//       if (!userRoles.some((role) => allowedRoles.includes(role))) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//       break; // Once matched and validated, no need to continue
//     }
//   }

//   return NextResponse.next();
// }

// // Update matcher to cover all protected route bases and their subpaths
// export const config = {
//   matcher: [
//     "/Admin/:path*",
//     "/Employer/:path*",
//     "/Candidate/:path*",
//   ],
// };
