"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";

// 🛠️ Fullscreen and no-scroll calendar CSS
const calendarStyles = `
  .rbc-calendar, .rbc-time-view, .rbc-time-content, .rbc-time-header, .rbc-time-gutter, .rbc-events-container, body, html {
    overflow: hidden !important;
  }
  .rbc-allday-cell {
    display: none !important;
  }
  .rbc-event {
    font-size: 11px;
    padding: 3px 6px;
    min-height: 25px !important;
    height: auto !important;
    line-height: 1.2;
  }
  .rbc-event-content {
    overflow: visible !important;
    text-overflow: initial !important;
    white-space: normal !important;
    word-wrap: break-word;
  }
  .rbc-time-slot {
    min-height: 40px !important;
  }
  .rbc-timeslot-group {
    min-height: 80px !important;
  }
  .rbc-day-slot .rbc-events-container {
    margin-right: 0px;
  }
  .rbc-header {
    padding: 8px 4px;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid #ddd;
    background-color: #f8f9fa;
  }
  .rbc-header + .rbc-header {
    border-left: 1px solid #ddd;
  }
  .rbc-time-header .rbc-header {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const localizer = momentLocalizer(moment);

// Updated type to match your API response
type MedicalRecord = {
  id: number;
  recordDate: string;
  type: string;
  details: string;
  followUpDate: string;
  chiefComplaint: string;
  medicalHistory: string;
  allergies: string;
  examinationNotes: string;
  xrayFindings: string;
  diagnosis: string;
  treatmentPlan: string;
  proceduresDone: string;
  lastUpdated: string;
  dentalHealthSummary: string;
  nextCheckupDate: string;
  oralHygieneInstructions: string;
};

type AppointmentDTO = {
  id: number;
  medicalRecord: MedicalRecord | null;
  startTime: string; // Changed from 'start' to 'startTime'
  endTime: string;   // Changed from 'end' to 'endTime'
  reason: string;
  appointmentType: string;
  status: string;
  notes: string;
  bookingMethod: string;
  bookedBy: string;
};

type AppointmentEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
  reason: string;
  appointmentType: string;
  notes: string;
  bookingMethod: string;
  bookedBy: string;
  medicalRecord: MedicalRecord | null;
};

// ✅ Helper: Extract patientId from JWT Token
const getPatientIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log("✅ Decoded JWT Payload:", decodedPayload);
    return decodedPayload.patientId || null;
  } catch (error) {
    console.error("❌ Error decoding JWT token:", error);
    return null;
  }
};

const BigCalendarPatient = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("jwt_token");
        console.log("📌 JWT Token from localStorage:", token);

        if (!token) {
          throw new Error("User not authenticated. JWT token not found.");
        }

        const patientId = getPatientIdFromToken(token);
        console.log("📌 Extracted Patient ID:", patientId);

        if (!patientId) {
          throw new Error("Patient ID not found in JWT token.");
        }

        const endpoint = `https://wambs-clinic.onrender.com/api/v1/auth/appointments/patient/${patientId}`;
        console.log("📡 Fetching appointments from:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        const data: AppointmentDTO[] = await response.json();
        console.log("📥 Appointments from backend:", data);

        // ✅ Proper mapping to match the new API structure
        const mappedEvents: AppointmentEvent[] = data.map((appt) => ({
          id: appt.id,
          title: `${appt.reason} (${appt.appointmentType})`, // Create title from reason and type
          start: new Date(appt.startTime), // Use startTime instead of start
          end: new Date(appt.endTime),     // Use endTime instead of end
          status: appt.status,
          reason: appt.reason,
          appointmentType: appt.appointmentType,
          notes: appt.notes,
          bookingMethod: appt.bookingMethod,
          bookedBy: appt.bookedBy,
          medicalRecord: appt.medicalRecord,
        }));

        console.log("📋 Mapped events for calendar:", mappedEvents);
        setEvents(mappedEvents);
      } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleViewChange = (selectedView: View) => {
    setView(selectedView);
  };

  // Enhanced event styling based on appointment type and status
  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#2c5aa0";
    
    // Color based on status
    switch (event.status) {
      case "PENDING":
        backgroundColor = "#f39c12";
        borderColor = "#e67e22";
        break;
      case "CONFIRMED":
        backgroundColor = "#27ae60";
        borderColor = "#229954";
        break;
      case "CANCELLED":
        backgroundColor = "#e74c3c";
        borderColor = "#c0392b";
        break;
      case "COMPLETED":
        backgroundColor = "#2c3e50";
        borderColor = "#1b2631";
        break;
    }

    // Slight variation based on appointment type
    if (event.appointmentType === "Follow-up") {
      backgroundColor = `${backgroundColor}dd`; // More transparent
    } else if (event.appointmentType === "Immunization") {
      borderColor = "#8e44ad"; // Purple border for immunizations
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: `2px solid ${borderColor}`,
        display: "block",
        fontSize: "11px",
        fontWeight: "500",
      },
    };
  };

  // Enhanced event selection handler
  const handleSelectEvent = (event: AppointmentEvent) => {
    const medicalInfo = event.medicalRecord 
      ? `\n\nMedical Record:\n- Diagnosis: ${event.medicalRecord.diagnosis}\n- Chief Complaint: ${event.medicalRecord.chiefComplaint}\n- Treatment Plan: ${event.medicalRecord.treatmentPlan}`
      : '\n\nNo medical record attached.';

    alert(`📅 Appointment Details:
    
Title: ${event.title}
Reason: ${event.reason}
Type: ${event.appointmentType}
Status: ${event.status}
Notes: ${event.notes}
Booked by: ${event.bookedBy} (${event.bookingMethod})
Time: ${event.start.toLocaleString()} - ${event.end.toLocaleTimeString()}${medicalInfo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your appointments...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your schedule</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-red-600 font-semibold text-lg mb-2">Unable to Load Appointments</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );  
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
      <div className="h-screen w-screen overflow-hidden bg-gray-50">
        {/* Header with appointment count */}
        <div className="bg-white shadow-sm border-b px-4 py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">My Appointments</h1>
            <div className="text-sm text-gray-600">
              {events.length} appointment{events.length !== 1 ? 's' : ''} scheduled
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-60px)]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WORK_WEEK, Views.DAY, Views.WEEK, Views.MONTH]}
            view={view}
            onView={handleViewChange}
            style={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
            eventPropGetter={eventStyleGetter}
            min={new Date(0, 0, 0, 7, 0, 0)}  // Start at 7 AM
            max={new Date(0, 0, 0, 19, 0, 0)} // End at 7 PM
            step={30} // 30-minute intervals
            timeslots={2} // Two 30-minute slots per hour
            defaultDate={new Date()}
            popup={true}
            tooltipAccessor={(event) => `${event.title}\nStatus: ${event.status}\nNotes: ${event.notes}`}
            onSelectEvent={handleSelectEvent}
            formats={{
              dayHeaderFormat: (date, culture, localizer) =>
                localizer?.format(date, "dddd\nMMM Do", culture) || "",
              timeGutterFormat: (date, culture, localizer) =>
                localizer?.format(date, "h:mm A", culture) || "",
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer?.format(start, "h:mm A", culture)} - ${localizer?.format(end, "h:mm A", culture)}`,
              dayFormat: (date, culture, localizer) =>
                localizer?.format(date, "dddd\nMMM Do", culture) || "",
              weekdayFormat: (date, culture, localizer) =>
                localizer?.format(date, "dddd\nMMM Do", culture) || "",
            }}
            components={{
              event: ({ event }) => (
                <div className="rbc-event-content" style={{ 
                  whiteSpace: 'normal', 
                  wordWrap: 'break-word', 
                  lineHeight: '1.2',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                    {event.reason}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>
                    {event.appointmentType}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '1px' }}>
                    {event.status}
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BigCalendarPatient;