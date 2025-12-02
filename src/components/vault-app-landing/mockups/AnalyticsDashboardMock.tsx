import React, { useState } from 'react';
import { Calendar, BarChart3, Trophy } from 'lucide-react';

const AnalyticsDashboardMock: React.FC = () => {
  // Data matching the screenshots
  const stepsData = [
    { steps: 8, count: 13 },
    { steps: 10, count: 3 },
    { steps: 12, count: 7 },
    { steps: 14, count: 1 },
    { steps: 18, count: 8 },
  ];

  const maxStepCount = Math.max(...stepsData.map(d => d.count));

  // Rating data by step filter
  const [selectedStepFilter, setSelectedStepFilter] = useState<string>('all');

  const ratingDataByFilter: Record<string, { name: string; count: number; color: string }[]> = {
    all: [
      { name: 'Great', count: 10, color: '#60A5FA' },
      { name: 'Good', count: 7, color: '#6EE7B7' },
      { name: 'Ok', count: 6, color: '#FCD34D' },
      { name: 'Glider', count: 1, color: '#FDBA74' },
    ],
    '6': [
      { name: 'Great', count: 2, color: '#60A5FA' },
      { name: 'Good', count: 1, color: '#6EE7B7' },
      { name: 'Ok', count: 1, color: '#FCD34D' },
      { name: 'Glider', count: 0, color: '#FDBA74' },
    ],
    '8': [
      { name: 'Great', count: 5, color: '#60A5FA' },
      { name: 'Good', count: 4, color: '#6EE7B7' },
      { name: 'Ok', count: 3, color: '#FCD34D' },
      { name: 'Glider', count: 1, color: '#FDBA74' },
    ],
    '10': [
      { name: 'Great', count: 3, color: '#60A5FA' },
      { name: 'Good', count: 2, color: '#6EE7B7' },
      { name: 'Ok', count: 2, color: '#FCD34D' },
      { name: 'Glider', count: 0, color: '#FDBA74' },
    ],
  };

  const ratingData = ratingDataByFilter[selectedStepFilter].filter(r => r.count > 0);
  const totalJumps = ratingData.reduce((sum, r) => sum + r.count, 0);

  const poleData = [
    { rank: 1, name: "ESSX 16'5' 190lbs 18,3", jumps: 6 },
    { rank: 2, name: "Pacer Composite 15'7' 13,9", jumps: 5 },
    { rank: 3, name: "Pacer Carbon 16'9' 13,6", jumps: 3 },
    { rank: 4, name: "Pacer Carbon 16'9' 13,3", jumps: 3 },
    { rank: 5, name: "Pacer Composite 16'5' 14,0", jumps: 2 },
  ];

  const maxPoleJumps = Math.max(...poleData.map(p => p.jumps));

  return (
    <div className="h-full bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto overflow-y-auto">
      {/* Status Bar Area */}
      <div className="h-12" />

      {/* Header */}
      <div className="px-4 pt-2 pb-3">
        <h2 className="text-[22px] font-bold text-vault-text">Analytics</h2>
        <p className="text-[12px] text-vault-text-secondary mt-0.5">Track your performance trends</p>

        {/* Time Filter */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto">
          {['30D', '60D', '90D', '1Y', 'All', 'Custom'].map((period, i) => (
            <button
              key={period}
              className={`px-2.5 py-1 text-[9px] font-medium rounded-full whitespace-nowrap ${
                i === 4
                  ? 'bg-vault-primary text-white'
                  : 'bg-white text-vault-text-secondary border border-vault-border'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards - 3 columns */}
      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-xl p-2 shadow-vault-sm border border-vault-border-light text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Calendar className="w-2.5 h-2.5 text-vault-text-muted" />
            <span className="text-[7px] text-vault-text-muted leading-tight">Total<br/>Sessions</span>
          </div>
          <p className="text-[14px] font-bold text-vault-text">20</p>
          <p className="text-[6px] text-vault-text-muted">(5 Competitions)</p>
        </div>
        <div className="bg-white rounded-xl p-2 shadow-vault-sm border border-vault-border-light text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <BarChart3 className="w-2.5 h-2.5 text-vault-text-muted" />
            <span className="text-[7px] text-vault-text-muted leading-tight">Total<br/>Jumps</span>
          </div>
          <p className="text-[14px] font-bold text-vault-text">30</p>
          <p className="text-[6px] text-vault-success">+21% vs prev 30 days</p>
        </div>
        <div className="bg-white rounded-xl p-2 shadow-vault-sm border border-vault-border-light text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Trophy className="w-2.5 h-2.5 text-vault-text-muted" />
            <span className="text-[7px] text-vault-text-muted leading-tight">Best<br/>Height</span>
          </div>
          <p className="text-[14px] font-bold text-vault-text">5.90m</p>
          <p className="text-[6px] text-amber-500">Tokyo</p>
        </div>
      </div>

      {/* Distribution of Jumps by Runup Steps */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <h3 className="text-[11px] font-semibold text-vault-text mb-3">Distribution of Jumps by Runup Steps</h3>
          <div className="flex items-end justify-between h-20 gap-1 px-1">
            {stepsData.map((item) => (
              <div key={item.steps} className="flex flex-col items-center flex-1">
                <span className="text-[8px] font-semibold text-vault-text mb-1">{item.count}</span>
                <div
                  className="w-full bg-vault-primary rounded-t min-h-[4px]"
                  style={{ height: `${(item.count / maxStepCount) * 50}px` }}
                />
                <span className="text-[7px] text-vault-text-muted mt-1">{item.steps} steps</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jump Quality Distribution - Donut Chart */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <h3 className="text-[11px] font-semibold text-vault-text mb-2">Jump Quality Distribution</h3>

          {/* Steps Filter */}
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {[
              { key: 'all', label: 'All Steps' },
              { key: '6', label: '6 steps' },
              { key: '8', label: '8 steps' },
              { key: '10', label: '10 steps' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStepFilter(filter.key)}
                className={`px-2 py-0.5 text-[8px] font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedStepFilter === filter.key
                    ? 'bg-vault-primary text-white'
                    : 'bg-vault-bg-warm-start text-vault-text-secondary hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="100" height="100" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                {/* Dynamic segments based on rating data */}
                {(() => {
                  const circumference = 2 * Math.PI * 35; // ~220
                  let cumulativeOffset = 0;

                  return ratingData.map((rating, index) => {
                    const segmentLength = (rating.count / totalJumps) * circumference;
                    const dashOffset = -cumulativeOffset;
                    cumulativeOffset += segmentLength;

                    return (
                      <circle
                        key={rating.name}
                        cx="50" cy="50" r="35"
                        fill="none"
                        stroke={rating.color}
                        strokeWidth="12"
                        strokeDasharray={`${segmentLength} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease' }}
                      />
                    );
                  });
                })()}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-vault-text">{totalJumps}</span>
                <span className="text-[8px] text-vault-text-muted">jumps</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
              {ratingData.map((rating) => (
                <div key={rating.name} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: rating.color }}
                  />
                  <span className="text-[8px] text-vault-text-muted">
                    {rating.name} ({rating.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Type Comparison */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <h3 className="text-[11px] font-semibold text-vault-text mb-3">Session Type Comparison</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Training */}
            <div className="bg-blue-50 rounded-lg p-2.5">
              <p className="text-[9px] font-semibold text-vault-text mb-1">Training</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Total jumps</span>
                  <span className="text-[8px] font-semibold text-vault-text">22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Jumps per session</span>
                  <span className="text-[8px] font-semibold text-vault-text">3.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Avg height</span>
                  <span className="text-[8px] font-semibold text-vault-text">5.40m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Avg rating</span>
                  <span className="text-[8px] font-semibold text-vault-text">Good</span>
                </div>
              </div>
            </div>
            {/* Competition */}
            <div className="bg-amber-50 rounded-lg p-2.5">
              <p className="text-[9px] font-semibold text-amber-600 mb-1">Competition</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Total jumps</span>
                  <span className="text-[8px] font-semibold text-vault-text">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Jumps per session</span>
                  <span className="text-[8px] font-semibold text-vault-text">8.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Avg height</span>
                  <span className="text-[8px] font-semibold text-vault-text">5.26m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-vault-text-muted">Avg rating</span>
                  <span className="text-[8px] font-semibold text-vault-text">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Performance Patterns */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-[11px] font-semibold text-vault-text">Competition Performance Patterns</h3>
              <p className="text-[8px] text-vault-text-muted italic">Rating progression for competitions with 4+ rated jumps (1=runthru, 5=great)</p>
            </div>
          </div>
          {/* Simple line chart representation */}
          <div className="h-16 flex items-end gap-1 mt-2">
            <div className="flex-1 flex flex-col justify-end">
              <svg className="w-full h-14" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#e5e7eb" strokeWidth="0.5" />
                {/* Line chart - simulating rating progression */}
                <polyline
                  points="5,10 20,5 35,10 50,5 65,10 80,15 95,10"
                  fill="none"
                  stroke="#072f57"
                  strokeWidth="2"
                />
                <polyline
                  points="5,25 20,20 35,30 50,25"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[7px] text-vault-text-muted">
            <span>Jump 1</span>
            <span>Jump 2</span>
            <span>Jump 3</span>
            <span>Jump 4</span>
            <span>Jump 5</span>
          </div>
        </div>
      </div>

      {/* Pole Usage Statistics */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <h3 className="text-[11px] font-semibold text-vault-text mb-1">Pole Usage Statistics</h3>
          <p className="text-[8px] text-vault-text-muted italic mb-3">Number of jumps per pole</p>

          {/* Steps Filter */}
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {['All Steps', '6 steps', '8 steps', '10 steps'].map((filter, i) => (
              <button
                key={filter}
                className={`px-2 py-0.5 text-[8px] font-medium rounded-full whitespace-nowrap ${
                  i === 0
                    ? 'bg-vault-primary text-white'
                    : 'bg-vault-bg-warm-start text-vault-text-secondary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Pole List */}
          <div className="space-y-2">
            {poleData.map((pole) => (
              <div key={pole.rank}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-vault-primary flex items-center justify-center">
                    <span className="text-[8px] text-white font-semibold">{pole.rank}</span>
                  </div>
                  <span className="text-[9px] font-medium text-vault-text flex-1 truncate">{pole.name}</span>
                  <span className="text-[8px] text-vault-text-muted">{pole.jumps} jumps</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-vault-primary rounded-full"
                    style={{ width: `${(pole.jumps / maxPoleJumps) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="px-4 pb-20 mb-4">
        <div className="bg-vault-primary rounded-xl p-4 shadow-vault-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-[12px] font-semibold text-white">AI Insights</h3>
          </div>
          <p className="text-[10px] text-white/80 leading-relaxed">
            Personalized training recommendations powered by AI analysis of your jump data.
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-[8px] font-medium text-white">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardMock;
