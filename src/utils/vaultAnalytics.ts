import { Session, Jump } from '@/types/vault';

export interface SuccessRateData {
  totalJumps: number;
  makes: number;
  misses: number;
  successRate: number;
}

export interface PoleUsageData {
  poleId: string;
  poleName: string;
  jumps: number;
  makes: number;
  successRate: number;
  avgHeight: number;
}

export interface RatingDistribution {
  rating: string;
  count: number;
  percentage: number;
}

export interface HeightProgressionData {
  date: string;
  bestHeight: number;
  avgHeight: number;
  jumps: number;
}

export interface EnvironmentalData {
  indoor: { jumps: number; makes: number; avgHeight: number };
  outdoor: { jumps: number; makes: number; avgHeight: number };
  weatherConditions: Record<string, { jumps: number; makes: number }>;
}

export interface TechnicalMetrics {
  avgGripHeight: number;
  avgSteps: number;
  avgRunUpLength: number;
  avgTakeOff: number;
  gripHeightTrend: { session: string; avgGrip: number }[];
}

/**
 * Calculate overall success rate from sessions
 */
export const calculateSuccessRate = (sessions: Session[]): SuccessRateData => {
  const allJumps = sessions.flatMap(s => s.jumps || []);
  const makes = allJumps.filter(j => j.result === 'make').length;
  const totalJumps = allJumps.length;
  const misses = totalJumps - makes;
  const successRate = totalJumps > 0 ? (makes / totalJumps) * 100 : 0;

  return { totalJumps, makes, misses, successRate };
};

/**
 * Calculate pole usage statistics
 */
export const calculatePoleUsage = (sessions: Session[]): PoleUsageData[] => {
  const poleMap = new Map<string, { jumps: Jump[]; name: string }>();

  sessions.forEach(session => {
    session.jumps?.forEach(jump => {
      if (jump.pole) {
        const existing = poleMap.get(jump.pole);
        const poleName = jump.poleDetails
          ? `${jump.poleDetails.brand} ${jump.poleDetails.flex} ${jump.poleDetails.length}`
          : jump.pole;

        if (existing) {
          existing.jumps.push(jump);
        } else {
          poleMap.set(jump.pole, { jumps: [jump], name: poleName });
        }
      }
    });
  });

  const poleUsageData: PoleUsageData[] = [];

  poleMap.forEach((data, poleId) => {
    const makes = data.jumps.filter(j => j.result === 'make').length;
    const jumps = data.jumps.length;
    const successRate = jumps > 0 ? (makes / jumps) * 100 : 0;

    // Calculate average height (only for jumps with height data)
    const jumpsWithHeight = data.jumps.filter(j => j.height && parseFloat(j.height) > 0);
    const avgHeight = jumpsWithHeight.length > 0
      ? jumpsWithHeight.reduce((sum, j) => {
          const height = parseFloat(j.height);
          // Convert to meters if in feet
          return sum + (j.barUnits === 'ft' ? height * 0.3048 : height);
        }, 0) / jumpsWithHeight.length
      : 0;

    poleUsageData.push({
      poleId,
      poleName: data.name,
      jumps,
      makes,
      successRate,
      avgHeight,
    });
  });

  return poleUsageData.sort((a, b) => b.jumps - a.jumps);
};

/**
 * Calculate rating distribution
 */
export const calculateRatingDistribution = (sessions: Session[]): RatingDistribution[] => {
  const allJumps = sessions.flatMap(s => s.jumps || []);
  const ratingCounts = new Map<string, number>();

  allJumps.forEach(jump => {
    if (jump.rating) {
      ratingCounts.set(jump.rating, (ratingCounts.get(jump.rating) || 0) + 1);
    }
  });

  const total = allJumps.filter(j => j.rating).length;
  const ratings: RatingDistribution[] = [];

  // Define rating order
  const ratingOrder = ['run-thru', 'glider', 'ok', 'good', 'great'];

  ratingOrder.forEach(rating => {
    const count = ratingCounts.get(rating) || 0;
    if (count > 0) {
      ratings.push({
        rating,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      });
    }
  });

  return ratings;
};

/**
 * Calculate height progression over time
 */
