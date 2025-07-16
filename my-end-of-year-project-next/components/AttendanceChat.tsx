"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AttendanceChat = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch attendance data from backend
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/doctor/stats/weekly")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        console.log("[AttendanceChat] Data fetched:", resData);
      })
      .catch(err => {
        console.error("[AttendanceChat] Fetch error:", err);
        setData([]);
      });
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20}/>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius:"10px",borderColor:"lightgray"}} />
          <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop: "20px", paddingBottom: "40px"}} />
          <Bar dataKey="Absent" fill="#FAE27C" legendType='circle' radius={[8,8,0,0]} />
          <Bar dataKey="present" fill="#C3EBFA" legendType='circle' radius={[8,8,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceChat;
