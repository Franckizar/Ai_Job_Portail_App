"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { parseJwt } from "@/jwt";

type Role = {
  label: string;
  route: string;
  value: string;
};

const roles: Role[] = [
  { label: "Admin", route: "/login/admin", value: "ADMIN" },
  { label: "Doctor", route: "/login/doctor", value: "DOCTOR" },
  { label: "Patient", route: "/login/patient", value: "PATIENT" },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    router.push(role.route);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        let message = "Login failed";
        try {
          const data = await response.json();
          message = data.message || message;
        } catch {}
        throw new Error(message);
      }

      const data: { token?: string } = await response.json();
      if (data.token) {
        // Save JWT in cookie and localStorage
        document.cookie = `jwt_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("jwt_token", data.token);

        // Parse the token and get user role
        const decoded = parseJwt(data.token);
        console.log("Decoded JWT:", decoded);

        if (decoded && decoded.roles && decoded.roles.length > 0) {
          const userRole = decoded.roles[0].toLowerCase();

          if (userRole === "admin") {
            router.push("/Admin");
          } else if (userRole === "doctor") {
            router.push("/Doctor");
          } else if (userRole === "nurse") {
            router.push("/Nurse");
          } else if (userRole === "patient") {
            router.push("/Patient");
          } else {
            console.warn("Unknown role:", userRole);
            router.push("/unauthorized");
          }
        } else {
          console.warn("No role found in JWT payload.");
          router.push("/unauthorized");
        }
      } else {
        throw new Error("No token received from server.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#f3f7fa] to-[#e3f0ff]">
        <div className="bg-white shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md border border-[#b2dfdb]">
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#26c6da] to-[#1976d2] mb-6">
            Welcome Back
          </h1>

          <div className="flex justify-center gap-2 mb-6">
            {roles.map((role) => (
              <button
                key={role.label}
                onClick={() => handleRoleChange(role)}
                className={`px-4 py-1 rounded-full font-semibold border transition ${
                  selectedRole.label === role.label
                    ? "bg-[#26c6da] text-white border-[#26c6da]"
                    : "bg-white text-[#1976d2] border-[#b2dfdb] hover:bg-[#e0f7fa]"
                }`}
                type="button"
              >
                {role.label}
              </button>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1976d2] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#b2dfdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26c6da] bg-[#f3f7fa] transition"
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1976d2] mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#b2dfdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2] bg-[#f3f7fa] transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-between items-center">
              <Link href="/forget" className="text-xs text-[#26c6da] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-[#26c6da] to-[#1976d2] text-white font-bold rounded-lg hover:from-[#1976d2] hover:to-[#26c6da] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : `Login as ${selectedRole.label}`}
            </button>

            {error && <div className="text-red-600 text-center text-sm mt-2">{error}</div>}
          </form>

          <p className="mt-6 text-center text-sm text-[#1976d2]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#26c6da] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
