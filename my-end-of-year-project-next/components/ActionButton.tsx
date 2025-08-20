// components/ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, color }) => (
  <button
    className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-opacity`}
  >
    <div className="p-2 rounded-full bg-white/50">{icon}</div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </button>
);

export default ActionButton;