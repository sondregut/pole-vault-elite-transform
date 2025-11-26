import React from 'react';
import { Video } from 'lucide-react';

interface JumpFormMockProps {
  compact?: boolean;
}

const JumpFormMock: React.FC<JumpFormMockProps> = ({ compact = false }) => {
  const ratingButtons = [
    { label: 'Glider', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { label: 'OK', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { label: 'Good', color: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'Great', color: 'bg-vault-primary-muted text-vault-primary border-vault-primary/20' },
  ];

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-vault border border-vault-border-light font-roboto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-vault-text">Jump #8</span>
          <span className="text-xs text-vault-text-muted">Training Session</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-vault-primary-muted/50 rounded-lg p-2">
            <span className="text-vault-text-muted">Height</span>
            <p className="font-bold text-vault-primary">5.40m</p>
          </div>
          <div className="bg-vault-primary-muted/50 rounded-lg p-2">
            <span className="text-vault-text-muted">Pole</span>
            <p className="font-bold text-vault-primary">15'7</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-vault-md border border-vault-border font-roboto max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-lg font-bold text-vault-text">Jump #8</span>
          <p className="text-sm text-vault-text-muted">Training Session</p>
        </div>
        <div className="w-10 h-10 bg-vault-primary-muted rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-vault-primary rounded-full" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        {/* Pole */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Pole</span>
          <span className="text-sm font-semibold text-vault-text">15'7 (175) 16.4</span>
        </div>

        {/* Bar Height */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Bar Height</span>
          <span className="text-sm font-semibold text-vault-text">5.40m</span>
        </div>

        {/* Grip Height */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Grip Height</span>
          <span className="text-sm font-semibold text-vault-text">15'1"</span>
        </div>

        {/* Run-up */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Run-up</span>
          <span className="text-sm font-semibold text-vault-text">16 Steps</span>
        </div>

        {/* Mid-Mark */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Mid-Mark</span>
          <span className="text-sm font-semibold text-vault-text">56' 6"</span>
        </div>

        {/* Outcome */}
        <div className="flex items-center justify-between py-3 border-b border-vault-border-light">
          <span className="text-sm text-vault-text-muted">Outcome</span>
          <span className="text-sm font-semibold text-red-600">Run-thru</span>
        </div>
      </div>

      {/* Rating Buttons */}
      <div className="mb-6">
        <p className="text-sm text-vault-text-muted mb-3">Rate this jump</p>
        <div className="flex gap-2">
          {ratingButtons.map((btn) => (
            <button
              key={btn.label}
              className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all hover:shadow-vault-sm ${btn.color}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attach Video Button */}
      <button className="w-full py-3 px-4 border-2 border-dashed border-vault-border rounded-xl text-vault-text-secondary font-medium flex items-center justify-center gap-2 hover:border-vault-primary hover:text-vault-primary transition-colors">
        <Video className="w-5 h-5" />
        Attach Video
      </button>
    </div>
  );
};

export default JumpFormMock;
