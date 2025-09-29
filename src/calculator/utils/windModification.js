export const WIND_AFFECTED_EVENTS = [
  '100m',
  '200m',
  '100mH',
  '110mH',
  'Long Jump',
  'Triple Jump'
];

// Points modification per wind speed (m/s)
export const WIND_MODIFICATIONS = {
  '-5.0': 30,
  '-4.0': 24,
  '-3.0': 18,
  '-2.0': 12,
  '-1.0': 6,
  '0.0': 0,
  '2.0': 0,    // No modification between 0 and +2.0
  '2.1': -0.6, // Deductions start from here
  '3.0': -6,
  '4.0': -12,
  '5.0': -18
};

export const needsWindInput = (eventType) => {
  return ['100m', '200m', '100mH', '110mH', 'LJ', 'TJ'].includes(eventType);
};

export const calculateWindModification = (eventType, windSpeed, points) => {
  if (!needsWindInput(eventType)) return 0;
  
  // Wind adjustment coefficients
  const coefficients = {
    '100m': 0.6,
    '200m': 0.6,
    '100mH': 0.6,
    '110mH': 0.6,
    'LJ': 0.4,
    'TJ': 0.4
  };

  return -points * coefficients[eventType] * windSpeed / 100;
}; 