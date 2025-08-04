"use client";
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { getRoleFromLocalStorage } from "@/jwt";

type Appointment = {
  id: number;
  startTime: string;
  endTime: string;
  reason: string;
  appointmentType: string;
  status: string;
  bookedBy?: string;
};

const columns = [
  { header: "Start Time", accessor: "startTime" },
  { header: "End Time", accessor: "endTime" },
  { header: "Reason", accessor: "reason" },
  { header: "Type", accessor: "appointmentType", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/appoint/all")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderRow = (item: Appointment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-blue-50 transition-colors"
    >
      <td className="p-4">{new Date(item.startTime).toLocaleString()}</td>
      <td>{new Date(item.endTime).toLocaleString()}</td>
      <td>{item.reason}</td>
      <td className="hidden md:table-cell">{item.appointmentType}</td>
      <td className="hidden lg:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/appoint/${item.id}`} className="text-blue-500 hover:underline">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button>
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
        <h1 className="hidden md:block text-lg font-semibold">All Appointments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/plus.png" alt="" width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={appointments} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AppointmentListPage;
