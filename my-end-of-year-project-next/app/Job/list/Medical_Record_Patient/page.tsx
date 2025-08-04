"use client";
import React, { useEffect, useState } from "react";

// Helper to extract patient ID from JWT
function getPatientIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded.patient_id || decoded.patientId || null;
  } catch {
    return null;
  }
}

type MedicalRecord = {
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

const MedicalRecordCard = ({ record }: { record: MedicalRecord }) => (
  <div
    className="w-full max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl border border-blue-200 flex flex-col md:flex-row p-10 gap-8"
    style={{ minHeight: "500px" }} // <-- Moderate height
  >
    <div className="flex-shrink-0 flex flex-col items-center justify-start w-full md:w-72">
      <div className="bg-blue-600 text-white rounded-xl h-20 w-20 flex items-center justify-center text-4xl font-bold mb-4">
        {record.type[0]}
      </div>
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{record.type}</h2>
      <p className="text-gray-500 text-sm mb-2">Record Date: {record.recordDate}</p>
      <div className="bg-blue-50 rounded px-4 py-2 mb-2">
        <span className="font-semibold text-blue-700">Next Checkup:</span>
        <span className="ml-2 text-blue-900">{record.nextCheckupDate}</span>
      </div>
      <div className="bg-green-50 rounded px-4 py-2">
        <span className="font-semibold text-green-700">Follow-up:</span>
        <span className="ml-2 text-green-900">{record.followUpDate}</span>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Chief Complaint:</span>
          <span className="ml-2 text-gray-800">{record.chiefComplaint}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Diagnosis:</span>
          <span className="ml-2 text-blue-700">{record.diagnosis}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Details:</span>
          <span className="ml-2 text-gray-800">{record.details}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Examination Notes:</span>
          <span className="ml-2 text-gray-800">{record.examinationNotes}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">X-ray Findings:</span>
          <span className="ml-2 text-gray-800">{record.xrayFindings}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Treatment Plan:</span>
          <span className="ml-2 text-gray-800">{record.treatmentPlan}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Procedures Done:</span>
          <span className="ml-2 text-gray-800">{record.proceduresDone}</span>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Medical History:</span>
          <span className="ml-2 text-gray-800">{record.medicalHistory}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Allergies:</span>
          <span className="ml-2 text-gray-800">{record.allergies}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Dental Health Summary:</span>
          <span className="ml-2 text-gray-800">{record.dentalHealthSummary}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Oral Hygiene Instructions:</span>
          <span className="ml-2 text-gray-800">{record.oralHygieneInstructions}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Notes Last Updated:</span>
          <span className="ml-2 text-gray-600">{new Date(record.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
);

const MedicalRecordPatient = () => {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const patientId = getPatientIdFromToken(token);

    if (!patientId) {
      setError("Could not determine patient ID from login.");
      setLoading(false);
      return;
    }

    fetch(`https://wambs-clinic.onrender.com/api/v1/auth/medical-records/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch medical record.");
        return res.json();
      })
      .then((data) => setRecord(data))
      .catch(() => setError("Could not load medical record."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10 text-blue-600">Loading medical record...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!record) return <div className="text-center mt-10 text-gray-500">No medical record found.</div>;

  return <MedicalRecordCard record={record} />;
};

export default MedicalRecordPatient;
