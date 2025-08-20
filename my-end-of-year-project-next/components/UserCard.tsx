// components/UserCard.tsx
'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface UserCardProps {
  type: string;
  endpoint: string;
  isCurrency?: boolean; // Added to handle currency formatting
}

const UserCard: React.FC<UserCardProps> = ({ type, endpoint, isCurrency = false }) => {
  const [count, setCount] = useState<number | null>(null);

  // Log the props for debugging
  console.log(`[UserCard] Props:`, { type, endpoint, isCurrency });

  useEffect(() => {
    if (!endpoint) {
      console.error(`[UserCard] No endpoint provided for ${type}`);
      return;
    }
    console.log(`[UserCard] Fetching for ${type}: ${endpoint}`);
    fetch(endpoint)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const value = typeof data === 'number' ? data : data.count;
        setCount(typeof value === 'number' ? value : null);
        console.log(`[UserCard] Data for ${type}:`, value);
      })
      .catch(err => {
        console.error(`[UserCard] Fetch error for ${type}:`, err);
        setCount(null);
      });
  }, [endpoint, type]);

  // Format the count for display
  const formattedCount = count !== null
    ? isCurrency
      ? `${(count / 1000).toFixed(1)}K XAF`
      : count.toLocaleString()
    : '...';

  return (
    <div className="rounded-2xl even:bg-lamaYellow odd:bg-lamaPurple p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2024/25</span>
        <Image src="/more.png" alt="" width={20} height={20} className="cursor-pointer" />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-black">{formattedCount}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;