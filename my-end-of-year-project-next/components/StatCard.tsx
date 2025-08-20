// components/StatCard.tsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, isCurrency = false }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">
          {isCurrency ? `${value} XAF` : value}
        </p>
      </div>
      <div className={`p-2 rounded-lg ${change >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {icon}
      </div>
    </div>
    <div className={`flex items-center mt-3 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change >= 0 ? (
        <ArrowUp className="h-4 w-4 mr-1" />
      ) : (
        <ArrowDown className="h-4 w-4 mr-1" />
      )}
      <span>{Math.abs(change)}% from last period</span>
    </div>
  </div>
);

export default StatCard;