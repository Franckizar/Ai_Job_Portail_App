"use client";
import { Announcements, Performance } from '@/components';
import BigCalendar from '@/components/GigCalender';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { useParams } from 'next/navigation';

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
  yearsOfExperience: number;
  languagesSpoken: string;
  bio: string;
};

const SingleNursePage = () => {
  const params = useParams();
  const nurseId = params.id;
  const [nurse, setNurse] = useState<Nurse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nurseId) return;
    fetch(`https://wambs-clinic.onrender.com/api/v1/auth/nurse/${nurseId}`)
      .then(res => res.json())
      .then(data => {
        setNurse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [nurseId]);

  if (loading) return <Loader />;
  if (!nurse) return <div className="p-8 text-center text-red-600">Nurse not found.</div>;

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
                src={nurse.photoUrl || "/default-user.png"}
                alt={nurse.fullName}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{nurse.fullName}</h1>
              <p className="text-sm text-gray-500">{nurse.bio}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/badge.png" alt="" width={14} height={14} />
                  <span>{nurse.licenseNumber}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{nurse.email}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{nurse.contactNumber}</span>
                </div>
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <Image src="/office.png" alt="" width={14} height={14} />
                  <span>{nurse.officeNumber}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL INFO CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD: Department */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/department.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{nurse.department}</h1>
                <span className="text-sm text-gray-400">Department</span>
              </div>
            </div>
            {/* CARD: Shift */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/shift.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{nurse.shift}</h1>
                <span className="text-sm text-gray-400">Shift</span>
              </div>
            </div>
            {/* CARD: Experience */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/experience.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{nurse.yearsOfExperience} yrs</h1>
                <span className="text-sm text-gray-400">Experience</span>
              </div>
            </div>
            {/* CARD: Languages */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/languages.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">
                  {nurse.languagesSpoken ? nurse.languagesSpoken.split(",").length : 0}
                </h1>
                <span className="text-sm text-gray-400">Languages</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="">Nurse&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Assigned Patients</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaPurpleLight">Department Info</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaYellowLight">Shift Calendar</Link>
            <Link href="/" className="p-3 rounded-md bg-pink-50">Performance</Link>
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Contact Admin</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleNursePage;
