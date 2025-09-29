export const EVENT_CODES = {
  // Track Events
  '100m': '100m',
  '200m': '200m',
  '400m': '400m',
  '800m': '800m',
  '1500m': '1500m',
  '3000m': '3000m',
  '3000mSC': '3000mSC',
  '5000m': '5000m',
  '10000m': '10000m',
  '110mH': '110mH',
  '100mH': '100mH',
  '400mH': '400mH',
  
  // Field Events
  'High Jump': 'HJ',
  'Pole Vault': 'PV',
  'Long Jump': 'LJ',
  'Triple Jump': 'TJ',
  'Shot Put': 'SP',
  'Discus Throw': 'DT',
  'Hammer Throw': 'HT',
  'Javelin Throw': 'JT',
  
  // Combined Events
  'Decathlon': 'Decathlon',
  'Heptathlon': 'Heptathlon',
  'Pentathlon': 'Pentathlon'
};

// Helper function to check if an event is a combined event
export const isCombinedEvent = (event) => {
  return ['Decathlon', 'Heptathlon', 'Pentathlon'].includes(event);
};
