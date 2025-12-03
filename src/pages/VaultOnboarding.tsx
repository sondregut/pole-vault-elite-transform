import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, User, AtSign, Trophy, Ruler, Target, Loader2 } from 'lucide-react';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, db, app } from '@/utils/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';

// Competitive level options
const competitiveLevels = [
  { id: 'high_school', label: 'High School', description: 'Currently in high school or just starting out' },
  { id: 'college', label: 'College', description: 'Competing at the collegiate level' },
  { id: 'club', label: 'Club/Post-Collegiate', description: 'Training with a club or independently' },
  { id: 'professional', label: 'Professional', description: 'Competing at national/international level' },
  { id: 'masters', label: 'Masters', description: 'Masters division athlete' },
  { id: 'recreational', label: 'Recreational', description: 'Vaulting for fun and fitness' },
];

// Step components
const StepName = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [name, setName] = useState(data.name);
  const isValid = name.trim().length >= 2;

  const handleNext = () => {
    updateData({ name: name.trim() });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <User className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      <div>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-center text-xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
          autoFocus
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid}
        className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all disabled:opacity-50"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

const StepUsername = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [username, setUsername] = useState(data.username);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const validateUsername = (value: string) => {
    const cleaned = value.toLowerCase().replace(/\s/g, '');
    setUsername(cleaned);
    setIsAvailable(null);

    if (cleaned.length < 3) {
      setError('Username must be at least 3 characters');
    } else if (cleaned.length > 20) {
      setError('Username must be 20 characters or less');
    } else if (!/^[a-z0-9_.\-]+$/.test(cleaned)) {
      setError('Only letters, numbers, underscores, hyphens, and periods');
    } else {
      setError('');
    }
  };

  const isValidFormat = username.length >= 3 && username.length <= 20 && /^[a-z0-9_.\-]+$/.test(username);

  const checkUsernameAvailability = async () => {
    if (!isValidFormat) return;

    setIsChecking(true);
    setError('');

    try {
      const functions = getFunctions(app);
      const checkUsername = httpsCallable(functions, 'checkUsernameAvailable');
      const result = await checkUsername({ username });
      const data = result.data as { available: boolean; message: string; reason?: string };

      setIsAvailable(data.available);
      if (!data.available) {
        setError(data.message || 'This username is already taken');
      }
    } catch (err) {
      console.error('Username check failed:', err);
      // If the check fails, allow the user to continue (will be checked again on account creation)
      setIsAvailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = async () => {
    if (!isValidFormat) return;

    // Check availability before proceeding
    if (isAvailable === null) {
      await checkUsernameAvailability();
    }

    if (isAvailable) {
      updateData({ username });
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <AtSign className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      <div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-vault-text-muted text-xl">@</span>
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => validateUsername(e.target.value)}
            onBlur={checkUsernameAvailability}
            className="text-center text-xl py-6 pl-10 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
            autoFocus
          />
        </div>
        {isChecking && (
          <p className="text-vault-text-muted text-sm mt-2 text-center">Checking availability...</p>
        )}
        {!isChecking && error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        {!isChecking && !error && isAvailable === true && (
          <p className="text-green-600 text-sm mt-2 text-center">Username is available!</p>
        )}
        {!isChecking && !error && isAvailable === null && (
          <p className="text-vault-text-muted text-sm mt-2 text-center">
            Use letters, numbers, underscores, hyphens, and periods
          </p>
        )}
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValidFormat || isChecking || isAvailable === false}
        className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all disabled:opacity-50"
      >
        {isChecking ? 'Checking...' : 'Continue'}
        {!isChecking && <ArrowRight className="w-5 h-5 ml-2" />}
      </Button>
    </div>
  );
};

const StepLevel = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState(data.competitiveLevel);

  const handleNext = () => {
    updateData({ competitiveLevel: selected });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      <div className="space-y-3">
        {competitiveLevels.map((level) => (
          <motion.button
            key={level.id}
            onClick={() => setSelected(level.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selected === level.id
                ? 'border-vault-primary bg-vault-primary/5'
                : 'border-vault-border hover:border-vault-primary/50'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-vault-text">{level.label}</p>
                <p className="text-sm text-vault-text-secondary">{level.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selected === level.id
                    ? 'border-vault-primary bg-vault-primary'
                    : 'border-vault-border'
                }`}
              >
                {selected === level.id && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selected}
        className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all disabled:opacity-50"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

const StepUnits = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<'metric' | 'imperial'>(data.preferredUnits);

  const handleNext = () => {
    updateData({ preferredUnits: selected });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <Ruler className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          onClick={() => setSelected('metric')}
          className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
            selected === 'metric'
              ? 'border-vault-primary bg-vault-primary/5'
              : 'border-vault-border hover:border-vault-primary/50'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-vault-text">Metric</p>
              <p className="text-sm text-vault-text-secondary">Meters and centimeters (e.g., 4.50m, 5.00m)</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === 'metric'
                  ? 'border-vault-primary bg-vault-primary'
                  : 'border-vault-border'
              }`}
            >
              {selected === 'metric' && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setSelected('imperial')}
          className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
            selected === 'imperial'
              ? 'border-vault-primary bg-vault-primary/5'
              : 'border-vault-border hover:border-vault-primary/50'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-vault-text">Imperial</p>
              <p className="text-sm text-vault-text-secondary">Feet and inches (e.g., 14'9", 16'5")</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === 'imperial'
                  ? 'border-vault-primary bg-vault-primary'
                  : 'border-vault-border'
              }`}
            >
              {selected === 'imperial' && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        </motion.button>
      </div>

      <p className="text-center text-sm text-vault-text-muted">
        Don't worry, you can change this later in settings
      </p>

      <Button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

const StepPR = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [meters, setMeters] = useState('');

  const isMetric = data.preferredUnits === 'metric';

  const handleNext = () => {
    let pr = '';
    if (isMetric) {
      pr = meters ? `${meters}m` : '';
    } else {
      if (feet || inches) {
        pr = `${feet || '0'}'${inches || '0'}"`;
      }
    }
    updateData({ personalRecord: pr });
    onNext();
  };

  const handleMetersChange = (value: string) => {
    // If empty, clear everything
    if (value === '') {
      setMeters('');
      return;
    }

    // Remove any non-numeric characters except period
    let cleaned = value.replace(/[^\d.]/g, '');

    // Remove all periods to count digits
    const digitsOnly = cleaned.replace(/\./g, '');

    // If no digits, clear
    if (digitsOnly.length === 0) {
      setMeters('');
      return;
    }

    // If user is deleting from "X." (single digit), clear everything
    // Detect this by checking if input is just one digit with no period
    const currentDigitsOnly = meters.replace(/[^\d]/g, '');
    if (currentDigitsOnly.length === 1 && digitsOnly.length === 1 && !value.includes('.')) {
      setMeters('');
      return;
    }

    // Format based on number of digits
    if (digitsOnly.length === 1) {
      // Single digit: show as "X."
      cleaned = digitsOnly + '.';
    } else {
      // Multiple digits: show as "X.XX"
      cleaned = digitsOnly.charAt(0) + '.' + digitsOnly.slice(1);
    }

    // Limit to 3 digits total (X.XX format)
    const maxDigits = 3;
    if (digitsOnly.length > maxDigits) {
      const limitedDigits = digitsOnly.slice(0, maxDigits);
      cleaned = limitedDigits.charAt(0) + '.' + limitedDigits.slice(1);
    }

    setMeters(cleaned);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      {isMetric ? (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={meters}
            onChange={(e) => handleMetersChange(e.target.value)}
            className="w-32 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
            autoFocus
          />
          <span className="text-2xl text-vault-text-muted">m</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={feet}
            onChange={(e) => setFeet(e.target.value.replace(/\D/g, '').slice(0, 2))}
            className="w-20 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
            autoFocus
          />
          <span className="text-2xl text-vault-text-muted">'</span>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inches}
            onChange={(e) => setInches(e.target.value.replace(/[^0-9.]/g, '').slice(0, 5))}
            className="w-20 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
          />
          <span className="text-2xl text-vault-text-muted">"</span>
        </div>
      )}

      <p className="text-center text-sm text-vault-text-muted">
        This is optional - you can skip if you prefer
      </p>

      <div className="space-y-3">
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button
          onClick={() => {
            updateData({ personalRecord: '' });
            onNext();
          }}
          variant="ghost"
          className="w-full text-vault-text-secondary"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

const StepGoal = ({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) => {
  const { data, updateData } = useOnboarding();
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [meters, setMeters] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isMetric = data.preferredUnits === 'metric';

  const handleComplete = async () => {
    setIsLoading(true);

    let goal = '';
    if (isMetric) {
      goal = meters ? `${meters}m` : '';
    } else {
      if (feet || inches) {
        goal = `${feet || '0'}'${inches || '0'}"`;
      }
    }

    try {
      // Save/update profile to Firestore (merge with existing data from signup/webhook)
      await setDoc(doc(db, 'users', data.userId), {
        fullName: data.name,
        username: data.username,
        sport: 'Track & Field - Pole Vault',
        competitiveLevel: data.competitiveLevel,
        preferredUnits: data.preferredUnits,
        personalRecord: data.personalRecord || 'Not set',
        goalHeight: goal || 'Not set',
        onboardingCompleted: true,
        onboardingCompletedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      updateData({ goalHeight: goal });

      toast({
        title: 'Welcome to VAULT!',
        description: 'Your profile is all set up.',
      });

      onComplete();
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetersChange = (value: string) => {
    // If empty, clear everything
    if (value === '') {
      setMeters('');
      return;
    }

    // Remove any non-numeric characters except period
    let cleaned = value.replace(/[^\d.]/g, '');

    // Remove all periods to count digits
    const digitsOnly = cleaned.replace(/\./g, '');

    // If no digits, clear
    if (digitsOnly.length === 0) {
      setMeters('');
      return;
    }

    // If user is deleting from "X." (single digit), clear everything
    // Detect this by checking if input is just one digit with no period
    const currentDigitsOnly = meters.replace(/[^\d]/g, '');
    if (currentDigitsOnly.length === 1 && digitsOnly.length === 1 && !value.includes('.')) {
      setMeters('');
      return;
    }

    // Format based on number of digits
    if (digitsOnly.length === 1) {
      // Single digit: show as "X."
      cleaned = digitsOnly + '.';
    } else {
      // Multiple digits: show as "X.XX"
      cleaned = digitsOnly.charAt(0) + '.' + digitsOnly.slice(1);
    }

    // Limit to 3 digits total (X.XX format)
    const maxDigits = 3;
    if (digitsOnly.length > maxDigits) {
      const limitedDigits = digitsOnly.slice(0, maxDigits);
      cleaned = limitedDigits.charAt(0) + '.' + limitedDigits.slice(1);
    }

    setMeters(cleaned);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-vault-primary/10 flex items-center justify-center">
          <Target className="w-8 h-8 text-vault-primary" />
        </div>
      </div>

      {isMetric ? (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={meters}
            onChange={(e) => handleMetersChange(e.target.value)}
            className="w-32 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
            autoFocus
          />
          <span className="text-2xl text-vault-text-muted">m</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={feet}
            onChange={(e) => setFeet(e.target.value.replace(/\D/g, '').slice(0, 2))}
            className="w-20 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
            autoFocus
          />
          <span className="text-2xl text-vault-text-muted">'</span>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inches}
            onChange={(e) => setInches(e.target.value.replace(/[^0-9.]/g, '').slice(0, 5))}
            className="w-20 text-center text-2xl py-6 border-0 border-b-2 border-vault-border rounded-none focus:border-vault-primary focus:ring-0 bg-transparent"
          />
          <span className="text-2xl text-vault-text-muted">"</span>
        </div>
      )}

      <p className="text-center text-sm text-vault-text-muted">
        What height are you working towards?
      </p>

      <div className="space-y-3">
        <Button
          onClick={handleComplete}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all disabled:opacity-50"
        >
          {isLoading ? 'Finishing Setup...' : 'Complete Setup'}
          {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
        <Button
          onClick={handleComplete}
          disabled={isLoading}
          variant="ghost"
          className="w-full text-vault-text-secondary"
        >
          {isLoading ? 'Please wait...' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
};

// Main Onboarding Component
const OnboardingContent = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, updateData } = useOnboarding();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Total steps is now 6 (removed auth step)
  const totalSteps = 6;

  const titles = [
    "What's your name?",
    'Choose a username',
    "What's your competitive level?",
    'Preferred units',
    "What's your personal record?",
    "What's your goal height?",
  ];

  const subtitles = [
    "Let's get to know you",
    'This is how other athletes will find you',
    'Help us personalize your experience',
    'How would you like to track your heights?',
    'Your best vault so far',
    'Dream big - what are you working towards?',
  ];

  // Check authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is authenticated, store their info
        updateData({
          userId: user.uid,
          email: user.email || '',
          name: user.displayName || '',
        });

        // Check if user has already completed onboarding
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data()?.onboardingCompleted) {
            // Already onboarded, redirect to dashboard
            navigate('/vault/dashboard');
            return;
          }
        } catch (err) {
          console.error('Error checking onboarding status:', err);
        }

        setIsAuthenticated(true);
      } else {
        // Not authenticated, redirect to signup
        navigate('/vault/signup');
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate, updateData]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate('/vault/dashboard');
  };

  const progress = (currentStep / totalSteps) * 100;

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vault-primary mx-auto mb-4" />
          <p className="text-vault-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      {/* Header with back button and progress */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-vault-border/50">
        <div className="container mx-auto px-4 py-4 max-w-lg">
          <div className="flex items-center gap-4 mb-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-vault-primary/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-vault-text" />
              </button>
            )}
            <span className="text-sm text-vault-text-muted">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-vault-border/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-vault-primary to-vault-primary-dark rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-vault-text mb-2">
                {titles[currentStep - 1]}
              </h1>
              <p className="text-vault-text-secondary">{subtitles[currentStep - 1]}</p>
            </div>

            {/* Step content - now 6 steps instead of 7 */}
            {currentStep === 1 && <StepName onNext={handleNext} />}
            {currentStep === 2 && <StepUsername onNext={handleNext} onBack={handleBack} />}
            {currentStep === 3 && <StepLevel onNext={handleNext} onBack={handleBack} />}
            {currentStep === 4 && <StepUnits onNext={handleNext} onBack={handleBack} />}
            {currentStep === 5 && <StepPR onNext={handleNext} onBack={handleBack} />}
            {currentStep === 6 && <StepGoal onComplete={handleComplete} onBack={handleBack} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const VaultOnboarding = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default VaultOnboarding;
