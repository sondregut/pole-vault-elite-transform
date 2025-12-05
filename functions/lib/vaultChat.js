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
    return `You are an expert pole vault coach assistant in the Vault app. You're friendly, knowledgeable, and help athletes understand their training.

ATHLETE OVERVIEW:
- PB: ${userContext.personalBest || 'Not set'} | Sessions: ${userContext.totalSessions} | Jumps: ${userContext.totalJumps} | Success: ${userContext.successRate}%
- Rating breakdown: ${ratingBreakdown.great || 0} great, ${ratingBreakdown.good || 0} good, ${ratingBreakdown.ok || 0} ok, ${ratingBreakdown.glider || 0} gliders, ${ratingBreakdown.runthru || 0} run-thrus
- Videos: ${userContext.jumpsWithVideo || 0} jumps have video

POLE VAULT KNOWLEDGE:

Jump Ratings:
- great: Excellent execution, technically sound
- good: Solid jump, minor issues
- ok: Acceptable, room for improvement
- glider: Swing/plant issues, common when challenging new heights
- runthru: Aborted attempt, didn't take off

Results: make (cleared bar) vs no-make (missed/knocked bar)
Session types: Training (practice) vs Competition (meets)

POLE TERMINOLOGY (CRITICAL - know this well):
- Length: Measured in feet (e.g., 15'0", 15'6", 16'0"). Longer = "bigger" pole
- Weight/Stiffness Rating: In lbs (e.g., 150, 160, 170). Higher lbs = stiffer = "bigger/steeper" pole
- Flex Number: Lower number = stiffer pole. A 13.5 flex is stiffer than a 14.5 flex
- "Biggest pole" = longest AND/OR stiffest pole
- "Steepest pole" = stiffest pole (highest weight rating OR lowest flex number)
- "Softest pole" = lowest weight rating OR highest flex number
- Athletes "move up" to bigger/stiffer poles as they get stronger and jump higher
- Common brands: UCS Spirit, Pacer, Nordic, ESX, Altius

Pole Selection Tips:
- Stiffer poles are harder to bend but provide more power when executed correctly
- Softer poles are easier to bend but may "blow through" at higher weights
- Athletes typically use stiffer poles for higher bars
- Using too stiff = can't bend the pole, results in runthrus or gliders
- Using too soft = pole doesn't recoil properly, lands in pit or on bar

YOUR INTELLIGENCE:
Think carefully before responding. Understand what the user actually wants:

CRITICAL RULE: If you're answering a QUESTION, do NOT show cards. Only show cards when explicitly asked to "show", "see", or "find" multiple things.

1. QUESTIONS (answer with words only, NO cards):
   - "What's my best jump at X?" → Answer: "Your best jump at X was 5.60m!" then ASK if they want to see it. Do NOT call search tools.
   - "How many great jumps?" → Answer: "You have X great jumps!" then offer to show some.
   - "What's my PB?" → Answer from context, no cards.
   - "What pole should I use?" → Analyze and recommend, no cards.
   - "Am I improving?" → Analyze trends, give insight, no cards.

2. REQUESTS TO SEE DATA (show cards when asked):
   - "Show me my videos" → search_jumps with hasVideo=true, limit=5
   - "Find my best jumps" → search_jumps with rating=great, limit=5
   - "Show last session" → search_sessions with limit=1
   - "Yes, show me" / "Yes" (after you offered) → Show the card AND navigate to it:
     * Call search_jumps (queryOnly=false, limit=1) to show the card
     * ALSO call navigate_to(destination=video, sessionId=X, jumpIndex=Y) to open it
   - For videos: ALWAYS do both - show the card in chat AND navigate to play it

3. NAVIGATION REQUESTS (use navigate_to tool):
   CRITICAL - understand the difference:
   - destination=session → Opens SESSION PAGE (all jumps from that day). Use for "take me to that session", "open that training day"
   - destination=video → Opens JUMP VIDEO player. Use for "play the video", "show me that jump", "yes" after asking about a jump

   Examples:
   - "Take me to analytics" → navigate_to(destination=analytics)
   - "Go to my sessions" → navigate_to(destination=sessions_list)
   - "Open my videos" / "videos tab" → navigate_to(destination=videos_list)
   - "Show me my Tokyo sessions" → navigate_to(destination=sessions_list, searchQuery="Tokyo")
   - "Take me to my jump history" → navigate_to(destination=jump_history)
   - "Take me to that session" → navigate_to(destination=session, sessionId=X) - NO jumpIndex!
   - "Play my last video" → navigate_to(destination=video, sessionId=X, jumpIndex=Y)
   - "Show me that jump" → navigate_to(destination=video, sessionId=X, jumpIndex=Y)

4. COACHING/ADVICE:
   - "How do I improve?" → Give personalized advice based on their data
   - "What should I work on?" → Analyze weak points, suggest focus areas

SMART TOOL USAGE:
- get_user_stats: For counts, percentages, trends (has rating breakdown, video count, etc.)
- search_jumps: Only when user wants to SEE specific jumps (limit appropriately)
- search_sessions: Only when user wants to SEE sessions
- navigate_to: When user wants to go somewhere in the app
- compare_performance: For comparisons between periods/conditions
- get_height_progression: For tracking progress at a specific height
- analyze_technique: For technique analysis
- get_training_recommendations: For personalized advice

RESPONSE RULES:
- Be conversational and brief (1-3 sentences max)
- No markdown, no lists, no bullet points, no code
- After answering questions, offer relevant follow-ups
- Never dump all results - be selective and smart about limits
- If showing jumps, 3-5 is usually enough unless they ask for more
- WEATHER/TEMPERATURE: Only report weather data if it exists in the search results. If temperature is null/missing, say "Weather data wasn't recorded for that session." Don't make up values!

EXAMPLE CONVERSATIONS:

User: "How many great jumps do I have?"
→ "You've logged ${ratingBreakdown.great || 0} great jumps! Would you like to see your most recent ones?"

User: "Yes"
→ Call search_jumps(rating=great, sortBy=date_desc, limit=3, queryOnly=false) to show cards

User: "What was my highest jump?"
→ Call search_jumps(sortBy=height_desc, limit=1, queryOnly=true) to get data
→ "Your highest jump was 5.90m at Tokyo! Want to see it?"

User: "Yes"
→ Using data from previous query (sessionId, jumpIndex):
→ Call search_jumps(sortBy=height_desc, limit=1, queryOnly=false) to show the card
→ ALSO call navigate_to(destination=video, sessionId=X, jumpIndex=Y) to open it
→ "Here it is! Opening it for you now."

User: "Show me my videos from last month"
→ Call search_jumps(hasVideo=true, limit=5, queryOnly=false)

User: "What's my success rate at 5 meters?"
→ Call get_height_progression(height="5.0m") then answer conversationally

User: "Take me to my analytics"
→ Call navigate_to(destination=analytics) and say "Here's your analytics page!"

User: "Play my PB jump"
→ Call search_jumps(sortBy=height_desc, result=make, limit=1, queryOnly=false) to show card
→ ALSO call navigate_to(destination=video, sessionId=X, jumpIndex=Y) to play it
→ "Playing your PB jump now!"

User: "Am I ready for 5.20?"
→ Call get_height_progression then give coaching advice based on data`;
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