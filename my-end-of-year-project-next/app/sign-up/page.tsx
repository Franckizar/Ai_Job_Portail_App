"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const favoriteColors = [
  { value: "east_side", label: "East Side" },
  { value: "purple_haze", label: "Purple Haze" },
  { value: "blue_lagoon", label: "Blue Lagoon" },
  { value: "green_day", label: "Green Day" },
  { value: "red_velvet", label: "Red Velvet" },
];

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    favoriteColor: "east_side",
    luckyNumber: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "luckyNumber" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800">Create Account</h1>
            <p className="mt-2 text-purple-600">Join us today</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Favorite Color
                </label>
                <select
                  name="favoriteColor"
                  value={formData.favoriteColor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {favoriteColors.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Lucky Number
                </label>
                <input
                  type="number"
                  name="luckyNumber"
                  min="1"
                  max="10"
                  value={formData.luckyNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors mt-4"
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            {error && (
              <div className="p-2 text-center text-red-600 bg-red-50 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-purple-600">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-purple-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}