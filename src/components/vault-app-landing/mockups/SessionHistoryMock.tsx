import React, { useState } from 'react';
import { MapPin, Video, Star, ChevronDown, Home, Users, Plus, List, TrendingUp, Search, Calendar } from 'lucide-react';

const SessionHistoryMock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'jumps' | 'videos'>('videos');
  const [activeSort, setActiveSort] = useState<'date' | 'height' | 'rating'>('date');

  const sessions = [
    {
      id: 1,
      location: 'Tokyo Olympic Stadium',
      type: 'competition',
      competitionName: 'Olympic Games',
      day: 'SAT',
      date: 'August 3, 2024',
      best: '5.90m',
      jumps: 8,
      rating: 5,
      hasVideo: true,
      videoCount: 3,
    },
    {
      id: 2,
      location: 'Princeton University Track',
      type: 'training',
      day: 'THU',
      date: 'July 28, 2024',
      best: '5.75m',
      jumps: 14,
      rating: 4,
      hasVideo: true,
      videoCount: 5,
    },
    {
      id: 3,
      location: 'Home Track',
      type: 'training',
      day: 'WED',
      date: 'July 24, 2024',
      best: '5.60m',
      jumps: 12,
      rating: 3,
      hasVideo: false,
      videoCount: 0,
    },
  ];

  const videos = [
    {
      id: 1,
      height: '5.40',
      rating: 'OK',
      date: 'Nov 24',
      location: '',
      thumbnail: '/video-thumb-1.png',
    },
    {
      id: 2,
      height: '5.50',
      rating: 'RUN THRU',
      date: 'Nov 23',
      location: 'Gainesville High School',
      thumbnail: '/video-thumb-2.png',
    },
    {
      id: 3,
      height: '5.50',
      rating: '',
      date: 'Nov 22',
      location: '',
      thumbnail: '/video-thumb-3.png',
    },
    {
      id: 4,
      height: '5.20',
      rating: '',
      date: 'Nov 21',
      location: '',
      thumbnail: '/video-thumb-4.png',
    },
  ];

  const tabs = [
    { id: 'sessions', label: 'Sessions' },
    { id: 'jumps', label: 'Jump History' },
    { id: 'videos', label: 'Videos' },
  ] as const;

  const getRatingColor = (rating: string) => {
    switch (rating?.toUpperCase()) {
      case 'GREAT': return 'text-blue-500';
      case 'GOOD': return 'text-green-500';
      case 'OK': return 'text-vault-primary';
      case 'RUN THRU': return 'text-amber-500';
      case 'GLIDER': return 'text-orange-500';
      default: return 'text-vault-text-muted';
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      {/* Status Bar Area */}
      <div className="h-8" />

      {/* Header */}
      <div className="px-3 pt-1 pb-1">
        <h2 className="text-[15px] font-bold text-vault-text">Session History</h2>
        <p className="text-[9px] text-vault-text-secondary mt-0.5">
          View and manage your training sessions
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="px-3 pt-2 pb-1 border-b border-vault-border">
        <div className="flex justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-1 py-1.5 flex-1"
            >
              <span
                className={`text-[10px] font-medium ${
                  activeTab === tab.id
                    ? 'text-vault-primary font-semibold'
                    : 'text-vault-text-secondary'
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-vault-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar - for Sessions and Jump History */}
      {(activeTab === 'sessions' || activeTab === 'jumps') && (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-vault-border-light">
              <Search className="w-3.5 h-3.5 text-vault-text-muted" />
              <span className="text-[10px] text-vault-text-muted">Search by location or notes...</span>
            </div>
            <button className="w-9 h-9 bg-white rounded-lg border border-vault-border-light flex items-center justify-center">
              <Calendar className="w-4 h-4 text-vault-text-muted" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'videos' ? (
          <>
            {/* Sort Controls */}
            <div className="px-3 py-2 flex items-center gap-1.5">
              <span className="text-[8px] text-vault-text-secondary">Sort by:</span>
              {(['date', 'height', 'rating'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  className={`px-2 py-0.5 text-[8px] font-medium rounded-full flex items-center gap-0.5 ${
                    activeSort === sort
                      ? 'bg-vault-primary text-white'
                      : 'bg-white text-vault-text-secondary border border-vault-border'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  {activeSort === sort && <ChevronDown className="w-2 h-2" />}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <div className="px-2 pb-16 grid grid-cols-2 gap-2">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm border border-vault-border-light overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={`Jump at ${video.height}m`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Info */}
                  <div className="p-2">
                    <p className="text-[12px] font-bold text-vault-text">{video.height}</p>
                    {video.rating && (
                      <p className={`text-[8px] font-semibold uppercase ${getRatingColor(video.rating)}`}>
                        {video.rating}
                      </p>
                    )}
                    <p className="text-[8px] text-vault-text-muted">{video.date}</p>
                    {video.location && (
                      <p className="text-[7px] text-vault-text-muted truncate">{video.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Sessions Tab Content */
          <div className="px-3 pt-3 space-y-2.5 pb-16">
            {sessions.map((session) => {
              const isCompetition = session.type === 'competition';

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl shadow-vault-sm border border-vault-border-light overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-3 pt-3 pb-2 border-b border-vault-border-light">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[8px] font-semibold text-vault-text-muted tracking-wider">
                            {session.day}
                          </span>
                          {isCompetition && session.competitionName && (
                            <span className="text-[8px] font-semibold text-amber-600">
                              {session.competitionName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-vault-text">
                          {session.date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-1.5 py-0.5 text-[7px] font-semibold rounded tracking-wide uppercase ${
                          isCompetition
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-vault-primary/10 text-vault-primary border border-vault-primary/30'
                        }`}>
                          {isCompetition ? 'Comp' : 'Training'}
                        </span>
                        {session.hasVideo && (
                          <div className="flex items-center gap-0.5 bg-vault-primary/10 px-1.5 py-0.5 rounded">
                            <Video className="w-2.5 h-2.5 text-vault-primary" />
                            <span className="text-[8px] font-semibold text-vault-primary">
                              {session.videoCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="px-3 py-1.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-vault-text-secondary" />
                      <span className="text-[9px] text-vault-text-secondary font-medium">
                        {session.location}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="mx-3 mb-3 bg-slate-50 rounded-lg border border-vault-border-light">
                    <div className="flex divide-x divide-vault-border-light">
                      <div className="flex-1 py-2 px-2 text-center">
                        <p className="text-[7px] text-vault-text-muted uppercase tracking-wide font-semibold mb-0.5">
                          {isCompetition ? 'Official' : 'Max'}
                        </p>
                        <p className="text-[13px] font-bold text-vault-text">{session.best}</p>
                      </div>
                      <div className="flex-1 py-2 px-2 text-center">
                        <p className="text-[7px] text-vault-text-muted uppercase tracking-wide font-semibold mb-0.5">
                          Jumps
                        </p>
                        <p className="text-[13px] font-bold text-vault-text">{session.jumps}</p>
                      </div>
                      <div className="flex-1 py-2 px-2 text-center">
                        <p className="text-[7px] text-vault-text-muted uppercase tracking-wide font-semibold mb-0.5">
                          Rating
                        </p>
                        <div className="flex justify-center gap-[1px]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-2.5 h-2.5 ${
                                star <= session.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-vault-border px-2 py-1.5 flex justify-around items-center">
        <div className="flex flex-col items-center gap-0.5">
          <Home className="w-4 h-4 text-vault-text-muted" />
          <span className="text-[7px] text-vault-text-muted">Home</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Users className="w-4 h-4 text-vault-text-muted" />
          <span className="text-[7px] text-vault-text-muted">Feed</span>
        </div>
        <div className="flex flex-col items-center -mt-3">
          <div className="w-8 h-8 bg-vault-primary rounded-full flex items-center justify-center shadow-md">
            <Plus className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <List className="w-4 h-4 text-vault-primary" />
          <span className="text-[7px] text-vault-primary font-semibold">Sessions</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <TrendingUp className="w-4 h-4 text-vault-text-muted" />
          <span className="text-[7px] text-vault-text-muted">Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryMock;
