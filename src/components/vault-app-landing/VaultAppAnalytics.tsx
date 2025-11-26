import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Percent, Lightbulb, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PhoneMockup from './mockups/PhoneMockup';
import AnalyticsDashboardMock from './mockups/AnalyticsDashboardMock';
import HeightProgressChart from './mockups/HeightProgressChart';

const VaultAppAnalytics = () => {
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
      description:
        'You clear 85% of bars on your 3rd attempt in competitions. You perform well under pressure.',
    },
    {
      title: 'Pole Match',
      description:
        "Your highest clearance rate (92%) comes when using the 15'7 (175).",
    },
    {
      title: 'Focus Area',
      description:
        '6-Step short approach sessions are averaging 0.15m lower than last month.',
    },
  ];

  return (
    <section id="analytics" className="py-20 bg-white font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-vault-text mb-4">
            Professional Grade Analytics
          </h2>
          <p className="text-lg text-vault-text-secondary max-w-2xl mx-auto">
            Data visualization that reveals your hidden patterns.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:sticky lg:top-24"
          >
            <PhoneMockup>
              <AnalyticsDashboardMock />
            </PhoneMockup>
          </motion.div>

          {/* Right Column - Feature Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-vault-primary" />
                Key Metrics at a Glance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-vault border border-vault-border-light hover:shadow-vault-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-4 h-4 text-vault-text-muted" />
                      <span className="text-xs text-vault-text-muted">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-vault-primary">{stat.value}</p>
                    <p className={`text-xs ${stat.subtextColor || 'text-vault-text-muted'}`}>
                      {stat.subtext}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Height Progress */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4">Height Progress</h3>
              <div className="bg-white rounded-xl p-6 shadow-vault border border-vault-border-light">
                <p className="text-sm text-vault-text-muted mb-4">
                  Max vs Average clearance over last 12 sessions
                </p>
                <HeightProgressChart />
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-vault-warning" />
                AI Insights
                <Badge className="bg-vault-warning/10 text-vault-warning border-0 text-xs ml-2">
                  Coming Soon
                </Badge>
              </h3>
              <div className="bg-gradient-to-br from-vault-primary-dark to-vault-primary rounded-xl p-5">
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    >
                      <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{insight.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Training vs Competition */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4">
                Training vs Competition
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-vault-primary-muted rounded-xl p-4">
                  <p className="text-sm text-vault-text-muted mb-2">Training</p>
                  <p className="text-2xl font-bold text-vault-primary mb-1">5.75m</p>
                  <p className="text-xs text-vault-text-muted">Avg Best</p>
                  <div className="mt-3 pt-3 border-t border-vault-primary/10">
                    <p className="text-lg font-semibold text-vault-text">62%</p>
                    <p className="text-xs text-vault-text-muted">Success Rate</p>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-700 mb-2">Competition</p>
                  <p className="text-2xl font-bold text-amber-600 mb-1">5.90m</p>
                  <p className="text-xs text-amber-600/70">Avg Best</p>
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-lg font-semibold text-amber-700">78%</p>
                    <p className="text-xs text-amber-600/70">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VaultAppAnalytics;
