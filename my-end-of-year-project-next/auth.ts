// utils/auth.ts

export function getJwtToken(): string | null {
  if (typeof window === "undefined") return null;

  // Example: Try to get from localStorage first
  const localStorageToken = localStorage.getItem("jwt_token");
  if (localStorageToken) return localStorageToken;

  // Optionally, check cookies if you store token there
  // Example using document.cookie:
  const match = document.cookie.match(/(^|;)\\s*jwt_token=([^;]+)/);
  if (match) return decodeURIComponent(match[2]);

  return null;
}

// export function setJwtToken(token: string): void {
//   if (typeof window === "undefined") return;

//   localStorage.setItem("jwt_token", token);
//   document.cookie = `jwt_token=${token}; path=/; secure; samesite=strict`;
// }