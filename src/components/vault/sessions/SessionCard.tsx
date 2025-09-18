import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Session, Jump, formatDate, formatHeight, ratingLabels } from '@/types/vault';
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
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
      <Link to={`/vault/sessions/${session.id}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-900 mb-2">
                {dateLabel}
              </CardTitle>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{session.location || 'Training'}</span>
                </div>
                {session.sessionType && (
                  <Badge variant="outline" className="text-xs">
                    {session.sessionType}
                  </Badge>
                )}
              </div>

              {session.weather && (
                <div className="text-sm text-gray-500 mb-2">
                  <span>{session.weather}</span>
                  {session.temperature && <span> • {session.temperature}°</span>}
                  {session.windSpeed && <span> • Wind: {session.windSpeed}</span>}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {bestJump ? formatHeight(bestJump.height, bestJump.barUnits) : '—'}
              </div>
              <div className="text-sm text-gray-500">
                Personal best
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">{jumps.length}</span>
              </div>
              <div className="text-xs text-gray-600">Jumps</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {successRate >= 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-lg font-semibold text-gray-900">{successRate}%</span>
              </div>
              <div className="text-xs text-gray-600">Success</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Video className="h-4 w-4 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">{videoJumps.length}</span>
              </div>
              <div className="text-xs text-gray-600">Videos</div>
            </div>
          </div>

          {/* Equipment Used */}
          {uniquePoles.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Equipment used:</div>
              <div className="flex flex-wrap gap-1">
                {uniquePoles.slice(0, 3).map((pole, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {pole}
                  </Badge>
                ))}
                {uniquePoles.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{uniquePoles.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Session Goal */}
          {session.sessionGoal && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">Session Goal</div>
              <div className="text-sm text-blue-800">{session.sessionGoal}</div>
            </div>
          )}

          {/* View Details Button */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {formatDate(session.date)} • {session.sessionType || 'Training'}
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default SessionCard;