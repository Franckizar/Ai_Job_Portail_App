// ```typescriptreact
'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Search, CheckCircle, XCircle, Clock, Trash2, Ban, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface Connection {
  id: number;
  requesterId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  requester: User;
  receiver: User;
}

const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConnections, setTotalConnections] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const itemsPerPage = 10;
  const baseURL = 'http://localhost:8088';

  // Fetch connections based on status
  const fetchConnections = async (status = 'ALL', page = 1) => {
    if (!user?.userId) return;
    setLoading(true);
    setError(null);
    try {
      let url;
      if (status === 'FRIENDS') {
        url = `${baseURL}/api/v1/auth/connections/user/${user.userId}/friends?page=${page - 1}&size=${itemsPerPage}`;
      } else if (status === 'PENDING') {
        url = `${baseURL}/api/v1/auth/connections/user/${user.userId}/pending?page=${page - 1}&size=${itemsPerPage}`;
      } else if (status === 'SENT') {
        url = `${baseURL}/api/v1/auth/connections/user/${user.userId}/sent?page=${page - 1}&size=${itemsPerPage}`;
      } else {
        url = `${baseURL}/api/v1/auth/connections/user/${user.userId}?page=${page - 1}&size=${itemsPerPage}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch connections');
      const data: Connection[] = await response.json();
      setConnections(data);
      setFilteredConnections(data);
      setTotalConnections(data.length);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setError('Failed to load connections. Please try again.');
      setConnections([]);
      setFilteredConnections([]);
    } finally {
      setLoading(false);
    }
  };

  // Search users by email
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(`${baseURL}/api/v1/auth/connections/search?email=${encodeURIComponent(searchQuery)}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
        });
        if (!response.ok) throw new Error('No users found');
        const data: User[] = await response.json();
        const validUsers = data
          .filter(item => item.id !== user?.userId)
          .map(item => ({
            id: item.id,
            firstname: item.firstname || '',
            lastname: item.lastname || '',
            email: item.email || 'No email available',
          }));
        setSearchResults(validUsers);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        setError('No users found for the search query.');
      }
    };
    searchUsers();
  }, [searchQuery, user]);

  // Update connection status
  const updateConnectionStatus = async (connectionId: number, action: string) => {
    setActionLoading(connectionId);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/connections/${connectionId}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || `Failed to ${action} connection`);
      }
      fetchConnections(selectedStatus, currentPage);
    } catch (error: any) {
      console.error(`Error updating connection status (${action}):`, error);
      setError(error.message || `Failed to ${action} connection.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Remove connection
  const removeConnection = async (connectionId: number) => {
    setActionLoading(connectionId);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
      if (!response.ok) throw new Error('Failed to remove connection');
      fetchConnections(selectedStatus, currentPage);
    } catch (error) {
      console.error('Error removing connection:', error);
      setError('Failed to remove connection.');
    } finally {
      setActionLoading(null);
    }
  };

  // Send connection request
  const sendConnectionRequest = async (receiverId: number) => {
    setActionLoading(receiverId);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
        body: JSON.stringify({ requesterId: user?.userId, receiverId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to send connection request');
      }
      setSearchQuery('');
      setSearchResults([]);
      setSelectedStatus('SENT');
      fetchConnections('SENT', 1);
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      setError(error.message || 'Failed to send connection request.');
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  // Filter connections based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter(conn => {
        const otherUser = conn.requesterId === user?.userId ? conn.receiver : conn.requester;
        if (!otherUser) return false;
        const name = `${otherUser.firstname || ''} ${otherUser.lastname || ''}`.trim();
        return (
          (otherUser.email && otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (name && name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
      setFilteredConnections(filtered);
    }
  }, [searchQuery, connections, user]);

  // Initial load
  useEffect(() => {
    fetchConnections();
  }, [user]);

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    fetchConnections(status, 1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchConnections(selectedStatus, newPage);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      ACCEPTED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
      },
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
      },
      BLOCKED: {
        bg: 'bg-gray-200',
        text: 'text-gray-800',
        icon: Ban,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const totalPages = Math.ceil(totalConnections / itemsPerPage);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">Please log in to view connections</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Connections Management</h1>
            <p className="text-gray-600">
              Manage your connections ({totalConnections} total)
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result) => {
                  const displayName = result.firstname && result.lastname
                    ? `${result.firstname} ${result.lastname}`
                    : result.firstname || result.lastname || `User ID: ${result.id}`;
                  const displayEmail = result.email || 'No email available';
                  return (
                    <div key={result.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {displayName} ({displayEmail})
                        </p>
                      </div>
                      <button
                        onClick={() => sendConnectionRequest(result.id)}
                        disabled={actionLoading === result.id}
                        className={`px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading === result.id ? 'Sending...' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {['ALL', 'FRIENDS', 'PENDING', 'SENT'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Connections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created At</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                    Loading connections...
                  </td>
                </tr>
              ) : filteredConnections.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                    No connections found
                  </td>
                </tr>
              ) : (
                filteredConnections.map((connection) => {
                  const otherUser = connection.requesterId === user?.userId ? connection.receiver : connection.requester;
                  const displayName = otherUser?.firstname && otherUser?.lastname
                    ? `${otherUser.firstname} ${otherUser.lastname}`
                    : otherUser?.firstname || otherUser?.lastname || `User ID: ${connection.requesterId === user?.userId ? connection.receiverId : connection.requesterId}`;
                  const displayEmail = otherUser?.email || 'No email available';
                  return (
                    <tr
                      key={connection.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {displayName}
                            </span>
                            <p className="text-xs text-gray-500">
                              {displayEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={connection.status} />
                        <span className="text-xs text-gray-500 ml-2">
                          {connection.requesterId === user?.userId ? '(Sent)' : '(Received)'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{formatDate(connection.createdAt)}</p>
                          <p className="text-xs text-gray-500">{timeAgo(connection.createdAt)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {connection.status === 'PENDING' && connection.requesterId !== user?.userId && (
                            <>
                              <button
                                onClick={() => updateConnectionStatus(connection.id, 'accept')}
                                disabled={actionLoading === connection.id}
                                className={`p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors ${actionLoading === connection.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Accept"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateConnectionStatus(connection.id, 'reject')}
                                disabled={actionLoading === connection.id}
                                className={`p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ${actionLoading === connection.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {connection.status === 'ACCEPTED' && (
                            <button
                              onClick={() => updateConnectionStatus(connection.id, 'block')}
                              disabled={actionLoading === connection.id}
                              className={`p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${actionLoading === connection.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Block"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeConnection(connection.id)}
                            disabled={actionLoading === connection.id}
                            className={`p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ${actionLoading === connection.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalConnections)} of {totalConnections} connections
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  if (pageNumber > totalPages) return null;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;