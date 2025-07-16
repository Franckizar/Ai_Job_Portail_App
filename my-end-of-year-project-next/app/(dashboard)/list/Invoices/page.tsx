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
import { CheckCircle2, Clock, AlertCircle, XCircle, Filter, ArrowUpDown, Plus } from "lucide-react";

type Invoice = {
  id: number;
  appointment_id?: number | null;
  patient_id: number;
  date_issued: string;
  due_date: string;
  total_amount: number;
  status: string;
};

const columns = [
  { header: "Invoice ID", accessor: "id" },
  { header: "Patient ID", accessor: "patient_id" },
  { header: "Appointment ID", accessor: "appointment_id", className: "hidden md:table-cell" },
  { header: "Date Issued", accessor: "date_issued", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "due_date", className: "hidden lg:table-cell" },
  { header: "Amount", accessor: "total_amount", className: "hidden lg:table-cell" },
  { header: "Status", accessor: "status", className: "hidden xl:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const statusStyles = {
  paid: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
    border: "border-green-200"
  },
  unpaid: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
    border: "border-yellow-200"
  },
  payment_error: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <AlertCircle className="h-4 w-4" />,
    border: "border-red-200"
  },
  payment_failed: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <XCircle className="h-4 w-4" />,
    border: "border-red-200"
  },
  default: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    icon: <Clock className="h-4 w-4" />,
    border: "border-gray-200"
  }
};

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/invoices/all")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('paid') && !lowerStatus.includes('unpaid')) {
      return statusStyles.paid;
    } else if (lowerStatus.includes('unpaid')) {
      return statusStyles.unpaid;
    } else if (lowerStatus.includes('error')) {
      return statusStyles.payment_error;
    } else if (lowerStatus.includes('failed')) {
      return statusStyles.payment_failed;
    }
    return statusStyles.default;
  };

  const renderRow = (item: Invoice) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <tr
        key={item.id}
        className={`border-b ${statusStyle.border} hover:bg-blue-50/50 transition-colors`}
      >
        <td className="p-4 font-medium text-gray-900">#{item.id}</td>
        <td className="text-gray-600">P-{item.patient_id}</td>
        <td className="hidden md:table-cell text-gray-600">
          {item.appointment_id ? `A-${item.appointment_id}` : "N/A"}
        </td>
        <td className="hidden md:table-cell text-gray-600">
          {formatDate(item.date_issued)}
        </td>
        <td className="hidden lg:table-cell text-gray-600">
          {formatDate(item.due_date)}
        </td>
        <td className="hidden lg:table-cell font-medium">
          {formatCurrency(item.total_amount)}
        </td>
        <td className="hidden xl:table-cell">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.icon}
            <span className="ml-1 capitalize">{item.status.toLowerCase().replace('_', ' ')}</span>
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Link 
              href={`/list/invoice/${item.id}`} 
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="View details"
            >
              <Image src="/view.png" alt="View" width={16} height={16} />
            </Link>
            {role === "admin" && (
              <>
                <FormModal 
                  table="invoices" 
                  type="update" 
                  data={item} 
                  className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                />
                <FormModal 
                  table="invoices" 
                  type="delete" 
                  id={item.id}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-500 mt-1">
            {invoices.length} invoices found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <TableSearch placeholder="Search invoices..." />
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Filter"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button 
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Sort"
            >
              <ArrowUpDown className="h-5 w-5" />
            </button>
            {role === "admin" && (
              <FormModal 
                table="invoices" 
                type="create"
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Invoice</span>
              </FormModal>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table columns={columns} renderRow={renderRow} data={invoices} />
          </div>
          {/* Pagination */}
          <div className="mt-6">
            <Pagination />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceListPage;
