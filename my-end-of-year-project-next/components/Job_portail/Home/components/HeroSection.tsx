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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 500); // Match this with your CSS transition duration
  };

  useEffect(() => {
    if (!isClient) return;

    intervalRef.current = setInterval(startTransition, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isClient]);

  const handleSearch = () => {
    triggerSearch();
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      startTransition();
      setCurrentIndex(index);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(startTransition, 5000);
    }
  };

  return (
    <section className="relative py-20 text-black min-h-[600px] overflow-hidden">
      {/* Background Images with transition effect */}
      <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-500 ease-in-out ${
              i === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url(${src})`,
              zIndex: -1,
              transitionDelay: isTransitioning ? '0ms' : '500ms'
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      <div className="relative container mx-auto px-4 z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white drop-shadow-lg">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow">
          Discover thousands of job opportunities with all the information you
          need. It&apos;s your future. Come find it.
        </p>
<div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 max-w-3xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Job Title Search */}
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-[var(--color-lamaSkyDark)] group-hover:text-[var(--color-lamaSky)] transition-colors" />
      </div>
      <Input
        placeholder="Job title or keywords"
        className="pl-10 bg-white/95 border-[var(--color-border-light)] hover:border-[var(--color-lamaSky)] focus:border-[var(--color-lamaSkyDark)] focus:ring-2 focus:ring-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]"
        value={filters.skill}
        onChange={(e) => setFilters((f) => ({ ...f, skill: e.target.value }))}
      />
    </div>

    {/* Location Search */}
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MapPin className="h-5 w-5 text-[var(--color-lamaSkyDark)] group-hover:text-[var(--color-lamaSky)] transition-colors" />
      </div>
      <Input
        placeholder="Location"
        className="pl-10 bg-white/95 border-[var(--color-border-light)] hover:border-[var(--color-lamaSky)] focus:border-[var(--color-lamaSkyDark)] focus:ring-2 focus:ring-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]"
        value={filters.city}
        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
      />
    </div>

    {/* Job Type Selector */}
    <div className="flex gap-2">
     <Select
  value={filters.type}
  onValueChange={(value) => setFilters((f) => ({ ...f, type: value === "ANY" ? undefined : value }))}
>
  <SelectTrigger className="bg-white/95 border-[var(--color-border-light)] hover:border-[var(--color-lamaSky)] focus:border-[var(--color-lamaSkyDark)] focus:ring-2 focus:ring-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]">
    <SelectValue placeholder="Job type" />
  </SelectTrigger>
  <SelectContent className="bg-white/95 border-[var(--color-border-light)] backdrop-blur-sm">
    <SelectItem 
      value="ANY"
      className="hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
    >
      Any type
    </SelectItem>
    <SelectItem 
      value="FULL_TIME" 
      className="hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
    >
      Full-time
    </SelectItem>
    <SelectItem 
      value="PART_TIME"
      className="hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
    >
      Part-time
    </SelectItem>
    <SelectItem 
      value="CONTRACT"
      className="hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
    >
      Contract
    </SelectItem>
  </SelectContent>
</Select>

      <Button
        onClick={handleSearch}
        className="flex-1 bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white transition-colors shadow-md hover:shadow-lg"
      >
        Search
      </Button>
    </div>
  </div>
</div>
        {/* Slide indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}