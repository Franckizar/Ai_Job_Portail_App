// components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">JobFinder</Link>
        <ul className="hidden md:flex gap-6 text-gray-700">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/jobs">Jobs</Link></li>
          <li><Link href="/companies">Companies</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <div className="flex gap-4">
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
