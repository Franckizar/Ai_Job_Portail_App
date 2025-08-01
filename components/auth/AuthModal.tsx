import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useAuth } from "./AuthContext";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  UserCheck, 
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = "job_seeker" | "recruiter" | "admin" | "client";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "job_seeker" as UserRole,
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker" as UserRole,
  });

  const roleOptions = [
    {
      value: "job_seeker",
      label: "Job Seeker",
      description: "Looking for opportunities",
      icon: User,
    },
    {
      value: "recruiter",
      label: "Recruiter",
      description: "Hiring for companies",
      icon: UserCheck,
    },
    {
      value: "client",
      label: "Client",
      description: "Post jobs & hire talent",
      icon: Building2,
    },
    {
      value: "admin",
      label: "Admin",
      description: "Platform management",
      icon: Shield,
    },
  ];

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
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(registerData.password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const success = await login(loginData.email, loginData.password, loginData.role);
      if (success) {
        setSuccess("Login successful! Welcome back.");
        setTimeout(() => {
          onClose();
          setLoginData({ email: "", password: "", role: "job_seeker" });
          setSuccess("");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Please ensure your password meets all requirements");
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(
        registerData.email,
        registerData.password,
        registerData.username,
        registerData.role
      );
      if (success) {
        setSuccess("Account created successfully! Welcome to JobPortal.");
        setTimeout(() => {
          onClose();
          setRegisterData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "job_seeker",
          });
          setSuccess("");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setError("");
    setSuccess("");
    setLoginData({ email: "", password: "", role: "job_seeker" });
    setRegisterData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "job_seeker",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white shadow-2xl rounded-3xl p-0 border-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Welcome to JobPortal AI</DialogTitle>
            <DialogDescription className="text-blue-100">
              Your intelligent career companion
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl h-12">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* Success/Error Messages */}
            {(error || success) && (
              <div className={cn(
                "mb-4 p-3 rounded-lg flex items-center gap-2 text-sm",
                error ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
              )}>
                {error ? (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{error || success}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Select Your Role</Label>
                  <RadioGroup
                    value={loginData.role}
                    onValueChange={(value) =>
                      setLoginData({ ...loginData, role: value as UserRole })
                    }
                    className="grid grid-cols-2 gap-3"
                  >
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      return (
                        <div key={role.value} className="relative">
                          <RadioGroupItem
                            value={role.value}
                            id={`login-${role.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`login-${role.value}`}
                            className="flex flex-col items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all"
                          >
                            <Icon className="h-5 w-5 text-gray-600 peer-checked:text-blue-600" />
                            <span className="text-xs font-medium text-gray-700">{role.label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER FORM */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="Enter your full name"
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  {registerData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600 mb-1">Password requirements:</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={cn("flex items-center gap-1", passwordValidation.minLength ? "text-green-600" : "text-gray-400")}>
                          <div className={cn("w-1 h-1 rounded-full", passwordValidation.minLength ? "bg-green-500" : "bg-gray-300")} />
                          8+ characters
                        </div>
                        <div className={cn("flex items-center gap-1", passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-400")}>
                          <div className={cn("w-1 h-1 rounded-full", passwordValidation.hasUpperCase ? "bg-green-500" : "bg-gray-300")} />
                          Uppercase
                        </div>
                        <div className={cn("flex items-center gap-1", passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-400")}>
                          <div className={cn("w-1 h-1 rounded-full", passwordValidation.hasLowerCase ? "bg-green-500" : "bg-gray-300")} />
                          Lowercase
                        </div>
                        <div className={cn("flex items-center gap-1", passwordValidation.hasNumbers ? "text-green-600" : "text-gray-400")}>
                          <div className={cn("w-1 h-1 rounded-full", passwordValidation.hasNumbers ? "bg-green-500" : "bg-gray-300")} />
                          Numbers
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className={cn(
                        "pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                        registerData.confirmPassword && registerData.password !== registerData.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      )}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Choose Your Role</Label>
                  <RadioGroup
                    value={registerData.role}
                    onValueChange={(value) =>
                      setRegisterData({ ...registerData, role: value as UserRole })
                    }
                    className="grid grid-cols-2 gap-3"
                  >
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      return (
                        <div key={role.value} className="relative">
                          <RadioGroupItem
                            value={role.value}
                            id={`reg-${role.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`reg-${role.value}`}
                            className="flex flex-col items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all"
                          >
                            <Icon className="h-5 w-5 text-gray-600 peer-checked:text-blue-600" />
                            <span className="text-xs font-medium text-gray-700 text-center">{role.label}</span>
                            <span className="text-xs text-gray-500 text-center">{role.description}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200" 
                  disabled={isLoading || !passwordValidation.isValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <button className="text-blue-600 hover:underline">Terms of Service</button>
              {" "}and{" "}
              <button className="text-blue-600 hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}