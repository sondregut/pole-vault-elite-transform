import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const LAUNCH_COUPON_ID = process.env.LAUNCH_COUPON_ID || 'LAUNCH50';

interface CouponResponse {
  available: boolean;
  remaining: number;
  total: number;
  discountPercent: number;
}

export const checkCouponAvailability = functions.https.onCall(
  async (): Promise<CouponResponse> => {
    const db = admin.firestore();

    const couponDoc = await db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID).get();

    if (!couponDoc.exists) {
      // Coupon document doesn't exist yet, initialize it
      const initialData = {
        code: LAUNCH_COUPON_ID,
        maxRedemptions: 100,
        currentRedemptions: 0,
        discountPercent: 50,
        redeemedBy: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID).set(initialData);

      return {
        available: true,
        remaining: 100,
        total: 100,
        discountPercent: 50,
      };
    }

    const data = couponDoc.data();
    const maxRedemptions = data?.maxRedemptions || 100;
    const currentRedemptions = data?.currentRedemptions || 0;
    const discountPercent = data?.discountPercent || 50;
    const remaining = Math.max(0, maxRedemptions - currentRedemptions);

    return {
      available: remaining > 0,
      remaining,
      total: maxRedemptions,
      discountPercent,
    };
  }
);
