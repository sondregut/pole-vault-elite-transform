import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneMockup from './mockups/PhoneMockup';
import {
  ChevronLeft,
  Heart,
  Settings,
  TrendingUp,
  Star,
  FileText,
  Video,
  ChevronRight,
  Minus,
  Plus,
  Home,
  Users,
  List,
  TrendingUp as Analytics,
  X,
  Search,
  Check,
  Trophy,
  Target
} from 'lucide-react';

const poles = [
  "ESSX 13'1 140 22.0",
  "ESSX 15'1 170 18.4",
  "Pacer Composite 15'7 lbs 13,9",
  "Pacer Composite 15'7 lbs 15,4",
  "Pacer Composite 15'7 lbs 15,4",
  "UCS Spirit 15'7 170 18.4",
  "ESSX 15'7\"",
  "ESSX 15'7 175 17.8",
  "UCS Spirit 15'7\"",
  "ESSX 15'7 180 15.7",
];

interface Jump {
  id: number;
  height: string;
  steps: number;
  pole: string;
  grip: string;
  rating: 'Run Thru' | 'Glider' | 'OK' | 'Good' | 'Great';
  isFavorite?: boolean;
}

const ratingConfig = {
  'Run Thru': { bg: 'bg-red-100', text: 'text-red-600', label: 'Run Thru' },
  'Glider': { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Glider' },
  'OK': { bg: 'bg-amber-100', text: 'text-amber-600', label: 'OK' },
  'Good': { bg: 'bg-green-100', text: 'text-green-600', label: 'Good' },
  'Great': { bg: 'bg-green-100', text: 'text-green-700', label: 'Great' },
};

const initialJumps: Jump[] = [
  { id: 1, height: '5.00', steps: 8, pole: "15'7 13,9", grip: '—', rating: 'OK' },
  { id: 2, height: '5.00', steps: 18, pole: "16'5 14,0", grip: '4.90', rating: 'OK' },
  { id: 3, height: '5.50', steps: 18, pole: "16'9 13,6", grip: '4.93', rating: 'Good' },
  { id: 4, height: '5.50', steps: 18, pole: "16'9 13,6", grip: '4.95', rating: 'Great' },
  { id: 5, height: '5.50', steps: 18, pole: "16'9 13,6", grip: '4.95', rating: 'Great', isFavorite: true },
  { id: 6, height: '5.50', steps: 18, pole: "16'9 13,3", grip: '4.95', rating: 'Good' },
];

const VaultAppJumpLogger = () => {
  const [showPoleSelector, setShowPoleSelector] = useState(false);
  const [selectedPole, setSelectedPole] = useState("16'9 13,3");
  const [steps, setSteps] = useState(18);
  const [selectedRating, setSelectedRating] = useState<'Run Thru' | 'Glider' | 'OK' | 'Good' | 'Great'>('Great');
  const [jumps, setJumps] = useState<Jump[]>(initialJumps);
  const [barHeight, setBarHeight] = useState('5.80');
  const [gripHeight, setGripHeight] = useState('4.95');
  const [sessionType, setSessionType] = useState<'training' | 'competition'>('training');
  const [standards, setStandards] = useState(0);
  const [result, setResult] = useState<'none' | 'make' | 'miss'>('none');
  const [landing, setLanding] = useState<'none' | 'shallow' | 'on' | 'deep' | 'thru'>('none');

  const incrementSteps = () => setSteps(prev => Math.min(prev + 2, 30));
  const decrementSteps = () => setSteps(prev => Math.max(prev - 2, 2));
  const incrementStandards = () => setStandards(prev => Math.min(prev + 5, 80));
  const decrementStandards = () => setStandards(prev => Math.max(prev - 5, 0));

  const addJump = () => {
    const newJump: Jump = {
      id: jumps.length + 1,
      height: barHeight,
      steps: steps,
      pole: selectedPole,
      grip: gripHeight,
      rating: selectedRating,
    };
    setJumps([...jumps, newJump]);
    // Update bar height for next jump
    const nextHeight = (parseFloat(barHeight) + 0.10).toFixed(2);
    setBarHeight(nextHeight);
  };
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
              <div className="h-full flex flex-col bg-gradient-to-b from-[#f5f0e8] to-[#ebe5db]">
                {/* Status Bar Area */}
                <div className="h-12 flex-shrink-0" />

                {/* Header */}
                <div className="px-3 pt-1 pb-2 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <ChevronLeft className="w-4 h-4 text-vault-text" />
                    <h3 className="text-sm font-bold text-[#1a3a5c]">
                      {sessionType === 'competition' ? 'Competition' : 'Training'} #{jumps.length + 1}
                    </h3>
                  </div>
                  <Heart className="w-4 h-4 text-[#e85a5a] fill-[#e85a5a]" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-3 pb-16">
                  {/* Session Type Toggle */}
                  <div className="mb-3">
                    <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1">
                      <button
                        onClick={() => setSessionType('training')}
                        className={`flex-1 py-1.5 px-2 rounded-md text-[9px] font-medium flex items-center justify-center gap-1 transition-all ${
                          sessionType === 'training'
                            ? 'bg-[#1a3a5c] text-white'
                            : 'text-[#6b7c8a] hover:bg-gray-100'
                        }`}
                      >
                        <Target className="w-3 h-3" />
                        Training
                      </button>
                      <button
                        onClick={() => setSessionType('competition')}
                        className={`flex-1 py-1.5 px-2 rounded-md text-[9px] font-medium flex items-center justify-center gap-1 transition-all ${
                          sessionType === 'competition'
                            ? 'bg-amber-500 text-white'
                            : 'text-[#6b7c8a] hover:bg-gray-100'
                        }`}
                      >
                        <Trophy className="w-3 h-3" />
                        Competition
                      </button>
                    </div>
                  </div>

                  {/* Competition Fields */}
                  {sessionType === 'competition' && (
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Trophy className="w-2.5 h-2.5 text-amber-500" />
                        <span className="text-[8px] text-[#6b7c8a] font-medium">Competition</span>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm">
                        {/* Standards */}
                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
                          <span className="text-[10px] font-medium text-[#1a3a5c]">Standards</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={decrementStandards}
                              className="w-5 h-5 rounded-full bg-[#e8eef3] flex items-center justify-center hover:bg-[#dce4eb] active:scale-95 transition-all"
                            >
                              <Minus className="w-2.5 h-2.5 text-[#6b7c8a]" />
                            </button>
                            <span className="text-[10px] font-semibold text-[#1a3a5c] w-10 text-center">{standards} cm</span>
                            <button
                              onClick={incrementStandards}
                              className="w-5 h-5 rounded-full bg-[#e8eef3] flex items-center justify-center hover:bg-[#dce4eb] active:scale-95 transition-all"
                            >
                              <Plus className="w-2.5 h-2.5 text-[#6b7c8a]" />
                            </button>
                          </div>
                        </div>

                        {/* Result */}
                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
                          <span className="text-[10px] font-medium text-[#1a3a5c]">Result</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setResult('make')}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold transition-all ${
                                result === 'make'
                                  ? 'bg-green-100 text-green-600 border border-green-400'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              O
                            </button>
                            <button
                              onClick={() => setResult('miss')}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold transition-all ${
                                result === 'miss'
                                  ? 'bg-red-100 text-red-600 border border-red-400'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              X
                            </button>
                          </div>
                        </div>

                        {/* Landing */}
                        <div className="flex items-center justify-between px-2 py-1.5">
                          <span className="text-[10px] font-medium text-[#1a3a5c]">Landing</span>
                          <div className="flex items-center gap-0.5">
                            {['Shallow', 'On', 'Deep', 'Thru'].map((option) => (
                              <button
                                key={option}
                                onClick={() => setLanding(option.toLowerCase() as typeof landing)}
                                className={`px-1.5 py-0.5 rounded text-[6px] font-medium transition-all ${
                                  landing === option.toLowerCase()
                                    ? 'bg-[#1a3a5c] text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Equipment & Approach Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Settings className="w-3 h-3 text-[#6b7c8a]" />
                      <span className="text-[9px] text-[#6b7c8a] font-medium">Equipment & Approach</span>
                    </div>

                    {/* Pole Selector */}
                    <button
                      onClick={() => setShowPoleSelector(true)}
                      className="w-full bg-white rounded-lg shadow-sm mb-1.5 text-left"
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-medium text-[#1a3a5c]">Pole</span>
                        <div className="flex items-center gap-1 text-[#6b7c8a]">
                          <span className="text-[10px]">{selectedPole}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </button>

                    {/* Steps and Run-up */}
                    <div className="bg-white rounded-lg shadow-sm">
                      {/* Steps */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <span className="text-xs font-medium text-[#1a3a5c]">Steps</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={decrementSteps}
                            className="w-6 h-6 rounded-full bg-[#e8eef3] flex items-center justify-center hover:bg-[#dce4eb] active:scale-95 transition-all"
                          >
                            <Minus className="w-3 h-3 text-[#6b7c8a]" />
                          </button>
                          <span className="text-xs font-semibold text-[#1a3a5c] w-5 text-center">{steps}</span>
                          <button
                            onClick={incrementSteps}
                            className="w-6 h-6 rounded-full bg-[#e8eef3] flex items-center justify-center hover:bg-[#dce4eb] active:scale-95 transition-all"
                          >
                            <Plus className="w-3 h-3 text-[#6b7c8a]" />
                          </button>
                        </div>
                      </div>
                      {/* Run-up */}
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-medium text-[#1a3a5c]">Run-up</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-semibold text-[#1a3a5c]">41.40</span>
                          <span className="text-[10px] text-[#6b7c8a]">m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Jump Setup Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="w-3 h-3 text-[#6b7c8a]" />
                      <span className="text-[9px] text-[#6b7c8a] font-medium">Jump Setup</span>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm">
                      {/* Bar Height */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <span className="text-xs font-medium text-[#1a3a5c]">Bar Height</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-semibold text-[#1a3a5c]">{barHeight}</span>
                          <span className="text-[10px] text-[#6b7c8a]">m</span>
                        </div>
                      </div>
                      {/* Grip Height */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <span className="text-xs font-medium text-[#1a3a5c]">Grip Height</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-semibold text-[#1a3a5c]">{gripHeight}</span>
                          <span className="text-[10px] text-[#6b7c8a]">m</span>
                        </div>
                      </div>
                      {/* Mid-Mark */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <span className="text-xs font-medium text-[#1a3a5c]">Mid-Mark</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-semibold text-[#1a3a5c]">16.70</span>
                          <span className="text-[10px] text-[#6b7c8a]">m</span>
                        </div>
                      </div>
                      {/* Take-off */}
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-medium text-[#1a3a5c]">Take-off</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-semibold text-[#1a3a5c]">4.30</span>
                          <span className="text-[10px] text-[#6b7c8a]">m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Star className="w-3 h-3 text-[#6b7c8a]" />
                      <span className="text-[9px] text-[#6b7c8a] font-medium">Performance</span>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-2.5">
                      <p className="text-[10px] font-medium text-[#1a3a5c] mb-2">Jump Rating</p>
                      <div className="flex gap-1">
                        {[
                          { label: 'Run Thru', icon: '→', color: 'border-red-400 bg-red-50 text-red-600', selectedBg: 'bg-red-100' },
                          { label: 'Glider', icon: '↻', color: 'border-orange-400 bg-orange-50 text-orange-600', selectedBg: 'bg-orange-100' },
                          { label: 'OK', icon: '✓', color: 'border-amber-400 bg-amber-50 text-amber-600', selectedBg: 'bg-amber-100' },
                          { label: 'Good', icon: '◎', color: 'border-green-400 bg-green-50 text-green-600', selectedBg: 'bg-green-100' },
                          { label: 'Great', icon: '☆', color: 'border-green-500 bg-green-50 text-green-600', selectedBg: 'bg-green-100' },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={() => setSelectedRating(btn.label)}
                            className={`flex-1 py-1.5 px-0.5 text-[7px] font-medium rounded-lg flex flex-col items-center gap-0.5 transition-all border-2 ${
                              selectedRating === btn.label
                                ? `${btn.color} ${btn.selectedBg}`
                                : 'bg-[#f5f5f5] text-[#6b7c8a] border-transparent hover:bg-[#ebebeb]'
                            }`}
                          >
                            <span className="text-[9px]">{btn.icon}</span>
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes & Media Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="w-3 h-3 text-[#6b7c8a]" />
                      <span className="text-[9px] text-[#6b7c8a] font-medium">Notes & Media</span>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow-sm p-2.5 mb-1.5">
                      <p className="text-[10px] font-medium text-[#1a3a5c] mb-1.5">Notes</p>
                      <div className="bg-[#f8f6f3] rounded-md p-2 min-h-[40px]">
                        <p className="text-[8px] text-[#9ca3af]">Add notes about technique, feelings, etc.</p>
                      </div>
                    </div>

                    {/* Video */}
                    <div className="bg-white rounded-lg shadow-sm p-2.5 mb-2">
                      <p className="text-[10px] font-medium text-[#1a3a5c] mb-1.5">Video</p>
                      <div className="flex gap-1.5">
                        <button className="flex-1 py-2 px-2 bg-[#dc4545] text-white text-[9px] font-medium rounded-md flex items-center justify-center gap-1">
                          <Video className="w-3 h-3" />
                          Record
                        </button>
                        <button className="flex-1 py-2 px-2 bg-[#f0f4f7] text-[#6b7c8a] text-[9px] font-medium rounded-md flex items-center justify-center gap-1">
                          <FileText className="w-3 h-3" />
                          Library
                        </button>
                      </div>
                    </div>

                    {/* Add Jump Button */}
                    <button
                      onClick={addJump}
                      className="w-full py-2.5 bg-[#1a3a5c] text-white text-xs font-semibold rounded-lg hover:bg-[#2a4a6c] active:scale-[0.98] transition-all"
                    >
                      Add Jump
                    </button>
                  </div>

                  {/* Jump Table */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    {/* Jump List Header */}
                    <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#1a3a5c]">Jumps</span>
                      <span className="px-1.5 py-0.5 bg-[#1a3a5c]/10 rounded text-[8px] font-semibold text-[#1a3a5c]">
                        {jumps.length}
                      </span>
                    </div>
                    <p className="px-3 py-1 text-[8px] text-gray-500">All jumps recorded during this session</p>

                    {/* Table Header */}
                    <div className="flex items-center bg-gray-50 border-y border-gray-200 px-2 py-1.5">
                      <span className="w-7 text-[7px] font-semibold text-gray-500 text-center">#</span>
                      <span className="w-11 text-[7px] font-semibold text-gray-500 text-center">Height</span>
                      <span className="w-9 text-[7px] font-semibold text-gray-500 text-center">Steps</span>
                      <span className="w-16 text-[7px] font-semibold text-gray-500">Pole</span>
                      <span className="w-9 text-[7px] font-semibold text-gray-500 text-center">Grip</span>
                      <span className="flex-1 text-[7px] font-semibold text-gray-500 text-center">Rating</span>
                    </div>

                    {/* Jump Rows */}
                    <div className="max-h-[180px] overflow-y-auto">
                      {jumps.map((jump, idx) => (
                        <div
                          key={jump.id}
                          className={`flex items-center px-2 py-1.5 border-b border-gray-100 last:border-0 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <div className="w-7 flex items-center justify-center gap-0.5">
                            {jump.isFavorite && (
                              <Heart className="w-2 h-2 text-red-400 fill-red-400" />
                            )}
                            <span className="text-[8px] font-semibold text-[#1a3a5c]">{jump.id}</span>
                          </div>
                          <span className="w-11 text-[8px] font-semibold text-[#1a3a5c] text-center">
                            {jump.height === '—' ? '—' : jump.height}
                          </span>
                          <span className="w-9 text-[8px] text-[#1a3a5c] text-center">{jump.steps}</span>
                          <span className="w-16 text-[7px] text-gray-600 truncate">{jump.pole}</span>
                          <span className="w-9 text-[8px] text-[#1a3a5c] text-center">{jump.grip}</span>
                          <div className="flex-1 flex justify-center">
                            <span className={`px-1.5 py-0.5 rounded text-[6px] font-medium ${ratingConfig[jump.rating].bg} ${ratingConfig[jump.rating].text}`}>
                              {ratingConfig[jump.rating].label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pole Selector Modal */}
                <AnimatePresence>
                  {showPoleSelector && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 flex items-end"
                    >
                      {/* Backdrop */}
                      <div
                        className="absolute inset-0 bg-black/20"
                        onClick={() => setShowPoleSelector(false)}
                      />

                      {/* Modal Content */}
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full bg-white rounded-t-2xl max-h-[85%] flex flex-col"
                      >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                          <h4 className="text-sm font-semibold text-[#1a3a5c]">Select Pole</h4>
                          <button
                            onClick={() => setShowPoleSelector(false)}
                            className="p-1"
                          >
                            <X className="w-4 h-4 text-[#6b7c8a]" />
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-lg px-3 py-2">
                            <Search className="w-3.5 h-3.5 text-[#9ca3af]" />
                            <span className="text-[10px] text-[#9ca3af]">Search poles...</span>
                          </div>
                        </div>

                        {/* Pole List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                          {poles.map((pole, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedPole(pole);
                                setShowPoleSelector(false);
                              }}
                              className="w-full text-left py-2.5 border-b border-gray-100 last:border-0"
                            >
                              <span className="text-[11px] text-[#1a3a5c]">{pole}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1.5 flex items-center justify-around">
                  <div className="flex flex-col items-center gap-0">
                    <Home className="w-4 h-4 text-[#6b7c8a]" />
                    <span className="text-[7px] text-[#6b7c8a]">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-0">
                    <Users className="w-4 h-4 text-[#6b7c8a]" />
                    <span className="text-[7px] text-[#6b7c8a]">Feed</span>
                  </div>
                  <div className="relative -mt-3">
                    <div className="w-10 h-10 bg-[#1a3a5c] rounded-xl flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0">
                    <List className="w-4 h-4 text-[#6b7c8a]" />
                    <span className="text-[7px] text-[#6b7c8a]">Sessions</span>
                  </div>
                  <div className="flex flex-col items-center gap-0">
                    <Analytics className="w-4 h-4 text-[#6b7c8a]" />
                    <span className="text-[7px] text-[#6b7c8a]">Analytics</span>
                  </div>
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
