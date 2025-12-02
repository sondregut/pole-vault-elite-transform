"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCouponAvailability = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const LAUNCH_COUPON_ID = process.env.LAUNCH_COUPON_ID || 'LAUNCH50';
exports.checkCouponAvailability = functions.https.onCall(async () => {
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
    const maxRedemptions = (data === null || data === void 0 ? void 0 : data.maxRedemptions) || 100;
    const currentRedemptions = (data === null || data === void 0 ? void 0 : data.currentRedemptions) || 0;
    const discountPercent = (data === null || data === void 0 ? void 0 : data.discountPercent) || 50;
    const remaining = Math.max(0, maxRedemptions - currentRedemptions);
    return {
        available: remaining > 0,
        remaining,
        total: maxRedemptions,
        discountPercent,
    };
});
//# sourceMappingURL=checkCouponAvailability.js.map