// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { useAuth } from "./AuthContext";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   User,
//   Building2,
//   UserCheck,
//   Wrench,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Shield,
// } from "lucide-react";

// // Utility function to combine class names
// function cn(...inputs: (string | undefined | null | boolean)[]): string {
//   return inputs.filter(Boolean).join(" ");
// }

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// type UserRole = "JOB_SEEKER" | "technician" | "recruiter" | "enterprise";
// type AuthView =
//   | "login"
//   | "register"
//   | "forgot-password"
//   | "reset-password"
//   | "verify-email"
//   | "success";

// export function AuthModal({ isOpen, onClose }: AuthModalProps) {
//   // State hooks
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [currentView, setCurrentView] = useState<AuthView>("login");

//   const [resetEmail, setResetEmail] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");

//   // Auth context functions
//   const {
//     login,
//     register,
//     forgotPassword,
//     resetPassword,
//     verifyEmail,
//     resendVerification,
//   } = useAuth();

//   // Login data state
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//     role: "job_seeker" as UserRole,
//   });

//   // Register data state
//   const [registerData, setRegisterData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "job_seeker" as UserRole,
//   });

//   // User role options
//   const roleOptions = [
//     {
//       value: "JOB_SEEKER",
//       label: "Job Seeker",
//       description: "Find opportunities",
//       icon: User,
//     },
//     {
//       value: "technician",
//       label: "Technician",
//       description: "Technical roles",
//       icon: Wrench,
//     },
//     {
//       value: "recruiter",
//       label: "Recruiter",
//       description: "Hire talent",
//       icon: UserCheck,
//     },
//     {
//       value: "enterprise",
//       label: "Enterprise",
//       description: "Business solutions",
//       icon: Building2,
//     },
//   ];

//   // Password validation helper
//   const validatePassword = (password: string) => {
//     const minLength = password.length >= 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumbers = /\d/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     return {
//       minLength,
//       hasUpperCase,
//       hasLowerCase,
//       hasNumbers,
//       hasSpecialChar,
//       isValid:
//         minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
//     };
//   };

//   const passwordValidation = validatePassword(registerData.password);
//   const newPasswordValidation = validatePassword(newPassword);

//   // Handlers for auth flows
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const success = await login(loginData.email, loginData.password);
//       if (success) {
//         setSuccess("Login successful! Welcome back.");
//         setTimeout(() => {
//           onClose();
//           resetAllForms();
//         }, 1500);
//       }
//     } catch (err: any) {
//       setError(err.message || "Invalid credentials. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     if (registerData.password !== registerData.confirmPassword) {
//       setError("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     if (!passwordValidation.isValid) {
//       setError("Please ensure your password meets all requirements");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const success = await register(
//         registerData.email,
//         registerData.password,
//         `${registerData.firstName} ${registerData.lastName}`,
//         registerData.role
//       );
//       if (success) {
//         setCurrentView("verify-email");
//         setSuccess("Account created! Please check your email for verification.");
//       }
//     } catch (err: any) {
//       setError(err.message || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await forgotPassword(resetEmail);
//       setSuccess("Password reset instructions sent to your email.");
//       setCurrentView("reset-password");
//     } catch (err: any) {
//       setError(err.message || "Failed to send reset email. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     if (newPassword !== confirmNewPassword) {
//       setError("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     if (!newPasswordValidation.isValid) {
//       setError("Please ensure your password meets all requirements");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await resetPassword(verificationCode, newPassword);
//       setCurrentView("success");
//       setSuccess("Password reset successful! You can now sign in with your new password.");
//     } catch (err: any) {
//       setError(err.message || "Failed to reset password. Please check your code and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyEmail = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await verifyEmail(verificationCode);
//       setCurrentView("success");
//       setSuccess("Email verified successfully! You can now sign in to your account.");
//     } catch (err: any) {
//       setError(err.message || "Failed to verify email. Please check your code and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendVerification = async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       await resendVerification(registerData.email || resetEmail);
//       setSuccess("Verification code sent to your email.");
//     } catch (err: any) {
//       setError(err.message || "Failed to resend verification code.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Reset all form states to initial
//   const resetAllForms = () => {
//     setError("");
//     setSuccess("");
//     setCurrentView("login");
//     setLoginData({ email: "", password: "", role: "job_seeker" });
//     setRegisterData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "job_seeker",
//     });
//     setResetEmail("");
//     setVerificationCode("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setShowPassword(false);
//     setShowConfirmPassword(false);
//   };

