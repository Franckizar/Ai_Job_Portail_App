'use client';
import { useEffect, useState } from 'react';

export default function DaysAgo({ date }: { date?: string }) {
  const [text, setText] = useState('Recently posted');

  useEffect(() => {
    if (!date) return;

    const created = new Date(date);
    const now = new Date();

    if (isNaN(created.getTime())) {
      setText('Recently posted');
      return;
    }

    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) setText('Posted today');
    else if (diffDays === 1) setText('Posted 1 day ago');
    else if (diffDays <= 7) setText(`Posted ${diffDays} days ago`);
    else if (diffDays <= 30) setText(`Posted ${Math.floor(diffDays / 7)} weeks ago`);
    else setText(`Posted ${Math.floor(diffDays / 30)} months ago`);
  }, [date]);

  return <span className="text-sm text-[var(--color-text-tertiary)] bg-[var(--color-lamaYellowLight)] px-2 py-1 rounded">{text}</span>;
}
