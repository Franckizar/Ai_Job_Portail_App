'use client';
import { useEffect, useState } from 'react';

export default function Salary({ min, max }: { min?: number; max?: number }) {
  const [text, setText] = useState('Salary negotiable');

  useEffect(() => {
    const formatNumber = (num: number) => (num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : `$${num}`);

    if (min && max) setText(`${formatNumber(min)} - ${formatNumber(max)}`);
    else if (min) setText(`${formatNumber(min)}+`);
    else if (max) setText(`Up to ${formatNumber(max)}`);
  }, [min, max]);

  return <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] bg-[var(--color-lamaGreenLight)] px-3 py-1 rounded-full">{text}</span>;
}
