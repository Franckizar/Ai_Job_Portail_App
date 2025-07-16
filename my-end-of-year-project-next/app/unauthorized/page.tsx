"use client";

import { useEffect } from "react";
import { getRoleFromLocalStorage } from "@/jwt";

export default function Unauthorized() {
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    console.log("JWT Token:", token);

    const role = getRoleFromLocalStorage();
    console.log("User Role:", role);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg">You do not have permission to view this page.</p>
    </div>
  );
}
