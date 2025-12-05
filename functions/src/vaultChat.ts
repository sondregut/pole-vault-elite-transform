import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toolDefinitions, executeTool, getUserStats } from './chatTools';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

function buildSystemPrompt(userContext: any): string {
  return `You are an expert pole vault coach and training analyst built into the Vault app. You help athletes understand their training data, identify patterns, and improve their performance.

ATHLETE'S CURRENT STATS:
- Personal Best: ${userContext.personalBest || 'Not recorded yet'}
- Total Sessions: ${userContext.totalSessions}
- Total Jumps: ${userContext.totalJumps}
- Overall Success Rate: ${userContext.successRate}%

POLE VAULT KNOWLEDGE:
- Jump ratings: "great" (excellent execution), "good" (solid jump), "ok" (acceptable), "glider" (plant/swing issues, common at higher bars), "runthru" (aborted attempt, no takeoff)
- Result: "make" = cleared the bar, "no-make" = missed/knocked bar
- Bar clearance: "deep" (cleared well over), "on" (close clearance), "shallow" (barely cleared)
- Session types: "Training" (practice) vs "Competition" (meets/competitions)
- Competition phase: "warmup" vs "competition" jumps within a meet
- A high success rate at a height (>66%) suggests readiness to move up
- Gliders often indicate the athlete is challenging themselves at new heights

AVAILABLE DATA FOR EACH JUMP:
- Height and bar units (meters or feet)
- Pole: brand, length, weight (lbs), flex number
- Technical: steps (approach count), grip height, run-up length, takeoff point, mid-mark, standards
- Rating, result, bar clearance, notes
- Video availability, favorite status, warmup indicator

AVAILABLE DATA FOR EACH SESSION:
- Date, location, indoor/outdoor
- Competition name and phase (if competition)
- Weather: conditions, temperature, wind direction & speed
- Athlete state: energy level (1-10), session goal, mental notes
- Post-session notes and reflections

WHAT YOU CAN DO:
1. Search sessions by date, location, competition name, or type
2. Find specific jumps by height, rating, result, or video availability
3. Calculate and explain statistics (success rates, trends, comparisons)
4. Navigate users directly to sessions, videos, or analytics
5. Provide coaching insights based on the data
6. Compare performance between time periods, locations, training vs competition, indoor vs outdoor
7. Analyze pole performance and recommend best poles for specific heights
8. Track height progression and readiness to move up
9. Analyze technique patterns (grip, steps, takeoff, standards)
10. Provide personalized training recommendations

CRITICAL TOOL USAGE RULES:
1. ALWAYS call search_jumps or search_sessions when user asks to see videos, jumps, or sessions
2. The UI automatically displays cards for returned results - if you don't call the tool, nothing displays
3. Use limit=1 when user asks for ONE specific thing (e.g., "show me my last video", "the video before that")
4. Only use higher limits when user asks for multiple items (e.g., "show me all my competition videos")

RESPONSE STYLE:
- Write 1-2 short conversational sentences only
- NO lists, NO bullet points, NO markdown formatting
- NEVER include JSON, code, sessionId, or technical details
- Keep it brief - the video cards speak for themselves

PRECISION RULES:
- When user asks for ONE thing, return ONLY ONE result (use limit=1)
- "my last video" = most recent video, limit=1
- "the one before that" = use context to find the specific one, limit=1
- "show me videos from X" = can return multiple
- Don't dump all results when user wants something specific

Always call the tools - never respond about videos/jumps without calling search_jumps first.`;
}

// Convert tool definitions to Gemini format
function getGeminiTools() {
  return toolDefinitions.map(tool => ({
    name: tool.function.name,
    description: tool.function.description,
    parameters: tool.function.parameters,
  }));
}

export const vaultChat = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB',
    secrets: ['GEMINI_API_KEY'],
  })
  .https.onCall(async (data: ChatRequest, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be logged in to use the chat'
      );
    }

    const userId = context.auth.uid;
    const { message, conversationHistory } = data;

    // Validate input
    if (!message || typeof message !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Message is required'
      );
    }

    if (message.length > 1000) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Message too long (max 1000 characters)'
      );
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Gemini API key not configured'
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        tools: [{ functionDeclarations: getGeminiTools() as any }],
        systemInstruction: buildSystemPrompt(await getUserStats(userId, { timeframe: 'all' })),
      });

      // Build chat history - filter to ensure it starts with a user message
      // Gemini requires the first message in history to be from 'user', not 'model'
      let filteredHistory = conversationHistory.slice(-10);

      // Find the first user message and start from there
      const firstUserIndex = filteredHistory.findIndex(msg => msg.role === 'user');
      if (firstUserIndex > 0) {
        filteredHistory = filteredHistory.slice(firstUserIndex);
      } else if (firstUserIndex === -1) {
        // No user messages in history, start fresh
        filteredHistory = [];
      }

      const history: any[] = filteredHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({ history });

      // Send message and handle tool calls
      let response = await chat.sendMessage(message);
      const toolResults: any = {};
      let navigation: any = null;

      // Process function calls - limit to 5 iterations to prevent infinite loops
      let iterations = 0;
      const maxIterations = 5;

      while (iterations < maxIterations && response.response.candidates?.[0]?.content?.parts?.some((p: any) => p.functionCall)) {
        iterations++;
        const parts = response.response.candidates[0].content.parts;
        const functionResponseParts: any[] = [];

        for (const part of parts) {
          if (part.functionCall) {
            const toolName = part.functionCall.name;
            const args = part.functionCall.args || {};

            // Execute the tool
            const result = await executeTool(userId, toolName, args);

            // Store results for response
            console.log(`[vaultChat] Tool called: ${toolName}, args:`, JSON.stringify(args));
            console.log(`[vaultChat] Tool result:`, JSON.stringify(result).substring(0, 500));

            if (toolName === 'search_sessions') {
              toolResults.sessionResults = result;
            } else if (toolName === 'search_jumps') {
              toolResults.jumpResults = result;
              console.log(`[vaultChat] jumpResults set with ${Array.isArray(result) ? result.length : 0} items`);
            } else if (toolName === 'get_user_stats') {
              toolResults.stats = result;
            } else if (toolName === 'navigate_to') {
              navigation = result.navigation;
            }

            // Each function response is a separate part
            functionResponseParts.push({
              functionResponse: {
                name: toolName,
                response: { result: JSON.stringify(result) },
              },
            });
          }
        }

        // Send function results back as parts array
        response = await chat.sendMessage(functionResponseParts);
      }

      // Extract final text response
      let finalText = response.response.candidates?.[0]?.content?.parts
        ?.filter((p: any) => p.text)
        ?.map((p: any) => p.text)
        ?.join('\n') || '';

      // Strip any markdown formatting
      finalText = finalText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^#{1,3}\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/^[-*]\s+/gm, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/navigate_to[^)]*\)/g, '')
        .replace(/\{[^}]*sessionId[^}]*\}/g, '')
        .trim();

      // Always return results if we have them - the UI will display them
      console.log(`[vaultChat] Returning response with jumpResults: ${toolResults.jumpResults ? toolResults.jumpResults.length : 'undefined'}`);
      return {
        message: finalText || 'I found some results for you.',
        navigation,
        sessionResults: toolResults.sessionResults,
        jumpResults: toolResults.jumpResults,
        stats: toolResults.stats,
      };
    } catch (error: any) {
      console.error('Chat error:', error);

      if (error.status === 429) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'AI service rate limited. Please try again in a moment.'
        );
      }

      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while processing your message'
      );
    }
  });
