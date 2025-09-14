// app/Job/connection/page.tsx
"use client";

import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';

interface Connection {
  id: number;
  requesterId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  requester?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  receiver?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export default function Connections() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch connections based on active tab
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let endpoint = '';
        
        switch(activeTab) {
          case 'friends':
            endpoint = `http://localhost:8088/api/v1/auth/connections/user/${user.userId}/friends`;
            break;
          case 'pending':
            endpoint = `http://localhost:8088/api/v1/auth/connections/user/${user.userId}/pending`;
            break;
          case 'sent':
            endpoint = `http://localhost:8088/api/v1/auth/connections/user/${user.userId}/sent`;
            break;
          default:
            endpoint = `http://localhost:8088/api/v1/auth/connections/user/${user.userId}`;
        }
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch connections');
        }
        
        const data: Connection[] = await response.json();
        setConnections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [activeTab, user]);

  // Handle connection actions (accept, reject, block, remove)
  const handleConnectionAction = async (action: string, connectionId: number) => {
    try {
      const endpoint = `http://localhost:8088/api/v1/auth/connections/${connectionId}/${action}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} connection`);
      }
      
      // Refresh the connections list
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Get the other user in a connection
  const getOtherUser = (connection: Connection) => {
    if (!user) return null;
    
    if (connection.requesterId === user.userId) {
      return connection.receiver || { id: connection.receiverId, firstname: 'User', lastname: `#${connection.receiverId}` };
    } else {
      return connection.requester || { id: connection.requesterId, firstname: 'User', lastname: `#${connection.requesterId}` };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDF9FD' }}>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center">Please log in to view your connections</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EDF9FD' }}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#A5B4FC' }}>
          Your Connections
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#A5B4FC' }}>
            Welcome, {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600">User ID: {user.userId} | Role: {user.role}</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'friends' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
            style={activeTab === 'friends' ? { color: '#A5B4FC', borderColor: '#A5B4FC' } : {}}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'pending' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
            style={activeTab === 'pending' ? { color: '#A5B4FC', borderColor: '#A5B4FC' } : {}}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
          </button>
          <button
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'sent' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
            style={activeTab === 'sent' ? { color: '#A5B4FC', borderColor: '#A5B4FC' } : {}}
            onClick={() => setActiveTab('sent')}
          >
            Sent Requests
          </button>
          <button
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'all' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
            style={activeTab === 'all' ? { color: '#A5B4FC', borderColor: '#A5B4FC' } : {}}
            onClick={() => setActiveTab('all')}
          >
            All Connections
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 rounded mb-6" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', color: '#FCA5A5', borderWidth: '1px' }}>
            {error}
          </div>
        )}
        
        {/* Connections List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#A5B4FC' }}></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {connections.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">
                  {activeTab === 'friends' && "You don't have any friends yet."}
                  {activeTab === 'pending' && "You don't have any pending requests."}
                  {activeTab === 'sent' && "You haven't sent any connection requests."}
                  {activeTab === 'all' && "You don't have any connections."}
                </p>
              </div>
            ) : (
              connections.map(connection => {
                const otherUser = getOtherUser(connection);
                return (
                  <div key={connection.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">
                        {otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : `User #${connection.requesterId === user.userId ? connection.receiverId : connection.requesterId}`}
                      </h3>
                      <p className="text-gray-500">
                        Status: {connection.status}
                        {connection.requesterId === user.userId ? (
                          <span> (You sent this request)</span>
                        ) : (
                          <span> (They sent you a request)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Created: {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      {activeTab === 'pending' && connection.requesterId !== user.userId && (
                        <>
                          <button
                            onClick={() => handleConnectionAction('accept', connection.id)}
                            className="px-3 py-1 text-white rounded-md transition-colors"
                            style={{ backgroundColor: '#86EFAC' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BBF7D0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#86EFAC'}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleConnectionAction('reject', connection.id)}
                            className="px-3 py-1 text-white rounded-md transition-colors"
                            style={{ backgroundColor: '#FCA5A5' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FCA5A5'}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(activeTab === 'friends' || activeTab === 'all') && connection.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleConnectionAction('block', connection.id)}
                          className="px-3 py-1 text-white rounded-md transition-colors"
                          style={{ backgroundColor: '#FDBA74' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FED7AA'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FDBA74'}
                        >
                          Block
                        </button>
                      )}
                      <button
                        onClick={() => handleConnectionAction('', connection.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}