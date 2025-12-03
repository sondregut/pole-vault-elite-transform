import React from 'react';
import { Link } from 'react-router-dom';
import { Session, formatHeight } from '@/types/vault';
import {
  MapPin,
  Cloud,
  Video,
  Star
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

  // Calculate average rating (1-5 scale)
  const ratingMap: Record<string, number> = {
    'Run Thru': 1,
    'Glider': 2,
    'OK': 3,
    'Good': 4,
    'Great': 5
  };

  const jumpsWithRating = jumps.filter(j => j.rating && ratingMap[j.rating]);
  const avgRating = jumpsWithRating.length > 0
    ? jumpsWithRating.reduce((sum, j) => sum + (ratingMap[j.rating] || 0), 0) / jumpsWithRating.length
    : 0;

  // Format date
  const sessionDate = new Date(session.date);
  const dayOfWeek = sessionDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const fullDate = sessionDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Determine if competition
  const isCompetition = session.sessionType?.toLowerCase().includes('competition') ||
                        session.sessionType?.toLowerCase().includes('meet') ||
                        session.sessionType?.toLowerCase() === 'comp';

  // Get competition/meet name if available
  const meetName = session.competitionName || session.meetName || (isCompetition ? session.location : null);

  // Weather display
  const hasWeather = session.weather || session.temperature;
  const weatherText = [
    session.weather,
    session.temperature ? `${session.temperature}°F` : null
  ].filter(Boolean).join(', ');

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? 'text-amber-500 fill-amber-500'
              : 'text-stone-300 fill-stone-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/vault/sessions/${session.id}`} className={`block ${className}`}>
      <div className="bg-[#fefdfb] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#e8e4df] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#8b9299] tracking-wider">
                  {dayOfWeek}
                </span>
                {meetName && (
                  <span className="text-xs font-bold text-[#d4a056]">
                    {meetName}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-[#1a3a5c]">
                {fullDate}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 text-[11px] font-bold rounded-lg tracking-wide uppercase ${
                isCompetition
                  ? 'bg-[#fef7ed] text-[#d4a056] border border-[#f5dfc4]'
                  : 'bg-[#e8f4f8] text-[#1a6b8a] border border-[#c5e4ed]'
              }`}>
                {isCompetition ? 'Comp' : 'Training'}
              </span>
              {videoJumps.length > 0 && (
                <div className="flex items-center gap-1.5 text-[#6b7c8a]">
                  <Video className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    {videoJumps.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-[#e8e4df]" />

        {/* Location & Weather */}
        {(session.location || hasWeather) && (
          <div className="px-5 py-3 flex flex-wrap items-center gap-3">
            {session.location && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f3f0] rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#8b9299]" />
                <span className="text-xs text-[#5a6670] font-medium">
                  {session.location}
                </span>
              </div>
            )}
            {hasWeather && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f3f0] rounded-full">
                <Cloud className="w-3.5 h-3.5 text-[#8b9299]" />
                <span className="text-xs text-[#5a6670] font-medium">
                  {weatherText}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mx-5 mb-5 bg-gradient-to-b from-[#f8f6f3] to-[#f3f1ed] rounded-xl border border-[#e8e4df]">
          <div className="flex divide-x divide-[#e8e4df]">
            {/* Best Height */}
            <div className="flex-1 py-4 px-3 text-center">
              <p className="text-[10px] text-[#8b9299] uppercase tracking-wider font-bold mb-1.5">
                {isCompetition ? 'Official' : 'Max'}
              </p>
              <p className="text-xl font-bold text-[#1a6b8a]">
                {bestJump ? formatHeight(bestJump.height, bestJump.barUnits) : '—'}
              </p>
            </div>

            {/* Jumps */}
            <div className="flex-1 py-4 px-3 text-center">
              <p className="text-[10px] text-[#8b9299] uppercase tracking-wider font-bold mb-1.5">
                Jumps
              </p>
              <p className="text-xl font-bold text-[#1a3a5c]">
                {jumps.length}
              </p>
            </div>

            {/* Rating */}
            <div className="flex-1 py-4 px-3 text-center">
              <p className="text-[10px] text-[#8b9299] uppercase tracking-wider font-bold mb-1.5">
                Rating
              </p>
              <div className="flex justify-center gap-0.5">
                {avgRating > 0 ? renderStars(avgRating) : (
                  <span className="text-sm text-[#8b9299]">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session Notes */}
        {session.sessionGoal && (
          <div className="mx-5 mb-5 pl-3 border-l-3 border-[#1a6b8a]/40">
            <p className="text-sm text-[#5a6670] italic line-clamp-2">
              {session.sessionGoal}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SessionCard;
