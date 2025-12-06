import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserStats } from './chatTools';

export const generateGreeting = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB',
    secrets: ['GEMINI_API_KEY'],
  })
  .https.onCall(async (_data, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be logged in'
      );
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
      const userStats = await getUserStats(userId, { timeframe: 'all' });
      const recentStats = await getUserStats(userId, { timeframe: 'month' });

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    } catch (error: any) {
      console.error('Greeting generation error:', error);
      // Return fallback greeting on error
      return {
        greeting: "Hey! I'm here to help with your pole vault training. What would you like to know?",
      };
    }
  });
