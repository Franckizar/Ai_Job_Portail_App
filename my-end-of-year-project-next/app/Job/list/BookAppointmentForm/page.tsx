"use client";
import React, { useState } from "react";

// Helper to extract patient ID from JWT
const getPatientIdFromToken = (token: string | null) => {
  const decoded = parseJwt(token);
  return decoded.patient_id || decoded.patientId || null;
};

const initialForm = {
  startTime: "",
  endTime: "",
  reason: "",
  appointmentType: "",
  notes: "",
  bookingMethod: "Online",
  bookedBy: "Patient",
};

const BookAppointmentForm = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    // Simple validation
    if (!form.startTime || !form.endTime || !form.reason || !form.appointmentType) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("jwt_token");
    const patientId = getPatientIdFromToken(token);
    const doctorId = 1; // Always use doctor ID 1

    if (!patientId) {
      console.error("Could not determine patient ID from login token");
      setError("An error occurred. Please try again.");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/appointments/create/patient/${patientId}/doctor/${doctorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to book appointment:", response.status, errorText);
        throw new Error("Failed to book appointment.");
      }
      
      setSuccess("Appointment booked successfully!");
      setForm(initialForm);
    }
    catch (err: unknown) {
  if (err instanceof Error) {
    console.error("Error booking appointment:", err.message);
  } else {
    console.error("Error booking appointment:", err);
  }
  setError("An error occurred. Please try again.");
}

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md p-12"
      style={{
        border: "1px solid #e2e8f0",
        minWidth: "320px",
        maxWidth: "900px",
        width: "100%",
      }}
    >
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Book Appointment</h2>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">Start Time*</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">End Time*</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">Reason*</label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="e.g. Annual checkup"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">Appointment Type*</label>
          <select
            name="appointmentType"
            value={form.appointmentType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            <option value="Regular">Regular</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Immunization">Immunization</option>
            <option value="Consultation">Consultation</option>
            <option value="Lab">Lab</option>
            <option value="Therapy">Therapy</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">Booking Method</label>
          <select
            name="bookingMethod"
            value={form.bookingMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Online">Online</option>
            <option value="In-person">In-person</option>
          </select>
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-700 mb-1 font-semibold">Booked By</label>
          <input
            type="text"
            name="bookedBy"
            value={form.bookedBy}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 mb-1 font-semibold">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any special instructions?"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
      <button
        type="submit"
        className="w-full mt-8 bg-blue-600 text-white py-3 rounded font-semibold text-lg hover:bg-blue-700 transition"
      >
        Book Appointment
      </button>
    </form>
  );
};

// Helper function at the bottom
function parseJwt(token: string | null) {
  if (!token) return {};
  try {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  } catch {
    return {};
  }
}

export default BookAppointmentForm;
