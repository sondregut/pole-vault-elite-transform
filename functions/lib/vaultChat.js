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
exports.vaultChat = void 0;
const functions = __importStar(require("firebase-functions"));
const generative_ai_1 = require("@google/generative-ai");
const chatTools_1 = require("./chatTools");
function buildSystemPrompt(userContext) {
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
    return chatTools_1.toolDefinitions.map(tool => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
    }));
}
exports.vaultChat = functions
    .runWith({
    timeoutSeconds: 60,
    memory: '256MB',
    secrets: ['GEMINI_API_KEY'],
})
    .https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to use the chat');
    }
    const userId = context.auth.uid;
    const { message, conversationHistory } = data;
    // Validate input
    if (!message || typeof message !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Message is required');
    }
    if (message.length > 1000) {
        throw new functions.https.HttpsError('invalid-argument', 'Message too long (max 1000 characters)');
    }
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
        throw new functions.https.HttpsError('failed-precondition', 'Gemini API key not configured');
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            tools: [{ functionDeclarations: getGeminiTools() }],
            systemInstruction: buildSystemPrompt(await (0, chatTools_1.getUserStats)(userId, { timeframe: 'all' })),
        });
        // Build chat history
        const history = conversationHistory.slice(-10).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));
        const chat = model.startChat({ history });
        // Send message and handle tool calls
        let response = await chat.sendMessage(message);
        const toolResults = {};
        let navigation = null;
        // Process function calls - limit to 5 iterations to prevent infinite loops
        let iterations = 0;
        const maxIterations = 5;
        while (iterations < maxIterations && ((_d = (_c = (_b = (_a = response.response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.some((p) => p.functionCall))) {
            iterations++;
            const parts = response.response.candidates[0].content.parts;
            const functionResponseParts = [];
            for (const part of parts) {
                if (part.functionCall) {
                    const toolName = part.functionCall.name;
                    const args = part.functionCall.args || {};
                    // Execute the tool
                    const result = await (0, chatTools_1.executeTool)(userId, toolName, args);
                    // Store results for response
                    console.log(`[vaultChat] Tool called: ${toolName}, args:`, JSON.stringify(args));
                    console.log(`[vaultChat] Tool result:`, JSON.stringify(result).substring(0, 500));
                    if (toolName === 'search_sessions') {
                        toolResults.sessionResults = result;
                    }
                    else if (toolName === 'search_jumps') {
                        toolResults.jumpResults = result;
                        console.log(`[vaultChat] jumpResults set with ${Array.isArray(result) ? result.length : 0} items`);
                    }
                    else if (toolName === 'get_user_stats') {
                        toolResults.stats = result;
                    }
                    else if (toolName === 'navigate_to') {
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
        let finalText = ((_k = (_j = (_h = (_g = (_f = (_e = response.response.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((p) => p.text)) === null || _j === void 0 ? void 0 : _j.map((p) => p.text)) === null || _k === void 0 ? void 0 : _k.join('\n')) || '';
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
    }
    catch (error) {
        console.error('Chat error:', error);
        if (error.status === 429) {
            throw new functions.https.HttpsError('resource-exhausted', 'AI service rate limited. Please try again in a moment.');
        }
        throw new functions.https.HttpsError('internal', 'An error occurred while processing your message');
    }
});
//# sourceMappingURL=vaultChat.js.map