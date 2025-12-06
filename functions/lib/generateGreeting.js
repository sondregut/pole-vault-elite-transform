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
exports.generateGreeting = void 0;
const functions = __importStar(require("firebase-functions"));
const generative_ai_1 = require("@google/generative-ai");
const chatTools_1 = require("./chatTools");
exports.generateGreeting = functions
    .runWith({
    timeoutSeconds: 30,
    memory: '256MB',
    secrets: ['GEMINI_API_KEY'],
})
    .https.onCall(async (_data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }
    const userId = context.auth.uid;
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
        // Return a default greeting if no API key
        return {
            greeting: "Hey! I'm your pole vault coach assistant. What would you like to know?",
        };
    }
    try {
        // Get user stats for context
        const userStats = await (0, chatTools_1.getUserStats)(userId, { timeframe: 'all' });
        const recentStats = await (0, chatTools_1.getUserStats)(userId, { timeframe: 'month' });
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        // Build context for greeting generation
        const hasData = userStats.totalSessions > 0;
        let contextInfo = '';
        if (hasData) {
            contextInfo = `
The athlete has:
- Personal best: ${userStats.personalBest || 'Not set'}
- Total sessions: ${userStats.totalSessions}
- Total jumps: ${userStats.totalJumps}
- Success rate: ${userStats.successRate}%
- Recent activity (last month): ${recentStats.totalSessions} sessions, ${recentStats.totalJumps} jumps
`;
        }
        const prompt = `You are a friendly pole vault coach assistant. Generate a SHORT, personalized greeting (1-2 sentences max) for the athlete opening the chat.

${hasData ? contextInfo : 'This is a new user with no data yet.'}

Rules:
- Be warm and encouraging but professional
- NO emojis
- Keep it brief - max 2 sentences
- If they have recent activity, acknowledge it briefly
- If they have a PB, you can mention you're ready to help them improve
- If new user, welcome them and offer to help track their training
- Don't list what you can do - just be natural
- End with an open question like "What's on your mind?" or "How can I help today?"

Generate ONLY the greeting text, nothing else.`;
        const result = await model.generateContent(prompt);
        const greeting = result.response.text().trim();
        return { greeting };
    }
    catch (error) {
        console.error('Greeting generation error:', error);
        // Return fallback greeting on error
        return {
            greeting: "Hey! I'm here to help with your pole vault training. What would you like to know?",
        };
    }
});
//# sourceMappingURL=generateGreeting.js.map