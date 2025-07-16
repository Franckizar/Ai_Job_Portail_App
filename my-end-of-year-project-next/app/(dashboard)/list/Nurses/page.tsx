"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { getRoleFromLocalStorage } from "@/jwt";

// Type for a nurse as returned by the backend
type NurseApi = {
  id: number;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  department: string | null;
  licenseNumber: string;
  shift: string | null;
  contactNumber: string;
  photoUrl: string | null;
  officeNumber: string | null;
  yearsOfExperience: number | null;
  languagesSpoken: string | null;
  fullName?: string;
  email?: string;
};

// Type for display in the table (flattened)
type Nurse = {
  id: number;
  fullName: string;
  email: string;
  department: string;
  licenseNumber: string;
  shift: string;
  contactNumber: string;
  photoUrl: string | null;
  officeNumber: string;
  yearsOfExperience: number | null;
  languagesSpoken: string | null;
};

const columns = [
  { header: "Photo", accessor: "photo" },
  { header: "Name", accessor: "fullName" },
  { header: "Email", accessor: "email", className: "hidden md:table-cell" },
  { header: "Department", accessor: "department", className: "hidden md:table-cell" },
  { header: "Shift", accessor: "shift", className: "hidden lg:table-cell" },
  { header: "Phone", accessor: "contactNumber", className: "hidden lg:table-cell" },
  { header: "Experience", accessor: "yearsOfExperience", className: "hidden xl:table-cell" },
  { header: "Languages", accessor: "languagesSpoken", className: "hidden xl:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const NurseListPage = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "patient" | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/nurse/all")
      .then((res) => res.json())
      .then((data: NurseApi[]) => {
        // Flatten and normalize data for display
        const nurses: Nurse[] = data.map((nurse) => ({
          id: nurse.id,
          fullName:
            nurse.fullName ||
            (nurse.user
              ? `${nurse.user.firstname} ${nurse.user.lastname}`
              : "—"),
          email: nurse.email || (nurse.user ? nurse.user.email : "—"),
          department: nurse.department || "—",
          licenseNumber: nurse.licenseNumber || "—",
          shift: nurse.shift || "—",
          contactNumber: nurse.contactNumber || "—",
          photoUrl: nurse.photoUrl,
          officeNumber: nurse.officeNumber || "—",
          yearsOfExperience:
            nurse.yearsOfExperience !== null ? nurse.yearsOfExperience : null,
          languagesSpoken: nurse.languagesSpoken || "—",
        }));
        setNurses(nurses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderRow = (item: Nurse) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-blue-50 transition-colors"
    >
      <td className="p-4">
        <Image
          src={item.photoUrl || "/default-user.png"}
          alt={item.fullName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td>{item.fullName}</td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.department}</td>
      <td className="hidden lg:table-cell">{item.shift}</td>
      <td className="hidden lg:table-cell">{item.contactNumber}</td>
      <td className="hidden xl:table-cell">
        {item.yearsOfExperience !== null ? `${item.yearsOfExperience} yrs` : "—"}
      </td>
      <td className="hidden xl:table-cell">
        <span className="truncate block max-w-[120px]" title={item.languagesSpoken || "—"}>
          {item.languagesSpoken}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/Nurse/${item.id}`} className="text-blue-500 hover:underline">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="nurse" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {loading && <Loader />}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Nurses</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="nurse" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={nurses} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default NurseListPage;
