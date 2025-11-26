import React from 'react';
import { TrendingUp, Target, Award, Percent, Lightbulb } from 'lucide-react';
import HeightProgressChart from './HeightProgressChart';

const AnalyticsDashboardMock: React.FC = () => {
  const stats = [
    {
      label: 'Total Sessions',
      value: '24',
      subtext: '(8 Competitions)',
      icon: Target,
    },
    {
      label: 'Total Jumps',
      value: '342',
      subtext: '+12% volume',
      icon: TrendingUp,
      subtextColor: 'text-vault-success',
    },
    {
      label: 'Best Height',
      value: '5.90m',
      subtext: 'Season Best',
      icon: Award,
    },
    {
      label: 'Success Rate',
      value: '68%',
      subtext: 'Top 10% Avg',
      icon: Percent,
    },
  ];

  const insights = [
    {
      title: 'Strong Finish',
      text: 'You clear 85% of bars on your 3rd attempt in competitions. You perform well under pressure.',
    },
    {
      title: 'Pole Match',
      text: "Your highest clearance rate (92%) comes when using the 15'7 (175).",
    },
    {
      title: 'Focus Area',
      text: '6-Step short approach sessions are averaging 0.15m lower than last month.',
    },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto overflow-y-auto">
      {/* Status Bar Area */}
      <div className="h-12" />

      {/* Header */}
      <div className="px-4 pt-2 pb-3">
        <h2 className="text-lg font-bold text-vault-text">Analytics</h2>

        {/* Time Filter */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto">
          {['30 Days', '60 Days', '90 Days', '1 Year', 'All'].map((period, i) => (
            <button
              key={period}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-full whitespace-nowrap ${
                i === 2
                  ? 'bg-vault-primary text-white'
                  : 'bg-white text-vault-text-secondary border border-vault-border'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 mb-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3 h-3 text-vault-text-muted" />
              <span className="text-[9px] text-vault-text-muted">{stat.label}</span>
            </div>
            <p className="text-lg font-bold text-vault-primary">{stat.value}</p>
            <p className={`text-[8px] ${stat.subtextColor || 'text-vault-text-muted'}`}>
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Height Progress Chart */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
          <h3 className="text-xs font-semibold text-vault-text mb-2">Height Progress</h3>
          <p className="text-[8px] text-vault-text-muted mb-2">
            Max vs Average clearance over last 12 sessions
          </p>
          <HeightProgressChart compact />
        </div>
      </div>

      {/* AI Insights */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-vault-primary-dark to-vault-primary rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3 h-3 text-white" />
            <h3 className="text-xs font-semibold text-white">AI Insights</h3>
            <span className="text-[8px] bg-white/20 text-white px-1.5 py-0.5 rounded-full ml-auto">
              Coming Soon
            </span>
          </div>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-2">
                <p className="text-[9px] font-semibold text-white mb-0.5">{insight.title}</p>
                <p className="text-[8px] text-white/80 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {/* Jumps by Approach */}
          <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
            <h4 className="text-[9px] font-semibold text-vault-text mb-2">Jumps by Approach</h4>
            <div className="flex items-end justify-between h-12 gap-0.5">
              {[42, 65, 88, 94, 32, 21].map((val, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-vault-primary rounded-t"
                    style={{ height: `${(val / 100) * 40}px` }}
                  />
                  <span className="text-[6px] text-vault-text-muted mt-1">{6 + i * 2}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jump Quality */}
          <div className="bg-white rounded-xl p-3 shadow-vault-sm border border-vault-border-light">
            <h4 className="text-[9px] font-semibold text-vault-text mb-2">Jump Quality</h4>
            <div className="flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e5e5" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#072f57"
                  strokeWidth="3"
                  strokeDasharray="54 94"
                  strokeDashoffset="0"
                  transform="rotate(-90 18 18)"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#198754"
                  strokeWidth="3"
                  strokeDasharray="33 94"
                  strokeDashoffset="-54"
                  transform="rotate(-90 18 18)"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray="28 94"
                  strokeDashoffset="-87"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
            <div className="flex justify-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-vault-primary" />
                <span className="text-[6px] text-vault-text-muted">Great 15%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-vault-success" />
                <span className="text-[6px] text-vault-text-muted">Good 35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardMock;
