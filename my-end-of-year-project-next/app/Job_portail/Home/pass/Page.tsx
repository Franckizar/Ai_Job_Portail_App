import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../components/Job_portail/Home/components/auth/AuthContext";
// import { useAuth } from "./AuthContext";
import { Button } from "../../../../components/Job_portail/Home/components/ui/button";
import { Input } from "../../../../components/Job_portail/Home/components/ui/input";
import { Label } from "../../../../components/Job_portail/Home/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2, Shield } from "lucide-react";

const cn = (...inputs: (string | undefined | null | boolean)[]) =>
  inputs.filter(Boolean).join(" ");

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { resetPassword } = useAuth();

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("Missing verification token.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess("Password reset successful! You can now sign in with your new password.");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-md shadow bg-white">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="text-2xl font-semibold mt-2">Reset Password</h2>
        <p className="text-gray-600 mt-1">
          Enter your new password below to reset your account password.
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" /> <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded flex items-center gap-2 text-sm">
          <svg
            className="h-4 w-4 text-green-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      {!success && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="new-password" className="text-sm font-medium text-gray-900">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirm-new-password" className="text-sm font-medium text-gray-900">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className={cn(
                  "pr-10",
                  confirmNewPassword && newPassword !== confirmNewPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                )}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password requirements notice */}
          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600">
            Password must include:
            <ul className="list-disc list-inside mt-1">
              <li className={passwordValidation.minLength ? "text-green-600" : ""}>At least 8 characters</li>
              <li className={passwordValidation.hasUpperCase ? "text-green-600" : ""}>An uppercase letter</li>
              <li className={passwordValidation.hasLowerCase ? "text-green-600" : ""}>A lowercase letter</li>
              <li className={passwordValidation.hasNumbers ? "text-green-600" : ""}>A number</li>
              <li className={passwordValidation.hasSpecialChar ? "text-green-600" : ""}>A special character</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
            disabled={
              isLoading ||
              !passwordValidation.isValid ||
              newPassword !== confirmNewPassword
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
