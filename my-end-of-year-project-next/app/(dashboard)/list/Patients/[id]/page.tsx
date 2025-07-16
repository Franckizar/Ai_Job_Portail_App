"use client";
import { Announcements, Performance } from '@/components';
import BigCalendar from '@/components/GigCalender';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { useParams } from 'next/navigation';

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
  chronicConditions: string;
  currentMedications: string;
};

const SinglePatientPage = () => {
  const params = useParams();
  const patientId = params.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    fetch(`https://wambs-clinic.onrender.com/api/v1/auth/patient/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [patientId]);

  if (loading) return <Loader />;

  if (!patient) return <div className="p-8 text-center text-red-600">Patient not found.</div>;

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 xl:flex-row">
      {/* Left  */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* User INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={patient.photoUrl || "/default-user.png"}
                alt={patient.fullName}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{patient.fullName}</h1>
              <p className="text-sm text-gray-500">{patient.address}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{patient.bloodType}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{patient.dateOfBirth}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{patient.email}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{patient.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL INFO CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD: Appointments (static) */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/appointment.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">3</h1>
                <span className="text-sm text-gray-400">Appointments</span>
              </div>
            </div>
            {/* CARD: Medications */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/medication.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">
                  {patient.currentMedications ? patient.currentMedications.split(",").length : 0}
                </h1>
                <span className="text-sm text-gray-400">Medications</span>
              </div>
            </div>
            {/* CARD: Allergies */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/allergy.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">
                  {patient.allergies ? patient.allergies.split(",").length : 0}
                </h1>
                <span className="text-sm text-gray-400">Allergies</span>
              </div>
            </div>
            {/* CARD: Chronic Conditions */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/chronic.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">
                  {patient.chronicConditions ? patient.chronicConditions.split(",").length : 0}
                </h1>
                <span className="text-sm text-gray-400">Chronic Conditions</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="">Patient&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Medical History</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaPurpleLight">Doctors</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaYellowLight">Lab Results</Link>
            <Link href="/" className="p-3 rounded-md bg-pink-50">Prescriptions</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Appointments</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SinglePatientPage;
