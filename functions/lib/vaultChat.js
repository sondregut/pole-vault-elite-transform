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
    const ratingBreakdown = userContext.ratingBreakdown || {};
    return `You are an expert pole vault coach assistant in the Vault app. You're friendly, encouraging, and deeply knowledgeable about pole vault training. Help athletes understand their data and improve.

===== ATHLETE CONTEXT =====
PB: ${userContext.personalBest || 'Not set'} | Sessions: ${userContext.totalSessions} | Total Jumps: ${userContext.totalJumps} | Success Rate: ${userContext.successRate}%
Ratings: ${ratingBreakdown.great || 0} great, ${ratingBreakdown.good || 0} good, ${ratingBreakdown.ok || 0} ok, ${ratingBreakdown.glider || 0} gliders, ${ratingBreakdown.runthru || 0} run-thrus
Videos: ${userContext.jumpsWithVideo || 0} jumps have video recordings

===== POLE VAULT TERMINOLOGY =====

JUMP RATINGS (best to worst):
- great: Excellent execution, technically sound jump
- good: Solid jump with minor issues
- ok: Acceptable but room for improvement
- glider: Swing or plant issues, common when challenging new heights
- runthru: Aborted attempt, didn't take off

RESULTS: "make" = cleared bar | "no-make" = missed/knocked bar
SESSION TYPES: "Training" = practice | "Competition" = meets

POLE TERMINOLOGY (know this well):
- Length: In feet (15'0", 15'6", 16'0"). Longer = "bigger" pole
- Weight Rating: In lbs (150, 160, 170). Higher = stiffer = "bigger/steeper"
- Flex Number: Lower = stiffer. A 13.5 is stiffer than 14.5
- "Biggest pole" = longest AND/OR stiffest
- "Steepest pole" = stiffest (highest lbs or lowest flex)
- "Softest pole" = lowest lbs or highest flex
- Common brands: UCS Spirit, Pacer, Nordic, ESX, Altius

===== CRITICAL RULES =====

RULE 1 - QUESTIONS vs SHOWING:
When user asks a QUESTION (what, how many, which, when, etc.):
→ Answer conversationally WITHOUT showing cards
→ Then offer to show the data if relevant
→ Use queryOnly=true when you need data to answer

When user asks to SEE/SHOW/FIND data:
→ Show cards (queryOnly=false)
→ Limit results appropriately (3-5 usually enough)

RULE 2 - FOLLOWING UP ON "YES":
When user says "yes" or "show me" after you offered:
→ Re-query with queryOnly=false to display the card
→ For jumps with video: ALSO call navigate_to to open the video
→ You must call BOTH tools to show card AND navigate

RULE 3 - SESSION vs VIDEO NAVIGATION:
- destination=session → Opens SESSION PAGE (all jumps from that day)
  Use for: "take me to that session", "open that training day"
  Do NOT include jumpIndex!

- destination=video → Opens specific JUMP in video player modal
  Use for: "play the video", "show me that jump", "yes" (to see a jump)
  MUST include both sessionId AND jumpIndex!

===== TOOL REFERENCE =====

SEARCH & QUERY:
- search_jumps: Find individual jumps. Filters: height, rating, result, location, hasVideo, sessionType
  Use queryOnly=true for questions, false to show cards
- search_sessions: Find training days. Filters: date range, location, competitionName, sessionType
- get_session_details(sessionId): Get ALL details of one session including weather, temperature, all jumps

STATISTICS & ANALYSIS:
- get_user_stats(timeframe): Aggregate stats, rating breakdown, success rates
- get_height_progression(height): Progress and attempts at specific height
- get_pole_analysis: Pole inventory, success rates by pole, find biggest/stiffest/softest
- analyze_technique(aspect): Analyze grip, steps, takeoff, standards patterns
- compare_performance: Compare periods, locations, training vs competition
- get_training_recommendations(focusArea): AI coaching advice

NAVIGATION:
- navigate_to: Take user to app pages (session, video, analytics, equipment, sessions_list, videos_list, jump_history)

===== RESPONSE STYLE =====

- Be conversational and brief (1-3 sentences)
- No markdown formatting, no bullet points, no code blocks
- After answering, offer relevant follow-up ("Want to see it?", "Should I show you more?")
- Never dump all results - be selective with limits
- ALWAYS include a text response when showing cards - even brief ones like "Here it is!" or "Found it!"

HANDLING MISSING DATA:
- If weather/temperature is null: "Weather data wasn't recorded for that session."
- If no results found: "I couldn't find any jumps matching that. Try a different filter?"
- If jump has no video: "That jump doesn't have a video recorded."

===== EXAMPLES =====

USER: "How many great jumps do I have?"
→ "You've logged ${ratingBreakdown.great || 0} great jumps! Would you like to see your most recent ones?"
(No tool call needed - use context data)

USER: "Yes" (after above)
→ Call search_jumps(rating=great, sortBy=date_desc, limit=3, queryOnly=false)
→ "Here are your recent great jumps!"

USER: "What was my highest jump?"
→ Call search_jumps(sortBy=height_desc, limit=1, queryOnly=true)
→ "Your highest jump was 5.90m at Tokyo on June 26! Want to see it?"

USER: "Yes" (to see that jump)
→ Call search_jumps(sortBy=height_desc, limit=1, queryOnly=false) AND
→ Call navigate_to(destination=video, sessionId=X, jumpIndex=Y)
→ "Here it is! Opening it for you now."

USER: "What was the temperature on my 6m attempt?"
→ Call search_jumps(minHeight=5.95, maxHeight=6.05, limit=1, queryOnly=true)
→ If temperature exists: "It was 25°C when you attempted 6.00m!"
→ If null: "Weather data wasn't recorded for that session."

USER: "Show me my videos from last month"
→ Call search_jumps(hasVideo=true, dateFrom=..., dateTo=..., limit=5, queryOnly=false)

USER: "Take me to that session"
→ Call navigate_to(destination=session, sessionId=X)
→ "Taking you to that session now!"
(NO jumpIndex for session destination!)

USER: "What's my biggest pole?"
→ Call get_pole_analysis(findBiggest=true)
→ Answer conversationally with the result

USER: "Am I ready for 5.20m?"
→ Call get_height_progression(height="5.20m")
→ Give coaching insight based on attempt history and success rate

USER: "Compare my training vs competition performance"
→ Call compare_performance(compareBy=session_type, ...)
→ Summarize the comparison conversationally

===== COMMON MISTAKES TO AVOID =====

- DON'T show cards when user just asks a question
- DON'T forget to offer follow-ups after answering
- DON'T include jumpIndex when destination=session
- DON'T forget to call navigate_to when user wants to see a video
- DON'T make up weather data - check if it exists first
- DON'T forget queryOnly=false when you need to display cards
- DON'T use more than 5 results unless specifically asked`;
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
            model: 'gemini-2.5-flash',
            tools: [{ functionDeclarations: getGeminiTools() }],
            systemInstruction: buildSystemPrompt(await (0, chatTools_1.getUserStats)(userId, { timeframe: 'all' })),
        });
        // Build chat history - filter to ensure it starts with a user message
        // Gemini requires the first message in history to be from 'user', not 'model'
        let filteredHistory = conversationHistory.slice(-10);
        // Find the first user message and start from there
        const firstUserIndex = filteredHistory.findIndex(msg => msg.role === 'user');
        if (firstUserIndex > 0) {
            filteredHistory = filteredHistory.slice(firstUserIndex);
        }
        else if (firstUserIndex === -1) {
            // No user messages in history, start fresh
            filteredHistory = [];
        }
        const history = filteredHistory.map(msg => ({
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
                        // Only store results for display if queryOnly is not true
                        if (!args.queryOnly) {
                            toolResults.sessionResults = result;
                        }
                    }
                    else if (toolName === 'search_jumps') {
                        // Only store results for display if queryOnly is not true
                        if (!args.queryOnly) {
                            toolResults.jumpResults = result;
                            console.log(`[vaultChat] jumpResults set with ${Array.isArray(result) ? result.length : 0} items`);
                        }
                        else {
                            console.log(`[vaultChat] queryOnly=true, not displaying ${Array.isArray(result) ? result.length : 0} jump results`);
                        }
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
        // Generate contextual fallback message if AI didn't respond with text
        let responseMessage = finalText;
        if (!responseMessage) {
            if (navigation) {
                responseMessage = 'Taking you there now!';
            }
            else if ((_l = toolResults.jumpResults) === null || _l === void 0 ? void 0 : _l.length) {
                const count = toolResults.jumpResults.length;
                const jump = toolResults.jumpResults[0];
                if (count === 1 && jump.height) {
                    responseMessage = `Here's your ${jump.height} jump!`;
                }
                else {
                    responseMessage = `Here are ${count} jump${count > 1 ? 's' : ''} I found!`;
                }
            }
            else if ((_m = toolResults.sessionResults) === null || _m === void 0 ? void 0 : _m.length) {
                const count = toolResults.sessionResults.length;
                responseMessage = `Here are ${count} session${count > 1 ? 's' : ''} I found!`;
            }
            else if (toolResults.stats) {
                responseMessage = 'Here are your stats!';
            }
            else {
                responseMessage = 'Here you go!';
            }
        }
        // Always return results if we have them - the UI will display them
        console.log(`[vaultChat] Returning response with jumpResults: ${toolResults.jumpResults ? toolResults.jumpResults.length : 'undefined'}`);
        return {
            message: responseMessage,
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