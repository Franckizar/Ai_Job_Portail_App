"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { toast } from 'react-toastify';
import { Send, Plus, Users, MessageSquare, User, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Job_portail/Home/components/ui/card';
import { Input } from '@/components/Job_portail/Home/components/ui/input';
import { Button } from '@/components/Job_portail/Home/components/ui/button';
import { ScrollArea } from '@/components/Job_portail/Home/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Job_portail/Home/components/ui/select';
import { messagingApi, Connection, Conversation, Message } from '@/components/Job_portail/Home/context/messagingApi';
import { Avatar, AvatarFallback } from '@/components/Job_portail/Home/components/ui/avatar';
import { Badge } from '@/components/Job_portail/Home/components/ui/badge';

const MessagingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [modalMessage, setModalMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isLoadingState, setIsLoadingState] = useState({
    connections: false,
    conversations: false,
    messages: false,
    sendingMessage: false,
    creatingConversation: false,
  });
  
  const [errors, setErrors] = useState({
    connections: '',
    conversations: '',
    messages: '',
  });

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Safe getAvatarInitials with fallback
  const getAvatarInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== 'string') {
      return '?';
    }
    return name.split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format message time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get conversation display name
  const getConversationName = (conversation: Conversation) => {
    if (!user?.userId) return 'Unknown';
    const otherParticipants = conversation.participants.filter(p => p.user.id !== user.userId);
    return otherParticipants.map(p => `${p.user.firstname || ''} ${p.user.lastname || ''}`.trim() || 'Unknown').join(', ');
  };

  // Check if message is from current user
  const isMessageFromCurrentUser = (message: Message) => {
    return message.sender.id === user?.userId;
  };

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    if (!user?.userId) {
      console.log('No userId available for fetching data');
      return;
    }

    try {
      setIsLoadingState(prev => ({ ...prev, connections: true }));
      setErrors(prev => ({ ...prev, connections: '' }));
      const connectionsData = await messagingApi.getConnections(user.userId);
      setConnections(connectionsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load friends';
      setErrors(prev => ({ ...prev, connections: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoadingState(prev => ({ ...prev, connections: false }));
    }

    try {
      setIsLoadingState(prev => ({ ...prev, conversations: true }));
      setErrors(prev => ({ ...prev, conversations: '' }));
      const conversationsData = await messagingApi.getConversations(user.userId);
      setConversations(conversationsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversations';
      setErrors(prev => ({ ...prev, conversations: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoadingState(prev => ({ ...prev, conversations: false }));
    }
  }, [user?.userId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: number) => {
    if (!user?.userId) return;

    try {
      setIsLoadingState(prev => ({ ...prev, messages: true }));
      setErrors(prev => ({ ...prev, messages: '' }));
      const messagesData = await messagingApi.getMessages(conversationId, user.userId);
      setMessages(messagesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      setErrors(prev => ({ ...prev, messages: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoadingState(prev => ({ ...prev, messages: false }));
    }
  }, [user?.userId]);

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation, fetchMessages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || !user?.userId) return;

    try {
      setIsLoadingState(prev => ({ ...prev, sendingMessage: true }));
      await messagingApi.sendMessage(selectedConversation.id, user.userId, newMessage);
      setNewMessage('');
      await fetchMessages(selectedConversation.id);
      toast.success('Message sent successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsLoadingState(prev => ({ ...prev, sendingMessage: false }));
    }
  };

  // Handle creating conversation
  const handleCreateConversation = async () => {
    if (!user?.userId || !selectedFriendId) return;

    try {
      setIsLoadingState(prev => ({ ...prev, creatingConversation: true }));
      const friendId = parseInt(selectedFriendId);

      const existingConversation = await messagingApi.findConversationBetweenUsers(user.userId, friendId);

      if (existingConversation) {
        setSelectedConversation(existingConversation);
        await fetchMessages(existingConversation.id);
        toast.info('Conversation already exists');
      } else {
        if (modalMessage.trim()) {
          await messagingApi.sendDirectMessage(user.userId, friendId, modalMessage);
          toast.success('Message sent successfully');
        } else {
          const conversation = await messagingApi.createConversation([user.userId, friendId]);
          setSelectedConversation(conversation);
          setMessages([]);
          toast.success('Conversation created successfully');
        }
        await fetchData();
      }

      setIsModalOpen(false);
      setSelectedFriendId('');
      setModalMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      toast.error(errorMessage);
    } finally {
      setIsLoadingState(prev => ({ ...prev, creatingConversation: false }));
    }
  };

  // Handle starting conversation
  const handleStartConversation = async (friendId: number) => {
    if (!user?.userId) return;

    try {
      const existingConversation = await messagingApi.findConversationBetweenUsers(user.userId, friendId);

      if (existingConversation) {
        setSelectedConversation(existingConversation);
        await fetchMessages(existingConversation.id);
      } else {
        const conversation = await messagingApi.createConversation([user.userId, friendId]);
        setSelectedConversation(conversation);
        setMessages([]);
        await fetchData();
        toast.success('Conversation started');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start conversation';
      toast.error(errorMessage);
    }
  };

  // Handle selecting conversation
  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
  };

  // Load data on mount
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      fetchData();
    }
  }, [isAuthenticated, user?.userId, fetchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 text-gray-900">
        Please log in to access messaging.
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">Connect and chat with your friends</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={connections.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Friends Sidebar */}
          <Card className="lg:col-span-1 border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Friends ({connections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {isLoadingState.connections ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : errors.connections ? (
                  <div className="text-center text-red-500 py-8 text-sm">
                    {errors.connections}
                    <Button variant="outline" size="sm" className="mt-2" onClick={fetchData}>
                      Retry
                    </Button>
                  </div>
                ) : connections.length > 0 ? (
                  connections.map((connection) => {
                    const friend = connection.requesterId === user?.userId
                      ? { id: connection.receiverId, name: connection.receiverName || 'Unknown' }
                      : { id: connection.requesterId, name: connection.requesterName || 'Unknown' };

                    return (
                      <div
                        key={connection.id}
                        onClick={() => handleStartConversation(friend.id)}
                        className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getAvatarInitials(friend.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{friend.name}</p>
                          <p className="text-sm text-gray-600">Online</p>
                        </div>
                        <Badge variant="secondary" className="ml-2">Friend</Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-600 py-8">
                    No friends yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Conversations and Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Conversations ({conversations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                  {/* Conversations List */}
                  <div className="lg:col-span-1">
                    <ScrollArea className="h-full">
                      {isLoadingState.conversations ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : errors.conversations ? (
                        <div className="text-center text-red-500 py-8 text-sm">
                          {errors.conversations}
                          <Button variant="outline" size="sm" className="mt-2" onClick={fetchData}>
                            Retry
                          </Button>
                        </div>
                      ) : conversations.length > 0 ? (
                        conversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => handleSelectConversation(conversation)}
                            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                              selectedConversation?.id === conversation.id
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {getAvatarInitials(getConversationName(conversation))}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{getConversationName(conversation)}</p>
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.participants.length - 1} participant{conversation.participants.length - 1 !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-600 py-8">
                          No conversations yet
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2 border-l border-gray-200 pl-6">
                    {selectedConversation ? (
                      <div className="h-full flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {getAvatarInitials(getConversationName(selectedConversation))}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{getConversationName(selectedConversation)}</h3>
                              <p className="text-sm text-gray-600">Online</p>
                            </div>
                          </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 mb-4 pr-4">
                          {isLoadingState.messages ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          ) : errors.messages ? (
                            <div className="text-center text-red-500 py-8 text-sm">
                              {errors.messages}
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => selectedConversation && fetchMessages(selectedConversation.id)}
                              >
                                Retry
                              </Button>
                            </div>
                          ) : messages.length > 0 ? (
                            <div className="space-y-4">
                              {messages.map((message) => {
                                const isCurrentUser = isMessageFromCurrentUser(message);
                                
                                return (
                                  <div
                                    key={message.id}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div className={`flex items-start gap-2 max-w-[80%] ${
                                      isCurrentUser ? 'flex-row-reverse' : ''
                                    }`}>
                                      {/* Avatar for received messages */}
                                      {!isCurrentUser && (
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                            {getAvatarInitials(`${message.sender.firstname || ''} ${message.sender.lastname || ''}`.trim() || 'Unknown')}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                      
                                      {/* Message Bubble */}
                                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                        {/* Sender name for received messages */}
                                        {!isCurrentUser && (
                                          <span className="text-xs text-gray-500 mb-1 ml-1">
                                            {`${message.sender.firstname || ''} ${message.sender.lastname || ''}`.trim() || 'Unknown'}
                                          </span>
                                        )}
                                        
                                        <div
                                          className={`p-3 rounded-2xl ${
                                            isCurrentUser
                                              ? 'bg-blue-600 text-white rounded-br-none'
                                              : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                          }`}
                                        >
                                          <p className="text-sm break-words">{message.content}</p>
                                        </div>
                                        
                                        {/* Timestamp */}
                                        <span className={`text-xs text-gray-500 mt-1 ${
                                          isCurrentUser ? 'text-right' : 'text-left'
                                        }`}>
                                          {formatTime(message.timestamp)}
                                        </span>
                                      </div>

                                      {/* Avatar for sent messages */}
                                      {isCurrentUser && (
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                            {getAvatarInitials(`${user.firstname || ''} ${user.lastname || ''}`.trim() || 'You')}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </div>
                          ) : (
                            <div className="text-center text-gray-600 py-8">
                              No messages yet. Start the conversation!
                            </div>
                          )}
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border-gray-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !isLoadingState.sendingMessage) {
                                handleSendMessage();
                              }
                            }}
                            disabled={isLoadingState.sendingMessage}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isLoadingState.sendingMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isLoadingState.sendingMessage ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-600">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a conversation to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Chat Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFriendId('');
                    setModalMessage('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Select a friend</label>
                  <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a friend to chat with" />
                    </SelectTrigger>
                    <SelectContent>
                      {connections.map((connection) => {
                        const friend = connection.requesterId === user?.userId
                          ? { id: connection.receiverId, name: connection.receiverName || 'Unknown' }
                          : { id: connection.requesterId, name: connection.requesterName || 'Unknown' };
                        return (
                          <SelectItem key={friend.id} value={friend.id.toString()}>
                            {friend.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Message (optional)</label>
                  <Input
                    value={modalMessage}
                    onChange={(e) => setModalMessage(e.target.value)}
                    placeholder="Type your first message..."
                    className="w-full"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && selectedFriendId && !isLoadingState.creatingConversation) {
                        handleCreateConversation();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFriendId('');
                      setModalMessage('');
                    }}
                    disabled={isLoadingState.creatingConversation}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateConversation}
                    disabled={!selectedFriendId || isLoadingState.creatingConversation}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoadingState.creatingConversation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Start Chat'
                    )}
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