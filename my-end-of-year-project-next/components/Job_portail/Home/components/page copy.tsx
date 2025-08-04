// "use client";

// import React, { useEffect, useState } from "react";

// interface ResetPasswordPageProps {
//   resetPassword: (token: string, newPassword: string) => Promise<void>;
// }

// export default function ResetPasswordPage({ resetPassword }: ResetPasswordPageProps) {
//   const [token, setToken] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Grab token from URL on mount
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tokenFromUrl = params.get("token") || "";
//     setToken(tokenFromUrl);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!token) {
//       setError("Reset token is missing.");
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await resetPassword(token, newPassword);
//       setSuccess("Your password was reset successfully!");
//     } catch (err: any) {
//       setError(err?.message || "Something went wrong, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "3rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
//       <h2>Reset Password</h2>
//       {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
//       {success && <div style={{ color: "green", marginBottom: 10 }}>{success}</div>}

//       {!success && (
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: 10 }}>
//             <label>
//               New Password:<br />
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 minLength={8}
//                 style={{ width: "100%", padding: 8, marginTop: 4 }}
//               />
//             </label>
//           </div>
//           <div style={{ marginBottom: 10 }}>
//             <label>
//               Confirm Password:<br />
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 required
//                 minLength={8}
//                 style={{ width: "100%", padding: 8, marginTop: 4 }}
//               />
//             </label>
//           </div>

//           <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }
