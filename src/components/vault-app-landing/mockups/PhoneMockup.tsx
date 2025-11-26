import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[40px] p-2 shadow-vault-lg">
        {/* Inner bezel */}
        <div className="relative w-full h-full bg-gray-800 rounded-[32px] overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-2">
            <div className="w-[90px] h-[28px] bg-black rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="absolute inset-0 bg-white overflow-hidden rounded-[32px]">
            {children}
          </div>
        </div>

        {/* Side Button (right) */}
        <div className="absolute right-[-2px] top-[120px] w-[3px] h-[60px] bg-gray-700 rounded-l-sm" />

        {/* Volume Buttons (left) */}
        <div className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] bg-gray-700 rounded-r-sm" />
        <div className="absolute left-[-2px] top-[140px] w-[3px] h-[50px] bg-gray-700 rounded-r-sm" />
      </div>
    </div>
  );
};

export default PhoneMockup;
