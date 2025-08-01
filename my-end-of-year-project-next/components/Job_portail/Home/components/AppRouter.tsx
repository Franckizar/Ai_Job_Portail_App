'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'home' | 'jobs' | 'job-detail' | 'profile' | 'company-profile';

interface AppRouterContextType {
  currentView: ViewType;
  selectedJobId: number | null;
  selectedCompanyId: number | null;
  navigateTo: (view: ViewType, id?: number) => void;
}

const AppRouterContext = createContext<AppRouterContextType | undefined>(undefined);

export function AppRouterProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const navigateTo = (view: ViewType, id?: number) => {
    setCurrentView(view);
    if (view === 'job-detail') {
      setSelectedJobId(id || null);
    } else if (view === 'company-profile') {
      setSelectedCompanyId(id || null);
    }
  };

  return (
    <AppRouterContext.Provider value={{ currentView, selectedJobId, selectedCompanyId, navigateTo }}>
      {children}
    </AppRouterContext.Provider>
  );
}

export const useRouter = () => {
  const context = useContext(AppRouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within an AppRouterProvider');
  }
  return context;
};