'use client';

import React, { useEffect, useState } from 'react';

export default function StorageAndCookiesViewer() {
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({});

  useEffect(() => {
    // Parse cookies into an object
    const cookieObj: Record<string, string> = {};
    if (typeof document !== 'undefined' && document.cookie) {
      document.cookie.split(';').forEach(cookieStr => {
        const [key, ...valParts] = cookieStr.trim().split('=');
        cookieObj[key] = valParts.join('=');
      });
    }
    setCookies(cookieObj);

    // Read all localStorage items
    const localStorageObj: Record<string, string> = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageObj[key] = localStorage.getItem(key) || '';
        }
      }
    }
    setLocalStorageItems(localStorageObj);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Cookies & Local Storage Viewer</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Cookies</h2>
        {Object.keys(cookies).length === 0 ? (
          <p className="italic text-gray-500">No cookies found.</p>
        ) : (
          <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2 border-b">Name</th>
                <th className="text-left px-4 py-2 border-b">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cookies).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{key}</td>
                  <td className="px-4 py-2 border-b break-all">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Local Storage</h2>
        {Object.keys(localStorageItems).length === 0 ? (
          <p className="italic text-gray-500">No localStorage items found.</p>
        ) : (
          <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2 border-b">Key</th>
                <th className="text-left px-4 py-2 border-b">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(localStorageItems).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{key}</td>
                  <td className="px-4 py-2 border-b break-all">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
