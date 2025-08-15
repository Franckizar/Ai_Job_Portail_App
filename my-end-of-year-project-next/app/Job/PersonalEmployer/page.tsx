'use client';

import { useState } from 'react';
import {
  Briefcase, Users, FileText, CheckCircle, Clock, MessageSquare,
  ChevronRight, Plus, Search, Filter, Mail
} from 'lucide-react';
import JobModal from '@/components/Job_portail/Home/components/JobModal';
// import JobModal from '@/components/JobModal';
// import { useJobModal } from '@/contexts/JobModalContext';
import { useJobModal } from "@/components/Job_portail/Home/context/JobModalContext";

const RecruiterDashboard = () => {
  const { openModal } = useJobModal(); // use context for modal

  const stats = [
    { 
      title: 'Active Jobs', 
      value: 24, 
      change: '+3', 
      icon: <Briefcase className="h-5 w-5 text-[var(--color-lamaSkyDark)]" />,
      bg: 'bg-[var(--color-lamaSkyLight)]',
      iconBg: 'bg-[var(--color-lamaSky)]'
    },
    { 
      title: 'Total Candidates', 
      value: 142, 
      change: '+12', 
      icon: <Users className="h-5 w-5 text-[var(--color-lamaPurpleDark)]" />,
      bg: 'bg-[var(--color-lamaPurpleLight)]',
      iconBg: 'bg-[var(--color-lamaPurple)]'
    },
    { 
      title: 'Hired This Month', 
      value: 8, 
      change: '+2', 
      icon: <CheckCircle className="h-5 w-5 text-[var(--color-lamaGreenDark)]" />,
      bg: 'bg-[var(--color-lamaGreenLight)]',
      iconBg: 'bg-[var(--color-lamaGreen)]'
    },
    { 
      title: 'Pending Reviews', 
      value: 17, 
      change: '-5', 
      icon: <Clock className="h-5 w-5 text-[var(--color-lamaRedDark)]" />,
      bg: 'bg-[var(--color-lamaRedLight)]',
      iconBg: 'bg-[var(--color-lamaRed)]'
    }
  ];

  const recentApplications = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', position: 'Senior UX Designer', applied: '2 hours ago', status: 'new' },
    // More applications...
  ];

  const upcomingInterviews = [
    { id: 1, time: '10:00 AM', date: 'Today', type: 'Technical Interview', candidate: 'Michael Chen - Frontend Developer', location: 'Zoom Meeting', duration: '45 mins' },
    // More interviews...
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Recruiter Dashboard</h1>
          <p className="text-[var(--color-text-secondary)]">Overview of your recruiting activities</p>
        </div>
        <button 
          onClick={openModal} // Open the modal when clicked
          className="flex items-center gap-2 bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bg} p-4 rounded-xl shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className={`${stat.iconBg} p-2 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--color-text-secondary)]">{stat.title}</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
              </div>
            </div>
            <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} from last week
            </p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[var(--color-border-light)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[var(--color-text-secondary)] text-sm border-b border-[var(--color-border-light)]">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Applied</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map(app => (
                  <tr key={app.id} className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-secondary)]">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-lamaSky)]"></div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">{app.name}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{app.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-[var(--color-text-primary)]">{app.position}</td>
                    <td className="py-4 text-[var(--color-text-secondary)]">{app.applied}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'new' ? 'bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)]' : ''}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 flex gap-2">
                      <button className="text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)]"><MessageSquare className="h-4 w-4" /></button>
                      <button className="text-[var(--color-lamaPurpleDark)] hover:text-[var(--color-lamaPurple)]"><Mail className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-light)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Upcoming Interviews</h2>
            {upcomingInterviews.map(interview => (
              <div key={interview.id} className="flex items-start gap-4 p-3 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                <div className="bg-[var(--color-lamaYellowLight)] p-2 rounded-lg text-center min-w-[60px]">
                  <p className="font-medium text-[var(--color-text-primary)]">{interview.time}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{interview.date}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--color-text-primary)]">{interview.type}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{interview.candidate}</p>
                  <div className="flex gap-2 mt-1 text-xs text-[var(--color-text-tertiary)]">
                    <span>{interview.location}</span>•<span>{interview.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-light)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="flex items-center gap-3 w-full p-3 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                <div className="bg-[var(--color-lamaSky)] p-2 rounded-lg"><Search className="h-4 w-4 text-white" /></div>
                <span className="text-sm text-[var(--color-text-primary)]">Search Candidates</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                <div className="bg-[var(--color-lamaPurple)] p-2 rounded-lg"><FileText className="h-4 w-4 text-white" /></div>
                <span className="text-sm text-[var(--color-text-primary)]">Create Job Post</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                <div className="bg-[var(--color-lamaGreen)] p-2 rounded-lg"><Filter className="h-4 w-4 text-white" /></div>
                <span className="text-sm text-[var(--color-text-primary)]">Filter Applications</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Modal */}
      <JobModal />
    </div>
  );
};

export default RecruiterDashboard;
