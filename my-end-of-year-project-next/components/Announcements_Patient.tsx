"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, CalendarPlus, Loader2 } from "lucide-react";

type Appointment = {
  id: number;
  reason: string;
  startTime: string;
  notes: string;
  appointmentType: string;
  status: string;
  patientName?: string;
  duration?: number;
};

const AppointmentsByStatus = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Status colors mapping
  const statusColors = {
    CONFIRMED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };

  const typeColors = {
    Immunization: "bg-yellow-100 text-yellow-800",
    "Follow-up": "bg-purple-100 text-purple-800",
    Checkup: "bg-blue-100 text-blue-800",
    Consultation: "bg-teal-100 text-teal-800",
    default: "bg-gray-100 text-gray-800",
  };

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

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setProcessingId(id);
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/appointments/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      
      if (!response.ok) throw new Error(`Failed to update appointment status`);

      setAppointments(prev =>
        prev.map(appt => 
          appt.id === id ? { ...appt, status } : appt
        )
      );
      
      setSuccessMsg(`Appointment ${status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Could not update appointment. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h1>
          <p className="text-gray-500 mt-1">
            {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Filter
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Sort
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no upcoming appointments.
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`p-4 ${typeColors[appointment.appointmentType as keyof typeof typeColors] || typeColors.default}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{appointment.reason}</h2>
                    {appointment.patientName && (
                      <p className="text-sm opacity-80">Patient: {appointment.patientName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatDate(appointment.startTime)}</p>
                    <p className="text-sm">
                      {formatTime(appointment.startTime)}
                      {appointment.duration && ` • ${appointment.duration} mins`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white">
                {appointment.notes && (
                  <p className="text-sm text-gray-600 mb-3">{appointment.notes}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[appointment.status as keyof typeof statusColors] || statusColors.PENDING}`}>
                    {appointment.status}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[appointment.appointmentType as keyof typeof typeColors] || typeColors.default}`}>
                    {appointment.appointmentType}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleStatusChange(appointment.id, "CONFIRMED")}
                    disabled={appointment.status === "CONFIRMED" || processingId === appointment.id}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                      appointment.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    } transition-colors`}
                  >
                    {processingId === appointment.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {appointment.status === "CONFIRMED" ? "Confirmed" : "Confirm"}
                  </button>

                  <button
                    onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
                    disabled={processingId === appointment.id}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                      processingId === appointment.id
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    } transition-colors`}
                  >
                    {processingId === appointment.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Cancel
                  </button>

                  <button
                    onClick={() => console.log("Reschedule", appointment.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsByStatus;