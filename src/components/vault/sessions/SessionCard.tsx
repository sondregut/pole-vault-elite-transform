import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Session, Jump, formatDate, formatHeight, ratingLabels } from '@/types/vault';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultPoles } from '@/hooks/useVaultData';
import { getPoleDisplayName } from '@/utils/poleHelpers';
import {
  Calendar,
  MapPin,
  Target,
  Activity,
  Video,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SessionCardProps {
  session: Session;
  className?: string;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, className = '' }) => {
  const { user } = useFirebaseAuth();
  const { poles } = useVaultPoles(user);
  const jumps = session.jumps || [];
  const successfulJumps = jumps.filter(jump => jump.result === 'make');
  const videoJumps = jumps.filter(jump => jump.videoUrl || jump.videoLocalUri);

  // Calculate best jump
  const bestJump = successfulJumps.length > 0
    ? successfulJumps.reduce((max, jump) => {
        const height = parseFloat(jump.height) || 0;
        const maxHeight = parseFloat(max.height) || 0;
        return height > maxHeight ? jump : max;
      })
    : null;

  // Calculate success rate
  const successRate = jumps.length > 0 ? Math.round((successfulJumps.length / jumps.length) * 100) : 0;

  // Format date
  const sessionDate = new Date(session.date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let dateLabel;
  if (sessionDate.toDateString() === today.toDateString()) {
    dateLabel = 'Today';
  } else if (sessionDate.toDateString() === yesterday.toDateString()) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = formatDate(session.date);
  }

  // Get unique poles used
  const uniquePoles = [...new Set(jumps.map(jump => jump.pole).filter(Boolean))];

  return (
    <div className={`bg-white rounded-2xl shadow-vault border border-vault-border-light hover:shadow-vault-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden ${className}`}>
      <Link to={`/vault/sessions/${session.id}`}>
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-vault-text mb-2">
                {dateLabel}
              </h3>

              <div className="flex items-center gap-4 text-sm text-vault-text-secondary mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-vault-text-muted" />
                  <span>{session.location || 'Training'}</span>
                </div>
                {session.sessionType && (
                  <Badge className="text-xs bg-vault-primary-muted text-vault-primary border-vault-primary/20">
                    {session.sessionType}
                  </Badge>
                )}
              </div>

              {session.weather && (
                <div className="text-sm text-vault-text-muted mb-2">
                  <span>{session.weather}</span>
                  {session.temperature && <span> • {session.temperature}°</span>}
                  {session.windSpeed && <span> • Wind: {session.windSpeed}</span>}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-vault-text mb-1">
                {bestJump ? formatHeight(bestJump.height, bestJump.barUnits) : '—'}
              </div>
              <div className="text-sm text-vault-text-muted">
                Personal best
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-vault-primary-muted rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-vault-primary" />
                <span className="text-lg font-semibold text-vault-text">{jumps.length}</span>
              </div>
              <div className="text-xs text-vault-text-secondary">Jumps</div>
            </div>

            {session.sessionType?.toLowerCase() !== 'training' && (
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {successRate >= 50 ? (
                    <CheckCircle className="h-4 w-4 text-vault-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-vault-warning" />
                  )}
                  <span className="text-lg font-semibold text-vault-text">{successRate}%</span>
                </div>
                <div className="text-xs text-vault-text-secondary">Success</div>
              </div>
            )}

            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Video className="h-4 w-4 text-vault-warning" />
                <span className="text-lg font-semibold text-vault-text">{videoJumps.length}</span>
              </div>
              <div className="text-xs text-vault-text-secondary">Videos</div>
            </div>
          </div>

          {/* Equipment Used */}
          {uniquePoles.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-vault-text-secondary mb-2">Equipment used:</div>
              <div className="flex flex-wrap gap-1">
                {uniquePoles.slice(0, 3).map((pole, index) => (
                  <Badge key={index} className="text-xs bg-vault-primary-muted text-vault-primary border-vault-primary/20">
                    {getPoleDisplayName(pole, poles)}
                  </Badge>
                ))}
                {uniquePoles.length > 3 && (
                  <Badge className="text-xs bg-vault-primary-muted text-vault-primary border-vault-primary/20">
                    +{uniquePoles.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Session Goal */}
          {session.sessionGoal && (
            <div className="mb-4 p-3 bg-vault-primary-muted rounded-xl border border-vault-primary/20">
              <div className="text-sm font-semibold text-vault-primary mb-1">Session Goal</div>
              <div className="text-sm text-vault-text-secondary">{session.sessionGoal}</div>
            </div>
          )}

          {/* View Details Button */}
          <div className="flex justify-between items-center pt-3 border-t border-vault-border-light">
            <div className="text-sm text-vault-text-muted">
              {formatDate(session.date)} • {session.sessionType || 'Training'}
            </div>
            <Button variant="ghost" size="sm" className="text-vault-primary hover:text-vault-primary-dark hover:bg-vault-primary-muted font-semibold">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SessionCard;