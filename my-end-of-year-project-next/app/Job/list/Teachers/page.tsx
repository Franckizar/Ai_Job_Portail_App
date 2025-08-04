"use client";

import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { teachersData as rawTeachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

// Helper to get role from localStorage (type-safe)
function getRoleFromLocalStorage(): "admin" | "patient" | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payloadJson = atob(padded);
    const payload = JSON.parse(payloadJson);
    if (Array.isArray(payload.roles)) {
      if (payload.roles.includes("ADMIN")) return "admin";
      if (payload.roles.includes("PATIENT")) return "patient";
    }
    return null;
  } catch {
    return null;
  }
}

// Raw data type (matches your /lib/data)
type RawTeacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
  // info missing in raw, so we add it below
};

// Final, type-safe Teacher type
type Teacher = {
  id: number;
  info: string;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
};

// Map and add info field for each teacher
const teachersData: Teacher[] = rawTeachersData.map((item: RawTeacher) => ({
  ...item,
  info: `${item.name} (${item.teacherId})`,
}));

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const TeacherListPage: React.FC = () => {
  const [role, setRole] = useState<"admin" | "patient" | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
  }, []);

  const renderRow = (item: Teacher) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors'>
      <td className='flex items-center gap-4 p-4'>
        <Image src={item.photo} alt={item.info} width={40} height={40} className='md:hidden xl:block w-10 h-10 rounded-full object-cover' />
        <div className="flex flex-col">
          <h3 className='font-semibold'>{item.name}</h3>
          <p className='text-xs text-gray-500'>{item?.email}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>{item.teacherId}</td>
      <td className='hidden md:table-cell'>{item.subjects.join(", ")}</td>
      <td className='hidden md:table-cell'>{item.classes.join(", ")}</td>
      <td className='hidden lg:table-cell'>{item.phone}</td>
      <td className='hidden lg:table-cell'>{item.address}</td>
      <td>
        <div className='flex item-center gap-2'>
          <Link href={`/List/teachers/${item.id}`} className='text-blue-500 hover:underline'>
            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table='teacher' type='delete' id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 '>
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className='hidden md:block text-lg font-semibold'>All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src="/filter.png" alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src="/sort.png" alt='' width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table='teacher' type='create' />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachersData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
