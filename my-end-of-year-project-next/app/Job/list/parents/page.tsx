import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import React from 'react'
import { invoicesData, Invoice } from './invoicesData'

// Example role (replace with your auth logic)
const role = 'admin'

// Table columns
const columns = [
  { header: 'Invoice ID', accessor: 'id' },
  { header: 'Patient ID', accessor: 'patient_id', className: 'hidden md:table-cell' },
  { header: 'Appointment ID', accessor: 'appointment_id', className: 'hidden md:table-cell' },
  { header: 'Date Issued', accessor: 'date_issued', className: 'hidden lg:table-cell' },
  { header: 'Due Date', accessor: 'due_date', className: 'hidden lg:table-cell' },
  { header: 'Total Amount', accessor: 'total_amount' },
  { header: 'Status', accessor: 'status', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'actions' },
]

// Row renderer
const renderRow = (item: Invoice) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors"
  >
    <td className="p-4 font-semibold">{item.id}</td>
    <td className="hidden md:table-cell">{item.patient_id}</td>
    <td className="hidden md:table-cell">{item.appointment_id ?? 'N/A'}</td>
    <td className="hidden lg:table-cell">{item.date_issued}</td>
    <td className="hidden lg:table-cell">{item.due_date}</td>
    <td>{item.total_amount.toFixed(2)}</td>
    <td className="hidden md:table-cell">{item.status}</td>
    <td>
      <div className="flex items-center gap-2">
        <FormModal table="invoices" type="update" data={item} />
        <FormModal table="invoices" type="delete" id={item.id} />
      </div>
    </td>
  </tr>
)

// Main Invoice List Page
const InvoiceListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold">All Invoices</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table="invoices" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={invoicesData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default InvoiceListPage
