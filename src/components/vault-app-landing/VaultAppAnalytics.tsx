import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BarChart3, PieChart, GitCompare, LineChart, Activity, Lightbulb } from 'lucide-react';
import PhoneMockup from './mockups/PhoneMockup';
import AnalyticsDashboardMock from './mockups/AnalyticsDashboardMock';

const VaultAppAnalytics = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Jump Distribution',
      description: 'See how your jumps break down by runup steps. Identify your most practiced approaches.',
    },
    {
      icon: PieChart,
      title: 'Quality Breakdown',
      description: 'Track the distribution of Great, Good, OK, and Glider jumps with beautiful donut charts.',
    },
    {
      icon: GitCompare,
      title: 'Training vs Competition',
      description: 'Compare your performance metrics side-by-side between training and competition sessions.',
    },
    {
      icon: LineChart,
      title: 'Performance Patterns',
      description: 'Visualize your rating progression within competitions to understand your warm-up patterns.',
    },
    {
      icon: Activity,
      title: 'Pole Statistics',
      description: 'Track which poles you use most frequently and filter by approach length.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your jumps volume changes with percentage comparisons to previous periods.',
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
            Data visualization that reveals your hidden patterns and helps you train smarter.
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
            {/* Overview Cards */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-vault-primary" />
                Key Metrics at a Glance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-4 shadow-vault border border-vault-border-light text-center"
                >
                  <p className="text-xs text-vault-text-muted mb-1">Total Sessions</p>
                  <p className="text-2xl font-bold text-vault-primary">20</p>
                  <p className="text-xs text-amber-500">5 Competitions</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-vault border border-vault-border-light text-center"
                >
                  <p className="text-xs text-vault-text-muted mb-1">Total Jumps</p>
                  <p className="text-2xl font-bold text-vault-primary">30</p>
                  <p className="text-xs text-vault-success">+21% vs prev 30 days</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-vault border border-vault-border-light text-center"
                >
                  <p className="text-xs text-vault-text-muted mb-1">Best Height</p>
                  <p className="text-2xl font-bold text-vault-primary">5.90m</p>
                  <p className="text-xs text-amber-500">Tokyo</p>
                </motion.div>
              </div>
            </div>

            {/* Feature Grid */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4">
                Analytics Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-vault-bg-warm-start rounded-xl p-4 hover:shadow-vault-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-vault-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-vault-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-vault-text text-sm mb-1">{feature.title}</p>
                        <p className="text-xs text-vault-text-secondary leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Training vs Competition Preview */}
            <div>
              <h3 className="text-lg font-semibold text-vault-text mb-4">
                Training vs Competition
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-vault-text mb-2">Training</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Total jumps</span>
                      <span className="text-xs font-semibold text-vault-text">22</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Jumps per session</span>
                      <span className="text-xs font-semibold text-vault-text">3.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Avg height</span>
                      <span className="text-xs font-semibold text-vault-text">5.40m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Avg rating</span>
                      <span className="text-xs font-semibold text-vault-text">Good</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-600 mb-2">Competition</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Total jumps</span>
                      <span className="text-xs font-semibold text-vault-text">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Jumps per session</span>
                      <span className="text-xs font-semibold text-vault-text">8.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Avg height</span>
                      <span className="text-xs font-semibold text-vault-text">5.26m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-vault-text-muted">Avg rating</span>
                      <span className="text-xs font-semibold text-vault-text">Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Range Info */}
            <div className="bg-vault-primary-muted rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-vault-primary" />
                <span className="font-semibold text-vault-text text-sm">Flexible Time Ranges</span>
              </div>
              <p className="text-xs text-vault-text-secondary leading-relaxed">
                Filter your analytics by 30, 60, 90 days, 1 year, all time, or set custom date ranges to analyze specific training periods or competition seasons.
              </p>
            </div>

            {/* AI Insights Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {/* Header - Outside the dark card */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-semibold text-vault-text">AI Insights</h3>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
                  Coming Soon
                </span>
              </div>

              {/* Dark Card with Insights */}
              <div className="bg-[#1a2a3a] rounded-2xl p-4">
                {/* Insight Cards */}
                <div className="space-y-3">
                  {/* Strong Finish */}
                  <div className="bg-[#243447] rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">Strong Finish</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      You clear 85% of bars on your 3rd attempt in competitions. You perform well under pressure.
                    </p>
                  </div>

                  {/* Pole Match */}
                  <div className="bg-[#243447] rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">Pole Match</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Your highest clearance rate (92%) comes when using the 15'7 (175).
                    </p>
                  </div>

                  {/* Focus Area */}
                  <div className="bg-[#243447] rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">Focus Area</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      6-Step short approach sessions are averaging 0.15m lower than last month.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VaultAppAnalytics;
