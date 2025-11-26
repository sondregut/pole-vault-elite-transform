import React from 'react';
import { motion } from 'framer-motion';
import { Play, ClipboardList, BarChart3, ArrowRight } from 'lucide-react';

const VaultAppSessionFlow = () => {
  const steps = [
    {
      number: 1,
      icon: Play,
      title: 'Start Session',
      description: 'Log context in seconds',
      mockContent: (
        <div className="bg-white rounded-lg p-3 shadow-vault-sm border border-vault-border-light">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-vault-primary-muted rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-vault-primary rounded-full" />
            </div>
            <span className="text-xs font-medium text-vault-text">New Session</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-vault-primary-muted rounded w-3/4" />
            <div className="h-2 bg-vault-border-light rounded w-1/2" />
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
        <div className="bg-white rounded-lg p-3 shadow-vault-sm border border-vault-border-light">
          <div className="text-[10px] font-medium text-vault-text-muted mb-2">Jump #8</div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-vault-primary-muted rounded p-1.5">
              <span className="text-vault-text-muted">Height</span>
              <div className="font-semibold text-vault-primary">5.40m</div>
            </div>
            <div className="bg-vault-primary-muted rounded p-1.5">
              <span className="text-vault-text-muted">Pole</span>
              <div className="font-semibold text-vault-primary">15'7</div>
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
        <div className="bg-white rounded-lg p-3 shadow-vault-sm border border-vault-border-light">
          <div className="text-[10px] font-medium text-vault-text-muted mb-2">Progress</div>
          <div className="flex items-end gap-1 h-10">
            <div className="w-2 bg-vault-primary-muted rounded-t h-4" />
            <div className="w-2 bg-vault-primary-muted rounded-t h-5" />
            <div className="w-2 bg-vault-primary-muted rounded-t h-6" />
            <div className="w-2 bg-vault-primary-light rounded-t h-7" />
            <div className="w-2 bg-vault-primary rounded-t h-9" />
            <div className="w-2 bg-vault-primary rounded-t h-10" />
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
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-vault-primary to-vault-primary-muted z-0">
                  <ArrowRight className="absolute -right-1 -top-2 w-5 h-5 text-vault-primary-muted" />
                </div>
              )}

              <div className="relative z-10 bg-white">
                {/* Step Number */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vault-primary-dark to-vault-primary flex items-center justify-center text-white font-bold text-lg shadow-vault">
                    {step.number}
                  </div>
                </div>

                {/* Mock UI Card */}
                <div className="mb-6 transform hover:scale-105 transition-transform duration-200">
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
