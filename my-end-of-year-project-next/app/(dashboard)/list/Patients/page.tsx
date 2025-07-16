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

type Patient = {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  bloodType: string;
  allergies: string;
  photoUrl: string | null;
};

const columns = [
  { header: "Photo", accessor: "photo" },
  { header: "Name", accessor: "fullName" },
  { header: "Email", accessor: "email", className: "hidden md:table-cell" },
  { header: "DOB", accessor: "dateOfBirth", className: "hidden md:table-cell" },
  { header: "Gender", accessor: "gender", className: "hidden lg:table-cell" },
  { header: "Phone", accessor: "phoneNumber", className: "hidden lg:table-cell" },
  { header: "Blood Type", accessor: "bloodType", className: "hidden xl:table-cell" },
  { header: "Allergies", accessor: "allergies", className: "hidden xl:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const PatientListPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/patient/all")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderRow = (item: Patient) => (
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
      <td className="hidden md:table-cell">{item.dateOfBirth}</td>
      <td className="hidden lg:table-cell">{item.gender}</td>
      <td className="hidden lg:table-cell">{item.phoneNumber}</td>
      <td className="hidden xl:table-cell">{item.bloodType}</td>
      <td className="hidden xl:table-cell">
        <span className="truncate block max-w-[120px]" title={item.allergies}>
          {item.allergies}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/Patient/${item.id}`} className="text-blue-500 hover:underline">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="patients" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Patients</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="patients" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={patients} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default PatientListPage;
