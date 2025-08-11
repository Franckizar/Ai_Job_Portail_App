// components/Job_portail/Home/components/HeroSection.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useSearch } from '../context/SearchContext';

const images = [
  '/home_page_images/1.jpg',
  '/home_page_images/2.jpg',
  '/home_page_images/3.jpg',
  '/home_page_images/4.jpg',
];

export function HeroSection() {
  const { filters, setFilters, triggerSearch } = useSearch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fix hydration issue - only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isClient]);

  const handleSearch = () => {
    triggerSearch();
  };

  return (
    <section className="relative py-20 text-black min-h-[600px] overflow-hidden">
      {/* Background Images - Always render all images but control opacity */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${
            // Show first image by default during SSR, then switch to currentIndex on client
            (!isClient && i === 0) || (isClient && i === currentIndex) 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${src})`, zIndex: -1 }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      <div className="relative container mx-auto px-4 z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white drop-shadow-lg">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow">
          Discover thousands of job opportunities with all the information you
          need. It&apos;s your future. Come find it.
        </p>

        <div className="bg-white bg-opacity-80 rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Job title, keywords, or company"
                className="pl-10 bg-white text-black"
                value={filters.skill}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, skill: e.target.value }))
                }
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="City or state"
                className="pl-10 bg-white text-black"
                value={filters.city}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, city: e.target.value }))
                }
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((f) => ({ ...f, type: value }))
              }
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                {/* <SelectItem value="ANY">Any type</SelectItem>  */}
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}