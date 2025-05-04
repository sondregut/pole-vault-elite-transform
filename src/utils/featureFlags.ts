
/**
 * Simple feature flag system to toggle sections of the website
 * This can be expanded later to fetch flags from a remote config or backend
 */

// Add sections that should be hidden to this list
const HIDDEN_SECTIONS = [
  // 'AthleteResults',
  // 'Features',
  // 'CoachProfile',
  // 'Testimonials',
  // 'Programs',
  // 'AppFeatures',
  // 'VideoAnalysis',
  // 'BeforeAfter',
  // 'CTASection',
];

/**
 * Check if a section should be visible
 * @param sectionName The name of the section to check
 * @returns boolean indicating if the section should be shown
 */
export const isVisible = (sectionName: string): boolean => {
  return !HIDDEN_SECTIONS.includes(sectionName);
};
