import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';

// Debug function to see what fields actually exist in user documents
export const debugUserFields = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(5)); // Get first 5 users
    const snapshot = await getDocs(q);

    console.log('=== DEBUG: User Document Fields ===');
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\nUser ${index + 1} (${doc.id}):`);
      console.log('All fields:', Object.keys(data));
      console.log('Full data:', data);

      // Check subscription-related fields specifically
      console.log('\nSubscription-related fields:');
      console.log('- hasLifetimeAccess:', data.hasLifetimeAccess);
      console.log('- subscriptionStatus:', data.subscriptionStatus);
      console.log('- subscriptionTier:', data.subscriptionTier);
      console.log('- tier:', data.tier);
      console.log('- isPremium:', data.isPremium);
      console.log('- isSubscribed:', data.isSubscribed);
      console.log('- trialEndsAt:', data.trialEndsAt);
      console.log('- subscriptionExpiresAt:', data.subscriptionExpiresAt);
    });

    return snapshot.docs.map(doc => ({
      id: doc.id,
      fields: Object.keys(doc.data()),
      data: doc.data()
    }));
  } catch (error) {
    console.error('Debug error:', error);
    return [];
  }
};
