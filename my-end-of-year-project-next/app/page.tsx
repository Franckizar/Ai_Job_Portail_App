"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { parseJwt } from "@/jwt";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const { token } = await response.json();
      localStorage.setItem("jwt_token", token);
      document.cookie = `jwt_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      const decoded = parseJwt(token);
      if (decoded?.roles?.length) {
        const userRole = decoded.roles[0].toLowerCase();
        router.push(`/${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`);
      } else {
        router.push("/unauthorized");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800">Welcome Back</h1>
            <p className="mt-2 text-purple-600">Sign in to your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forget" className="text-sm text-purple-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {error && (
              <div className="p-2 text-center text-red-600 bg-red-50 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-purple-600">
            Don&apos;t have an account?{""}
            <Link href="/sign-up" className="font-medium text-purple-700 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}