//   const handleClose = () => {
//     resetAllForms();
//     onClose();
//   };

//   const getHeaderTitle = () => {
//     switch (currentView) {
//       case "login":
//         return "Sign In";
//       case "register":
//         return "Create Account";
//       case "forgot-password":
//         return "Reset Password";
//       case "reset-password":
//         return "New Password";
//       case "verify-email":
//         return "Verify Email";
//       case "success":
//         return "Success";
//       default:
//         return "JobPortal";
//     }
//   };

//   const getHeaderDescription = () => {
//     switch (currentView) {
//       case "login":
//         return "Welcome back to your account";
//       case "register":
//         return "Join our professional network";
//       case "forgot-password":
//         return "We'll send you reset instructions";
//       case "reset-password":
//         return "Enter your new password";
//       case "verify-email":
//         return "Check your email for verification code";
//       case "success":
//         return "Action completed successfully";
//       default:
//         return "Professional career platform";
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-lg bg-white shadow-xl rounded-lg p-0 border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-black p-6 text-white text-center relative">
//           {currentView !== "login" && currentView !== "register" && (
//             <button
//               onClick={() => setCurrentView("login")}
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
//               aria-label="Back to sign in"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//           )}
//           <DialogHeader className="text-center">
//             <DialogTitle className="text-xl font-semibold text-center">
//               {currentView === "login" || currentView === "register"
//                 ? "JobPortal"
//                 : getHeaderTitle()}
//             </DialogTitle>
//             <DialogDescription className="text-gray-300 text-sm text-center">
//               {getHeaderDescription()}
//             </DialogDescription>
//           </DialogHeader>
//         </div>

//         <div className="p-6">
//           {/* Success/Error Messages */}
//           {(error || success) && (
//             <div
//               className={cn(
//                 "mb-4 p-3 rounded-md flex items-center gap-2 text-sm",
//                 error
//                   ? "bg-gray-50 text-red-600 border border-red-200"
//                   : "bg-gray-50 text-green-600 border border-green-200"
//               )}
//               role="alert"
//             >
//               {error ? (
//                 <AlertCircle className="h-4 w-4 flex-shrink-0" />
//               ) : (
//                 <CheckCircle className="h-4 w-4 flex-shrink-0" />
//               )}
//               <span>{error || success}</span>
//             </div>
//           )}

//           {/* Tabs for login/register */}
//           {(currentView === "login" || currentView === "register") && (
//             <Tabs
//               value={currentView}
//               onValueChange={(value) => setCurrentView(value as AuthView)}
//               className="w-full"
//             >
//               <TabsList className="grid grid-cols-2 mb-6 bg-gray-200 p-1 rounded-md h-10">
//                 <TabsTrigger
//                   value="login"
//                   className="rounded-sm data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-sm text-gray-700 hover:text-black transition-colors"
//                 >
//                   Sign In
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="register"
//                   className="rounded-sm data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-sm text-gray-700 hover:text-black transition-colors"
//                 >
//                   Register
//                 </TabsTrigger>
//               </TabsList>

//               {/* LOGIN FORM */}
//               <TabsContent value="login" className="space-y-4">
//                 <form onSubmit={handleLogin} className="space-y-4" noValidate>
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium text-gray-900">
//                       Email Address
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         className="pl-10 h-10 border-gray-300 focus:border-black focus:ring-black"
//                         value={loginData.email}
//                         onChange={(e) =>
//                           setLoginData({ ...loginData, email: e.target.value })
//                         }
//                         required
//                         autoComplete="email"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="password" className="text-sm font-medium text-gray-900">
//                       Password
//                     </Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         className="pl-10 pr-10 h-10 border-gray-300 focus:border-black focus:ring-black"
//                         value={loginData.password}
//                         onChange={(e) =>
//                           setLoginData({ ...loginData, password: e.target.value })
//                         }
//                         required
//                         autoComplete="current-password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
//                         aria-label={showPassword ? "Hide password" : "Show password"}
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <button
//                       type="button"
//                       onClick={() => setCurrentView("forgot-password")}
//                       className="text-sm text-gray-600 hover:text-black hover:underline font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Signing in...
//                       </>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>
//                 </form>
//               </TabsContent>

