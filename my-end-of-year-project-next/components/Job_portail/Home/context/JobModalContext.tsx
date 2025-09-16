// contexts/JobModalContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface Job {
  id?: number;
  title: string;
  description: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  city: string;
  state: string;
  status: string;
}

type JobModalContextType = {
  isOpen: boolean;
  currentJob: Job | null;
  openModal: (job?: Job | null) => void;
  closeModal: () => void;
};

const JobModalContext = createContext<JobModalContextType | undefined>(undefined);

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  const openModal = (job: Job | null = null) => {
    setCurrentJob(job);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentJob(null);
  };

  return (
    <JobModalContext.Provider value={{ isOpen, currentJob, openModal, closeModal }}>
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