import React from 'react';
import { motion } from 'framer-motion';
import { Play, ClipboardList, BarChart3, ArrowRight } from 'lucide-react';

// Running person SVG icon
const RunningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="2" fill="currentColor" />
    <path d="M7 22l3-7" />
    <path d="M10 15l-2-4 4-2 3 4" />
    <path d="M17 10l2 4h-4" />
    <path d="M14 22l-2-7" />
  </svg>
);

const VaultAppSessionFlow = () => {
  const steps = [
    {
      number: 1,
      icon: Play,
      title: 'Start Session',
      description: 'Log context in seconds',
      mockContent: (
        <div className="bg-[#1a3a5c] rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white">
              <RunningIcon />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Log Session</p>
              <p className="text-white/60 text-xs">Start tracking your jumps</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      icon: ClipboardList,
      title: 'Log Jump',
      description: 'Capture technical details',
      mockContent: (
        <div className="bg-gradient-to-b from-[#f5f0e8] to-[#ebe5db] rounded-xl p-4 shadow-lg border border-white/50">
          <div className="text-[11px] font-bold text-[#1a3a5c] mb-3">Jump #8</div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500">Height</span>
              <span className="text-[12px] font-bold text-[#1a3a5c]">5.40m</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500">Pole</span>
              <span className="text-[11px] font-semibold text-[#1a3a5c]">16'5 175</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Rating</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded">Great</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      icon: BarChart3,
      title: 'Analysis',
      description: 'Instant visual feedback',
      mockContent: (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#1a3a5c]">2025 Progress</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-medium rounded-full">+0.35m</span>
          </div>
          <p className="text-[8px] text-gray-400 mb-3">Best height per month</p>
          <div className="flex items-end justify-between gap-1 h-12">
            {[
              { h: 24, m: 'Jan' },
              { h: 28, m: 'Feb' },
              { h: 32, m: 'Mar' },
              { h: 36, m: 'Apr' },
              { h: 40, m: 'May' },
              { h: 44, m: 'Jun' },
              { h: 46, m: 'Jul' },
              { h: 48, m: 'Aug' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                <div
                  className={`w-full rounded-sm ${i === 7 ? 'bg-[#1a3a5c]' : 'bg-[#1a3a5c]/40'}`}
                  style={{ height: `${item.h}px` }}
                />
                <span className="text-[5px] text-gray-400">{item.m}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white font-roboto">
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
            Built for the flow of practice
          </h2>
          <p className="text-lg text-vault-text-secondary max-w-2xl mx-auto">
            The interface is designed to be used on the runway, not just at home.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 items-start max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col items-center"
            >
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 w-12 left-[calc(100%-8px)] h-0.5 bg-vault-primary/40 z-0" />
              )}

              <div className="relative z-10 bg-white flex flex-col items-center">
                {/* Step Number */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vault-primary-dark to-vault-primary flex items-center justify-center text-white font-bold text-lg shadow-vault">
                    {step.number}
                  </div>
                </div>

                {/* Mock UI Card */}
                <div className="mb-6 transform hover:scale-105 transition-transform duration-200 w-full">
                  {step.mockContent}
                </div>

                {/* Title & Description */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-vault-text mb-2">{step.title}</h3>
                  <p className="text-vault-text-secondary">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VaultAppSessionFlow;
