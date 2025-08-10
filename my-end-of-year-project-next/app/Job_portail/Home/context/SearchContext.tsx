'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SearchFilters = {
  title: string;
  city: string;
  type: string;
};

type SearchContextType = {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({
    title: '',
    city: '',
    type: '',
  });

  return (
    <SearchContext.Provider value={{ filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
