// components/ActionButton.tsx
import React from 'react';
import Link from 'next/link';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  href?: string; // Add href prop for navigation
  onClick?: () => void; // Keep onClick for other actions
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  color, 
  href,
  onClick 
}) => {
  // If href is provided, use Link wrapper
  if (href) {
    return (
      <Link href={href} className="block">
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-opacity cursor-pointer`}
        >
          <div className="p-2 rounded-full bg-white/50">{icon}</div>
          <span className="mt-2 text-sm font-medium">{label}</span>
        </div>
      </Link>
    );
  }

  // Otherwise, use button with onClick
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-opacity`}
    >
      <div className="p-2 rounded-full bg-white/50">{icon}</div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
  );
};

export default ActionButton;