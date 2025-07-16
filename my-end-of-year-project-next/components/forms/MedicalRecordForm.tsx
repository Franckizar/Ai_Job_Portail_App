"use client";

import React, { useEffect, useState} from "react";

type Patient = {
  id: number;
  fullName: string;
  email: string;
};

type MedicalRecordFormProps = {
  patientId?: number;
  onSuccess?: () => void;
};

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientId,
  onSuccess,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    recordDate: "",
    type: "",
    details: "",
    followUpDate: "",
    chiefComplaint: "",
    medicalHistory: "",
    allergies: "",
    examinationNotes: "",
    xrayFindings: "",
    diagnosis: "",
    treatmentPlan: "",
    proceduresDone: "",
    lastUpdated: "",
    dentalHealthSummary: "",
    nextCheckupDate: "",
    oralHygieneInstructions: ""
  });

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/patient/all");
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Pre-select patient if patientId prop is provided
  useEffect(() => {
    if (patientId && patients.length > 0) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) setSelectedPatient(patient);
    }
  }, [patientId, patients]);

  // Handle patient select change
  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value || value === "") {
      setSelectedPatient(null);
      return;
    }
    const id = Number(value);
    if (isNaN(id)) return;
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  // Handle form field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use selectedPatient from state, or from patientId prop
    const patient = selectedPatient || patients.find(p => p.id === patientId);

    if (!patient) {
      alert("Please select a patient before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const url = `https://wambs-clinic.onrender.com/api/v1/auth/medical-records/create/patient/${patient.id}`;
      const dataToSend = {
        ...formData,
        patientId: patient.id
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert("Medical record created successfully!");
        setFormData({
          recordDate: "",
          type: "",
          details: "",
          followUpDate: "",
          chiefComplaint: "",
          medicalHistory: "",
          allergies: "",
          examinationNotes: "",
          xrayFindings: "",
          diagnosis: "",
          treatmentPlan: "",
          proceduresDone: "",
          lastUpdated: "",
          dentalHealthSummary: "",
          nextCheckupDate: "",
          oralHygieneInstructions: ""
        });
        if (!patientId) setSelectedPatient(null);
        onSuccess?.();
      } else {
        const errorText = await res.text();
        alert("Server error: " + errorText);
      }
    } catch (err) {
      alert("Network error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col gap-4 max-w-xl mx-auto bg-white rounded shadow"
    >
      <h2 className="text-lg font-bold mb-2">Create Medical Record</h2>

      {/* Patient selection */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Select Patient *</label>
        {loading ? (
          <select disabled className="p-2 border rounded">
            <option>Loading patients...</option>
          </select>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <select
            onChange={handlePatientSelect}
            className="p-2 border rounded"
            value={selectedPatient?.id || ""}
            required
            id="patient-select"
            disabled={!!patientId} // disables dropdown if patientId is set
          >
            <option value="">-- Select a patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.fullName} ({patient.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Display Selected Patient Info */}
      {selectedPatient && (
        <div className="p-2 bg-gray-100 rounded">
          <p><b>Selected Patient ID:</b> {selectedPatient.id}</p>
          <p><b>Name:</b> {selectedPatient.fullName}</p>
          <p><b>Email:</b> {selectedPatient.email}</p>
        </div>
      )}

      {/* Medical Record Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Record Date", name: "recordDate", type: "date" },
          { label: "Type", name: "type", type: "text" },
          { label: "Follow Up Date", name: "followUpDate", type: "date" },
          { label: "Chief Complaint", name: "chiefComplaint", type: "text" },
          { label: "Medical History", name: "medicalHistory", type: "text" },
          { label: "Allergies", name: "allergies", type: "text" },
          { label: "Examination Notes", name: "examinationNotes", type: "text" },
          { label: "X-ray Findings", name: "xrayFindings", type: "text" },
          { label: "Diagnosis", name: "diagnosis", type: "text" },
          { label: "Treatment Plan", name: "treatmentPlan", type: "text" },
          { label: "Procedures Done", name: "proceduresDone", type: "text" },
          { label: "Last Updated", name: "lastUpdated", type: "datetime-local" },
          { label: "Dental Health Summary", name: "dentalHealthSummary", type: "text" },
          { label: "Next Checkup Date", name: "nextCheckupDate", type: "date" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(formData as Record<string, string>)[field.name]}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
        ))}

        {/* Textarea field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Oral Hygiene Instructions</label>
          <textarea
            name="oralHygieneInstructions"
            value={formData.oralHygieneInstructions}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`mt-4 py-2 px-4 rounded transition ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {submitting ? "Creating..." : "Create Medical Record"}
      </button>
    </form>
  );
};

export default MedicalRecordForm;
