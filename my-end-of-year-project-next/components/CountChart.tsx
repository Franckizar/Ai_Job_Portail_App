"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = () => {
  const [data, setData] = useState([
    { name: "Total", count: 0, fill: "white" },
    { name: "FEMALE", count: 0, fill: "#FAE27C" },
    { name: "MALE", count: 0, fill: "#C3EBFA" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://wambs-clinic.onrender.com/api/v1/auth/patient/patient-gender-count")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {
        setData([
          { name: "Total", count: 0, fill: "white" },
          { name: "FEMALE", count: 0, fill: "#FAE27C" },
          { name: "MALE", count: 0, fill: "#C3EBFA" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  // Find counts by name
  const total = data.find(d => d.name === "Total")?.count ?? 0;
  const maleCount = data.find(d => d.name === "MALE")?.count ?? 0;
  const femaleCount = data.find(d => d.name === "FEMALE")?.count ?? 0;

  // Calculate percentages
  const malePercent = total ? Math.round((maleCount / total) * 100) : 0;
  const femalePercent = total ? Math.round((femaleCount / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Patients</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5" style={{ background: "#C3EBFA", borderRadius: "9999px" }} />
          <h1 className="font-bold">{maleCount}</h1>
          <h2 className="text-xs text-gray-300">
            MALE ({malePercent}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5" style={{ background: "#FAE27C", borderRadius: "9999px" }} />
          <h1 className="font-bold">{femaleCount}</h1>
          <h2 className="text-xs text-gray-300">
            FEMALE ({femalePercent}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
