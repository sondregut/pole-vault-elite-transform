import React, { useState } from 'react';
import { MapPin, Video, Star, ChevronDown, Home, Users, Plus, List, TrendingUp, Search, Calendar } from 'lucide-react';

const SessionHistoryMock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'jumps' | 'videos'>('sessions');
  const [activeSort, setActiveSort] = useState<'date' | 'height' | 'rating'>('date');

  const ratingConfig: Record<string, { bg: string; text: string; label: string }> = {
    'Run Thru': { bg: 'bg-red-100', text: 'text-red-600', label: 'Run Thru' },
    'Glider': { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Glider' },
    'OK': { bg: 'bg-amber-100', text: 'text-amber-600', label: 'OK' },
    'Good': { bg: 'bg-green-100', text: 'text-green-600', label: 'Good' },
    'Great': { bg: 'bg-green-100', text: 'text-green-700', label: 'Great' },
  };

  const jumpHistory = [
    { id: 1, date: 'Nov 24', type: 'Comp', result: 'miss', height: "17'9\"", steps: 8, rating: 'Great', pole: "15'7 160lbs 1...", grip: '—', takeoff: '—', runup: '—', mid: '—', location: '—', notes: '—' },
    { id: 2, date: 'Nov 24', type: 'Comp', result: 'miss', height: "17'9\"", steps: 8, rating: 'OK', pole: "15'7 160lbs 1...", grip: '—', takeoff: '—', runup: '—', mid: '—', location: '—', notes: '—' },
    { id: 3, date: 'Nov 24', type: 'Comp', result: 'miss', height: "17'9\"", steps: 8, rating: 'OK', pole: "15'7 160lbs 1...", grip: '—', takeoff: '—', runup: '—', mid: '—', location: '—', notes: '—' },
    { id: 4, date: 'Nov 24', type: 'Comp', result: 'make', height: "17'5\"", steps: 8, rating: 'Good', pole: "15'7 160lbs 1...", grip: '—', takeoff: '—', runup: '—', mid: '—', location: '—', notes: '—' },
    { id: 5, date: 'Nov 23', type: 'Comp', result: 'miss', height: "18'0\"", steps: 18, rating: 'Run Thru', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 6, date: 'Nov 23', type: 'Comp', result: 'miss', height: "18'0\"", steps: 18, rating: 'OK', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: 'Perfect' },
    { id: 7, date: 'Nov 23', type: 'Comp', result: 'miss', height: "18'0\"", steps: 12, rating: 'Glider', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 8, date: 'Nov 23', type: 'Comp', result: 'make', height: "17'1\"", steps: 12, rating: 'Good', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 9, date: 'Nov 23', type: 'Comp', result: 'make', height: "16'5\"", steps: 12, rating: 'Good', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 10, date: 'Nov 23', type: 'Comp', result: 'miss', height: "16'5\"", steps: 12, rating: 'OK', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 11, date: 'Nov 23', type: 'Comp-W', result: '—', height: "16'5\"", steps: 12, rating: 'Good', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 12, date: 'Nov 23', type: 'Comp-W', result: '—', height: "16'5\"", steps: 6, rating: 'Good', pole: "15'7 160lbs 1...", grip: "15'9\"", takeoff: "14'9\"", runup: '88\'7"', mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 13, date: 'Nov 22', type: 'Training', result: '—', height: "17'1\"", steps: 8, rating: 'OK', pole: '—', grip: "15'9\"", takeoff: "13'9\"", runup: "82'0\"", mid: "55'9\"", location: 'Gainesville...', notes: '—' },
    { id: 14, date: 'Nov 22', type: 'Training', result: '—', height: "17'1\"", steps: 8, rating: '—', pole: '—', grip: "15'9\"", takeoff: "13'9\"", runup: "82'0\"", mid: "55'9\"", location: 'Gainesville...', notes: '—' },
    { id: 15, date: 'Nov 22', type: 'Training', result: '—', height: "17'1\"", steps: 8, rating: 'Good', pole: "15'4 170lbs", grip: "15'9\"", takeoff: "13'9\"", runup: "82'0\"", mid: "55'9\"", location: 'Gainesville...', notes: '—' },
    { id: 16, date: 'Nov 10', type: 'Training', result: '—', height: "14'1\"", steps: 8, rating: 'Great', pole: "16'1 190lbs 1...", grip: "13'5\"", takeoff: "13'9\"", runup: "131'9\"", mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 17, date: 'Nov 10', type: 'Training', result: '—', height: "14'1\"", steps: 8, rating: 'Great', pole: "16'1 190lbs 1...", grip: "13'5\"", takeoff: "13'9\"", runup: "131'9\"", mid: "52'6\"", location: 'Gainesville...', notes: '—' },
    { id: 18, date: 'Nov 8', type: 'Training', result: '—', height: "17'9\"", steps: 18, rating: 'Good', pole: "16'5 180lbs", grip: "15'11\"", takeoff: "14'1\"", runup: '88\'7"', mid: "54'2\"", location: 'Princeton...', notes: '—' },
    { id: 19, date: 'Nov 8', type: 'Training', result: '—', height: "17'5\"", steps: 18, rating: 'OK', pole: "16'5 180lbs", grip: "15'11\"", takeoff: "14'1\"", runup: '88\'7"', mid: "54'2\"", location: 'Princeton...', notes: '—' },
    { id: 20, date: 'Nov 8', type: 'Training', result: '—', height: "17'1\"", steps: 16, rating: 'Great', pole: "15'7 170lbs", grip: "15'9\"", takeoff: "13'11\"", runup: "82'0\"", mid: "49'2\"", location: 'Princeton...', notes: 'Perfect' },
    { id: 21, date: 'Nov 5', type: 'Training', result: '—', height: "18'0\"", steps: 18, rating: 'Good', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'3\"", runup: '88\'7"', mid: "54'10\"", location: 'Home Track', notes: '—' },
    { id: 22, date: 'Nov 5', type: 'Training', result: '—', height: "17'9\"", steps: 18, rating: 'Great', pole: "16'5 180lbs", grip: "15'11\"", takeoff: "14'1\"", runup: '88\'7"', mid: "54'2\"", location: 'Home Track', notes: '—' },
    { id: 23, date: 'Nov 5', type: 'Training', result: '—', height: "17'5\"", steps: 16, rating: 'OK', pole: "15'7 170lbs", grip: "15'9\"", takeoff: "13'11\"", runup: "82'0\"", mid: "49'2\"", location: 'Home Track', notes: '—' },
    { id: 24, date: 'Nov 3', type: 'Comp', result: 'make', height: "18'4\"", steps: 18, rating: 'Great', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'5\"", runup: '88\'7"', mid: "54'10\"", location: 'Tokyo...', notes: 'PR!' },
    { id: 25, date: 'Nov 3', type: 'Comp', result: 'make', height: "18'0\"", steps: 18, rating: 'Good', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'3\"", runup: '88\'7"', mid: "54'10\"", location: 'Tokyo...', notes: '—' },
    { id: 26, date: 'Nov 3', type: 'Comp', result: 'miss', height: "18'8\"", steps: 18, rating: 'OK', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'5\"", runup: '88\'7"', mid: "54'10\"", location: 'Tokyo...', notes: '—' },
    { id: 27, date: 'Nov 3', type: 'Comp', result: 'miss', height: "18'8\"", steps: 18, rating: 'Glider', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'5\"", runup: '88\'7"', mid: "54'10\"", location: 'Tokyo...', notes: '—' },
    { id: 28, date: 'Nov 3', type: 'Comp', result: 'miss', height: "18'8\"", steps: 18, rating: 'OK', pole: "16'9 185lbs", grip: "16'1\"", takeoff: "14'5\"", runup: '88\'7"', mid: "54'10\"", location: 'Tokyo...', notes: '—' },
    { id: 29, date: 'Nov 1', type: 'Training', result: '—', height: "17'9\"", steps: 18, rating: 'Good', pole: "16'5 180lbs", grip: "15'11\"", takeoff: "14'1\"", runup: '88\'7"', mid: "54'2\"", location: 'Home Track', notes: '—' },
    { id: 30, date: 'Nov 1', type: 'Training', result: '—', height: "17'5\"", steps: 16, rating: 'Great', pole: "15'7 170lbs", grip: "15'9\"", takeoff: "13'11\"", runup: "82'0\"", mid: "49'2\"", location: 'Home Track', notes: 'Clean' },
  ];

  const sessions = [
    {
      id: 1,
      location: 'Tokyo Olympic Stadium',
      type: 'competition',
      competitionName: 'Olympic Games',
      day: 'SAT',
      date: 'August 3, 2024',
      best: "19'4\"",
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
      best: "18'10\"",
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
      best: "18'4\"",
      jumps: 12,
      rating: 3,
      hasVideo: false,
      videoCount: 0,
    },
  ];

  const videos = [
    {
      id: 1,
      height: "17'9\"",
      rating: 'OK',
      date: 'Nov 24',
      location: '',
      thumbnail: '/video-thumb-1.png',
    },
    {
      id: 2,
      height: "18'0\"",
      rating: 'RUN THRU',
      date: 'Nov 23',
      location: 'Gainesville High School',
      thumbnail: '/video-thumb-2.png',
    },
    {
      id: 3,
      height: "18'0\"",
      rating: '',
      date: 'Nov 22',
      location: '',
      thumbnail: '/video-thumb-3.png',
    },
    {
      id: 4,
      height: "17'1\"",
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
                      alt={`Jump at ${video.height}`}
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
        ) : activeTab === 'jumps' ? (
          /* Jump History Tab - Horizontally Scrollable Table View */
          <div className="px-2 pt-2 pb-16">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Horizontal scroll container */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Table Header */}
                  <div className="flex items-center bg-gray-50 border-b border-gray-200 px-2 py-1.5">
                    <span className="w-12 text-[7px] font-semibold text-gray-500 flex-shrink-0 flex items-center gap-0.5">Date <ChevronDown className="w-2 h-2" /></span>
                    <span className="w-12 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Type</span>
                    <span className="w-10 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Result</span>
                    <span className="w-10 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Height</span>
                    <span className="w-8 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Steps</span>
                    <span className="w-14 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Rating</span>
                    <span className="w-20 text-[7px] font-semibold text-gray-500 flex-shrink-0">Pole</span>
                    <span className="w-8 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Grip</span>
                    <span className="w-12 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Take-off</span>
                    <span className="w-10 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Run-up</span>
                    <span className="w-8 text-[7px] font-semibold text-gray-500 text-center flex-shrink-0">Mid</span>
                    <span className="w-20 text-[7px] font-semibold text-gray-500 flex-shrink-0">Location</span>
                    <span className="w-16 text-[7px] font-semibold text-gray-500 flex-shrink-0">Notes</span>
                  </div>

                  {/* Jump Rows */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {jumpHistory.map((jump, idx) => (
                      <div
                        key={jump.id}
                        className={`flex items-center px-2 py-1.5 border-b border-gray-100 last:border-0 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <span className="w-12 text-[7px] text-gray-500 flex-shrink-0">{jump.date}</span>
                        <span className="w-12 text-[7px] text-gray-600 text-center flex-shrink-0">{jump.type}</span>
                        <div className="w-10 flex justify-center flex-shrink-0">
                          {jump.result === 'make' ? (
                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[6px] font-bold">✓</span>
                          ) : jump.result === 'miss' ? (
                            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[6px] font-bold">✕</span>
                          ) : (
                            <span className="text-[7px] text-gray-300">—</span>
                          )}
                        </div>
                        <span className="w-10 text-[8px] font-semibold text-vault-text text-center flex-shrink-0">{jump.height}</span>
                        <span className="w-8 text-[8px] text-vault-text text-center flex-shrink-0">{jump.steps}</span>
                        <div className="w-14 flex justify-center flex-shrink-0">
                          {jump.rating !== '—' ? (
                            <span className={`px-1 py-0.5 rounded text-[6px] font-medium ${ratingConfig[jump.rating]?.bg || 'bg-gray-100'} ${ratingConfig[jump.rating]?.text || 'text-gray-600'}`}>
                              {ratingConfig[jump.rating]?.label || jump.rating}
                            </span>
                          ) : (
                            <span className="text-[7px] text-gray-300">—</span>
                          )}
                        </div>
                        <span className="w-20 text-[6px] text-gray-600 truncate flex-shrink-0">{jump.pole}</span>
                        <span className="w-8 text-[7px] text-vault-text text-center flex-shrink-0">{jump.grip}</span>
                        <span className="w-12 text-[7px] text-gray-500 text-center flex-shrink-0">{jump.takeoff}</span>
                        <span className="w-10 text-[7px] text-gray-500 text-center flex-shrink-0">{jump.runup}</span>
                        <span className="w-8 text-[7px] text-gray-500 text-center flex-shrink-0">{jump.mid}</span>
                        <span className="w-20 text-[6px] text-gray-500 truncate flex-shrink-0">{jump.location}</span>
                        <span className="w-16 text-[6px] text-gray-500 truncate flex-shrink-0">{jump.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
