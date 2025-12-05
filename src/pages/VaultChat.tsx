import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Trash2 } from 'lucide-react';
import { useVaultChat } from '@/hooks/useVaultChat';
import { ChatMessage, ChatInput, ChatSuggestions } from '@/components/vault/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function VaultChat() {
  const { messages, isLoading, sendMessage, handleNavigation, clearChat } = useVaultChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onNavigate = (sessionId: string, jumpIndex?: number) => {
    const jumpParam = jumpIndex !== undefined ? `?jump=${jumpIndex}` : '';
    navigate(`/vault/sessions/${sessionId}${jumpParam}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-b from-[#f5f0eb] to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-vault-border-light bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-primary to-vault-primary-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-vault-text">AI Training Assistant</h1>
            <p className="text-sm text-vault-text-muted">Ask about your sessions, jumps, and stats</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-vault-text-muted hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="py-6 space-y-6">
          {messages.length === 0 ? (
            // Welcome State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-vault-primary-muted flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-vault-primary" />
              </div>
              <h2 className="text-xl font-semibold text-vault-text mb-2">
                Welcome to your AI Assistant
              </h2>
              <p className="text-vault-text-muted max-w-md mb-6">
                I can help you find your training sessions, analyze your jumps, and navigate to specific videos. Try asking:
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

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-vault-primary-muted flex items-center justify-center">
                <Bot className="w-4 h-4 text-vault-primary" />
              </div>
              <div className="bg-white border border-vault-border-light rounded-2xl rounded-bl-md px-4 py-3 shadow-vault-sm">
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
    </div>
  );
}
