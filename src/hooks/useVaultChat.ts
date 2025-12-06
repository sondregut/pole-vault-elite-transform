import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, NavigationIntent } from '@/types/chat';
import { sendChatMessage, fetchGreeting } from '@/services/chatService';

const STORAGE_KEY = 'vault-chat-messages';
const GREETING_CACHE_KEY = 'vault-chat-greeting';
const GREETING_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback greeting (shown briefly while loading)
const FALLBACK_GREETING = "Hey! I'm here to help with your pole vault training. What would you like to know?";

// Load messages from sessionStorage
function loadMessages(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      const messages = parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));

      // If we have messages with a greeting, return them
      if (messages.length > 0) {
        return messages;
      }
    }
  } catch (e) {
    console.error('Failed to load chat messages:', e);
  }
  // Return empty - greeting will be fetched
  return [];
}

// Check if cached greeting is still valid
function getCachedGreeting(): string | null {
  try {
    const cached = sessionStorage.getItem(GREETING_CACHE_KEY);
    if (cached) {
      const { greeting, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < GREETING_CACHE_DURATION) {
        return greeting;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

// Save greeting to cache
function cacheGreeting(greeting: string) {
  try {
    sessionStorage.setItem(GREETING_CACHE_KEY, JSON.stringify({
      greeting,
      timestamp: Date.now(),
    }));
  } catch (e) {
    // Ignore cache errors
  }
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
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const greetingFetchedRef = useRef(false);

  // Fetch personalized greeting on first load (if no messages exist)
  useEffect(() => {
    if (messages.length > 0 || greetingFetchedRef.current) return;
    greetingFetchedRef.current = true;

    const loadGreeting = async () => {
      // Check cache first
      const cached = getCachedGreeting();
      if (cached) {
        setMessages([{
          id: 'greeting-initial',
          role: 'assistant',
          content: cached,
          timestamp: new Date(),
        }]);
        return;
      }

      // Show loading state
      setIsLoadingGreeting(true);

      try {
        const greeting = await fetchGreeting();
        cacheGreeting(greeting);
        setMessages([{
          id: 'greeting-initial',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        }]);
      } catch (e) {
        console.error('Failed to fetch greeting:', e);
        // Use fallback greeting
        setMessages([{
          id: 'greeting-initial',
          role: 'assistant',
          content: FALLBACK_GREETING,
          timestamp: new Date(),
        }]);
      } finally {
        setIsLoadingGreeting(false);
      }
    };

    loadGreeting();
  }, [messages.length]);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleNavigation = useCallback((intent: NavigationIntent) => {
    const searchParam = intent.searchQuery ? `?search=${encodeURIComponent(intent.searchQuery)}` : '';

    switch (intent.destination) {
      case 'session':
        if (intent.sessionId) {
          navigate(`/vault/sessions/${intent.sessionId}`);
        }
        break;
      case 'video':
        if (intent.sessionId) {
          // Navigate to session with jump highlighted and open video
          const jumpParam = intent.jumpIndex !== undefined ? `?jump=${intent.jumpIndex}&autoplay=true` : '';
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
        navigate(`/vault/sessions${searchParam}`);
        break;
      case 'videos_list':
        // Navigate to videos page (sessions with video filter or dedicated videos view)
        navigate(`/vault/videos${searchParam}`);
        break;
      case 'jump_history':
        // Navigate to sessions page with Jump History tab active
        navigate(`/vault/sessions?tab=jumps${intent.searchQuery ? `&search=${encodeURIComponent(intent.searchQuery)}` : ''}`);
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
    // Clear messages and cache, then refetch greeting
    setMessages([]);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(GREETING_CACHE_KEY);
    greetingFetchedRef.current = false;
  }, []);

  return {
    messages,
    isLoading,
    isLoadingGreeting,
    error,
    sendMessage,
    handleNavigation,
    clearChat,
  };
}
