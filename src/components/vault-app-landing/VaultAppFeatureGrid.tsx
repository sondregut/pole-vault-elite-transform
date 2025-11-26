import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, BarChart3, Video, WifiOff, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const VaultAppFeatureGrid = () => {
  const features = [
    {
      icon: Zap,
      title: 'Log in Seconds',
      description:
        "Tap. Tap. Done. The interface is built for speed so you don't break your rhythm on the runway.",
      comingSoon: false,
    },
    {
      icon: TrendingUp,
      title: 'Track Your PRs',
      description:
        'Visualize your progress over seasons. See exactly what gear and technical cues led to your best jumps.',
      comingSoon: false,
    },
    {
      icon: BarChart3,
      title: 'Pole Usage Stats',
      description:
        'Know which poles work best for you. Track flex numbers, lengths, and your success rate on each specific pole.',
      comingSoon: false,
    },
    {
      icon: Video,
      title: 'Video Integration',
      description:
        'Attach videos to specific jumps. No more scrolling through your camera roll wondering which jump was which.',
      comingSoon: false,
    },
    {
      icon: WifiOff,
      title: 'Offline First',
      description:
        "Training at a remote track with no service? No problem. Log everything offline and sync when you're back.",
      comingSoon: false,
    },
    {
      icon: Users,
      title: 'Coach Connect',
      description:
        "Share your live session data with your coach instantly, even if they aren't at the track.",
      comingSoon: true,
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto">
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
            Everything you need to vault smarter
          </h2>
          <p className="text-lg text-vault-text-secondary max-w-2xl mx-auto">
            Built by vaulters for vaulters. Every feature is designed with the runway in mind.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-vault border border-vault-border-light hover:shadow-vault-md hover:-translate-y-1 transition-all duration-200"
            >
              {feature.comingSoon && (
                <Badge className="absolute top-4 right-4 bg-vault-warning/10 text-vault-warning border-0 text-xs">
                  Coming Soon
                </Badge>
              )}

              <div className="w-12 h-12 bg-vault-primary-muted rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-vault-primary" />
              </div>

              <h3 className="text-xl font-bold text-vault-text mb-2">{feature.title}</h3>
              <p className="text-vault-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VaultAppFeatureGrid;