//               {/* REGISTER FORM */}
//               <TabsContent value="register" className="space-y-4">
//                 <form onSubmit={handleRegister} className="space-y-4" noValidate>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="firstName"
//                         className="text-sm font-medium text-gray-900"
//                       >
//                         First Name
//                       </Label>
//                       <Input
//                         id="firstName"
//                         placeholder="John"
//                         className="h-10 border-gray-300 focus:border-black focus:ring-black"
//                         value={registerData.firstName}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, firstName: e.target.value })
//                         }
//                         required
//                         autoComplete="given-name"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="lastName"
//                         className="text-sm font-medium text-gray-900"
//                       >
//                         Last Name
//                       </Label>
//                       <Input
//                         id="lastName"
//                         placeholder="Doe"
//                         className="h-10 border-gray-300 focus:border-black focus:ring-black"
//                         value={registerData.lastName}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, lastName: e.target.value })
//                         }
//                         required
//                         autoComplete="family-name"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="register-email"
//                       className="text-sm font-medium text-gray-900"
//                     >
//                       Email Address
//                     </Label>
//                     <Input
//                       id="register-email"
//                       type="email"
//                       placeholder="john.doe@email.com"
//                       className="h-10 border-gray-300 focus:border-black focus:ring-black"
//                       value={registerData.email}
//                       onChange={(e) =>
//                         setRegisterData({ ...registerData, email: e.target.value })
//                       }
//                       required
//                       autoComplete="email"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="register-password"
//                         className="text-sm font-medium text-gray-900"
//                       >
//                         Password
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="register-password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Password"
//                           className="pr-10 h-10 border-gray-300 focus:border-black focus:ring-black"
//                           value={registerData.password}
//                           onChange={(e) =>
//                             setRegisterData({ ...registerData, password: e.target.value })
//                           }
//                           required
//                           autoComplete="new-password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                           aria-label={showPassword ? "Hide password" : "Show password"}
//                         >
//                           {showPassword ? (
//                             <EyeOff className="h-4 w-4" />
//                           ) : (
//                             <Eye className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="register-confirm-password"
//                         className="text-sm font-medium text-gray-900"
//                       >
//                         Confirm
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="register-confirm-password"
//                           type={showConfirmPassword ? "text" : "password"}
//                           placeholder="Confirm password"
//                           className={cn(
//                             "pr-10 h-10 border-gray-300 focus:border-black focus:ring-black",
//                             registerData.confirmPassword &&
//                               registerData.password !== registerData.confirmPassword
//                               ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                               : ""
//                           )}
//                           value={registerData.confirmPassword}
//                           onChange={(e) =>
//                             setRegisterData({ ...registerData, confirmPassword: e.target.value })
//                           }
//                           required
//                           autoComplete="new-password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                           className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                           aria-label={
//                             showConfirmPassword ? "Hide password" : "Show password"
//                           }
//                         >
//                           {showConfirmPassword ? (
//                             <EyeOff className="h-4 w-4" />
//                           ) : (
//                             <Eye className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Password Requirements - Compact */}
//                   {registerData.password && (
//                     <div className="bg-gray-50 p-3 rounded-md">
//                       <div className="text-xs text-gray-600 mb-2">Password must include:</div>
//                       <div className="grid grid-cols-2 gap-1 text-xs">
//                         <div
//                           className={cn(
//                             "flex items-center gap-1",
//                             passwordValidation.minLength ? "text-green-600" : "text-gray-400"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-1 h-1 rounded-full",
//                               passwordValidation.minLength ? "bg-green-500" : "bg-gray-300"
//                             )}
//                           />
//                           8+ chars
//                         </div>
//                         <div
//                           className={cn(
//                             "flex items-center gap-1",
//                             passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-400"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-1 h-1 rounded-full",
//                               passwordValidation.hasUpperCase ? "bg-green-500" : "bg-gray-300"
//                             )}
//                           />
//                           Upper case
//                         </div>
//                         <div
//                           className={cn(
//                             "flex items-center gap-1",
//                             passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-400"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-1 h-1 rounded-full",
//                               passwordValidation.hasLowerCase ? "bg-green-500" : "bg-gray-300"
//                             )}
//                           />
//                           Lower case
//                         </div>
//                         <div
//                           className={cn(
//                             "flex items-center gap-1",
//                             passwordValidation.hasNumbers ? "text-green-600" : "text-gray-400"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-1 h-1 rounded-full",
//                               passwordValidation.hasNumbers ? "bg-green-500" : "bg-gray-300"
//                             )}
//                           />
//                           Numbers
//                         </div>
//                         <div
//                           className={cn(
//                             "flex items-center gap-1",
//                             passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-400"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-1 h-1 rounded-full",
//                               passwordValidation.hasSpecialChar ? "bg-green-500" : "bg-gray-300"
//                             )}
//                           />
//                           Special char
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="space-y-3">
//                     <Label className="text-sm font-medium text-gray-900">Account Type</Label>
//                     <RadioGroup
//                       value={registerData.role}
//                       onValueChange={(value) =>
//                         setRegisterData({ ...registerData, role: value as UserRole })
//                       }
//                       className="grid grid-cols-2 gap-2"
//                     >
//                       {roleOptions.map((role) => {
//                         const Icon = role.icon;
//                         return (
//                           <div key={role.value} className="relative">
//                             <RadioGroupItem
//                               value={role.value}
//                               id={`reg-${role.value}`}
//                               className="peer sr-only"
//                             />
//                             <Label
//                               htmlFor={`reg-${role.value}`}
//                               className="flex flex-col items-center gap-1 p-2 border-2 border-gray-200 rounded-md cursor-pointer hover:border-gray-400 peer-checked:border-black peer-checked:bg-gray-50 transition-all"
//                             >
//                               <Icon className="h-4 w-4 text-gray-600" />
//                               <span className="text-xs font-medium text-gray-700 text-center">
//                                 {role.label}
//                               </span>
//                               <span className="text-xs text-gray-500 text-center">
//                                 {role.description}
//                               </span>
//                             </Label>
//                           </div>
//                         );
//                       })}
//                     </RadioGroup>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//                     disabled={isLoading || !passwordValidation.isValid}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating account...
//                       </>
//                     ) : (
//                       "Create Account"
//                     )}
//                   </Button>
//                 </form>
//               </TabsContent>
//             </Tabs>
//           )}

