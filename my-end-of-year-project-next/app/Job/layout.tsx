'use client'
import {ModernMenu} from "@/components";
import {ModernNavbar} from "@/components";

import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/wamb.png" alt="logo" width={250} height={40} className="rounded-lg" />
            {/* <span className="text-xl font-bold text-gray-900">Wamb's</span> */}
          </Link>
          
          {/* Navigation Routes - Center */}
          <div className="flex-1 flex justify-center">
            <ModernMenu />
          </div>
          
          {/* Settings & User - Right Side */}
          <div className="flex items-center gap-4">
            <ModernNavbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-35 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}