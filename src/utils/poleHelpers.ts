import { Pole } from '@/types/vault';

/**
 * Get the display name for a pole
 * If the value is a pole ID (long alphanumeric string), look it up in the poles array
 * Otherwise return the value as-is (it's already a pole name)
 */
export const getPoleDisplayName = (poleIdOrName: string, poles: Pole[]): string => {
  if (!poleIdOrName) return '';

  // If it looks like a pole ID (long alphanumeric string), look it up
  if (poleIdOrName.length > 15) {
    const pole = poles.find(p => p.id === poleIdOrName);
    return pole ? pole.name : poleIdOrName;
  }

  // Otherwise it's already a pole name
  return poleIdOrName;
};
