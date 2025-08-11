// components/Job_portail/Home/context/SearchContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Filters = {
  skill: string;    // Changed from 'title' to 'skill' to match backend
  city: string;
  type: string;
};

type SearchContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  searchTriggered: boolean;
  setSearchTriggered: (triggered: boolean) => void;
  triggerSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({
    skill: '',  // Changed from 'title' to 'skill'
    city: '',
    type: '',
  });

  const [searchTriggered, setSearchTriggered] = useState(false);

  const triggerSearch = () => {
    setSearchTriggered(true);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        filters, 
        setFilters, 
        searchTriggered, 
        setSearchTriggered, 
        triggerSearch 
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