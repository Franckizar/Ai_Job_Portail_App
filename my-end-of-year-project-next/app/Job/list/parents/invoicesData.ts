// app/(dashboard)/list/parents/invoicesData.ts

export type Invoice = {
  id: number
  appointment_id?: number | null
  patient_id: number
  date_issued: string
  due_date: string
  total_amount: number
  status: string
}

export const invoicesData: Invoice[] = [
  {
    id: 1,
    appointment_id: null,
    patient_id: 101,
    date_issued: '2025-06-25',
    due_date: '2025-07-05',
    total_amount: 150.0,
    status: 'Pending',
  },
  {
    id: 2,
    appointment_id: 55,
    patient_id: 102,
    date_issued: '2025-06-20',
    due_date: '2025-06-30',
    total_amount: 200.0,
    status: 'Paid',
  },
  // ...more invoices
]
