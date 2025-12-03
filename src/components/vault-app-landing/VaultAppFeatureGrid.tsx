import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, BarChart3, Video, WifiOff, MessageCircle, Heart, Send, ChevronDown, Trophy, Users, Target, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const VaultAppFeatureGrid = () => {
  const [feedExpanded, setFeedExpanded] = useState(false);

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

        {/* Social Feed Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div
            className={`relative bg-gradient-to-br from-vault-primary-dark to-vault-primary rounded-xl p-5 shadow-vault-lg overflow-hidden cursor-pointer transition-all duration-300 ${feedExpanded ? 'ring-2 ring-vault-primary/30' : ''}`}
            onClick={() => setFeedExpanded(!feedExpanded)}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs font-medium">
                      Community
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Connect with the Vaulting Community
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                    Share jumps with friends and coaches. Celebrate PRs, get technique feedback, and stay motivated.
                  </p>
                  <button className="mt-3 flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
                    <span>{feedExpanded ? 'Hide preview' : 'See how it works'}</span>
                    <motion.div
                      animate={{ rotate: feedExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>

                {/* Mini feed preview - always visible */}
                <div className="flex gap-2 md:flex-col">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-white text-xs font-medium">Celebrate</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-white text-xs font-medium">Comment</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
                    <Send className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-white text-xs font-medium">Share</span>
                  </div>
                </div>
              </div>

              {/* Expandable Feed Preview */}
              <AnimatePresence>
                {feedExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-white/20">
                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Mock Feed Post 1 - PR Style with Video */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                          {/* Header */}
                          <div className="p-3 pb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-vault-primary rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-vault-primary/20">
                                  SG
                                </div>
                                <div>
                                  <p className="font-semibold text-vault-text text-sm">Sondre G.</p>
                                  <p className="text-[11px] text-vault-text-muted">@sondre_g · 2h ago</p>
                                </div>
                              </div>
                              <div className="text-vault-text-muted">•••</div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-vault-text-muted">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>5.90m best · 2 jumps</span>
                            </div>
                          </div>

                          {/* Video Thumbnail */}
                          <div className="relative h-52 bg-gray-200 mx-3 mb-2 rounded-lg overflow-hidden">
                            <img
                              src="/video-thumb-1.png"
                              alt="Pole vault jump"
                              className="w-full h-full object-cover object-[center_70%]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                              Jump 1 of 2
                            </span>
                          </div>

                          {/* Stats Bar */}
                          <div className="px-3 py-2.5 flex items-center justify-around">
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-primary">5.90m</p>
                              <p className="text-[10px] text-vault-text-muted">Height</p>
                            </div>
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-text">18</p>
                              <p className="text-[10px] text-vault-text-muted">Steps</p>
                            </div>
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-text">16'9 205</p>
                              <p className="text-[10px] text-vault-text-muted">Pole</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="px-3 py-2 flex items-center gap-4 border-t border-vault-border-light">
                            <span className="flex items-center gap-1.5">
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              <span className="text-xs text-vault-text">24</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle className="w-4 h-4 text-vault-text-muted" />
                              <span className="text-xs text-vault-text">8</span>
                            </span>
                            <Send className="w-4 h-4 text-vault-text-muted" />
                          </div>
                        </div>

                        {/* Mock Feed Post 2 - Session Style */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                          {/* Header */}
                          <div className="p-3 pb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-amber-500/20">
                                  MK
                                </div>
                                <div>
                                  <p className="font-semibold text-vault-text text-sm">Maria K.</p>
                                  <p className="text-[11px] text-vault-text-muted">@maria_k · 5h ago</p>
                                </div>
                              </div>
                              <div className="text-vault-text-muted">•••</div>
                            </div>
                            <p className="text-sm text-vault-text mb-2">
                              Great session! Finally nailed swing timing on 6-step 🙌
                            </p>
                            <div className="flex items-center gap-2 text-xs text-vault-text-muted">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>4.20m best · 12 jumps</span>
                            </div>
                          </div>

                          {/* Stats Bar */}
                          <div className="px-3 py-2.5 flex items-center justify-around border-t border-vault-border-light">
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-primary">4.20m</p>
                              <p className="text-[10px] text-vault-text-muted">Height</p>
                            </div>
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-text">6</p>
                              <p className="text-[10px] text-vault-text-muted">Steps</p>
                            </div>
                            <div className="text-center">
                              <p className="text-base font-bold text-vault-text">14'7"</p>
                              <p className="text-[10px] text-vault-text-muted">Pole</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="px-3 py-2 flex items-center justify-between border-t border-vault-border-light">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 text-vault-text-muted" />
                                <span className="text-xs text-vault-text">18</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MessageCircle className="w-4 h-4 text-vault-text-muted" />
                                <span className="text-xs text-vault-text">5</span>
                              </span>
                              <Send className="w-4 h-4 text-vault-text-muted" />
                            </div>
                            <button className="text-xs text-vault-text-muted bg-vault-bg-warm-start px-3 py-1.5 rounded-full flex items-center gap-1">
                              Details
                              <ChevronDown className="w-3 h-3 -rotate-90" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VaultAppFeatureGrid;

