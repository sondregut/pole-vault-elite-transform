import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, NavigationIntent } from '@/types/chat';
import { sendChatMessage } from '@/services/chatService';

const STORAGE_KEY = 'vault-chat-messages';

// Load messages from sessionStorage
function loadMessages(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
    }
  } catch (e) {
    console.error('Failed to load chat messages:', e);
  }
  return [];
}

// Save messages to sessionStorage
function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat messages:', e);
  }
}

export function useVaultChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Save messages whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const handleNavigation = useCallback((intent: NavigationIntent) => {
    switch (intent.destination) {
      case 'session':
        if (intent.sessionId) {
          navigate(`/vault/sessions/${intent.sessionId}`);
        }
        break;
      case 'video':
        if (intent.sessionId) {
          // Navigate to session with jump highlighted
          const jumpParam = intent.jumpIndex !== undefined ? `?jump=${intent.jumpIndex}` : '';
          navigate(`/vault/sessions/${intent.sessionId}${jumpParam}`);
        }
        break;
      case 'analytics':
        navigate('/vault/analytics');
        break;
      case 'equipment':
        navigate('/vault/equipment');
        break;
      case 'sessions_list':
        navigate('/vault/sessions');
        break;
    }
  }, [navigate]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(content.trim(), history);

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        navigation: response.navigation,
        sessionResults: response.sessionResults,
        jumpResults: response.jumpResults,
        stats: response.stats,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-navigate if there's a single clear result
      if (response.navigation && !response.sessionResults && !response.jumpResults) {
        handleNavigation(response.navigation);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, handleNavigation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    handleNavigation,
    clearChat,
  };
}
