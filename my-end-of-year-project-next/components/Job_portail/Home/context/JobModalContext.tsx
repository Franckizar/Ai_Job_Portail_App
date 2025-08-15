// contexts/JobModalContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type JobModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const JobModalContext = createContext<JobModalContextType | undefined>(undefined);

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <JobModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  const context = useContext(JobModalContext);
  if (context === undefined) {
    throw new Error('useJobModal must be used within a JobModalProvider');
  }
  return context;
}