//           {/* FORGOT PASSWORD FORM */}
//           {currentView === "forgot-password" && (
//             <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
//               <div className="text-center mb-4">
//                 <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-sm text-gray-600">
//                   Enter your email address and we'll send you instructions to reset your password.
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="reset-email"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Email Address
//                 </Label>
//                 <Input
//                   id="reset-email"
//                   type="email"
//                   placeholder="Enter your email"
//                   className="h-10 border-gray-300 focus:border-black focus:ring-black"
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)}
//                   required
//                   autoComplete="email"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//                 disabled={isLoading || !resetEmail}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Sending instructions...
//                   </>
//                 ) : (
//                   "Send Reset Instructions"
//                 )}
//               </Button>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentView("login")}
//                   className="text-sm text-gray-600 hover:text-black hover:underline"
//                 >
//                   Back to sign in
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* RESET PASSWORD FORM */}
//           {currentView === "reset-password" && (
//             <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
//               <div className="text-center mb-4">
//                 <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-sm text-gray-600">
//                   Enter the verification code from your email and your new password.
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="verification-code"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Verification Code
//                 </Label>
//                 <Input
//                   id="verification-code"
//                   placeholder="Enter 6-digit code"
//                   className="h-10 border-gray-300 focus:border-black focus:ring-black text-center tracking-widest"
//                   value={verificationCode}
//                   onChange={(e) => setVerificationCode(e.target.value)}
//                   maxLength={6}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="new-password"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   New Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="new-password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter new password"
//                     className="pr-10 h-10 border-gray-300 focus:border-black focus:ring-black"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                     autoComplete="new-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="confirm-new-password"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Confirm New Password
//                 </Label>
//                 <Input
//                   id="confirm-new-password"
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm new password"
//                   className={cn(
//                     "h-10 border-gray-300 focus:border-black focus:ring-black",
//                     confirmNewPassword && newPassword !== confirmNewPassword
//                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                       : ""
//                   )}
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   required
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                   aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                   style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>

