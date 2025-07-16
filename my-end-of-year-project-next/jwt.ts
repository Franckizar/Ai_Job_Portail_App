// utils/jwt.ts

export type JwtPayload = {
  roles?: string[];
  role?: string;
  [key: string]: unknown;
};

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

// Restrict to only "admin" | "patient" | null
export function getRoleFromLocalStorage(): "admin" | "patient" | null {
  if (typeof window === "undefined") return null; // SSR safety
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;
  let role: string | undefined;
  if (payload.roles && Array.isArray(payload.roles) && payload.roles.length > 0) {
    role = String(payload.roles[0]).toLowerCase();
  } else if (payload.role) {
    role = String(payload.role).toLowerCase();
  }
  if (role === "admin" || role === "patient") {
    return role;
  }
  return null;
}
