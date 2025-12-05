import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { NavigationCard } from './NavigationCard';
import { ChatVideoCard } from './ChatVideoCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onNavigate: (sessionId: string, jumpIndex?: number) => void;
}

export function ChatMessage({ message, onNavigate }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-vault-primary' : 'bg-vault-primary-muted'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-vault-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-vault-primary text-white rounded-br-md'
              : 'bg-white border border-vault-border-light shadow-vault-sm rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Session Results */}
        {message.sessionResults && message.sessionResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.sessionResults.map(session => (
              <NavigationCard
                key={session.id}
                type="session"
                title={session.competitionName || session.sessionType}
                subtitle={`${new Date(session.date).toLocaleDateString()} • ${session.location}`}
                meta={`${session.jumpCount} jumps${session.bestHeight ? ` • Best: ${session.bestHeight}` : ''}`}
                hasVideo={session.hasVideos}
                onClick={() => onNavigate(session.id)}
              />
            ))}
          </div>
        )}

        {/* Jump Results - Use video cards for jumps with videos */}
        {message.jumpResults && message.jumpResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.jumpResults.map((jump, index) => (
              jump.hasVideo && jump.videoUrl ? (
                <ChatVideoCard
                  key={`${jump.sessionId}-${jump.jumpIndex}-${index}`}
                  jump={jump}
                  onNavigate={onNavigate}
                />
              ) : (
                <NavigationCard
                  key={`${jump.sessionId}-${jump.jumpIndex}-${index}`}
                  type="video"
                  title={`${jump.height} - ${jump.result === 'make' ? 'Cleared' : 'Missed'}`}
                  subtitle={`${new Date(jump.date).toLocaleDateString()} • ${jump.location}`}
                  meta={jump.competitionName || jump.rating}
                  hasVideo={jump.hasVideo}
                  onClick={() => onNavigate(jump.sessionId, jump.jumpIndex)}
                />
              )
            ))}
          </div>
        )}

        {/* Stats */}
        {message.stats && (
          <div className="mt-3 bg-white border border-vault-border-light rounded-xl p-4 shadow-vault-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {message.stats.personalBest && (
                <div>
                  <span className="text-vault-text-muted">Personal Best</span>
                  <p className="font-semibold text-vault-primary">{message.stats.personalBest}</p>
                </div>
              )}
              {message.stats.totalSessions !== undefined && (
                <div>
                  <span className="text-vault-text-muted">Sessions</span>
                  <p className="font-semibold">{message.stats.totalSessions}</p>
                </div>
              )}
              {message.stats.totalJumps !== undefined && (
                <div>
                  <span className="text-vault-text-muted">Total Jumps</span>
                  <p className="font-semibold">{message.stats.totalJumps}</p>
                </div>
              )}
              {message.stats.successRate !== undefined && (
                <div>
                  <span className="text-vault-text-muted">Success Rate</span>
                  <p className="font-semibold">{message.stats.successRate}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs text-vault-text-muted mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
