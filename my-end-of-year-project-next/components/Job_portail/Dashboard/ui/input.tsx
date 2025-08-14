// components/Job_portail/Dashboard/ui/input.tsx
'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  error = false, 
  className = '', 
  ...props 
}) => {
  return (
    <input
      className={`block w-full rounded-md border ${
        error ? 'border-red-300' : 'border-gray-300'
      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${
        className
      }`}
      {...props}
    />
  );
};