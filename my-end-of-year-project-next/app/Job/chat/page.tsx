'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/fetchWithAuth';
import { Send, Plus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Job_portail/Home/components/ui/card';
import { Input } from '@/components/Job_portail/Home/components/ui/input';
import { Button } from '@/components/Job_portail/Home/components/ui/button';
import { ScrollArea } from '@/components/Job_portail/Home/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Job_portail/Home/components/ui/select';

interface Connection {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterEmail: string;
  receiverId: number;
  receiverName: string;
  receiverEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: number;
  participants: { user: { id: number; firstname: string; lastname: string; email: string } }[];
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromCurrentUser: boolean;
  messageType: string;
  sender: { id: number; firstname: string; lastname: string; email: string };
}

const BASE_URL = 'http://localhost:8088';

const MessagingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newConversationUserId, setNewConversationUserId] = useState<string>('');
  const [addParticipantId, setAddParticipantId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectionsLoading, setIsConnectionsLoading] = useState(false);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [connectionsError, setConnectionsError] = useState<string | null>(null);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // Fetch user's accepted connections (friends)
  const fetchConnections = useCallback(async () => {
    if (!user?.userId) {
      console.log('No userId available, skipping fetchConnections');
      return;
    }
    setIsConnectionsLoading(true);
    setConnectionsError(null);
    const url = `${BASE_URL}/api/v1/auth/connections/user/${user.userId}/friends`;
    console.log(`Sending request: ${url}, Method: GET`);
    try {
      const response = await fetchWithAuth(url, { method: 'GET' });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        setConnections(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to fetch connections from ${url}:`, errorData);
        setConnectionsError('Failed to fetch friends');
        toast.error('Failed to fetch friends');
      }
    } catch (error) {
      console.error(`Error fetching connections from ${url}:`, error);
      setConnectionsError('Error fetching friends');
      toast.error('Error fetching friends');
    } finally {
      setIsConnectionsLoading(false);
    }
  }, [user?.userId]);

  // Fetch user's conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.userId) {
      console.log('No userId available, skipping fetchConversations');
      return;
    }
    setIsConversationsLoading(true);
    setConversationsError(null);
    const url = `${BASE_URL}/api/v1/auth/conversations/user/${user.userId}`;
    console.log(`Sending request: ${url}, Method: GET`);
    try {
      const response = await fetchWithAuth(url, { method: 'GET' });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        setConversations(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to fetch conversations from ${url}:`, errorData);
        setConversationsError('Failed to fetch conversations');
        toast.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error(`Error fetching conversations from ${url}:`, error);
      setConversationsError('Error fetching conversations');
      toast.error('Error fetching conversations');
    } finally {
      setIsConversationsLoading(false);
    }
  }, [user?.userId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: number) => {
    if (!user?.userId) {
      console.log('No userId available, skipping fetchMessages');
      return;
    }
    const url = `${BASE_URL}/api/v1/auth/messages/conversations/${conversationId}/messages?userId=${user.userId}`;
    console.log(`Sending request: ${url}, Method: GET`);
    try {
      const response = await fetchWithAuth(url, { method: 'GET' });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        setMessages(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to fetch messages from ${url}:`, errorData);
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error(`Error fetching messages from ${url}:`, error);
      toast.error('Error fetching messages');
    }
  }, [user?.userId]);

  // Auto-refresh messages every 5 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;
    const interval = setInterval(() => {
      console.log(`Auto-refreshing messages for conversation ${selectedConversation.id}`);
      fetchMessages(selectedConversation.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConversation, fetchMessages]);

  // Create new conversation with connected users
  const handleCreateConversation = async () => {
    if (!newConversationUserId.trim()) {
      console.log('No user selected for new conversation');
      toast.error('Please select a user');
      return;
    }
    const selectedUserId = parseInt(newConversationUserId);
    if (isNaN(selectedUserId)) {
      console.log('Invalid user ID for new conversation:', newConversationUserId);
      toast.error('Invalid user ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requesterId === user?.userId && conn.receiverId === selectedUserId) ||
        (conn.receiverId === user?.userId && conn.requesterId === selectedUserId)
    );
    if (!isConnected) {
      console.log(`User ${selectedUserId} is not a connection for user ${user?.userId}`);
      toast.error('You can only start conversations with connected users');
      return;
    }
    const userIds = [user?.userId, selectedUserId].filter((id): id is number => id !== undefined);
    const url = `${BASE_URL}/api/v1/auth/conversations`;
    console.log(`Sending request: ${url}, Method: POST, Body:`, JSON.stringify({ userIds }, null, 2));
    try {
      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        toast.success('Conversation created');
        setNewConversationUserId('');
        setNewMessage('');
        setIsModalOpen(false);
        await fetchConversations();
        setSelectedConversation(data);
        setMessages([]);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to create conversation at ${url}:`, errorData);
        toast.error(errorData.error || 'Failed to create conversation');
      }
    } catch (error) {
      console.error(`Error creating conversation at ${url}:`, error);
      toast.error('Error creating conversation');
    }
  };

  // Add participant to conversation
  const handleAddParticipant = async () => {
    if (!selectedConversation || !addParticipantId.trim()) {
      console.log('No conversation or user selected for adding participant');
      toast.error('Please select a user');
      return;
    }
    const userId = parseInt(addParticipantId);
    if (isNaN(userId)) {
      console.log('Invalid user ID for adding participant:', addParticipantId);
      toast.error('Invalid user ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requesterId === user?.userId && conn.receiverId === userId) ||
        (conn.receiverId === user?.userId && conn.requesterId === userId)
    );
    if (!isConnected) {
      console.log(`User ${userId} is not a connection for user ${user?.userId}`);
      toast.error('You can only add connected users to conversations');
      return;
    }
    const url = `${BASE_URL}/api/v1/auth/conversations/${selectedConversation.id}/participants/${userId}`;
    console.log(`Sending request: ${url}, Method: POST`);
    try {
      const response = await fetchWithAuth(url, { method: 'POST' });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        toast.success('Participant added');
        setAddParticipantId('');
        await fetchConversations();
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to add participant at ${url}:`, errorData);
        toast.error(errorData.error || 'Failed to add participant');
      }
    } catch (error) {
      console.error(`Error adding participant at ${url}:`, error);
      toast.error('Error adding participant');
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || !user?.userId) {
      console.log('Missing data for sending message:', { selectedConversation, newMessage, userId: user?.userId });
      return;
    }
    // Verify all participants are connected
    const participants = selectedConversation.participants.map(p => p.user.id);
    const areAllConnected = participants.every(participantId =>
      participantId === user.userId ||
      connections.some(
        conn =>
          (conn.requesterId === user.userId && conn.receiverId === participantId) ||
          (conn.receiverId === user.userId && conn.requesterId === participantId)
      )
    );
    if (!areAllConnected) {
      console.log('Not all participants are connected:', participants);
      toast.error('Cannot send message: Not all participants are connected');
      return;
    }
    const url = `${BASE_URL}/api/v1/auth/conversations/${selectedConversation.id}/messages`;
    console.log(`Sending request: ${url}, Method: POST, Body:`, JSON.stringify({ senderId: user.userId, messageText: newMessage }, null, 2));
    try {
      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.userId, messageText: newMessage }),
      });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        setNewMessage('');
        await fetchMessages(selectedConversation.id);
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to send message at ${url}:`, errorData);
        toast.error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error(`Error sending message at ${url}:`, error);
      toast.error('Error sending message');
    }
  };

  // Send direct message
  const handleSendDirectMessage = async () => {
    if (!newConversationUserId.trim() || !newMessage.trim() || !user?.userId) {
      console.log('Missing data for sending direct message:', { newConversationUserId, newMessage, userId: user?.userId });
      toast.error('Please select a user and enter a message');
      return;
    }
    const receiverId = parseInt(newConversationUserId);
    if (isNaN(receiverId)) {
      console.log('Invalid receiver ID for direct message:', newConversationUserId);
      toast.error('Invalid receiver ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requesterId === user?.userId && conn.receiverId === receiverId) ||
        (conn.receiverId === user?.userId && conn.requesterId === receiverId)
    );
    if (!isConnected) {
      console.log(`User ${receiverId} is not a connection for user ${user?.userId}`);
      toast.error('You can only send direct messages to connected users');
      return;
    }
    const url = `${BASE_URL}/api/v1/auth/conversations/direct`;
    console.log(`Sending request: ${url}, Method: POST, Body:`, JSON.stringify({ senderId: user.userId, receiverId, messageText: newMessage }, null, 2));
    try {
      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.userId, receiverId, messageText: newMessage }),
      });
      console.log(`Response status for ${url}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
        toast.success('Direct message sent');
        setNewMessage('');
        setNewConversationUserId('');
        setIsModalOpen(false);
        await fetchConversations();
        // Find the new conversation and select it
        const newConversation = conversations.find(conv =>
          conv.participants.some(p => p.user.id === receiverId)
        );
        if (newConversation) {
          setSelectedConversation(newConversation);
          await fetchMessages(newConversation.id);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`Failed to send direct message at ${url}:`, errorData);
        toast.error(errorData.error || 'Failed to send direct message');
      }
    } catch (error) {
      console.error(`Error sending direct message at ${url}:`, error);
      toast.error('Error sending direct message');
    }
  };

  // Select conversation or start new one when clicking a friend
  const handleSelectFriend = async (friendId: number) => {
    console.log(`Selected friend: ${friendId}`);
    setNewConversationUserId(friendId.toString());
    
    // Check for existing conversation with this friend
    const existingConversation = conversations.find(conv =>
      conv.participants.length === 2 &&
      conv.participants.some(p => p.user.id === friendId) &&
      conv.participants.some(p => p.user.id === user?.userId)
    );

    if (existingConversation) {
      console.log(`Found existing conversation with friend ${friendId}:`, JSON.stringify(existingConversation, null, 2));
      setSelectedConversation(existingConversation);
      await fetchMessages(existingConversation.id);
    } else {
      console.log(`No existing conversation with friend ${friendId}, creating new one`);
      const userIds = [user?.userId, friendId].filter((id): id is number => id !== undefined);
      const url = `${BASE_URL}/api/v1/auth/conversations`;
      console.log(`Sending request: ${url}, Method: POST, Body:`, JSON.stringify({ userIds }, null, 2));
      try {
        const response = await fetchWithAuth(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds }),
        });
        console.log(`Response status for ${url}: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Response data for ${url}:`, JSON.stringify(data, null, 2));
          setSelectedConversation(data);
          setMessages([]);
          await fetchConversations();
        } else {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          console.error(`Failed to create conversation at ${url}:`, errorData);
          toast.error(errorData.error || 'Failed to create conversation');
        }
      } catch (error) {
        console.error(`Error creating conversation at ${url}:`, error);
        toast.error('Error creating conversation');
      }
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation: Conversation) => {
    console.log('Selected conversation:', JSON.stringify(conversation, null, 2));
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Fetch connections and conversations on mount
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      console.log('User authenticated, userId:', user.userId);
      fetchConnections();
      fetchConversations();
    } else {
      console.log('User not authenticated or no userId');
    }
  }, [isAuthenticated, user?.userId, fetchConnections, fetchConversations]);

  if (isLoading) {
    console.log('Auth context is loading');
    return <div className="text-center py-16 text-[var(--color-text-primary)]">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('User is not authenticated');
    return <div className="text-center py-16 text-[var(--color-text-primary)]">Please log in to access messaging.</div>;
  }

  return (
    <section className="py-16 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Messages
          </h2>
          <Button
            onClick={() => {
              console.log('Opening new conversation modal');
              setIsModalOpen(true);
            }}
            className="bg-[var(--color-lamaSkyDark)] text-white hover:bg-[var(--color-lamaSky)]"
          >
            <Plus className="mr-2 h-4 w-4" /> New Conversation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connections List */}
          <Card className="md:col-span-1 border-[var(--color-border-light)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-text-primary)]">Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {isConnectionsLoading ? (
                  <div className="text-center text-[var(--color-text-primary)]">Loading friends...</div>
                ) : connectionsError ? (
                  <div className="text-center text-[var(--color-text-primary)]">{connectionsError}</div>
                ) : connections.length > 0 ? (
                  connections.map(connection => {
                    const connectedUser = connection.requesterId === user?.userId
                      ? { id: connection.receiverId, name: connection.receiverName, email: connection.receiverEmail }
                      : { id: connection.requesterId, name: connection.requesterName, email: connection.requesterEmail };
                    return (
                      <div
                        key={connection.id}
                        onClick={() => handleSelectFriend(connectedUser.id)}
                        className={`p-4 mb-2 cursor-pointer rounded-lg hover:bg-[var(--color-lamaPurpleLight)] ${
                          newConversationUserId === connectedUser.id.toString()
                            ? 'bg-[var(--color-lamaPurpleLight)]'
                            : ''
                        }`}
                      >
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {connectedUser.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {connectedUser.email}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-[var(--color-text-primary)]">No friends found</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Conversations and Messages */}
          <Card className="md:col-span-2 border-[var(--color-border-light)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-text-primary)]">Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] mb-4">
                {isConversationsLoading ? (
                  <div className="text-center text-[var(--color-text-primary)]">Loading conversations...</div>
                ) : conversationsError ? (
                  <div className="text-center text-[var(--color-text-primary)]">{conversationsError}</div>
                ) : conversations.length > 0 ? (
                  conversations.map(conversation => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 mb-2 cursor-pointer rounded-lg hover:bg-[var(--color-lamaSkyLight)] ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-[var(--color-lamaSkyLight)]'
                          : ''
                      }`}
                    >
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {conversation.participants
                          .filter(p => p.user.id !== user?.userId)
                          .map(p => `${p.user.firstname} ${p.user.lastname}`)
                          .join(', ')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[var(--color-text-primary)]">No conversations found</p>
                )}
              </ScrollArea>
              {selectedConversation && (
                <>
                  <CardHeader>
                    <CardTitle className="text-[var(--color-text-primary)]">
                      <div className="flex justify-between items-center">
                        <span>
                          {selectedConversation.participants
                            .filter(p => p.user.id !== user?.userId)
                            .map(p => `${p.user.firstname} ${p.user.lastname}`)
                            .join(', ')}
                        </span>
                        <Button
                          onClick={() => {
                            console.log('Opening add participant select');
                            setAddParticipantId('');
                          }}
                          className="bg-[var(--color-lamaPurpleDark)] text-white hover:bg-[var(--color-lamaPurple)]"
                        >
                          <Users className="mr-2 h-4 w-4" /> Add Participant
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[300px] mb-4">
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${
                            message.isFromCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.isFromCurrentUser
                                ? 'bg-[var(--color-lamaSkyDark)] text-white'
                                : 'bg-[var(--color-lamaSkyLight)] text-[var(--color-text-primary)]'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[var(--color-text-primary)]">No messages in this conversation</p>
                    )}
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="border-[var(--color-border-light)] text-[var(--color-text-primary)]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-[var(--color-lamaSkyDark)] text-white hover:bg-[var(--color-lamaSky)]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Select
                      value={addParticipantId}
                      onValueChange={value => {
                        console.log('Selected participant ID:', value);
                        setAddParticipantId(value);
                      }}
                    >
                      <SelectTrigger className="border-[var(--color-border-light)] mb-2 text-[var(--color-text-primary)]">
                        <SelectValue placeholder="Select a user to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {connections.map(connection => {
                          const connectedUser = connection.requesterId === user?.userId
                            ? { id: connection.receiverId, name: connection.receiverName, email: connection.receiverEmail }
                            : { id: connection.requesterId, name: connection.requesterName, email: connection.requesterEmail };
                          return (
                            <SelectItem
                              key={connectedUser.id}
                              value={connectedUser.id.toString()}
                            >
                              {connectedUser.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddParticipant}
                      className="bg-[var(--color-lamaPurpleDark)] text-white hover:bg-[var(--color-lamaPurple)]"
                    >
                      Add Participant
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Conversation Modal */}
        {isModalOpen && (
          <div className="modal-backdrop flex justify-center items-center">
            <div className="modal-content max-w-md w-full">
              <div className="modal-body">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                  Start New Conversation
                </h3>
                <Select
                  value={newConversationUserId}
                  onValueChange={value => {
                    console.log('Selected user for new conversation:', value);
                    setNewConversationUserId(value);
                  }}
                >
                  <SelectTrigger className="border-[var(--color-border-light)] mb-4 text-[var(--color-text-primary)]">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map(connection => {
                      const connectedUser = connection.requesterId === user?.userId
                        ? { id: connection.receiverId, name: connection.receiverName, email: connection.receiverEmail }
                        : { id: connection.requesterId, name: connection.requesterName, email: connection.requesterEmail };
                      return (
                        <SelectItem
                          key={connectedUser.id}
                          value={connectedUser.id.toString()}
                        >
                          {connectedUser.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type an initial message (optional)"
                  className="border-[var(--color-border-light)] mb-4 text-[var(--color-text-primary)]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateConversation}
                    className="bg-[var(--color-lamaSkyDark)] text-white hover:bg-[var(--color-lamaSky)]"
                  >
                    Create Conversation
                  </Button>
                  <Button
                    onClick={handleSendDirectMessage}
                    className="bg-[var(--color-lamaPurpleDark)] text-white hover:bg-[var(--color-lamaPurple)]"
                  >
                    Send Direct Message
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Closing new conversation modal');
                      setIsModalOpen(false);
                    }}
                    className="bg-[var(--color-lamaRedLight)] text-[var(--color-lamaRedDark)] hover:bg-[var(--color-lamaRed)]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagingPage;