'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Filters = {
  skill: string;
  city: string;
  type: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  createdAt?: string;
};

type SearchContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  searchTriggered: boolean;
  setSearchTriggered: (triggered: boolean) => void;
  triggerSearch: () => void;
  searchResults: Job[];
  setSearchResults: React.Dispatch<React.SetStateAction<Job[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({
    skill: '',
    city: '',
    type: '',
  });

  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSearch = async () => {
    setSearchTriggered(true);
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (filters.skill) searchParams.append('skill', filters.skill);
      if (filters.city) searchParams.append('city', filters.city);
      if (filters.type) searchParams.append('type', filters.type);
      
      // Always limit to 3 results
      searchParams.append('limit', '3');

      const response = await fetch(`/api/jobs/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      // Ensure we only get 3 results maximum
      const limitedResults = (data.jobs || data || []).slice(0, 3);
      setSearchResults(limitedResults);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search jobs. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider 
      value={{ 
        filters, 
        setFilters, 
        searchTriggered, 
        setSearchTriggered, 
        triggerSearch,
        searchResults,
        setSearchResults,
        isLoading,
        setIsLoading,
        error,
        setError
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};