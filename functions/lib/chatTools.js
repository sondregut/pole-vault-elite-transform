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
exports.toolDefinitions = void 0;
exports.searchSessions = searchSessions;
exports.searchJumps = searchJumps;
exports.getSessionDetails = getSessionDetails;
exports.getUserStats = getUserStats;
exports.executeTool = executeTool;
const admin = __importStar(require("firebase-admin"));
// Tool definitions for AI function calling
exports.toolDefinitions = [
    {
        type: 'function',
        function: {
            name: 'search_sessions',
            description: 'Search training sessions. Use this to find sessions by date range, location, competition name, or type. Returns a list of matching sessions with jump counts and best heights. Always search before answering questions about sessions.',
            parameters: {
                type: 'object',
                properties: {
                    dateFrom: { type: 'string', description: 'Start date in ISO format (e.g., "2025-01-01"). Use for "this month", "last week", "in January" queries.' },
                    dateTo: { type: 'string', description: 'End date in ISO format (e.g., "2025-12-31"). Use with dateFrom for date ranges.' },
                    location: { type: 'string', description: 'Location name (partial match). Use for "at Oslo", "in Texas" queries.' },
                    sessionType: {
                        type: 'string',
                        enum: ['Training', 'Competition'],
                        description: 'Filter by Training (practice) or Competition (meets). Use for "my competitions", "training sessions" queries.'
                    },
                    competitionName: { type: 'string', description: 'Competition/meet name (partial match). Use for "World Championships", "Nationals", "Diamond League" queries.' },
                    limit: { type: 'number', description: 'Max results to return (default 10). Increase for comprehensive searches.' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'search_jumps',
            description: 'Search individual jumps across all sessions. Returns jumps sorted by date (most recent first) with full details. You can filter by height, rating, result, or video. After getting results, YOU decide which jump best answers the user query based on dates, heights, etc.',
            parameters: {
                type: 'object',
                properties: {
                    minHeight: { type: 'number', description: 'Minimum bar height in meters (e.g., 4.5).' },
                    maxHeight: { type: 'number', description: 'Maximum bar height in meters (e.g., 5.0).' },
                    rating: { type: 'string', description: 'Filter by rating: great, good, ok, glider, or runthru.' },
                    result: { type: 'string', description: 'Filter by result: make or no-make.' },
                    hasVideo: { type: 'boolean', description: 'Set true to only get jumps with video.' },
                    isFavorite: { type: 'boolean', description: 'Set true for favorited jumps only.' },
                    limit: { type: 'number', description: 'Max results to return (default 10).' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_session_details',
            description: 'Get full details of one session including ALL jumps with complete data: pole used, grip height, steps, takeoff, standards, bar clearance, notes, weather, temperature, energy level, session goals, and mental notes. Use when you need complete information about a specific session or want to analyze every jump from a training day.',
            parameters: {
                type: 'object',
                properties: {
                    sessionId: { type: 'string', description: 'The session ID from search_sessions results.' }
                },
                required: ['sessionId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_user_stats',
            description: 'Get aggregate statistics: personal best, total sessions/jumps, success rate, and success rate by height. Use for "how am I doing", "my stats", "success rate", "personal best" queries. Can filter by timeframe.',
            parameters: {
                type: 'object',
                properties: {
                    timeframe: {
                        type: 'string',
                        enum: ['week', 'month', 'year', 'all'],
                        description: 'Time period: week (last 7 days), month (last 30 days), year (last 365 days), all (all time). Default is all.'
                    }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'navigate_to',
            description: 'Navigate user to view content in the app. Use when user says "show me", "take me to", "open", "watch", "view". Always offer navigation after showing search results.',
            parameters: {
                type: 'object',
                properties: {
                    destination: {
                        type: 'string',
                        enum: ['session', 'video', 'analytics', 'equipment', 'sessions_list'],
                        description: 'Where to go: session (view one session), video (watch jump video), analytics (stats page), equipment (poles), sessions_list (all sessions).'
                    },
                    sessionId: { type: 'string', description: 'Required for session/video destinations. Get from search results.' },
                    jumpIndex: { type: 'number', description: 'For video: which jump in the session (0-indexed). Get from search_jumps results.' }
                },
                required: ['destination']
            }
        }
    }
];
// Helper to parse height string to number (handles both meters and feet)
function parseHeight(height) {
    if (!height)
        return 0;
    // If it contains a quote or feet symbol, it's in feet
    if (height.includes("'") || height.includes('ft')) {
        // Parse feet'inches format like 14'6 or 14'6"
        const match = height.match(/(\d+)'?\s*(\d+)?/);
        if (match) {
            const feet = parseInt(match[1]) || 0;
            const inches = parseInt(match[2]) || 0;
            return (feet * 12 + inches) * 0.0254; // Convert to meters
        }
    }
    // Otherwise assume meters
    return parseFloat(height) || 0;
}
async function searchSessions(userId, params) {
    const db = admin.firestore();
    const sessionsRef = db.collection('users').doc(userId).collection('sessions');
    const query = sessionsRef.orderBy('date', 'desc');
    const snapshot = await query.get(); // Get ALL sessions - data is small text
    let sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    // Apply filters
    if (params.dateFrom) {
        const fromDate = new Date(params.dateFrom);
        sessions = sessions.filter(s => {
            var _a;
            const sessionDate = ((_a = s.date) === null || _a === void 0 ? void 0 : _a.toDate) ? s.date.toDate() : new Date(s.date);
            return sessionDate >= fromDate;
        });
    }
    if (params.dateTo) {
        const toDate = new Date(params.dateTo);
        toDate.setHours(23, 59, 59, 999);
        sessions = sessions.filter(s => {
            var _a;
            const sessionDate = ((_a = s.date) === null || _a === void 0 ? void 0 : _a.toDate) ? s.date.toDate() : new Date(s.date);
            return sessionDate <= toDate;
        });
    }
    if (params.location) {
        const locationLower = params.location.toLowerCase();
        sessions = sessions.filter(s => { var _a; return (_a = s.location) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(locationLower); });
    }
    if (params.sessionType) {
        sessions = sessions.filter(s => { var _a, _b; return ((_a = s.sessionType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_b = params.sessionType) === null || _b === void 0 ? void 0 : _b.toLowerCase()); });
    }
    if (params.competitionName) {
        const compLower = params.competitionName.toLowerCase();
        sessions = sessions.filter(s => { var _a; return (_a = s.competitionName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(compLower); });
    }
    // Return up to 10 sessions for display, but AI sees all for analysis
    const limit = params.limit || 10;
    sessions = sessions.slice(0, limit);
    // Format for response
    return sessions.map(s => {
        var _a;
        const jumps = s.jumps || [];
        const heights = jumps.map((j) => parseHeight(j.height)).filter((h) => h > 0);
        const bestHeight = heights.length > 0 ? Math.max(...heights) : null;
        const hasVideos = jumps.some((j) => j.videoUrl);
        return {
            id: s.id,
            date: ((_a = s.date) === null || _a === void 0 ? void 0 : _a.toDate) ? s.date.toDate().toISOString() : s.date,
            location: s.location,
            sessionType: s.sessionType,
            competitionName: s.competitionName,
            jumpCount: jumps.length,
            hasVideos,
            bestHeight: bestHeight ? `${bestHeight.toFixed(2)}m` : null
        };
    });
}
async function searchJumps(userId, params) {
    const db = admin.firestore();
    const sessionsRef = db.collection('users').doc(userId).collection('sessions');
    const snapshot = await sessionsRef.orderBy('date', 'desc').get(); // Get ALL sessions
    const allJumps = [];
    snapshot.docs.forEach(doc => {
        const session = doc.data();
        const jumps = session.jumps || [];
        jumps.forEach((jump, index) => {
            var _a;
            const heightMeters = parseHeight(jump.height);
            // Apply filters
            if (params.minHeight !== undefined && heightMeters < params.minHeight)
                return;
            if (params.maxHeight !== undefined && heightMeters > params.maxHeight)
                return;
            if (params.rating && jump.rating !== params.rating)
                return;
            if (params.result) {
                const jumpResult = jump.result === 'make' ? 'make' : 'no-make';
                if (jumpResult !== params.result)
                    return;
            }
            if (params.hasVideo && !jump.videoUrl)
                return;
            if (params.isFavorite && !jump.isFavorite)
                return;
            allJumps.push({
                sessionId: doc.id,
                jumpId: jump.id,
                jumpIndex: index,
                // Session context
                date: ((_a = session.date) === null || _a === void 0 ? void 0 : _a.toDate) ? session.date.toDate().toISOString() : session.date,
                location: session.location,
                sessionType: session.sessionType,
                competitionName: session.competitionName,
                // Jump basics
                height: jump.height,
                barUnits: jump.barUnits || 'm',
                heightMeters,
                rating: jump.rating,
                result: jump.result || 'no-make',
                barClearance: jump.barClearance,
                isWarmup: jump.isWarmup,
                isFavorite: jump.isFavorite,
                // Pole information
                pole: jump.poleDetails
                    ? `${jump.poleDetails.brand} ${jump.poleDetails.length} ${jump.poleDetails.pounds}lbs${jump.poleDetails.flex ? ` (${jump.poleDetails.flex} flex)` : ''}`
                    : jump.pole,
                poleDetails: jump.poleDetails,
                // Technical details
                steps: jump.steps,
                gripHeight: jump.gripHeight,
                runUpLength: jump.runUpLength,
                takeOff: jump.takeOff,
                midMark: jump.midMark,
                standards: jump.standards,
                // Notes and video
                notes: jump.notes,
                hasVideo: !!jump.videoUrl,
                videoUrl: jump.videoUrl || null,
                videoUploadStatus: jump.videoUploadStatus || null
            });
        });
    });
    // Always sort by date descending (most recent first) - let AI reason about which to pick
    allJumps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Return up to 10 jumps for display
    const limit = params.limit || 10;
    return allJumps.slice(0, limit);
}
async function getSessionDetails(userId, sessionId) {
    var _a;
    const db = admin.firestore();
    const sessionDoc = await db
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .doc(sessionId)
        .get();
    if (!sessionDoc.exists) {
        return { error: 'Session not found' };
    }
    const session = sessionDoc.data();
    return {
        id: sessionDoc.id,
        // Session basics
        date: ((_a = session === null || session === void 0 ? void 0 : session.date) === null || _a === void 0 ? void 0 : _a.toDate) ? session.date.toDate().toISOString() : session === null || session === void 0 ? void 0 : session.date,
        location: session === null || session === void 0 ? void 0 : session.location,
        sessionType: session === null || session === void 0 ? void 0 : session.sessionType,
        isIndoor: session === null || session === void 0 ? void 0 : session.isIndoor,
        // Competition info
        competitionName: session === null || session === void 0 ? void 0 : session.competitionName,
        competitionPhase: session === null || session === void 0 ? void 0 : session.competitionPhase,
        // Environment
        weather: session === null || session === void 0 ? void 0 : session.weather,
        temperature: session === null || session === void 0 ? void 0 : session.temperature,
        temperatureScale: session === null || session === void 0 ? void 0 : session.temperatureScale,
        windDirection: session === null || session === void 0 ? void 0 : session.windDirection,
        windSpeed: session === null || session === void 0 ? void 0 : session.windSpeed,
        // Athlete state
        energyLevel: session === null || session === void 0 ? void 0 : session.energyLevel,
        sessionGoal: session === null || session === void 0 ? void 0 : session.sessionGoal,
        mentalNotes: session === null || session === void 0 ? void 0 : session.mentalNotes,
        // Post-session notes
        postSession: session === null || session === void 0 ? void 0 : session.postSession,
        // All jumps with full details
        jumps: ((session === null || session === void 0 ? void 0 : session.jumps) || []).map((j, index) => ({
            index,
            id: j.id,
            // Jump basics
            height: j.height,
            barUnits: j.barUnits || 'm',
            rating: j.rating,
            result: j.result,
            barClearance: j.barClearance,
            isWarmup: j.isWarmup,
            isFavorite: j.isFavorite,
            // Pole information
            pole: j.poleDetails
                ? `${j.poleDetails.brand} ${j.poleDetails.length} ${j.poleDetails.pounds}lbs${j.poleDetails.flex ? ` (${j.poleDetails.flex} flex)` : ''}`
                : j.pole,
            poleDetails: j.poleDetails,
            // Technical details
            steps: j.steps,
            gripHeight: j.gripHeight,
            runUpLength: j.runUpLength,
            takeOff: j.takeOff,
            midMark: j.midMark,
            standards: j.standards,
            // Notes and video
            notes: j.notes,
            hasVideo: !!j.videoUrl
        }))
    };
}
async function getUserStats(userId, params) {
    const db = admin.firestore();
    const sessionsRef = db.collection('users').doc(userId).collection('sessions');
    let query = sessionsRef.orderBy('date', 'desc');
    // Apply timeframe filter
    if (params.timeframe && params.timeframe !== 'all') {
        const now = new Date();
        let startDate;
        switch (params.timeframe) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0);
        }
        query = query.where('date', '>=', startDate);
    }
    const snapshot = await query.get();
    let totalJumps = 0;
    let makes = 0;
    let personalBest = 0;
    const heightStats = {};
    snapshot.docs.forEach(doc => {
        const session = doc.data();
        const jumps = session.jumps || [];
        jumps.forEach((jump) => {
            totalJumps++;
            const height = parseHeight(jump.height);
            if (height > personalBest && jump.result === 'make') {
                personalBest = height;
            }
            if (jump.result === 'make') {
                makes++;
            }
            // Track by height
            const heightKey = jump.height;
            if (!heightStats[heightKey]) {
                heightStats[heightKey] = { attempts: 0, makes: 0 };
            }
            heightStats[heightKey].attempts++;
            if (jump.result === 'make') {
                heightStats[heightKey].makes++;
            }
        });
    });
    const successRate = totalJumps > 0 ? (makes / totalJumps) * 100 : 0;
    // Calculate success rate by height
    const heightSuccessRate = Object.entries(heightStats)
        .filter(([_, stats]) => stats.attempts >= 3) // Only heights with 3+ attempts
        .map(([height, stats]) => ({
        height,
        rate: Math.round((stats.makes / stats.attempts) * 100),
        attempts: stats.attempts
    }))
        .sort((a, b) => parseHeight(b.height) - parseHeight(a.height));
    return {
        totalSessions: snapshot.size,
        totalJumps,
        personalBest: personalBest > 0 ? `${personalBest.toFixed(2)}m` : null,
        successRate: Math.round(successRate),
        heightSuccessRate: heightSuccessRate.slice(0, 5) // Top 5 heights
    };
}
// Execute a tool call
async function executeTool(userId, toolName, args) {
    switch (toolName) {
        case 'search_sessions':
            return searchSessions(userId, args);
        case 'search_jumps':
            return searchJumps(userId, args);
        case 'get_session_details':
            return getSessionDetails(userId, args.sessionId);
        case 'get_user_stats':
            return getUserStats(userId, args);
        case 'navigate_to':
            // Navigation is handled client-side, just return the intent
            return { navigation: args };
        default:
            return { error: `Unknown tool: ${toolName}` };
    }
}
//# sourceMappingURL=chatTools.js.map