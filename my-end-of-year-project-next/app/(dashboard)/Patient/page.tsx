"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  EventCalendar,
  UserCard,
  RoleProtectedDashboard,
  Announcements_Patient
} from "@/components";
import { parseJwt } from "@/jwt";

const PatientPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      console.log("JWT from localStorage:", token);
      const decoded = parseJwt(token);
      console.log("Decoded JWT payload:", decoded);
    } else {
      console.warn("No JWT token found in localStorage.");
    }
  }, []);

  return (
    <RoleProtectedDashboard allowedRoles={["PATIENT"]}>
      <div>
        <span className="flex text-gray-950 p-4 gap-4 flex-col md:flex-row">
          {/* LEFT */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="Appointment" endpoint="/api/appointments" />
            <UserCard type="invoice" endpoint="/api/invoices" />
            <UserCard type="Announcement" endpoint="/api/announcements" />
            <UserCard type="New Service" endpoint="/api/services" />

            </div>
            {/* Welcome Message and Health Tips */}
            <div className="flex gap-4 flex-col lg:flex-row">
              <div className="w-full bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Welcome to Your Patient Portal</h2>
               <p className="text-gray-700 mb-4">
                 We&apos;re glad to have you here! This is your central hub for managing your healthcare needs.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-700 mb-2">Health Tip of the Day</h3>
                  <p className="text-gray-700">
                    Remember to stay hydrated throughout the day. Drinking enough water helps maintain energy levels and supports overall health.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/list/BookAppointmentForm')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg transition-colors"
                >
                  Request Appointment
                </button>
                <button 
                  onClick={() => router.push('/list/Medical_Record_Patient')}
                  className="bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg transition-colors"
                >
                  View Test Results
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-lg transition-colors"
                >
                  Message Your Doctor
                </button>
                <button 
                  onClick={() => router.push('/list/Payment')}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-3 px-4 rounded-lg transition-colors"
                >
                  Pay Bills
                </button>
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div className="w-full lg:w-1/3 flex-col gap-8">
            <EventCalendar />
            <Announcements_Patient />
          </div>
        </span>
      </div>
    </RoleProtectedDashboard>
  );
};

export default PatientPage;