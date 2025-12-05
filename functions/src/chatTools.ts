import * as admin from 'firebase-admin';

// Tool definitions for AI function calling
export const toolDefinitions = [
  {
    type: 'function' as const,
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
    type: 'function' as const,
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
    type: 'function' as const,
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
    type: 'function' as const,
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
    type: 'function' as const,
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
  },
  {
    type: 'function' as const,
    function: {
      name: 'compare_performance',
      description: 'Compare performance between two time periods, locations, or session types. Use for "how did I do this month vs last month", "am I better indoors or outdoors", "compare my training vs competition" queries.',
      parameters: {
        type: 'object',
        properties: {
          compareBy: {
            type: 'string',
            enum: ['time_period', 'location', 'session_type', 'indoor_outdoor'],
            description: 'What to compare by: time_period (two date ranges), location (two locations), session_type (training vs competition), indoor_outdoor.'
          },
          period1: {
            type: 'object',
            properties: {
              dateFrom: { type: 'string', description: 'Start date ISO format' },
              dateTo: { type: 'string', description: 'End date ISO format' },
              location: { type: 'string', description: 'Location name for location comparison' },
              sessionType: { type: 'string', enum: ['Training', 'Competition'] },
              isIndoor: { type: 'boolean', description: 'For indoor/outdoor comparison' }
            },
            description: 'First period/group to compare'
          },
          period2: {
            type: 'object',
            properties: {
              dateFrom: { type: 'string', description: 'Start date ISO format' },
              dateTo: { type: 'string', description: 'End date ISO format' },
              location: { type: 'string', description: 'Location name for location comparison' },
              sessionType: { type: 'string', enum: ['Training', 'Competition'] },
              isIndoor: { type: 'boolean', description: 'For indoor/outdoor comparison' }
            },
            description: 'Second period/group to compare'
          }
        },
        required: ['compareBy', 'period1', 'period2']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_pole_analysis',
      description: 'Analyze pole performance - which poles work best at different heights, success rates by pole, recommendations. Use for "which pole for 4.50m", "my best pole", "success rate on Spirit 15" queries.',
      parameters: {
        type: 'object',
        properties: {
          poleBrand: { type: 'string', description: 'Filter by pole brand (e.g., "Spirit", "Pacer", "UCS")' },
          poleLength: { type: 'string', description: 'Filter by pole length (e.g., "15\'", "4.60m")' },
          targetHeight: { type: 'number', description: 'Target bar height in meters to find best pole for' },
          analyzeAll: { type: 'boolean', description: 'Set true to analyze all poles and compare them' }
        }
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_height_progression',
      description: 'Track progression at specific heights over time. Shows attempts, success rate trend, and readiness. Use for "progress at 4.60m", "how close to 4.80m", "height progression" queries.',
      parameters: {
        type: 'object',
        properties: {
          height: { type: 'string', description: 'Target height to track (e.g., "4.60m", "15\'0")' },
          includeNearby: { type: 'boolean', description: 'Include heights within 10cm of target' }
        },
        required: ['height']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'analyze_technique',
      description: 'Analyze technical patterns - grip height, steps, takeoff, standards correlations with success. Use for "best grip height", "6 vs 8 step", "optimal takeoff", "technique analysis" queries.',
      parameters: {
        type: 'object',
        properties: {
          aspect: {
            type: 'string',
            enum: ['grip', 'steps', 'takeoff', 'standards', 'all'],
            description: 'Which technical aspect to analyze: grip (grip height), steps (approach count), takeoff (takeoff point), standards (standard settings), all (comprehensive analysis).'
          },
          atHeight: { type: 'string', description: 'Analyze technique at a specific height (optional)' }
        },
        required: ['aspect']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_training_recommendations',
      description: 'Get AI-driven training recommendations based on performance data. Analyzes patterns to suggest focus areas. Use for "what should I work on", "why am I missing at X", "training advice" queries.',
      parameters: {
        type: 'object',
        properties: {
          focusArea: {
            type: 'string',
            enum: ['next_session', 'height_barrier', 'consistency', 'competition_prep', 'general'],
            description: 'Focus area: next_session (immediate next session), height_barrier (breaking through a height), consistency (improving success rate), competition_prep (competition readiness), general (overall advice).'
          },
          targetHeight: { type: 'string', description: 'Specific height to focus on (for height_barrier)' }
        },
        required: ['focusArea']
      }
    }
  }
];

// Helper to parse height string to number (handles both meters and feet)
function parseHeight(height: string): number {
  if (!height) return 0;
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

// Tool implementations
interface SessionData {
  id: string;
  date: any;
  location?: string;
  sessionType?: string;
  competitionName?: string;
  jumps?: any[];
  [key: string]: any;
}

export async function searchSessions(
  userId: string,
  params: {
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    sessionType?: string;
    competitionName?: string;
    limit?: number;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');

  const query = sessionsRef.orderBy('date', 'desc');

  const snapshot = await query.get(); // Get ALL sessions - data is small text

  let sessions: SessionData[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SessionData));

  // Apply filters
  if (params.dateFrom) {
    const fromDate = new Date(params.dateFrom);
    sessions = sessions.filter(s => {
      const sessionDate = s.date?.toDate ? s.date.toDate() : new Date(s.date);
      return sessionDate >= fromDate;
    });
  }

  if (params.dateTo) {
    const toDate = new Date(params.dateTo);
    toDate.setHours(23, 59, 59, 999);
    sessions = sessions.filter(s => {
      const sessionDate = s.date?.toDate ? s.date.toDate() : new Date(s.date);
      return sessionDate <= toDate;
    });
  }

  if (params.location) {
    const locationLower = params.location.toLowerCase();
    sessions = sessions.filter(s =>
      s.location?.toLowerCase().includes(locationLower)
    );
  }

  if (params.sessionType) {
    sessions = sessions.filter(s =>
      s.sessionType?.toLowerCase() === params.sessionType?.toLowerCase()
    );
  }

  if (params.competitionName) {
    const compLower = params.competitionName.toLowerCase();
    sessions = sessions.filter(s =>
      s.competitionName?.toLowerCase().includes(compLower)
    );
  }

  // Return up to 10 sessions for display, but AI sees all for analysis
  const limit = params.limit || 10;
  sessions = sessions.slice(0, limit);

  // Format for response
  return sessions.map(s => {
    const jumps = s.jumps || [];
    const heights = jumps.map((j: any) => parseHeight(j.height)).filter((h: number) => h > 0);
    const bestHeight = heights.length > 0 ? Math.max(...heights) : null;
    const hasVideos = jumps.some((j: any) => j.videoUrl);

    return {
      id: s.id,
      date: s.date?.toDate ? s.date.toDate().toISOString() : s.date,
      location: s.location,
      sessionType: s.sessionType,
      competitionName: s.competitionName,
      jumpCount: jumps.length,
      hasVideos,
      bestHeight: bestHeight ? `${bestHeight.toFixed(2)}m` : null
    };
  });
}

export async function searchJumps(
  userId: string,
  params: {
    minHeight?: number;
    maxHeight?: number;
    rating?: string;
    result?: string;
    hasVideo?: boolean;
    isFavorite?: boolean;
    limit?: number;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');

  const snapshot = await sessionsRef.orderBy('date', 'desc').get(); // Get ALL sessions

  const allJumps: any[] = [];

  snapshot.docs.forEach(doc => {
    const session = doc.data();
    const jumps = session.jumps || [];

    jumps.forEach((jump: any, index: number) => {
      const heightMeters = parseHeight(jump.height);

      // Apply filters
      if (params.minHeight !== undefined && heightMeters < params.minHeight) return;
      if (params.maxHeight !== undefined && heightMeters > params.maxHeight) return;
      if (params.rating && jump.rating !== params.rating) return;
      if (params.result) {
        const jumpResult = jump.result === 'make' ? 'make' : 'no-make';
        if (jumpResult !== params.result) return;
      }
      if (params.hasVideo && !jump.videoUrl) return;
      if (params.isFavorite && !jump.isFavorite) return;

      allJumps.push({
        sessionId: doc.id,
        jumpId: jump.id,
        jumpIndex: index,
        // Session context
        date: session.date?.toDate ? session.date.toDate().toISOString() : session.date,
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

export async function getSessionDetails(userId: string, sessionId: string) {
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
    date: session?.date?.toDate ? session.date.toDate().toISOString() : session?.date,
    location: session?.location,
    sessionType: session?.sessionType,
    isIndoor: session?.isIndoor,
    // Competition info
    competitionName: session?.competitionName,
    competitionPhase: session?.competitionPhase,
    // Environment
    weather: session?.weather,
    temperature: session?.temperature,
    temperatureScale: session?.temperatureScale,
    windDirection: session?.windDirection,
    windSpeed: session?.windSpeed,
    // Athlete state
    energyLevel: session?.energyLevel,
    sessionGoal: session?.sessionGoal,
    mentalNotes: session?.mentalNotes,
    // Post-session notes
    postSession: session?.postSession,
    // All jumps with full details
    jumps: (session?.jumps || []).map((j: any, index: number) => ({
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

export async function getUserStats(
  userId: string,
  params: { timeframe?: string }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');

  let query = sessionsRef.orderBy('date', 'desc');

  // Apply timeframe filter
  if (params.timeframe && params.timeframe !== 'all') {
    const now = new Date();
    let startDate: Date;

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
  const heightStats: Record<string, { attempts: number; makes: number }> = {};

  snapshot.docs.forEach(doc => {
    const session = doc.data();
    const jumps = session.jumps || [];

    jumps.forEach((jump: any) => {
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

// Compare performance between two periods/groups
export async function comparePerformance(
  userId: string,
  params: {
    compareBy: 'time_period' | 'location' | 'session_type' | 'indoor_outdoor';
    period1: any;
    period2: any;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');
  const snapshot = await sessionsRef.orderBy('date', 'desc').get();

  const sessions: SessionData[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SessionData));

  // Filter function based on criteria
  const filterSessions = (criteria: any) => {
    return sessions.filter(s => {
      const sessionDate = s.date?.toDate ? s.date.toDate() : new Date(s.date);

      if (criteria.dateFrom) {
        if (sessionDate < new Date(criteria.dateFrom)) return false;
      }
      if (criteria.dateTo) {
        const toDate = new Date(criteria.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (sessionDate > toDate) return false;
      }
      if (criteria.location) {
        if (!s.location?.toLowerCase().includes(criteria.location.toLowerCase())) return false;
      }
      if (criteria.sessionType) {
        if (s.sessionType?.toLowerCase() !== criteria.sessionType.toLowerCase()) return false;
      }
      if (criteria.isIndoor !== undefined) {
        if (s.isIndoor !== criteria.isIndoor) return false;
      }
      return true;
    });
  };

  // Calculate stats for a group
  const calculateStats = (filteredSessions: SessionData[]) => {
    let totalJumps = 0;
    let makes = 0;
    let bestHeight = 0;
    const heights: number[] = [];

    filteredSessions.forEach(s => {
      const jumps = s.jumps || [];
      jumps.forEach((j: any) => {
        totalJumps++;
        const height = parseHeight(j.height);
        if (j.result === 'make') {
          makes++;
          if (height > bestHeight) bestHeight = height;
        }
        heights.push(height);
      });
    });

    const avgHeight = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : 0;
    const successRate = totalJumps > 0 ? Math.round((makes / totalJumps) * 100) : 0;

    return {
      sessions: filteredSessions.length,
      totalJumps,
      makes,
      successRate,
      bestHeight: bestHeight > 0 ? `${bestHeight.toFixed(2)}m` : null,
      avgHeight: avgHeight > 0 ? `${avgHeight.toFixed(2)}m` : null
    };
  };

  const group1Sessions = filterSessions(params.period1);
  const group2Sessions = filterSessions(params.period2);

  const stats1 = calculateStats(group1Sessions);
  const stats2 = calculateStats(group2Sessions);

  // Determine labels based on comparison type
  let label1 = 'Period 1';
  let label2 = 'Period 2';

  if (params.compareBy === 'time_period') {
    label1 = params.period1.dateFrom ? `From ${params.period1.dateFrom}` : 'Earlier';
    label2 = params.period2.dateFrom ? `From ${params.period2.dateFrom}` : 'Later';
  } else if (params.compareBy === 'session_type') {
    label1 = params.period1.sessionType || 'Training';
    label2 = params.period2.sessionType || 'Competition';
  } else if (params.compareBy === 'indoor_outdoor') {
    label1 = params.period1.isIndoor ? 'Indoor' : 'Outdoor';
    label2 = params.period2.isIndoor ? 'Indoor' : 'Outdoor';
  } else if (params.compareBy === 'location') {
    label1 = params.period1.location || 'Location 1';
    label2 = params.period2.location || 'Location 2';
  }

  return {
    comparison: params.compareBy,
    group1: { label: label1, ...stats1 },
    group2: { label: label2, ...stats2 },
    analysis: {
      successRateDiff: stats1.successRate - stats2.successRate,
      betterGroup: stats1.successRate > stats2.successRate ? label1 :
                   stats2.successRate > stats1.successRate ? label2 : 'Equal',
      moreVolume: stats1.totalJumps > stats2.totalJumps ? label1 : label2
    }
  };
}

// Analyze pole performance
export async function getPoleAnalysis(
  userId: string,
  params: {
    poleBrand?: string;
    poleLength?: string;
    targetHeight?: number;
    analyzeAll?: boolean;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');
  const snapshot = await sessionsRef.get();

  const poleStats: Record<string, {
    name: string;
    brand: string;
    length: string;
    weight: string;
    attempts: number;
    makes: number;
    heights: number[];
    bestHeight: number;
  }> = {};

  snapshot.docs.forEach(doc => {
    const session = doc.data();
    const jumps = session.jumps || [];

    jumps.forEach((jump: any) => {
      const poleDetails = jump.poleDetails;
      if (!poleDetails) return;

      const poleKey = `${poleDetails.brand}-${poleDetails.length}-${poleDetails.pounds}`;
      const poleName = `${poleDetails.brand} ${poleDetails.length} ${poleDetails.pounds}lbs`;

      // Apply filters
      if (params.poleBrand && !poleDetails.brand?.toLowerCase().includes(params.poleBrand.toLowerCase())) return;
      if (params.poleLength && !poleDetails.length?.includes(params.poleLength)) return;

      if (!poleStats[poleKey]) {
        poleStats[poleKey] = {
          name: poleName,
          brand: poleDetails.brand,
          length: poleDetails.length,
          weight: `${poleDetails.pounds}lbs`,
          attempts: 0,
          makes: 0,
          heights: [],
          bestHeight: 0
        };
      }

      const height = parseHeight(jump.height);
      poleStats[poleKey].attempts++;
      poleStats[poleKey].heights.push(height);

      if (jump.result === 'make') {
        poleStats[poleKey].makes++;
        if (height > poleStats[poleKey].bestHeight) {
          poleStats[poleKey].bestHeight = height;
        }
      }
    });
  });

  // Convert to array and calculate rates
  let poles = Object.values(poleStats).map(pole => ({
    ...pole,
    successRate: pole.attempts > 0 ? Math.round((pole.makes / pole.attempts) * 100) : 0,
    avgHeight: pole.heights.length > 0
      ? `${(pole.heights.reduce((a, b) => a + b, 0) / pole.heights.length).toFixed(2)}m`
      : null,
    bestHeight: pole.bestHeight > 0 ? `${pole.bestHeight.toFixed(2)}m` : null
  }));

  // Sort by success rate
  poles.sort((a, b) => b.successRate - a.successRate);

  // Find best pole for target height if specified
  let recommendedPole = null;
  if (params.targetHeight) {
    const polesAtHeight = poles.filter(p =>
      p.heights.some(h => Math.abs(h - params.targetHeight!) < 0.15) // Within 15cm
    );
    if (polesAtHeight.length > 0) {
      recommendedPole = polesAtHeight[0];
    }
  }

  return {
    poles: poles.slice(0, 10),
    totalPolesUsed: poles.length,
    recommendedForHeight: recommendedPole ? {
      pole: recommendedPole.name,
      successRate: recommendedPole.successRate,
      attemptsAtHeight: recommendedPole.heights.filter(h =>
        Math.abs(h - (params.targetHeight || 0)) < 0.15
      ).length
    } : null,
    bestOverall: poles[0] ? {
      pole: poles[0].name,
      successRate: poles[0].successRate,
      bestHeight: poles[0].bestHeight
    } : null
  };
}

// Track height progression
export async function getHeightProgression(
  userId: string,
  params: {
    height: string;
    includeNearby?: boolean;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');
  const snapshot = await sessionsRef.orderBy('date', 'asc').get();

  const targetHeight = parseHeight(params.height);
  const tolerance = params.includeNearby ? 0.10 : 0.02; // 10cm or 2cm

  interface AttemptData {
    date: string;
    sessionId: string;
    result: string;
    rating: string;
    height: number;
  }

  const attempts: AttemptData[] = [];
  let firstMake: AttemptData | null = null;
  let lastMake: AttemptData | null = null;

  snapshot.docs.forEach(doc => {
    const session = doc.data();
    const sessionDate = session.date?.toDate ? session.date.toDate().toISOString() : session.date;
    const jumps = session.jumps || [];

    jumps.forEach((jump: any) => {
      const height = parseHeight(jump.height);
      if (Math.abs(height - targetHeight) <= tolerance) {
        const attempt: AttemptData = {
          date: sessionDate,
          sessionId: doc.id,
          result: jump.result || 'no-make',
          rating: jump.rating,
          height
        };
        attempts.push(attempt);

        if (jump.result === 'make') {
          if (!firstMake) firstMake = attempt;
          lastMake = attempt;
        }
      }
    });
  });

  // Calculate stats
  const makes = attempts.filter(a => a.result === 'make').length;
  const successRate = attempts.length > 0 ? Math.round((makes / attempts.length) * 100) : 0;

  // Calculate trend (last 5 vs first 5 attempts)
  let trend = 'stable';
  if (attempts.length >= 10) {
    const first5 = attempts.slice(0, 5);
    const last5 = attempts.slice(-5);
    const first5Rate = first5.filter(a => a.result === 'make').length / 5;
    const last5Rate = last5.filter(a => a.result === 'make').length / 5;
    if (last5Rate > first5Rate + 0.1) trend = 'improving';
    else if (last5Rate < first5Rate - 0.1) trend = 'declining';
  }

  // Readiness assessment
  let readiness = 'not_ready';
  if (successRate >= 66) readiness = 'ready_to_move_up';
  else if (successRate >= 50) readiness = 'close';
  else if (successRate >= 33) readiness = 'developing';

  // Cast to resolve TypeScript narrowing issue with closures
  const firstMakeResult = firstMake as AttemptData | null;
  const lastMakeResult = lastMake as AttemptData | null;

  return {
    targetHeight: params.height,
    totalAttempts: attempts.length,
    makes,
    successRate,
    trend,
    readiness,
    firstMake: firstMakeResult ? { date: firstMakeResult.date } : null,
    lastMake: lastMakeResult ? { date: lastMakeResult.date } : null,
    recentAttempts: attempts.slice(-5).reverse().map((a: AttemptData) => ({
      date: a.date,
      result: a.result,
      rating: a.rating
    }))
  };
}

// Analyze technique patterns
export async function analyzeTechnique(
  userId: string,
  params: {
    aspect: 'grip' | 'steps' | 'takeoff' | 'standards' | 'all';
    atHeight?: string;
  }
) {
  const db = admin.firestore();
  const sessionsRef = db.collection('users').doc(userId).collection('sessions');
  const snapshot = await sessionsRef.get();

  const targetHeight = params.atHeight ? parseHeight(params.atHeight) : null;
  const heightTolerance = 0.10;

  const gripMap: Record<string, { makes: number; attempts: number }> = {};
  const stepsMap: Record<number, { makes: number; attempts: number }> = {};
  const takeoffMap: Record<string, { makes: number; attempts: number }> = {};
  const standardsMap: Record<string, { makes: number; attempts: number }> = {};

  snapshot.docs.forEach(doc => {
    const session = doc.data();
    const jumps = session.jumps || [];

    jumps.forEach((jump: any) => {
      const height = parseHeight(jump.height);
      if (targetHeight && Math.abs(height - targetHeight) > heightTolerance) return;

      const isMake = jump.result === 'make';

      // Grip height
      if (jump.gripHeight) {
        if (!gripMap[jump.gripHeight]) gripMap[jump.gripHeight] = { makes: 0, attempts: 0 };
        gripMap[jump.gripHeight].attempts++;
        if (isMake) gripMap[jump.gripHeight].makes++;
      }

      // Steps
      if (jump.steps) {
        const stepCount = parseInt(jump.steps);
        if (!isNaN(stepCount)) {
          if (!stepsMap[stepCount]) stepsMap[stepCount] = { makes: 0, attempts: 0 };
          stepsMap[stepCount].attempts++;
          if (isMake) stepsMap[stepCount].makes++;
        }
      }

      // Takeoff
      if (jump.takeOff) {
        if (!takeoffMap[jump.takeOff]) takeoffMap[jump.takeOff] = { makes: 0, attempts: 0 };
        takeoffMap[jump.takeOff].attempts++;
        if (isMake) takeoffMap[jump.takeOff].makes++;
      }

      // Standards
      if (jump.standards) {
        if (!standardsMap[jump.standards]) standardsMap[jump.standards] = { makes: 0, attempts: 0 };
        standardsMap[jump.standards].attempts++;
        if (isMake) standardsMap[jump.standards].makes++;
      }
    });
  });

  // Convert maps to sorted arrays
  const toSortedArray = (map: Record<string | number, { makes: number; attempts: number }>) => {
    return Object.entries(map)
      .filter(([_, stats]) => stats.attempts >= 3)
      .map(([value, stats]) => ({
        value,
        makes: stats.makes,
        attempts: stats.attempts,
        successRate: Math.round((stats.makes / stats.attempts) * 100)
      }))
      .sort((a, b) => b.successRate - a.successRate);
  };

  const result: any = {};

  if (params.aspect === 'grip' || params.aspect === 'all') {
    result.gripAnalysis = toSortedArray(gripMap).slice(0, 5);
    result.bestGrip = result.gripAnalysis[0] || null;
  }

  if (params.aspect === 'steps' || params.aspect === 'all') {
    result.stepsAnalysis = toSortedArray(stepsMap).slice(0, 5);
    result.bestSteps = result.stepsAnalysis[0] || null;
  }

  if (params.aspect === 'takeoff' || params.aspect === 'all') {
    result.takeoffAnalysis = toSortedArray(takeoffMap).slice(0, 5);
    result.bestTakeoff = result.takeoffAnalysis[0] || null;
  }

  if (params.aspect === 'standards' || params.aspect === 'all') {
    result.standardsAnalysis = toSortedArray(standardsMap).slice(0, 5);
    result.bestStandards = result.standardsAnalysis[0] || null;
  }

  result.atHeight = params.atHeight || 'all heights';

  return result;
}

// Get training recommendations
export async function getTrainingRecommendations(
  userId: string,
  params: {
    focusArea: 'next_session' | 'height_barrier' | 'consistency' | 'competition_prep' | 'general';
    targetHeight?: string;
  }
) {
  // Gather all relevant data
  const stats = await getUserStats(userId, { timeframe: 'month' });
  const allTimeStats = await getUserStats(userId, { timeframe: 'all' });
  const technique = await analyzeTechnique(userId, { aspect: 'all' });

  const recommendations: string[] = [];
  const insights: any = {
    currentStats: stats,
    focusArea: params.focusArea
  };

  // General analysis
  if (stats.successRate < 40) {
    recommendations.push('Focus on consistency at comfortable heights before pushing higher');
  }

  if (params.focusArea === 'height_barrier' && params.targetHeight) {
    const progression = await getHeightProgression(userId, { height: params.targetHeight });
    insights.heightProgression = progression;

    if (progression.successRate < 33) {
      recommendations.push(`Build more volume at heights 10-20cm below ${params.targetHeight}`);
      recommendations.push('Focus on technical consistency before attempting this height');
    } else if (progression.successRate < 66) {
      recommendations.push(`You're making progress at ${params.targetHeight} - keep building attempts`);
      if (progression.trend === 'improving') {
        recommendations.push('Your trend is improving - maintain current approach');
      }
    } else {
      recommendations.push(`You're clearing ${params.targetHeight} consistently - ready to move up!`);
    }
  }

  if (params.focusArea === 'consistency') {
    if (technique.bestGrip) {
      recommendations.push(`Your best grip height is ${technique.bestGrip.value} (${technique.bestGrip.successRate}% success)`);
    }
    if (technique.bestSteps) {
      recommendations.push(`${technique.bestSteps.value}-step approach works best (${technique.bestSteps.successRate}% success)`);
    }
  }

  if (params.focusArea === 'competition_prep') {
    const comparisonResult = await comparePerformance(userId, {
      compareBy: 'session_type',
      period1: { sessionType: 'Training' },
      period2: { sessionType: 'Competition' }
    });
    insights.trainingVsCompetition = comparisonResult;

    if (comparisonResult.group1.successRate > comparisonResult.group2.successRate + 10) {
      recommendations.push('Your training success rate is higher than competition - work on competition nerves');
      recommendations.push('Practice competition-like pressure in training');
    } else if (comparisonResult.group2.successRate > comparisonResult.group1.successRate) {
      recommendations.push('You perform better in competition - great competition mindset!');
    }
  }

  if (params.focusArea === 'next_session') {
    recommendations.push(`Current PB: ${allTimeStats.personalBest || 'Not set'}`);
    recommendations.push(`Recent success rate: ${stats.successRate}%`);
    if (stats.successRate >= 60) {
      recommendations.push('Consider challenging yourself with slightly higher bars');
    } else {
      recommendations.push('Focus on building consistency before pushing heights');
    }
  }

  if (params.focusArea === 'general') {
    recommendations.push(`You've logged ${allTimeStats.totalJumps} jumps across ${allTimeStats.totalSessions} sessions`);
    if (allTimeStats.personalBest) {
      recommendations.push(`Personal best: ${allTimeStats.personalBest}`);
    }
    if (technique.bestGrip && technique.bestSteps) {
      recommendations.push(`Optimal setup: ${technique.bestSteps.value} steps, ${technique.bestGrip.value} grip`);
    }
  }

  return {
    focusArea: params.focusArea,
    targetHeight: params.targetHeight || null,
    recommendations,
    insights
  };
}

// Execute a tool call
export async function executeTool(
  userId: string,
  toolName: string,
  args: any
): Promise<any> {
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
    case 'compare_performance':
      return comparePerformance(userId, args);
    case 'get_pole_analysis':
      return getPoleAnalysis(userId, args);
    case 'get_height_progression':
      return getHeightProgression(userId, args);
    case 'analyze_technique':
      return analyzeTechnique(userId, args);
    case 'get_training_recommendations':
      return getTrainingRecommendations(userId, args);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}
