'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cameroonTowns } from '@/lib/cameroonTowns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useSearch } from '../context/SearchContext';

const images = [
  '/home_page_images/7.jpg',
  '/home_page_images/9.jpg',
  '/home_page_images/11.jpg',
  '/home_page_images/12.jpg',
  '/home_page_images/14.jpg', 
  '/home_page_images/15.jpg', 
  '/home_page_images/16.jpg',
];

export function HeroSection() {
  const { filters, setFilters, triggerSearch } = useSearch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth transition to next slide
  const goToNextSlide = useCallback(() => {
    setIsTransitioning(true);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 1000); // Matches CSS transition duration
  }, []);

  // Handle manual slide selection
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    
    setIsTransitioning(true);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
      
      // Restart the interval
      intervalRef.current = setInterval(goToNextSlide, 5000);
    }, 1000);
  }, [currentIndex, goToNextSlide]);

  // Initialize and clean up intervals
  useEffect(() => {
    intervalRef.current = setInterval(goToNextSlide, 5000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [goToNextSlide]);

  const handleSearch = () => {
    triggerSearch();
  };

  return (
    <section className="relative py-20 text-black min-h-[600px] overflow-hidden">
      {/* Background Images with optimized transition */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src} // Using src as key is better here
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
              i === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url(${src})`,
              zIndex: -1,
              transitionProperty: 'opacity',
              willChange: 'opacity'
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {/* Overlay with consistent opacity */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white drop-shadow-lg">
          Connecting Talent with  
          <b><span className='text-[var(--color-lamaSkyDark)]'> Opportunity</span></b>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow">
          Discover thousands of job opportunities with all the information you
          need. It&apos;s your future.       <br/>    
           <b><span className=' text-[var(--color-lamaSkyDark)]'> Come find it.</span></b>
        </p>

        {/* Search Form */}
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
            {/* <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-[var(--color-lamaSkyDark)] group-hover:text-[var(--color-lamaSky)] transition-colors" />
              </div>
              <Input
                placeholder="Location"
                className="pl-10 bg-white/95 border-[var(--color-border-light)] hover:border-[var(--color-lamaSky)] focus:border-[var(--color-lamaSkyDark)] focus:ring-2 focus:ring-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]"
                value={filters.city}
                // onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                
                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                onBlur={() => console.log('City updated:', filters.city)}
              />
            </div> */}
            <div className="relative group">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none  ">
    <MapPin className="h-5 w-5 text-[var(--color-lamaSkyDark)] group-hover:text-[var(--color-lamaSky)] transition-colors" />
   
  </div>

  <Select
    value={filters.city}
    onValueChange={(value) => setFilters((f) => ({ ...f, city: value }))}
  >
    <SelectTrigger className="pl-10 bg-white/95 border-[var(--color-border-light)] hover:border-[var(--color-lamaSky)] focus:border-[var(--color-lamaSkyDark)] focus:ring-2 focus:ring-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]">
      <SelectValue placeholder="Select City" />
    </SelectTrigger>

 <SelectContent className="text-black bg-white/95 border-[var(--color-border-light)] backdrop-blur-sm max-h-60 overflow-y-auto">
  {cameroonTowns
    .slice() // create a copy to avoid mutating original array
    .sort((a, b) => a.localeCompare(b))
    .map((town) => (
      <SelectItem key={town} value={town}>
        {town}
      </SelectItem>
    ))}
</SelectContent>

  </Select>
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
                <SelectContent className=" bg-white/95 border-[var(--color-border-light)] backdrop-blur-sm">
                  <SelectItem 
                    value="ANY"
                    className=" text-black hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
                  >
                    Any type
                  </SelectItem>
                  <SelectItem 
                    value="FULL_TIME" 
                    className="text-black hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
                  >
                    Full-time
                  </SelectItem>
                  <SelectItem 
                    value="PART_TIME"
                    className=" text-black hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
                  >
                    Part-time
                  </SelectItem>
                  <SelectItem 
                    value="CONTRACT"
                    className=" text-black hover:bg-[var(--color-lamaSkyLight)] focus:bg-[var(--color-lamaSkyLight)]"
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