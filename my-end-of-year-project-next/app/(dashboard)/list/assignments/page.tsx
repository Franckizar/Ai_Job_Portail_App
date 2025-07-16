"use client";

import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { assignmentsData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// --- Role helper ---
function getRoleFromLocalStorage(): "admin" | "patient" | null {
  if (typeof window === "undefined") return null; // SSR safety

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT format: header.payload.signature
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    // Add padding if needed for base64
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const payloadJson = atob(padded);
    const payload: { roles?: string[] } = JSON.parse(payloadJson);

    if (Array.isArray(payload.roles)) {
      if (payload.roles.includes("ADMIN")) return "admin";
      if (payload.roles.includes("PATIENT")) return "patient";
    }
    return null;
  } catch {
    return null;
  }
}

// --- Types ---
type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  duedate: string; // Table expects 'duedate'
};

type RawAssignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

// --- Columns ---
const columns: Array<{
  header: string;
  accessor: keyof Assignment | "actions";
  className?: string;
}> = [
  { header: "Subject Name", accessor: "subject" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "duedate", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "actions" },
];

// --- Main Page ---
const AssignmentListPage: React.FC = () => {
  const [role, setRole] = useState<"admin" | "patient" | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
  }, []);

  // Map assignmentsData (with 'dueDate') to Assignment[] (with 'duedate')
  const fixedAssignmentsData: Assignment[] = (assignmentsData as RawAssignment[]).map((a) => ({
    id: a.id,
    subject: a.subject,
    class: a.class,
    teacher: a.teacher,
    duedate: a.dueDate,
  }));

  const renderRow = (item: Assignment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors"
    >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{item.duedate}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/List/teachers/${item.id}`} className="text-blue-500 hover:underline">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/edit.png" alt="Edit" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
              <Image src="/delete.png" alt="Delete" width={16} height={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/plus.png" alt="Add" width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={fixedAssignmentsData} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AssignmentListPage;
