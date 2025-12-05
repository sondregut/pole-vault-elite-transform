interface ChatSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  "Show my best jumps",
  "What's my success rate?",
  "Find my competition sessions",
  "Show jumps with videos",
];

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-2 text-sm bg-vault-primary-muted text-vault-primary rounded-full hover:bg-vault-primary hover:text-white transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
