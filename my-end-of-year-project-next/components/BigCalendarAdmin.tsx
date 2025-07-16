"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";

// Custom CSS to make everything static and non-scrollable
const calendarStyles = `
  .rbc-calendar {
    overflow: hidden !important;
    max-width: 100% !important;
    height: 100% !important;
  }
  .rbc-time-view {
    overflow: hidden !important;
    height: 100% !important;
  }
  .rbc-time-content {
    overflow: hidden !important;
    height: 100% !important;
  }
  .rbc-time-header {
    overflow: hidden !important;
  }
  .rbc-allday-cell {
    display: none !important;
  }
  .rbc-time-gutter {
    overflow: hidden !important;
  }
  .rbc-events-container {
    overflow: hidden !important;
  }
  body {
    overflow: hidden !important;
  }
  html {
    overflow: hidden !important;
  }
`;

const localizer = momentLocalizer(moment);

type AppointmentDTO = {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
  reason: string;
};

type AppointmentEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
  reason: string;
};

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/appointments/all", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        const data: AppointmentDTO[] = await response.json();

        // Map the data to calendar events, including status in the title
        const mappedEvents: AppointmentEvent[] = data.map((appt) => ({
          id: appt.id,
          title: `${appt.title || appt.reason || "Appointment"} (${appt.status})`,
          start: new Date(appt.start),
          end: new Date(appt.end),
          status: appt.status,
          reason: appt.reason,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
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

  // Custom event style based on status
  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = '#3174ad';

    switch (event.status) {
      case 'PENDING':
        backgroundColor = '#f39c12';
        break;
      case 'CONFIRMED':
        backgroundColor = '#27ae60';
        break;
      case 'CANCELLED':
        backgroundColor = '#e74c3c';
        break;
      case 'COMPLETED':
        backgroundColor = '#2c3e50';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.85,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Error loading appointments</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
      <div className="h-screen w-screen overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WORK_WEEK, Views.DAY, Views.WEEK]} // Added MONTH view here
          view={view}
          onView={handleViewChange}
          style={{ 
            height: "100vh", 
            width: "100vw",
            overflow: "hidden"
          }}
          eventPropGetter={eventStyleGetter}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
          max={new Date(0, 0, 0, 17, 0, 0)} // 5:00 PM
          step={60}
          timeslots={1}
          defaultDate={new Date()}
          popup={false}
          tooltipAccessor={(event) => 
            `Title: ${event.title}\nReason: ${event.reason}\nStatus: ${event.status}`
          }
          onSelectEvent={(event) => {
            alert(`Appointment: ${event.title}\nReason: ${event.reason}\nStatus: ${event.status}`);
          }}
          formats={{
            dayHeaderFormat: (date, culture, localizer) =>
              localizer?.format(date, 'ddd', culture) || '',
            timeGutterFormat: (date, culture, localizer) =>
              localizer?.format(date, 'HH:mm', culture) || '',
          }}
        />
      </div>
    </>
  );
};

export default BigCalendar;