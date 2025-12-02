import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  name: string;
  username: string;
  competitiveLevel: string;
  preferredUnits: 'metric' | 'imperial';
  personalRecord: string;
  goalHeight: string;
  email: string;
  password: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const defaultData: OnboardingData = {
  name: '',
  username: '',
  competitiveLevel: '',
  preferredUnits: 'imperial',
  personalRecord: '',
  goalHeight: '',
  email: '',
  password: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
