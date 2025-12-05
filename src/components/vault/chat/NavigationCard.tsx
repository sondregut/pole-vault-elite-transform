import { Video, Calendar, ChevronRight } from 'lucide-react';

interface NavigationCardProps {
  type: 'session' | 'video';
  title: string;
  subtitle: string;
  meta?: string;
  hasVideo?: boolean;
  onClick: () => void;
}

export function NavigationCard({
  type,
  title,
  subtitle,
  meta,
  hasVideo,
  onClick,
}: NavigationCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-vault-border-light rounded-xl p-3 shadow-vault-sm hover:shadow-vault hover:border-vault-primary/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-vault-primary-muted flex items-center justify-center">
          {type === 'video' || hasVideo ? (
            <Video className="w-5 h-5 text-vault-primary" />
          ) : (
            <Calendar className="w-5 h-5 text-vault-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-vault-text truncate">{title}</p>
          <p className="text-sm text-vault-text-muted truncate">{subtitle}</p>
          {meta && (
            <p className="text-xs text-vault-text-muted mt-1">{meta}</p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-vault-text-muted group-hover:text-vault-primary transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}
