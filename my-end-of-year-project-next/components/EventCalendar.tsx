"use client";

import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import React, { useState, useEffect } from 'react';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventType = {
  id: number;
  title: string;
  time: string;
  description: string;
  eventDateTime: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
};

type UnregisteredPatient = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [unregisteredPatients, setUnregisteredPatients] = useState<UnregisteredPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch events
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
      });

    // Fetch unregistered patients
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/users/unknown")
      .then(res => res.json())
      .then(data => {
        setUnregisteredPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching unregistered patients:", err);
        setLoading(false);
      });
  }, []);

  const handleAcceptPatient = async (patientId: number) => {
    setProcessingId(patientId);
    try {
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/patient/create/${patientId}/doctor/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            specialization: "Cardiology",
            licenseNumber: "DOC123456",
            hospitalAffiliation: "General Hospital",
            yearsOfExperience: 10,
            contactNumber: "+1234567890"
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to register patient');
      }

      // Remove the patient from the unregistered list
      setUnregisteredPatients(prev => 
        prev.filter(patient => patient.id !== patientId)
      );
    } catch (error) {
      console.error("Error accepting patient:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm'>
      <Calendar onChange={onChange} value={value} />
      
      {/* Events Section */}
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-xl font-semibold">Events</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {events.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No events found.</div>
          ) : (
            events.map(event => (
              <div
                className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
                key={event.id}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-gray-600">{event.title}</h1>
                  <span className="text-xs text-gray-400">
                    {event.time || new Date(event.eventDateTime).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-400 text-xs">{event.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Unregistered Patients Section */}
      <div className="flex items-center justify-between mt-8">
        <h1 className="text-xl font-semibold">Unregistered Patients</h1>
        <span className="text-xs text-gray-400">
          {unregisteredPatients.length} found
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {unregisteredPatients.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No unregistered patients found.</div>
        ) : (
          unregisteredPatients.map(patient => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 border-t-red-200 bg-red-50"
              key={patient.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-semibold text-gray-600">
                    {patient.firstname} {patient.lastname}
                  </h1>
                  <p className="text-xs text-gray-400">{patient.email}</p>
                </div>
                <button
                  onClick={() => handleAcceptPatient(patient.id)}
                  disabled={processingId === patient.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    processingId === patient.id
                      ? 'bg-blue-300 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {processingId === patient.id ? 'Processing...' : 'Accept as Patient'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
