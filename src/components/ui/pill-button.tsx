
import React from 'react';
import { cn } from '@/lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'warmup' | 'strength' | 'rehab' | 'pvd' | 'medball' | 'gym';
  className?: string;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ children, variant = 'warmup', className, ...props }, ref) => {
    const getVariantStyles = (variant: string) => {
      const variants = {
        warmup: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        strength: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        rehab: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
        pvd: 'bg-red-50 text-red-700 hover:bg-red-100',
        medball: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
        gym: 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      };
      return variants[variant as keyof typeof variants] || variants.warmup;
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "px-6 py-3", // 24px horizontal, 12px vertical
          "rounded-full", // Pill shape
          "font-medium text-sm",
          "transition-colors duration-200",
          "shadow-sm hover:shadow-md", // Subtle drop shadow
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Variant-specific styles
          getVariantStyles(variant),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PillButton.displayName = "PillButton";

export { PillButton };
