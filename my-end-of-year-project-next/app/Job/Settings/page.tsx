"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";

type UserSettings = {
  avatarUrl: string | null;
  fullName: string;
  email: string;
  phone: string;
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/profile")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Only render FormModal if settings is loaded
  const modalData = settings ? { ...settings } : undefined;

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 xl:flex-row">
      {/* Left: Profile & Account */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* Profile Card */}
        <div className="bg-lamaSky py-6 px-4 rounded-md flex gap-4">
          <div className="w-1/3 flex flex-col items-center">
            <Image
              src={settings?.avatarUrl || "/default-user.png"}
              alt={settings?.fullName || "User"}
              width={120}
              height={120}
              className="w-28 h-28 rounded-full object-cover"
            />
            <button className="mt-4 px-3 py-1 bg-lamaYellow rounded text-xs font-medium hover:bg-lamaYellowLight transition">
              Change Photo
            </button>
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4">
            <h1 className="text-xl font-semibold">{settings?.fullName}</h1>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Image src="/mail.png" alt="" width={14} height={14} />
                <span>{settings?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/phone.png" alt="" width={14} height={14} />
                <span>{settings?.phone}</span>
              </div>
            </div>
            <div>
              {/* Only pass data if settings is not null */}
              {modalData && (
                <FormModal table="users" type="update" data={modalData} />
              )}
            </div>
          </div>
        </div>
        {/* Preferences Card */}
        <div className="bg-white p-6 rounded-md flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Preferences</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-1 w-full md:w-1/3">
              <label className="text-xs text-gray-400">Theme</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                value={settings?.theme}
                onChange={e => setSettings(s => s ? { ...s, theme: e.target.value as "light" | "dark" } : s)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-1/3">
              <label className="text-xs text-gray-400">Language</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                value={settings?.language}
                onChange={e => setSettings(s => s ? { ...s, language: e.target.value } : s)}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                {/* Add more languages */}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-1/3">
              <label className="text-xs text-gray-400">Notifications</label>
              <input
                type="checkbox"
                checked={settings?.notifications}
                onChange={e => setSettings(s => s ? { ...s, notifications: e.target.checked } : s)}
                className="w-5 h-5"
              />
              <span className="text-xs text-gray-500">Enable email notifications</span>
            </div>
          </div>
          <button className="mt-4 bg-lamaPurple text-white px-4 py-2 rounded hover:bg-lamaPurpleLight transition">
            Save Preferences
          </button>
        </div>
        {/* Account Actions */}
        <div className="bg-white p-6 rounded-md flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Account</h2>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition self-start">
            Delete Account
          </button>
        </div>
      </div>
      {/* Right: Shortcuts or Announcements */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href="/profile" className="p-3 rounded-md bg-lamaSkyLight">Profile</Link>
            <Link href="/billing" className="p-3 rounded-md bg-lamaPurpleLight">Billing</Link>
            <Link href="/support" className="p-3 rounded-md bg-lamaYellowLight">Support</Link>
            <Link href="/privacy" className="p-3 rounded-md bg-pink-50">Privacy Policy</Link>
          </div>
        </div>
        {/* You can also add <Performance/> or <Announcements/> here if relevant */}
      </div>
    </div>
  );
};

export default SettingsPage;
