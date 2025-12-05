import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex gap-2 items-end p-4 bg-white border-t border-vault-border-light">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder || "Ask about your training..."}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-vault-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-primary/20 focus:border-vault-primary disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ minHeight: '48px', maxHeight: '120px' }}
      />
      <Button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="h-12 w-12 rounded-xl bg-vault-primary hover:bg-vault-primary-dark disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
