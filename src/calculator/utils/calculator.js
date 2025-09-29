import { coeffs, field_events, thons } from './coefficients';

// Competition points for different meet types
export const COMPETITION_POINTS = {
    'OW': { // Olympic/World Championships
        1: 375, 2: 330, 3: 300, 4: 270, 5: 250, 6: 230, 7: 215, 8: 200,
        9: 130, 10: 120, 11: 110, 12: 100, 13: 95, 14: 90, 15: 85, 16: 80
    },
    'DF': { // Diamond Final
        1: 240, 2: 210, 3: 185, 4: 170, 5: 155, 6: 145, 7: 135, 8: 125,
        9: 90, 10: 80, 11: 70, 12: 60
    },
    'GW': { // Diamond League
        1: 200, 2: 170, 3: 150, 4: 140, 5: 130, 6: 120, 7: 110, 8: 100,
        9: 70, 10: 60, 11: 50, 12: 45
    },
    'GL': { // Continental Gold
        1: 170, 2: 145, 3: 130, 4: 120, 5: 110, 6: 100, 7: 90, 8: 80,
        9: 60, 10: 50, 11: 45, 12: 40
    },
    'A': { // Category A
        1: 140, 2: 120, 3: 110, 4: 100, 5: 90, 6: 80, 7: 70, 8: 60
    },
    'B': { // Category B
        1: 100, 2: 80, 3: 70, 4: 60, 5: 55, 6: 50, 7: 45, 8: 40
    },
    'C': { // Category C
        1: 60, 2: 50, 3: 45, 4: 40, 5: 35, 6: 30, 7: 27, 8: 25
    },
    'D': { // Category D
        1: 40, 2: 35, 3: 30, 4: 25, 5: 22, 6: 19, 7: 17, 8: 15
    },
    'E': { // Category E
        1: 25, 2: 21, 3: 18, 4: 15, 5: 12, 6: 10
    },
    'F': { // Category F
        1: 15, 2: 10, 3: 5
    }
};

export function calculatePoints(event, performance, gender = 'mens', season = 'outdoor') {
    try {
        const a = coeffs[gender][season][event].a;
        const b = coeffs[gender][season][event].b;
        const c = coeffs[gender][season][event].c;
        
        let points;
        if (field_events.includes(event)) {
            points = Math.floor(a * Math.pow(performance - b, c));
        } else {
            points = Math.floor(a * Math.pow(b - performance, c));
        }
        
        return Math.max(0, Math.min(1400, points));
    } catch (e) {
        throw new Error(`Error calculating points: ${e.message}`);
    }
}

export function calculatePerformance(event, points, gender = 'mens', season = 'outdoor') {
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
}

export function calculatePerformancesBatch(basePoints, eventType, gender = 'mens', season = 'outdoor') {
    try {
        const results = {};
        
        for (const meet in COMPETITION_POINTS) {
            const meetResults = {};
            for (const [place, bonus] of Object.entries(COMPETITION_POINTS[meet])) {
                try {
                    const requiredPoints = basePoints - bonus;
                    try {
                        const performance = calculatePerformance(eventType, requiredPoints, gender, season);
                        meetResults[place] = performance;
                    } catch {
                        meetResults[place] = null;
                    }
                } catch {
                    meetResults[place] = null;
                }
            }
            results[meet] = meetResults;
        }
        
        return results;
    } catch (e) {
        throw new Error(`Error in batch calculation: ${e.message}`);
    }
}