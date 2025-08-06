'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function StorageAndCookiesViewer() {
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: 'localStorage' | 'cookie' | 'clearAll';
    key?: string;
  } | null>(null);

  const loadData = () => {
    // Parse cookies into an object
    const cookieObj: Record<string, string> = {};
    if (typeof document !== 'undefined' && document.cookie) {
      document.cookie.split(';').forEach(cookieStr => {
        const [key, ...valParts] = cookieStr.trim().split('=');
        if (key) {
          cookieObj[key] = valParts.join('=');
        }
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteLocalStorageItem = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      loadData(); // Refresh the data
    }
  };

  const deleteCookie = (key: string) => {
    if (typeof document !== 'undefined') {
      // Delete cookie by setting it to expire in the past
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      // Also try with different path variations
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      loadData(); // Refresh the data
    }
  };

  const clearAllLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      loadData(); // Refresh the data
    }
  };

  const clearAllCookies = () => {
    if (typeof document !== 'undefined') {
      Object.keys(cookies).forEach(key => {
        deleteCookie(key);
      });
      loadData(); // Refresh the data
    }
  };

  const handleConfirmAction = () => {
    if (!showConfirmDialog) return;

    switch (showConfirmDialog.type) {
      case 'localStorage':
        if (showConfirmDialog.key) {
          deleteLocalStorageItem(showConfirmDialog.key);
        }
        break;
      case 'cookie':
        if (showConfirmDialog.key) {
          deleteCookie(showConfirmDialog.key);
        }
        break;
      case 'clearAll':
        clearAllLocalStorage();
        clearAllCookies();
        break;
    }
    setShowConfirmDialog(null);
  };

  const ConfirmDialog = () => {
    if (!showConfirmDialog) return null;

    const getDialogContent = () => {
      switch (showConfirmDialog.type) {
        case 'localStorage':
          return {
            title: 'Delete localStorage Item',
            message: `Are you sure you want to delete the localStorage item "${showConfirmDialog.key}"?`,
            action: 'Delete'
          };
        case 'cookie':
          return {
            title: 'Delete Cookie',
            message: `Are you sure you want to delete the cookie "${showConfirmDialog.key}"?`,
            action: 'Delete'
          };
        case 'clearAll':
          return {
            title: 'Clear All Storage',
            message: 'Are you sure you want to clear ALL localStorage items and cookies? This action cannot be undone.',
            action: 'Clear All'
          };
        default:
          return { title: '', message: '', action: '' };
      }
    };

    const { title, message, action } = getDialogContent();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmDialog(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cookies & Local Storage Viewer</h1>
        <div className="flex space-x-2">
          <button
            onClick={loadData}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowConfirmDialog({ type: 'clearAll' })}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Local Storage ({Object.keys(localStorageItems).length})</h2>
          {Object.keys(localStorageItems).length > 0 && (
            <button
              onClick={() => setShowConfirmDialog({ type: 'clearAll' })}
              className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              Clear All localStorage
            </button>
          )}
        </div>
        {Object.keys(localStorageItems).length === 0 ? (
          <p className="italic text-gray-500">No localStorage items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2 border-b">Key</th>
                  <th className="text-left px-4 py-2 border-b">Value</th>
                  <th className="text-center px-4 py-2 border-b w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(localStorageItems).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b font-medium">{key}</td>
                    <td className="px-4 py-2 border-b break-all max-w-md">
                      <div className="max-h-20 overflow-y-auto text-sm">
                        {value}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => setShowConfirmDialog({ type: 'localStorage', key })}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        title={`Delete ${key}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Cookies ({Object.keys(cookies).length})</h2>
          {Object.keys(cookies).length > 0 && (
            <button
              onClick={() => {
                clearAllCookies();
              }}
              className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              Clear All Cookies
            </button>
          )}
        </div>
        {Object.keys(cookies).length === 0 ? (
          <p className="italic text-gray-500">No cookies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2 border-b">Name</th>
                  <th className="text-left px-4 py-2 border-b">Value</th>
                  <th className="text-center px-4 py-2 border-b w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cookies).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b font-medium">{key}</td>
                    <td className="px-4 py-2 border-b break-all max-w-md">
                      <div className="max-h-20 overflow-y-auto text-sm">
                        {value}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => setShowConfirmDialog({ type: 'cookie', key })}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        title={`Delete ${key}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog />
    </div>
  );
}