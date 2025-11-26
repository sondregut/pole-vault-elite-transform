import React from 'react';
import { MapPin, Trophy, Dumbbell } from 'lucide-react';

interface SessionCardProps {
  location: string;
  type: 'Competition' | 'Training';
  date: string;
  bestHeight: string;
  jumps: number;
  place?: string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  location,
  type,
  date,
  bestHeight,
  jumps,
  place,
}) => {
  const isCompetition = type === 'Competition';

  return (
    <div className="bg-white rounded-xl p-4 shadow-vault-sm border border-vault-border-light mb-3 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isCompetition ? 'bg-amber-100' : 'bg-vault-primary-muted'
            }`}
          >
            {isCompetition ? (
              <Trophy className="w-5 h-5 text-amber-600" />
            ) : (
              <Dumbbell className="w-5 h-5 text-vault-primary" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-vault-text text-sm leading-tight">{location}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isCompetition
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-vault-primary-muted text-vault-primary'
                }`}
              >
                {type}
              </span>
              <span className="text-xs text-vault-text-muted">{date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-vault-border-light">
        <div className="text-center">
          <p className="text-xs text-vault-text-muted mb-0.5">Best</p>
          <p className="font-bold text-vault-primary text-lg">{bestHeight}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-vault-text-muted mb-0.5">Jumps</p>
          <p className="font-semibold text-vault-text-secondary">{jumps}</p>
        </div>
        {place && (
          <div className="text-center">
            <p className="text-xs text-vault-text-muted mb-0.5">Place</p>
            <p className="font-semibold text-amber-600">{place}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SessionHistoryMock: React.FC = () => {
  const sessions: SessionCardProps[] = [
    {
      location: 'Tokyo Olympic Stadium',
      type: 'Competition',
      date: 'Aug 3',
      bestHeight: '5.90m',
      jumps: 8,
      place: '1st',
    },
    {
      location: 'Princeton University Track',
      type: 'Training',
      date: 'Jul 28',
      bestHeight: '5.75m',
      jumps: 14,
    },
    {
      location: 'Home Track',
      type: 'Training',
      date: 'Jul 24',
      bestHeight: '5.60m',
      jumps: 12,
    },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto">
      {/* Status Bar Area */}
      <div className="h-12" />

      {/* Header */}
      <div className="px-4 pt-2 pb-4">
        <h2 className="text-xl font-bold text-vault-text">History</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          <button className="px-4 py-1.5 bg-vault-primary text-white text-sm font-medium rounded-full">
            All
          </button>
          <button className="px-4 py-1.5 bg-white text-vault-text-secondary text-sm font-medium rounded-full border border-vault-border">
            Competitions
          </button>
          <button className="px-4 py-1.5 bg-white text-vault-text-secondary text-sm font-medium rounded-full border border-vault-border">
            Training
          </button>
        </div>
      </div>

      {/* Session List */}
      <div className="px-4 pb-4">
        {sessions.map((session, index) => (
          <SessionCard key={index} {...session} />
        ))}
      </div>
    </div>
  );
};

export default SessionHistoryMock;
