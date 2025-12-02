import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/utils/firebase';

const functions = getFunctions(app);

export type PriceId = 'monthly' | 'yearly';

export interface CheckoutRequest {
  priceId: PriceId;
  applyCoupon?: boolean;
}

export interface CheckoutResponse {
  url: string;
  couponApplied: boolean;
  couponRemaining?: number;
}

export interface PortalResponse {
  url: string;
}

export interface CouponAvailability {
  available: boolean;
  remaining: number;
  total: number;
  discountPercent: number;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export const createCheckoutSession = async (
  request: CheckoutRequest
): Promise<CheckoutResponse> => {
  const createCheckout = httpsCallable<CheckoutRequest, CheckoutResponse>(
    functions,
    'createCheckout'
  );
  const result = await createCheckout(request);
  return result.data;
};

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export const createPortalSession = async (userId: string): Promise<PortalResponse> => {
  const customerPortal = httpsCallable<{ userId: string }, PortalResponse>(
    functions,
    'customerPortal'
  );
  const result = await customerPortal({ userId });
  return result.data;
};

/**
 * Check if the launch discount coupon is still available
 */
export const checkCouponAvailability = async (): Promise<CouponAvailability> => {
  const checkCoupon = httpsCallable<void, CouponAvailability>(
    functions,
    'checkCouponAvailability'
  );
  const result = await checkCoupon();
  return result.data;
};

/**
 * Redirect user to Stripe Checkout (no login required)
 */
export const redirectToCheckout = async (
  priceId: PriceId,
  applyCoupon: boolean = true
): Promise<{ couponApplied: boolean; couponRemaining?: number }> => {
  const response = await createCheckoutSession({
    priceId,
    applyCoupon,
  });

  // Redirect to Stripe Checkout
  window.location.href = response.url;

  return {
    couponApplied: response.couponApplied,
    couponRemaining: response.couponRemaining,
  };
};

/**
 * Redirect user to Stripe Customer Portal
 */
export const redirectToPortal = async (userId: string): Promise<void> => {
  const response = await createPortalSession(userId);
  window.location.href = response.url;
};
