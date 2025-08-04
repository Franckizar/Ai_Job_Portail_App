"use client";
import React, { useEffect, useState } from "react";

type Appointment = {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
  reason: string;
};

const statusOrder = (status: string) => {
  if (status === "CONFIRMED") return 0;
  if (status === "PENDING") return 1;
  return 2;
};

const formatDateTime = (str: string) =>
  new Date(str).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/appointments/all");
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data: Appointment[] = await res.json();
        // Sort: CONFIRMED first, then PENDING, then others
        const sorted = [...data].sort((a, b) => statusOrder(a.status) - statusOrder(b.status));
        setAppointments(sorted);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Error fetching appointments");
        } else {
          setError("Error fetching appointments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const confirmed = appointments.filter(a => a.status === "CONFIRMED");
  const pending = appointments.filter(a => a.status === "PENDING");

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-8xl min-w-[1100px] mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Appointments</h1>
      {loading && <div className="text-center text-blue-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          {/* Confirmed Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              <h2 className="text-xl font-semibold text-green-700">Confirmed Appointments</h2>
              <span className="ml-2 text-sm text-green-700 bg-green-100 px-2 rounded-full">{confirmed.length}</span>
            </div>
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {confirmed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-4">No confirmed appointments</td>
                  </tr>
                ) : (
                  confirmed.map(item => (
                    <tr key={item.id} className="bg-green-50 hover:bg-green-100 transition-colors">
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">{item.reason}</td>
                      <td className="p-3">{formatDateTime(item.start)}</td>
                      <td className="p-3">{formatDateTime(item.end)}</td>
                      <td className="p-3 font-semibold text-green-700">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pending Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
              <h2 className="text-xl font-semibold text-yellow-700">Pending Appointments</h2>
              <span className="ml-2 text-sm text-yellow-700 bg-yellow-100 px-2 rounded-full">{pending.length}</span>
            </div>
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-4">No pending appointments</td>
                  </tr>
                ) : (
                  pending.map(item => (
                    <tr key={item.id} className="bg-yellow-50 hover:bg-yellow-100 transition-colors">
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">{item.reason}</td>
                      <td className="p-3">{formatDateTime(item.start)}</td>
                      <td className="p-3">{formatDateTime(item.end)}</td>
                      <td className="p-3 font-semibold text-yellow-700">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
