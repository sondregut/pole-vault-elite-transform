import React from 'react';
import { motion } from 'framer-motion';
import JumpFormMock from './mockups/JumpFormMock';
import PhoneMockup from './mockups/PhoneMockup';
import { Video } from 'lucide-react';

const VaultAppJumpLogger = () => {
  const ratingButtons = [
    { label: 'Glider', color: 'bg-orange-100 text-orange-700', active: false },
    { label: 'OK', color: 'bg-yellow-100 text-yellow-700', active: false },
    { label: 'Good', color: 'bg-green-100 text-green-700', active: true },
    { label: 'Great', color: 'bg-vault-primary-muted text-vault-primary', active: false },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-vault-bg-warm-start font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-vault-text mb-6">
              Capture every detail that matters
            </h2>
            <p className="text-lg text-vault-text-secondary mb-8 leading-relaxed">
              Log your jumps with precision. Track pole specs, grip height, approach steps,
              and more. Add videos to build a visual library of your progress.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                'Track pole selection from your equipment library',
                'Log bar height, grip, run-up, and mid-mark',
                'Rate jump quality with one tap',
                'Attach videos to specific jumps',
                'Toggle between metric and imperial',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-vault-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-vault-success" />
                  </div>
                  <span className="text-vault-text-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <PhoneMockup>
              <div className="h-full bg-gradient-to-b from-vault-bg-warm-start to-white">
                {/* Status Bar Area */}
                <div className="h-12" />

                {/* Header */}
                <div className="px-4 pt-2 pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-vault-text">Jump #8</h3>
                  <span className="text-xs text-vault-text-muted bg-vault-primary-muted px-2 py-1 rounded-full">
                    Training
                  </span>
                </div>

                {/* Form Content */}
                <div className="px-4 pb-4">
                  {/* Form Fields */}
                  <div className="bg-white rounded-xl shadow-vault-sm border border-vault-border-light overflow-hidden mb-4">
                    {[
                      { label: 'Pole', value: '15\'7 (175) 16.4' },
                      { label: 'Bar Height', value: '5.40m' },
                      { label: 'Grip Height', value: '15\'1"' },
                      { label: 'Run-up', value: '16 Steps' },
                      { label: 'Mid-Mark', value: '56\' 6"' },
                      { label: 'Outcome', value: 'Run-thru', valueColor: 'text-red-600' },
                    ].map((field, index) => (
                      <div
                        key={field.label}
                        className={`flex items-center justify-between px-4 py-2.5 ${
                          index !== 5 ? 'border-b border-vault-border-light' : ''
                        }`}
                      >
                        <span className="text-xs text-vault-text-muted">{field.label}</span>
                        <span className={`text-xs font-semibold ${field.valueColor || 'text-vault-text'}`}>
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rating Buttons */}
                  <div className="mb-4">
                    <p className="text-xs text-vault-text-muted mb-2">Rate this jump</p>
                    <div className="flex gap-1.5">
                      {ratingButtons.map((btn) => (
                        <button
                          key={btn.label}
                          className={`flex-1 py-2 text-[10px] font-medium rounded-lg transition-all ${
                            btn.color
                          } ${btn.active ? 'ring-2 ring-offset-1 ring-green-400' : ''}`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attach Video */}
                  <button className="w-full py-2.5 border-2 border-dashed border-vault-border rounded-lg text-vault-text-muted text-xs font-medium flex items-center justify-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Attach Video
                  </button>
                </div>
              </div>
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VaultAppJumpLogger;
