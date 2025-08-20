// components/StatusItem.tsx
import React from 'react';

interface StatusItemProps {
  label: string;
  status: string;
  lastChecked: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status, lastChecked }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      ></div>
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-sm text-gray-500">{lastChecked}</span>
  </div>
);

export default StatusItem;