'use client';

import { useEffect } from "react";
import {
  Announcements,
  AttendanceChat,
  CountChart,
  EventCalendar,
  FinanceChat,
  UserCard,
  RoleProtectedDashboard
} from "@/components";
import { parseJwt } from "@/jwt";

// Define the card configs in an array
const userCardConfigs = [
  {
    type: "Doctor",
    endpoint: "https://wambs-clinic.onrender.com/api/v1/auth/doctor/stats/dentists/count",
  },
  {
    type: "Nurse",
    endpoint: "https://wambs-clinic.onrender.com/api/v1/auth/doctor/stats/nurses/count",
  },
  {
    type: "Patient",
    endpoint: "https://wambs-clinic.onrender.com/api/v1/auth/doctor/stats/patients/count",
  },
  {
    type: "Staff",
    endpoint: "https://wambs-clinic.onrender.com/api/v1/auth/doctor/stats/users/count",
  },
];

const AdminPage = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      console.log("JWT from localStorage:", token);
      const decoded = parseJwt(token);
      console.log("Decoded JWT payload:", decoded);
    } else {
      console.warn("No JWT token found in localStorage.");
    }
    // Log all endpoints being used
    userCardConfigs.forEach(cfg => {
      console.log(`[AdminPage] UserCard endpoint for ${cfg.type}: ${cfg.endpoint}`);
    });
  }, []);

  return (
    <RoleProtectedDashboard allowedRoles={["admin"]}>
      <div>
        <span className="flex text-gray-950 p-4 gap-4 flex-col md:flex-row">
          {/* LEFT */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="flex gap-4 justify-between flex-wrap">
              {userCardConfigs.map(cfg => (
                <UserCard
                  key={cfg.type}
                  type={cfg.type}
                  endpoint={cfg.endpoint}
                />
              ))}
            </div>
            {/* Charts */}
            <div className="flex gap-4 flex-col lg:flex-row">
              <div className="w-full lg:w-1/3 h-[450px]">
                <CountChart />
              </div>
              <div className="w-full lg:w-2/3 h-[450px]">
                <AttendanceChat />
              </div>
            </div>
            <div className="w-full h-[500px]">
              <FinanceChat />
            </div>
          </div>
          {/* RIGHT */}
          <div className="w-full lg:w-1/3 flex-col gap-8">
            <EventCalendar />
            <Announcements />
          </div>
        </span>
      </div>
    </RoleProtectedDashboard>
  );
};

export default AdminPage;