//               {/* New Password Requirements */}
//               {newPassword && (
//                 <div className="bg-gray-50 p-3 rounded-md">
//                   <div className="text-xs text-gray-600 mb-2">Password must include:</div>
//                   <div className="grid grid-cols-2 gap-1 text-xs">
//                     <div
//                       className={cn(
//                         "flex items-center gap-1",
//                         newPasswordValidation.minLength ? "text-green-600" : "text-gray-400"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "w-1 h-1 rounded-full",
//                           newPasswordValidation.minLength ? "bg-green-500" : "bg-gray-300"
//                         )}
//                       />
//                       8+ chars
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center gap-1",
//                         newPasswordValidation.hasUpperCase ? "text-green-600" : "text-gray-400"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "w-1 h-1 rounded-full",
//                           newPasswordValidation.hasUpperCase ? "bg-green-500" : "bg-gray-300"
//                         )}
//                       />
//                       Upper case
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center gap-1",
//                         newPasswordValidation.hasLowerCase ? "text-green-600" : "text-gray-400"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "w-1 h-1 rounded-full",
//                           newPasswordValidation.hasLowerCase ? "bg-green-500" : "bg-gray-300"
//                         )}
//                       />
//                       Lower case
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center gap-1",
//                         newPasswordValidation.hasNumbers ? "text-green-600" : "text-gray-400"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "w-1 h-1 rounded-full",
//                           newPasswordValidation.hasNumbers ? "bg-green-500" : "bg-gray-300"
//                         )}
//                       />
//                       Numbers
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center gap-1",
//                         newPasswordValidation.hasSpecialChar ? "text-green-600" : "text-gray-400"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "w-1 h-1 rounded-full",
//                           newPasswordValidation.hasSpecialChar ? "bg-green-500" : "bg-gray-300"
//                         )}
//                       />
//                       Special char
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//                 disabled={
//                   isLoading ||
//                   !newPasswordValidation.isValid ||
//                   newPassword !== confirmNewPassword ||
//                   verificationCode.length !== 6
//                 }
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Resetting password...
//                   </>
//                 ) : (
//                   "Reset Password"
//                 )}
//               </Button>
//             </form>
//           )}

//           {/* EMAIL VERIFICATION FORM */}
//           {currentView === "verify-email" && (
//             <form onSubmit={handleVerifyEmail} className="space-y-4" noValidate>
//               <div className="text-center mb-4">
//                 <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-sm text-gray-600 mb-2">
//                   We've sent a verification code to your email address.
//                 </p>
//                 <p className="text-sm font-medium text-gray-800">
//                   {registerData.email || resetEmail}
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email-verification-code"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Verification Code
//                 </Label>
//                 <Input
//                   id="email-verification-code"
//                   placeholder="Enter 6-digit code"
//                   className="h-10 border-gray-300 focus:border-black focus:ring-black text-center tracking-widest"
//                   value={verificationCode}
//                   onChange={(e) => setVerificationCode(e.target.value)}
//                   maxLength={6}
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//                 disabled={isLoading || verificationCode.length !== 6}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Verifying...
//                   </>
//                 ) : (
//                   "Verify Email"
//                 )}
//               </Button>

//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
//                 <button
//                   type="button"
//                   onClick={handleResendVerification}
//                   disabled={isLoading}
//                   className="text-sm text-gray-600 hover:text-black hover:underline mr-4"
//                 >
//                   Resend verification code
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setCurrentView("login")}
//                   className="text-sm text-gray-600 hover:text-black hover:underline"
//                 >
//                   Back to sign in
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* SUCCESS VIEW */}
//           {currentView === "success" && (
//             <div className="text-center space-y-4">
//               <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
//               <div className="space-y-2">
//                 <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
//                 <p className="text-sm text-gray-600">{success}</p>
//               </div>

//               <Button
//                 onClick={() => setCurrentView("login")}
//                 className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
//               >
//                 Continue to Sign In
//               </Button>
//             </div>
//           )}

//           {/* Terms and Privacy */}
//           {(currentView === "login" || currentView === "register") && (
//             <div className="mt-6 text-center">
//               <p className="text-xs text-gray-500">
//                 By continuing, you agree to our{" "}
//                 <button className="text-black hover:underline">Terms</button> and{" "}
//                 <button className="text-black hover:underline">Privacy Policy</button>
//               </p>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
