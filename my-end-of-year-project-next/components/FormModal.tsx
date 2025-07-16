"use client";

import Image from "next/image";
import React, { useState } from "react";
import TeacherForm from "./forms/TeacherForm";
import InvoiceForm from "./forms/InvoiceForm";
import NurseForm from "./forms/NurseForm";
import MedicalRecordForm from "./forms/MedicalRecordForm";

type Props = {
  table:
    | "users"
    | "teacher"
    | "students"
    | "classes"
    | "subjects"
    | "parents"
    | "announcements"
    | "events"
    | "exams"
    | "invoices"
    | "results"
    | "nurse"
    | "medical_records"
    | "patients";
  type: "create" | "update" | "delete";
  data?: Record<string, unknown>;
  id?: number;
  className?: string;
  children?: React.ReactNode;
};

const FormModal: React.FC<Props> = ({
  table,
  type,
  data,
  id,
  className,
  children,
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const iconSize = type === "create" ? 16 : 14;

  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const getFormComponent = () => {
    if (type === "delete" && id) {
      return (
        <form className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium mb-4">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition-colors"
              onClick={() => {
                // Add your delete logic here
                console.log(`Deleting ${table} with id: ${id}`);
                setOpen(false);
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    // Only pass "create" or "update" to forms
    switch (table) {
      case "teacher":
        if (type === "create" || type === "update") {
          return <TeacherForm type={type} data={data} />;
        }
        return null;
      case "invoices":
        if (type === "create" || type === "update") {
          return <InvoiceForm type={type} data={data} />;
        }
        return null;
      case "nurse":
        if (type === "create" || type === "update") {
          return <NurseForm type={type} data={data} />;
        }
        return null;
      case "medical_records":
        return (
          <MedicalRecordForm
            patientId={id as number}
            onSuccess={() => setOpen(false)}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-red-500">
            No form implemented for <b>{table}</b>.
          </div>
        );
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor} hover:opacity-80 transition-opacity ${className || ""}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        {children ? (
          children
        ) : (
          <Image
            src={`/${type}.png`}
            alt={`${type} icon`}
            width={iconSize}
            height={iconSize}
          />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md relative w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-auto">
            {getFormComponent()}
            <button
              className="absolute top-4 right-4 hover:opacity-70 transition-opacity"
              onClick={() => setOpen(false)}
              type="button"
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
