import { Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState, useRef } from "react";

const images = [
  "/home_page_images/1.jpg",
  "/home_page_images/2.jpg",
  "/home_page_images/3.jpg",
  "/home_page_images/4.jpg",
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds per image

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  return (
    <section className="relative py-20 text-black min-h-[600px] overflow-hidden">
      {/* Background images - absolutely positioned and fading */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})`, zIndex: -1 }}
          aria-hidden="true"
        />
      ))}

      {/* Overlay to dim background if needed */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      {/* Main container content on top */}
      <div className="relative container mx-auto px-4 z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white drop-shadow-lg">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow">
          Discover thousands of job opportunities with all the information you need. 
          It's your future. Come find it.
        </p>

        <div className="bg-white bg-opacity-80 rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Job title, keywords, or company"
                className="pl-10 bg-white text-black"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="City or state"
                className="pl-10 bg-white text-black"
              />
            </div>

            <Select>
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-primary hover:bg-primary/90 text-white">
              Search Jobs
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-muted-foreground">Popular searches:</span>
            <button className="text-primary hover:underline">Designer</button>
            <button className="text-primary hover:underline">Developer</button>
            <button className="text-primary hover:underline">Product Manager</button>
            <button className="text-primary hover:underline">Marketing</button>
          </div>
        </div>
      </div>
    </section>
  );
}
