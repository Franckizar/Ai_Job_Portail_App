"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';

type Patient = {
  id: number;
  fullName: string;
  email: string;
};

type Service = {
  id: number;
  serviceName: string;
  serviceCode: string;
  basePrice: number;
};

const schema = z.object({
  appointment_id: z.union([z.string().min(1), z.literal('')]).optional(),
  patient_id: z.string().min(1, { message: "Patient is required" }),
  date_issued: z.string().min(1, { message: "Date issued is required" }),
  due_date: z.string().min(1, { message: "Due date is required" }),
  total_amount: z.string().min(1, { message: "Total amount is required" }),
  status: z.enum(["Pending", "Paid", "Cancelled"], { message: "Status is required" }),
  payment_method: z.string().min(1, { message: "Payment method is required" }),
  items: z.array(
    z.object({
      serviceId: z.number().min(1, { message: "Service is required" }),
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
      unitPrice: z.number().min(0.01, { message: "Price must be positive" }),
    })
  ).min(1, { message: "At least one service item is required" })
});

type Inputs = z.infer<typeof schema>;
type InvoiceItem = Inputs["items"][number];

type InvoiceFormProps = {
  type: "create" | "update";
  data?: Record<string, unknown>;
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ type, data }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState({ patients: true, services: true });
  const [error, setError] = useState({ patients: null as string | null, services: null as string | null });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointment_id: data?.appointment_id?.toString() ?? "",
      patient_id: data?.patient_id?.toString() ?? "",
      date_issued: (data?.date_issued as string) ?? "",
      due_date: (data?.due_date as string) ?? "",
      total_amount: data?.total_amount?.toString() ?? "",
      status:
        data?.status === "Pending" ||
        data?.status === "Paid" ||
        data?.status === "Cancelled"
          ? (data.status as "Pending" | "Paid" | "Cancelled")
          : "Pending",
      payment_method: (data?.payment_method as string) ?? "CASH",
      items: data?.items
        ? (data.items as InvoiceItem[]).map((item: InvoiceItem) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice)
          }))
        : [{ serviceId: 0, quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Fetch patients and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsResponse = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/patient/all");
        if (!patientsResponse.ok) throw new Error("Failed to fetch patients");
        setPatients(await patientsResponse.json());

        const servicesResponse = await fetch("https://wambs-clinic.onrender.com/api/v1/auth/services/all");
        if (!servicesResponse.ok) throw new Error("Failed to fetch services");
        setServices(await servicesResponse.json());

        setLoading({ patients: false, services: false });
      } catch (err) {
        setError({
          patients: err instanceof Error ? err.message : "Failed to load patients",
          services: err instanceof Error ? err.message : "Failed to load services"
        });
        setLoading({ patients: false, services: false });
      }
    };
    fetchData();
  }, []);

  // Calculate total amount when items change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith("items") || name === "items") {
        const total = value.items?.reduce((sum, item) => sum + (item?.quantity || 0) * (item?.unitPrice || 0), 0) || 0;
        setValue("total_amount", total.toFixed(2));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleServiceChange = (index: number, serviceId: number) => {
    const selectedService = services.find(s => s.id === serviceId);
    if (selectedService) {
      setValue(`items.${index}.unitPrice`, selectedService.basePrice);
      setValue(`items.${index}.serviceId`, serviceId);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      dateIssued: formData.date_issued,
      dueDate: formData.due_date,
      totalAmount: Number(formData.total_amount),
      status: formData.status.toUpperCase(),
      paymentMethod: formData.payment_method.toUpperCase(),
      transactionId: null,
      paymentDate: null,
      items: formData.items.map((item: InvoiceItem) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    try {
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/invoices/create/patient/${formData.patient_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create invoice");
      }
      const result = await response.json();
      console.log("Invoice created successfully:", result);
      // TODO: Handle success (redirect, show message, etc.)
    } catch (err) {
      console.error("Error creating invoice:", err);
      // TODO: Show error to user
    }
  });

  return (
    <form 
      className="flex flex-col gap-8 p-8 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto" 
      onSubmit={onSubmit}
      style={{ minWidth: '800px' }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {type === "create" ? "Create New Invoice" : "Update Invoice"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left Column */}
        <div className="space-y-6 w-full">
          <InputField 
            label="Appointment ID (optional)" 
            name="appointment_id" 
            type="number"
            defaultValue={data?.appointment_id?.toString() ?? ""}
            register={register}
            error={errors.appointment_id}
            className="text-lg"
            inputClassName="h-14 text-lg px-4 w-full"
          />
          <div className="flex flex-col gap-2 w-full">
            <label className="text-lg font-medium text-gray-700">Patient</label>
            {loading.patients ? (
              <select disabled className="border-2 border-gray-300 rounded-lg p-3 bg-gray-100 text-lg h-14 w-full px-4">
                <option>Loading patients...</option>
              </select>
            ) : error.patients ? (
              <div className="text-red-500 text-lg">{error.patients}</div>
            ) : (
              <select
                {...register("patient_id")}
                className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
                defaultValue={data?.patient_id?.toString() ?? ""}
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id} className="py-2">
                    {patient.fullName} ({patient.email})
                  </option>
                ))}
              </select>
            )}
            {errors.patient_id?.message && (
              <p className="text-lg text-red-600 mt-1">{errors.patient_id.message}</p>
            )}
          </div>
          <InputField 
            label="Date Issued" 
            name="date_issued" 
            type="date"
            defaultValue={data?.date_issued as string ?? ""}
            register={register}
            error={errors.date_issued}
            className="text-lg"
            inputClassName="h-14 text-lg px-4 w-full"
          />
          <InputField 
            label="Due Date" 
            name="due_date" 
            type="date"
            defaultValue={data?.due_date as string ?? ""}
            register={register}
            error={errors.due_date}
            className="text-lg"
            inputClassName="h-14 text-lg px-4 w-full"
          />
        </div>
        {/* Right Column */}
        <div className="space-y-6 w-full">
          <InputField 
            label="Total Amount ($)" 
            name="total_amount" 
            type="number"
            step="0.01"
            defaultValue={data?.total_amount?.toString() ?? ""}
            register={register}
            error={errors.total_amount}
            disabled
            className="text-lg"
            inputClassName="h-14 text-lg px-4 w-full bg-gray-100"
          />
          <div className="flex flex-col gap-2 w-full">
            <label className="text-lg font-medium text-gray-700">Status</label>
            <select 
              {...register("status")} 
              className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
              defaultValue={
                data?.status === "Pending" ||
                data?.status === "Paid" ||
                data?.status === "Cancelled"
                  ? data.status
                  : "Pending"
              }
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status?.message && (
              <p className="text-lg text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-lg font-medium text-gray-700">Payment Method</label>
            <select 
              {...register("payment_method")} 
              className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
              defaultValue={data?.payment_method as string ?? "CASH"}
            >
              <option value="CASH">Cash</option>
              <option value="CAMPAY">Campay</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
            {errors.payment_method?.message && (
              <p className="text-lg text-red-600 mt-1">{errors.payment_method.message}</p>
            )}
          </div>
        </div>
      </div>
      {/* Service Items Section */}
      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800">Service Items</h2>
          <button
            type="button"
            onClick={() => append({ serviceId: 0, quantity: 1, unitPrice: 0 })}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            + Add Service Item
          </button>
        </div>
        {loading.services ? (
          <div className="text-center py-6 text-xl w-full">Loading services...</div>
        ) : error.services ? (
          <div className="text-red-500 text-center py-6 text-xl w-full">{error.services}</div>
        ) : (
          <div className="space-y-6 w-full">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-end p-6 border-2 border-gray-200 rounded-xl w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">Service</label>
                  <select
                    className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
                    value={field.serviceId}
                    onChange={(e) => handleServiceChange(index, Number(e.target.value))}
                  >
                    <option value={0}>Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id} className="py-2">
                        {service.serviceName} (${service.basePrice})
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.serviceId?.message && (
                    <p className="text-lg text-red-600 mt-1">{errors.items[index]?.serviceId?.message}</p>
                  )}
                </div>
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-lg font-medium text-gray-700">Quantity</label>
                      <input
                        {...field}
                        type="number"
                        min={1}
                        className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      {errors.items?.[index]?.quantity?.message && (
                        <p className="text-lg text-red-600 mt-1">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name={`items.${index}.unitPrice`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-lg font-medium text-gray-700">Unit Price ($)</label>
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 w-full px-4"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      {errors.items?.[index]?.unitPrice?.message && (
                        <p className="text-lg text-red-600 mt-1">{errors.items[index]?.unitPrice?.message}</p>
                      )}
                    </div>
                  )}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg flex items-center justify-center h-14"
                >
                  Remove
                </button>
              </div>
            ))}
            {errors.items?.message && (
              <p className="text-lg text-red-600">{errors.items.message}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-10 w-full">
        <button
          type="submit"
          className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl font-medium"
        >
          {type === "create" ? "Create Invoice" : "Update Invoice"}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
