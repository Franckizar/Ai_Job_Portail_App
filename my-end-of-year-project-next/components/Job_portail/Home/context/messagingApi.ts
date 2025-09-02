// services/messagingApi.ts
const BASE_URL = 'http://localhost:8088';
import { fetchWithAuth } from '@/fetchWithAuth';

export interface Connection {
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

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface ConversationParticipant {
  user: User;
  joinedAt: string;
}

export interface Conversation {
  id: number;
  participants: ConversationParticipant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromCurrentUser: boolean;
  messageType: string;
  sender: User;
}

export interface CreateConversationRequest {
  userIds: number[];
}

export interface SendMessageRequest {
  senderId: number;
  messageText: string;
}

export interface SendDirectMessageRequest {
  senderId: number;
  receiverId: number;
  messageText: string;
}

export const messagingApi = {
  // Fetch user's connections (friends)
  getConnections: async (userId: number): Promise<Connection[]> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/connections/user/${userId}/friends`,
        { method: 'GET' }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      throw error;
    }
  },

  // Fetch user's conversations
  getConversations: async (userId: number): Promise<Conversation[]> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/conversations/user/${userId}`,
        { method: 'GET' }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }
  },

  // Fetch messages for a conversation
  getMessages: async (conversationId: number, userId: number): Promise<Message[]> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/messages/conversations/${conversationId}/messages?userId=${userId}`,
        { method: 'GET' }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  },

  // Create new conversation
  createConversation: async (userIds: number[]): Promise<Conversation> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/conversations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds } as CreateConversationRequest),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },

  // Send message to existing conversation
  sendMessage: async (conversationId: number, senderId: number, messageText: string): Promise<Message> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            senderId, 
            messageText 
          } as SendMessageRequest),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  // Send direct message (creates conversation if needed)
  sendDirectMessage: async (senderId: number, receiverId: number, messageText: string): Promise<Message> => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/v1/auth/conversations/direct`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            senderId, 
            receiverId, 
            messageText 
          } as SendDirectMessageRequest),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send direct message:', error);
      throw error;
    }
  },

  // Check if conversation exists between two users
  findConversationBetweenUsers: async (user1Id: number, user2Id: number): Promise<Conversation | null> => {
    try {
      // Get all conversations for user1
      const conversations = await messagingApi.getConversations(user1Id);
      
      // Find conversation that includes both users and has exactly 2 participants (direct message)
      const directConversation = conversations.find(conv => 
        conv.participants.length === 2 &&
        conv.participants.some(p => p.user.id === user1Id) &&
        conv.participants.some(p => p.user.id === user2Id)
      );
      
      return directConversation || null;
    } catch (error) {
      console.error('Failed to find conversation between users:', error);
      return null;
    }
  }
};