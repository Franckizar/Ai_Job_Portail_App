"use client";
import React, { useEffect, useState } from "react";

type Appointment = {
  id: number;
  reason: string;
  startTime: string;
  notes: string;
  appointmentType: string;
  status: string;
};

const AppointmentsByStatus = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://wambs-clinic.onrender.com/api/v1/auth/appointments/status/CONFIRMED",
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/appointments/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CONFIRMED" }),
        }
      );
      if (!response.ok) throw new Error("Failed to confirm appointment");

      // Optionally, update state or refetch
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "CONFIRMED" } : appt
        )
      );
      setSuccessMsg("Appointment confirmed successfully!");
      setTimeout(() => setSuccessMsg(null), 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Error confirming appointment:", err);
      alert("Could not confirm appointment.");
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pending Appointments</h1>
        <span className="text-xs text-gray-400">
          {appointments.length} total
        </span>
      </div>

      {successMsg && (
        <div className="mt-4 mb-2 text-green-700 bg-green-100 px-4 py-2 rounded text-sm text-center">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`rounded-md p-4 ${
              appointment.appointmentType === "Immunization"
                ? "bg-yellow-100"
                : appointment.appointmentType === "Follow-up"
                ? "bg-purple-100"
                : "bg-blue-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{appointment.reason}</h2>
              <span className="text-xs text-gray-600 bg-white rounded-md px-2 py-1">
                {new Date(appointment.startTime).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
            <div className="flex gap-2 mt-3">
              <button
                className="px-3 py-1 text-xs rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => handleConfirm(appointment.id)}
                disabled={appointment.status === "CONFIRMED"}
              >
                Confirm
              </button>
              <button
                className="px-3 py-1 text-xs rounded bg-black text-white font-semibold opacity-80"
                // No onClick yet for Cancel
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <p className="text-sm text-gray-400">
            No pending appointments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsByStatus;
