export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  deepLink?: string;
  category: 'engagement' | 'subscription' | 'social' | 'training' | 'announcement';
  suggestedAudience?: string[];
}

export const notificationTemplates: NotificationTemplate[] = [
  // Engagement
  {
    id: 'trial-ending-3days',
    name: 'Trial Ending Soon (3 days)',
    title: 'Your trial ends in 3 days',
    body: 'Don\'t lose access to your training data and analytics. Upgrade now to keep tracking your progress!',
    deepLink: 'vault://subscription',
    category: 'engagement',
    suggestedAudience: ['trial'],
  },
  {
    id: 'trial-ending-1day',
    name: 'Trial Ending Tomorrow',
    title: 'Last chance! Trial ends tomorrow',
    body: 'Your free trial ends tomorrow. Upgrade to Athlete or Athlete+ to continue tracking your vaults.',
    deepLink: 'vault://subscription',
    category: 'engagement',
    suggestedAudience: ['trial'],
  },
  {
    id: 'weekly-reminder',
    name: 'Weekly Training Reminder',
    title: 'Time to train! 🏃‍♂️',
    body: 'Haven\'t logged a session this week? Track your next training session and see your progress!',
    deepLink: 'vault://sessions/new',
    category: 'engagement',
    suggestedAudience: ['athlete', 'athlete_plus', 'trial'],
  },
  {
    id: 'inactive-user',
    name: 'Re-engagement (Inactive Users)',
    title: 'We miss you! Come back to Vault',
    body: 'It\'s been a while since your last session. Check out new features and log your progress!',
    deepLink: 'vault://home',
    category: 'engagement',
    suggestedAudience: ['athlete', 'athlete_plus'],
  },

  // Subscription
  {
    id: 'subscription-renewal',
    name: 'Subscription Renewal Reminder',
    title: 'Your subscription renews soon',
    body: 'Your Athlete subscription will renew in 3 days. Thanks for being a valued member!',
    deepLink: 'vault://account',
    category: 'subscription',
    suggestedAudience: ['athlete', 'athlete_plus'],
  },
  {
    id: 'upgrade-prompt',
    name: 'Upgrade to Athlete+',
    title: 'Unlock premium features with Athlete+',
    body: 'Get advanced analytics, video storage, and exclusive training content. Upgrade today!',
    deepLink: 'vault://subscription',
    category: 'subscription',
    suggestedAudience: ['athlete'],
  },

  // Social
  {
    id: 'friend-request',
    name: 'Friend Request Received',
    title: 'New friend request!',
    body: '{userName} wants to connect with you on Vault.',
    deepLink: 'vault://friends/requests',
    category: 'social',
  },
  {
    id: 'post-liked',
    name: 'Post Liked',
    title: 'Someone liked your post',
    body: '{userName} liked your training session post!',
    deepLink: 'vault://feed',
    category: 'social',
  },
  {
    id: 'comment-received',
    name: 'New Comment',
    title: 'New comment on your post',
    body: '{userName} commented: "{comment}"',
    deepLink: 'vault://feed/post/{postId}',
    category: 'social',
  },

  // Training
  {
    id: 'personal-record',
    name: 'Personal Record Achieved',
    title: 'New personal record! 🎉',
    body: 'Congratulations! You just cleared {height}m - a new PR!',
    deepLink: 'vault://sessions/{sessionId}',
    category: 'training',
  },
  {
    id: 'training-streak',
    name: 'Training Streak Milestone',
    title: '{streak} day training streak! 🔥',
    body: 'Amazing consistency! You\'ve trained {streak} days in a row. Keep it up!',
    deepLink: 'vault://sessions',
    category: 'training',
  },
  {
    id: 'weekly-summary',
    name: 'Weekly Training Summary',
    title: 'Your week in review',
    body: 'This week: {sessions} sessions, {jumps} jumps, best height: {bestHeight}m. Great work!',
    deepLink: 'vault://stats',
    category: 'training',
  },

  // Announcements
  {
    id: 'new-feature',
    name: 'New Feature Announcement',
    title: 'New feature available! ✨',
    body: 'Check out the latest updates to Vault. We\'ve added some exciting new features!',
    deepLink: 'vault://whats-new',
    category: 'announcement',
    suggestedAudience: ['athlete', 'athlete_plus', 'trial'],
  },
  {
    id: 'app-update',
    name: 'App Update Available',
    title: 'Update available',
    body: 'A new version of Vault is available with bug fixes and improvements. Update now!',
    category: 'announcement',
  },
  {
    id: 'maintenance',
    name: 'Scheduled Maintenance',
    title: 'Scheduled maintenance',
    body: 'Vault will undergo maintenance on {date} from {time}. App may be temporarily unavailable.',
    category: 'announcement',
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): NotificationTemplate[] {
  return notificationTemplates.filter((t) => t.category === category);
}

// Helper function to get template by id
export function getTemplateById(id: string): NotificationTemplate | undefined {
  return notificationTemplates.find((t) => t.id === id);
}
