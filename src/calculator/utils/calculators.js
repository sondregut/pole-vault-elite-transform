import { formatTimeInput } from './formatters';
import { calculateWindModification, needsWindInput } from './windModification';
import { coeffs, field_events, thons, COMPETITION_POINTS, SPECIAL_EVENTS, SPECIAL_EVENTS_POINTS } from './coefficients';

export const calculatePoints = ({
  mode,
  performance,
  eventType,
  gender,
  season,
  windSpeed
}) => {
  try {
    if (mode === 'points') {
      const formattedPerformance = formatTimeInput(performance, eventType);
      if (['800m', '1500m', '3000m', '3000mSC', '5000m', '10000m'].includes(eventType) && !formattedPerformance) {
        console.error('Invalid time format');
        return null;
      }

      // Direct calculation instead of API call
      const a = coeffs[gender][season][eventType].a;
      const b = coeffs[gender][season][eventType].b;
      const c = coeffs[gender][season][eventType].c;
      
      let basePoints;
      if (field_events.includes(eventType)) {
        basePoints = Math.floor(a * Math.pow(formattedPerformance - b, c));
      } else {
        basePoints = Math.floor(a * Math.pow(b - formattedPerformance, c));
      }
      
      basePoints = Math.max(0, Math.min(1400, basePoints));

      // Wind adjustment logic remains the same
      if (season === 'outdoor' && needsWindInput(eventType, season) && windSpeed) {
        const windAdjustment = calculateWindModification(
          eventType,
          parseFloat(windSpeed),
          basePoints
        );
        return {
          points: basePoints,
          adjustedPoints: Math.round(basePoints + windAdjustment)
        };
      }
      
      return {
        points: basePoints,
        adjustedPoints: basePoints
      };
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const calculatePerformance = (event, points, gender = 'mens', season = 'outdoor') => {
    try {
        const a = coeffs[gender][season][event].a;
        const b = coeffs[gender][season][event].b;
        const c = coeffs[gender][season][event].c;
        
        if (points < 0 || points > 1400) {
            throw new Error("Points must be between 0 and 1400");
        }
        
        if (thons.includes(event)) {
            return Math.round(b + Math.pow(points/a, 1/c));
        } else if (field_events.includes(event)) {
            return Number((b + Math.pow(points/a, 1/c)).toFixed(2));
        } else {
            return Number((b - Math.pow(points/a, 1/c)).toFixed(2));
        }
    } catch (e) {
        throw new Error(`Error calculating performance: ${e.message}`);
    }
}; 

export const calculatePerformancesBatch = (basePoints, eventType, gender = 'mens', season = 'outdoor') => {
    try {
        const results = {};
        const pointsTable = SPECIAL_EVENTS.includes(eventType) ? SPECIAL_EVENTS_POINTS : COMPETITION_POINTS;
        
        for (const meet in pointsTable) {
            const meetResults = {};
            for (const [place, bonus] of Object.entries(pointsTable[meet])) {
                try {
                    const requiredPoints = basePoints - bonus;
                    if (requiredPoints > 1400) {
                        meetResults[place] = 'NaN';
                    } else if (requiredPoints > 0) {
                        const performance = calculatePerformance(eventType, requiredPoints, gender, season);
                        meetResults[place] = performance;
                    } else {
                        meetResults[place] = '-';
                    }
                } catch {
                    meetResults[place] = '-';
                }
            }
            results[meet] = meetResults;
        }
        
        return results;
    } catch (e) {
        console.error(`Error in batch calculation: ${e.message}`);
        return {};
    }
}; 