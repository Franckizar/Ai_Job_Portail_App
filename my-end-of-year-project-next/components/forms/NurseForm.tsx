"use client";
import React, { useState } from "react";

type NurseFormProps = {
  type: "create" | "update";
  data?: {
    fullName?: string;
    email?: string;
    [key: string]: unknown;
  };
};

const NurseForm: React.FC<NurseFormProps> = ({ type, data }) => {
  const [formData, setFormData] = useState({
    fullName: data?.fullName ?? "",
    email: data?.email ?? "",
    // Add more fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add your submit logic here (API call, validation, etc.)
    alert(
      `${type === "create" ? "Creating" : "Updating"} nurse: ${formData.fullName} (${formData.email})`
    );
  };

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-2">
        {type === "create" ? "Add Nurse" : "Update Nurse"}
      </h2>
      <input
        className="border p-2 rounded"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        name="fullName"
        required
      />
      <input
        className="border p-2 rounded"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        name="email"
        type="email"
        required
      />
      {/* Add more fields as needed */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default NurseForm;
