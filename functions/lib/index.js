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
exports.generateGreeting = exports.vaultChat = exports.checkCouponAvailability = exports.customerPortal = exports.stripeWebhook = exports.createCheckout = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Export all functions
var createCheckout_1 = require("./createCheckout");
Object.defineProperty(exports, "createCheckout", { enumerable: true, get: function () { return createCheckout_1.createCheckout; } });
var stripeWebhook_1 = require("./stripeWebhook");
Object.defineProperty(exports, "stripeWebhook", { enumerable: true, get: function () { return stripeWebhook_1.stripeWebhook; } });
var customerPortal_1 = require("./customerPortal");
Object.defineProperty(exports, "customerPortal", { enumerable: true, get: function () { return customerPortal_1.customerPortal; } });
var checkCouponAvailability_1 = require("./checkCouponAvailability");
Object.defineProperty(exports, "checkCouponAvailability", { enumerable: true, get: function () { return checkCouponAvailability_1.checkCouponAvailability; } });
var vaultChat_1 = require("./vaultChat");
Object.defineProperty(exports, "vaultChat", { enumerable: true, get: function () { return vaultChat_1.vaultChat; } });
var generateGreeting_1 = require("./generateGreeting");
Object.defineProperty(exports, "generateGreeting", { enumerable: true, get: function () { return generateGreeting_1.generateGreeting; } });
//# sourceMappingURL=index.js.map