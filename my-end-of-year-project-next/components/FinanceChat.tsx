"use client";

import Image from 'next/image';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
    {
        "name": "jan",
        "Income": 2000,
        "Expense": 9800,
        "amt": 2290
      } ,{
        "name": "feb",
        "Income": 2000,
        "Expense": 9800,
        "amt": 2290
      },
  {
    "name": "mar",
    "Income": 4000,
    "Expense": 2400,
    "amt": 2400
  },
  {
    "name": "Apr",
    "Income": 3000,
    "Expense": 1398,
    "amt": 2210
  },
  {
    "name": "may",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "jun",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "jul",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "aug",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "sep",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "oct",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "nov",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  },
  {
    "name": "dec",
    "Income": 2000,
    "Expense": 9800,
    "amt": 2290
  }
];

const FinanceChat = () => {
  return (
   
    <div className="bg-white w-full h-full p-4">
    <div className="flex justify-between items-center">
    <h1 className="text-lg font-semibold">Patient</h1>
    <Image src="/moreDark.png" alt="" width={20} height={20} />
</div>
<ResponsiveContainer width="100%" height="90%"  >
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3"  stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} 
          tickLine={false}
          tickMargin={10}/>
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend  align='center'
               verticalAlign='top' 
               wrapperStyle={{paddingTop: "10px", paddingBottom: "30px"}} />
          <Line type="monotone" dataKey="Expense" stroke="#8884d8" strokeWidth={2}/>
          <Line type="monotone" dataKey="Income" stroke="#82ca9d" strokeWidth={2}   />
        </LineChart>
      </ResponsiveContainer>
        </div>
     
   
  );
};

export default FinanceChat;
