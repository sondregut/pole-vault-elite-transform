import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bot, Trash2 } from 'lucide-react';
import { useVaultChat } from '@/hooks/useVaultChat';
import { ChatMessage, ChatInput, ChatSuggestions } from '@/components/vault/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(() => {
    // Load from sessionStorage to persist across page navigations
    const stored = sessionStorage.getItem('vault-chat-seen-count');
    return stored ? parseInt(stored, 10) : 1; // Start at 1 to account for initial greeting
  });
  const { messages, isLoading, isLoadingGreeting, sendMessage, clearChat } = useVaultChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Calculate unread messages (new assistant messages since last seen)
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const unreadCount = Math.max(0, assistantMessages.length - lastSeenCount);

  // Mark messages as seen when chat is opened
  useEffect(() => {
    if (isOpen) {
      const count = assistantMessages.length;
      setLastSeenCount(count);
      sessionStorage.setItem('vault-chat-seen-count', count.toString());
    }
  }, [isOpen, assistantMessages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const onNavigate = (sessionId: string, jumpIndex?: number) => {
    const jumpParam = jumpIndex !== undefined ? `?jump=${jumpIndex}` : '';
    navigate(`/vault/sessions/${sessionId}${jumpParam}`);
    setIsOpen(false); // Close chat after navigation
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-vault-primary shadow-lg hover:bg-vault-primary-dark transition-colors flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
            {/* Unread indicator - only show when there are new messages */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-[400px] h-[85vh] md:h-[600px] md:max-h-[80vh] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-vault-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-vault-border bg-gradient-to-r from-vault-primary to-vault-primary-dark text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">AI Assistant</h2>
                    <p className="text-xs text-white/70">Ask about your training</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearChat();
                        setLastSeenCount(1); // Reset to 1 for the greeting
                        sessionStorage.setItem('vault-chat-seen-count', '1');
                      }}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="py-4 space-y-4">
                  {messages.length === 0 && !isLoadingGreeting ? (
                    // Welcome State (fallback - should rarely show)
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-xl bg-vault-primary-muted flex items-center justify-center mb-3">
                        <Bot className="w-6 h-6 text-vault-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-vault-text mb-1">
                        Hi! I'm your AI Assistant
                      </h3>
                      <p className="text-sm text-vault-text-muted max-w-xs mb-4">
                        I can help you find sessions, analyze jumps, and navigate to videos.
                      </p>
                      <ChatSuggestions onSelect={sendMessage} />
                    </div>
                  ) : (
                    // Messages
                    messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        onNavigate={onNavigate}
                      />
                    ))
                  )}

                  {/* Loading Indicator for greeting */}
                  {isLoadingGreeting && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-vault-primary-muted flex items-center justify-center">
                        <Bot className="w-4 h-4 text-vault-primary" />
                      </div>
                      <div className="bg-white border border-vault-border-light rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading Indicator for messages */}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-vault-primary-muted flex items-center justify-center">
                        <Bot className="w-4 h-4 text-vault-primary" />
                      </div>
                      <div className="bg-white border border-vault-border-light rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-vault-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <ChatInput
                onSend={sendMessage}
                disabled={isLoading}
                placeholder="Ask about your training..."
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
