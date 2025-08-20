// components/ActivityItem.tsx
import React from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex-shrink-0 mt-1">{activity.icon}</div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
      <p className="text-sm text-gray-500 truncate">{activity.description}</p>
    </div>
    <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400">
      <Clock className="h-3 w-3" />
      <span>{activity.time}</span>
    </div>
  </div>
);

export default ActivityItem;