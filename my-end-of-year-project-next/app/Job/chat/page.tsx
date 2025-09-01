'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/fetchWithAuth';
import { Send, Plus, Users, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Job_portail/Home/components/ui/card';
import { Input } from '@/components/Job_portail/Home/components/ui/input';
import { Button } from '@/components/Job_portail/Home/components/ui/button';
import { ScrollArea } from '@/components/Job_portail/Home/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Job_portail/Home/components/ui/select';

interface Connection {
  id: number;
  requester: { id: number; firstname: string; lastname: string; email: string };
  receiver: { id: number; firstname: string; lastname: string; email: string };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
}

interface Conversation {
  conversationId: number;
  participants: { user: { id: number; firstname: string; lastname: string; email: string } }[];
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromCurrentUser: boolean;
  sender: { id: number; firstname: string; lastname: string; email: string };
}

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

  // Fetch user's accepted connections (friends)
  const fetchConnections = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const response = await fetchWithAuth(`/api/v1/auth/connections/user/${user.userId}/friends`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setConnections(data);
      } else {
        toast.error('Failed to fetch connections');
      }
    } catch (error) {
      toast.error('Error fetching connections');
    }
  }, [user?.userId]);

  // Fetch user's conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const response = await fetchWithAuth(`/api/v1/auth/conversations/user/${user.userId}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        toast.error('Failed to fetch conversations');
      }
    } catch (error) {
      toast.error('Error fetching conversations');
    }
  }, [user?.userId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: number) => {
    if (!user?.userId) return;
    try {
      const response = await fetchWithAuth(
        `/api/v1/auth/messages/conversations/${conversationId}/messages?userId=${user.userId}`,
        { method: 'GET' }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      toast.error('Error fetching messages');
    }
  }, [user?.userId]);

  // Create new conversation with connected users
  const handleCreateConversation = async () => {
    if (!newConversationUserId.trim()) {
      toast.error('Please select a user');
      return;
    }
    const selectedUserId = parseInt(newConversationUserId);
    if (isNaN(selectedUserId)) {
      toast.error('Invalid user ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requester.id === user?.userId && conn.receiver.id === selectedUserId) ||
        (conn.receiver.id === user?.userId && conn.requester.id === selectedUserId)
    );
    if (!isConnected) {
      toast.error('You can only start conversations with connected users');
      return;
    }
    const userIds = [user?.userId, selectedUserId].filter((id): id is number => id !== undefined);
    try {
      const response = await fetchWithAuth('/api/v1/auth/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });
      if (response.ok) {
        toast.success('Conversation created');
        setNewConversationUserId('');
        setNewMessage('');
        setIsModalOpen(false);
        await fetchConversations();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create conversation');
      }
    } catch (error) {
      toast.error('Error creating conversation');
    }
  };

  // Add participant to conversation
  const handleAddParticipant = async () => {
    if (!selectedConversation || !addParticipantId.trim()) {
      toast.error('Please select a user');
      return;
    }
    const userId = parseInt(addParticipantId);
    if (isNaN(userId)) {
      toast.error('Invalid user ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requester.id === user?.userId && conn.receiver.id === userId) ||
        (conn.receiver.id === user?.userId && conn.requester.id === userId)
    );
    if (!isConnected) {
      toast.error('You can only add connected users to conversations');
      return;
    }
    try {
      const response = await fetchWithAuth(
        `/api/v1/auth/conversations/${selectedConversation.conversationId}/participants/${userId}`,
        { method: 'POST' }
      );
      if (response.ok) {
        toast.success('Participant added');
        setAddParticipantId('');
        await fetchConversations();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add participant');
      }
    } catch (error) {
      toast.error('Error adding participant');
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || !user?.userId) return;
    // Verify all participants are connected
    const participants = selectedConversation.participants.map(p => p.user.id);
    const areAllConnected = participants.every(participantId =>
      participantId === user.userId ||
      connections.some(
        conn =>
          (conn.requester.id === user.userId && conn.receiver.id === participantId) ||
          (conn.receiver.id === user.userId && conn.requester.id === participantId)
      )
    );
    if (!areAllConnected) {
      toast.error('Cannot send message: Not all participants are connected');
      return;
    }
    try {
      const response = await fetchWithAuth(
        `/api/v1/auth/conversations/${selectedConversation.conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderId: user.userId, messageText: newMessage }),
        }
      );
      if (response.ok) {
        setNewMessage('');
        await fetchMessages(selectedConversation.conversationId);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  // Send direct message
  const handleSendDirectMessage = async () => {
    if (!newConversationUserId.trim() || !newMessage.trim() || !user?.userId) {
      toast.error('Please select a user and enter a message');
      return;
    }
    const receiverId = parseInt(newConversationUserId);
    if (isNaN(receiverId)) {
      toast.error('Invalid receiver ID');
      return;
    }
    // Check if user is a connection
    const isConnected = connections.some(
      conn =>
        (conn.requester.id === user?.userId && conn.receiver.id === receiverId) ||
        (conn.receiver.id === user?.userId && conn.requester.id === receiverId)
    );
    if (!isConnected) {
      toast.error('You can only send direct messages to connected users');
      return;
    }
    try {
      const response = await fetchWithAuth('/api/v1/auth/conversations/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.userId,
          receiverId,
          messageText: newMessage,
        }),
      });
      if (response.ok) {
        toast.success('Direct message sent');
        setNewMessage('');
        setNewConversationUserId('');
        setIsModalOpen(false);
        await fetchConversations();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to send direct message');
      }
    } catch (error) {
      toast.error('Error sending direct message');
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.conversationId);
  };

  // Fetch connections and conversations on mount
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      fetchConnections();
      fetchConversations();
    }
  }, [isAuthenticated, user?.userId, fetchConnections, fetchConversations]);

  if (isLoading) {
    return <div className="text-center py-16 text-[var(--color-text-primary)]">Loading...</div>;
  }

  if (!isAuthenticated) {
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
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-lamaSkyDark)] text-white hover:bg-[var(--color-lamaSky)]"
          >
            <Plus className="mr-2 h-4 w-4" /> New Conversation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connections List */}
          <Card className="md:col-span-1 border-[var(--color-border-light)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-text-primary)]">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {connections.length > 0 ? (
                  connections.map(connection => {
                    const connectedUser =
                      connection.requester.id === user?.userId
                        ? connection.receiver
                        : connection.requester;
                    return (
                      <div
                        key={connection.id}
                        onClick={() => setNewConversationUserId(connectedUser.id.toString())}
                        className={`p-4 mb-2 cursor-pointer rounded-lg hover:bg-[var(--color-lamaPurpleLight)] ${
                          newConversationUserId === connectedUser.id.toString()
                            ? 'bg-[var(--color-lamaPurpleLight)]'
                            : ''
                        }`}
                      >
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {connectedUser.firstname} {connectedUser.lastname}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {connectedUser.email}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[var(--color-text-primary)]">No connections found</p>
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
                {conversations.map(conversation => (
                  <div
                    key={conversation.conversationId}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 mb-2 cursor-pointer rounded-lg hover:bg-[var(--color-lamaSkyLight)] ${
                      selectedConversation?.conversationId === conversation.conversationId
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
                ))}
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
                          onClick={() => setAddParticipantId('')}
                          className="bg-[var(--color-lamaPurpleDark)] text-white hover:bg-[var(--color-lamaPurple)]"
                        >
                          <Users className="mr-2 h-4 w-4" /> Add Participant
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[300px] mb-4">
                    {messages.map(message => (
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
                    ))}
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
                      onValueChange={setAddParticipantId}
                    >
                      <SelectTrigger className="border-[var(--color-border-light)] mb-2 text-[var(--color-text-primary)]">
                        <SelectValue placeholder="Select a user to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {connections.map(connection => {
                          const connectedUser =
                            connection.requester.id === user?.userId
                              ? connection.receiver
                              : connection.requester;
                          return (
                            <SelectItem
                              key={connectedUser.id}
                              value={connectedUser.id.toString()}
                            >
                              {connectedUser.firstname} {connectedUser.lastname}
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
                  onValueChange={setNewConversationUserId}
                >
                  <SelectTrigger className="border-[var(--color-border-light)] mb-4 text-[var(--color-text-primary)]">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map(connection => {
                      const connectedUser =
                        connection.requester.id === user?.userId
                          ? connection.receiver
                          : connection.requester;
                      return (
                        <SelectItem
                          key={connectedUser.id}
                          value={connectedUser.id.toString()}
                        >
                          {connectedUser.firstname} {connectedUser.lastname}
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
                    onClick={() => setIsModalOpen(false)}
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