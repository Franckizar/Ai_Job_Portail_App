'use client';
import { Button } from "@/components/Job_portail/Home/components/ui/button";
import { Compass, Home, Mail } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-12">
            <div className="text-[120px] md:text-[180px] font-bold text-[var(--color-lamaSkyLight)]">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="h-24 w-24 text-[var(--color-lamaSkyDark)] opacity-70" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Page Not Found
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[var(--color-border-light)]">
            <p className="text-sm text-[var(--color-text-secondary)]">
              While you're here, check out our <Link href="/jobs" className="text-[var(--color-lamaSkyDark)] hover:underline">latest job listings</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}