export const calculateHeightProgression = (sessions: Session[]): HeightProgressionData[] => {
  const sortedSessions = [...sessions].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedSessions.map(session => {
    const jumps = session.jumps || [];
    const jumpsWithHeight = jumps.filter(j => j.height && parseFloat(j.height) > 0);

    if (jumpsWithHeight.length === 0) {
      return {
        date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bestHeight: 0,
        avgHeight: 0,
        jumps: jumps.length,
      };
    }

    const heights = jumpsWithHeight.map(j => {
      const height = parseFloat(j.height);
      return j.barUnits === 'ft' ? height * 0.3048 : height;
    });

    return {
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bestHeight: Math.max(...heights),
      avgHeight: heights.reduce((sum, h) => sum + h, 0) / heights.length,
      jumps: jumps.length,
    };
  }).slice(-10); // Last 10 sessions
};

/**
 * Calculate environmental impact on performance
 */
export const calculateEnvironmentalData = (sessions: Session[]): EnvironmentalData => {
  const indoor = { jumps: 0, makes: 0, avgHeight: 0, totalHeight: 0 };
  const outdoor = { jumps: 0, makes: 0, avgHeight: 0, totalHeight: 0 };
  const weatherConditions: Record<string, { jumps: number; makes: number }> = {};

  sessions.forEach(session => {
    const jumps = session.jumps || [];
    const isIndoor = session.isIndoor;

    jumps.forEach(jump => {
      const target = isIndoor ? indoor : outdoor;
      target.jumps++;
      if (jump.result === 'make') target.makes++;

      if (jump.height && parseFloat(jump.height) > 0) {
        const height = parseFloat(jump.height);
        const heightInMeters = jump.barUnits === 'ft' ? height * 0.3048 : height;
        target.totalHeight += heightInMeters;
      }
    });

    // Track weather conditions (outdoor only)
    if (!isIndoor && session.weather) {
      if (!weatherConditions[session.weather]) {
        weatherConditions[session.weather] = { jumps: 0, makes: 0 };
      }
      jumps.forEach(jump => {
        weatherConditions[session.weather].jumps++;
        if (jump.result === 'make') weatherConditions[session.weather].makes++;
      });
    }
  });

  // Calculate averages
  if (indoor.jumps > 0) indoor.avgHeight = indoor.totalHeight / indoor.jumps;
  if (outdoor.jumps > 0) outdoor.avgHeight = outdoor.totalHeight / outdoor.jumps;

  return { indoor, outdoor, weatherConditions };
};

/**
 * Calculate technical metrics and trends
 */
export const calculateTechnicalMetrics = (sessions: Session[]): TechnicalMetrics => {
  const allJumps = sessions.flatMap(s => s.jumps || []);

  // Filter jumps with valid data
  const jumpsWithGrip = allJumps.filter(j => j.gripHeight && parseFloat(j.gripHeight) > 0);
  const jumpsWithSteps = allJumps.filter(j => j.steps && j.steps > 0);
  const jumpsWithRunUp = allJumps.filter(j => j.runUpLength && parseFloat(j.runUpLength) > 0);
  const jumpsWithTakeOff = allJumps.filter(j => j.takeOff && parseFloat(j.takeOff) > 0);

  const avgGripHeight = jumpsWithGrip.length > 0
    ? jumpsWithGrip.reduce((sum, j) => sum + parseFloat(j.gripHeight), 0) / jumpsWithGrip.length
    : 0;

  const avgSteps = jumpsWithSteps.length > 0
    ? jumpsWithSteps.reduce((sum, j) => sum + j.steps, 0) / jumpsWithSteps.length
    : 0;

  const avgRunUpLength = jumpsWithRunUp.length > 0
    ? jumpsWithRunUp.reduce((sum, j) => sum + parseFloat(j.runUpLength), 0) / jumpsWithRunUp.length
    : 0;

  const avgTakeOff = jumpsWithTakeOff.length > 0
    ? jumpsWithTakeOff.reduce((sum, j) => sum + parseFloat(j.takeOff), 0) / jumpsWithTakeOff.length
    : 0;

  // Calculate grip height trend over last 10 sessions
  const sortedSessions = [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  const gripHeightTrend = sortedSessions.map(session => {
    const sessionJumps = (session.jumps || []).filter(j => j.gripHeight && parseFloat(j.gripHeight) > 0);
    const avgGrip = sessionJumps.length > 0
      ? sessionJumps.reduce((sum, j) => sum + parseFloat(j.gripHeight), 0) / sessionJumps.length
      : 0;

    return {
      session: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgGrip,
    };
  });

  return {
    avgGripHeight,
    avgSteps,
    avgRunUpLength,
    avgTakeOff,
    gripHeightTrend,
  };
};
