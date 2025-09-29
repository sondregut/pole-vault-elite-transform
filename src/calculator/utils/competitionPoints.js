export const COMPETITION_POINTS = {
    OW: { // Olympic/World Championships
      1: 375, 2: 330, 3: 300, 4: 270, 5: 250, 6: 230, 7: 215, 8: 200,
      9: 130, 10: 120, 11: 110, 12: 100, 13: 95, 14: 90, 15: 85, 16: 80
    },
    DF: { // Diamond Final
      1: 240, 2: 210, 3: 185, 4: 170, 5: 155, 6: 145, 7: 135, 8: 125,
      9: 90, 10: 80, 11: 70, 12: 60
    },
    GW: { // Diamond League
      1: 200, 2: 170, 3: 150, 4: 140, 5: 130, 6: 120, 7: 110, 8: 100,
      9: 70, 10: 60, 11: 50, 12: 45
    },
    GL: { // Continental Gold
      1: 170, 2: 145, 3: 130, 4: 120, 5: 110, 6: 100, 7: 90, 8: 80,
      9: 60, 10: 50, 11: 45, 12: 40
    },
    A: { // Category A
      1: 140, 2: 120, 3: 110, 4: 100, 5: 90, 6: 80, 7: 70, 8: 60
    },
    B: { // Category B
      1: 100, 2: 80, 3: 70, 4: 60, 5: 55, 6: 50, 7: 45, 8: 40
    },
    C: { // Category C
      1: 60, 2: 50, 3: 45, 4: 40, 5: 35, 6: 30, 7: 27, 8: 25
    },
    D: { // Category D
      1: 40, 2: 35, 3: 30, 4: 25, 5: 22, 6: 19, 7: 17, 8: 15
    },
    E: { // Category E
      1: 25, 2: 21, 3: 18, 4: 15, 5: 12, 6: 10
    },
    F: { // Category F
      1: 15, 2: 10, 3: 5
    }
};
  
export const MEET_LABELS = {
    OW: "OW",
    DF: "DF",
    GW: "GW",
    GL: "GL",
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F"
};

export const SPECIAL_EVENTS_POINTS = {
    OW: {
        1: 305, 2: 270, 3: 240, 4: 220, 5: 200, 6: 185, 7: 175, 8: 165,
        9: 110, 10: 100, 11: 90, 12: 80, 13: 75, 14: 70, 15: 65, 16: 60
    },
    DF: {
        1: 210, 2: 185, 3: 160, 4: 145, 5: 130, 6: 120, 7: 110, 8: 100,
        9: 70, 10: 60, 11: 55, 12: 50
    },
    GW: {
        1: 180, 2: 160, 3: 140, 4: 120, 5: 110, 6: 100, 7: 90, 8: 80,
        9: 55, 10: 45, 11: 40, 12: 35
    },
    GL: {
        1: 150, 2: 135, 3: 120, 4: 105, 5: 90, 6: 80, 7: 70, 8: 60,
        9: 45, 10: 40, 11: 35, 12: 30
    },
    A: {
        1: 100, 2: 90, 3: 80, 4: 70, 5: 60, 6: 50, 7: 45, 8: 40
    },
    B: {
        1: 70, 2: 60, 3: 50, 4: 45, 5: 40, 6: 35, 7: 30, 8: 25
    },
    C: {
        1: 50, 2: 40, 3: 35, 4: 30, 5: 26, 6: 23, 7: 20, 8: 18
    },
    D: {
        1: 35, 2: 27, 3: 22, 4: 19, 5: 16, 6: 14, 7: 12, 8: 10
    },
    E: {
        1: 20, 2: 16, 3: 12, 4: 10, 5: 9, 6: 8
    },
    F: {
        1: 12, 2: 7, 3: 4
    }
};

export const SPECIAL_EVENTS = ['5000m', '3000mSC', '10000m'];

export const COMBINED_EVENTS_POINTS = {
    'OW': {
        1: 280, 2: 250, 3: 225, 4: 205, 5: 185, 6: 170, 7: 155, 8: 145,
        9: 95, 10: 85, 11: 75, 12: 65, 13: 60, 14: 55, 15: 50, 16: 46
    },
    'DF': {
        1: 175, 2: 150, 3: 135, 4: 120, 5: 105, 6: 95, 7: 85, 8: 75,
        9: 50, 10: 40, 11: 35, 12: 30
    },
    'GW': {
        1: 140, 2: 120, 3: 105, 4: 90, 5: 80, 6: 70, 7: 60, 8: 50,
        9: 35, 10: 30, 11: 24, 12: 18
    },
    'GL': {
        1: 110, 2: 90, 3: 75, 4: 65, 5: 55, 6: 50, 7: 45, 8: 40,
        9: 30, 10: 25, 11: 20, 12: 15
    },
    'A': {
        1: 80, 2: 70, 3: 60, 4: 50, 5: 45, 6: 40, 7: 35, 8: 30
    },
    'B': {
        1: 60, 2: 50, 3: 45, 4: 40, 5: 35, 6: 30, 7: 25, 8: 20
    },
    'C': {
        1: 45, 2: 38, 3: 32, 4: 26, 5: 22, 6: 19, 7: 17, 8: 15
    },
    'D': {
        1: 30, 2: 22, 3: 18, 4: 16, 5: 14, 6: 12, 7: 11, 8: 10
    },
    'E': {
        1: 20, 2: 14, 3: 10, 4: 8, 5: 7, 6: 6
    },
    'F': {
        1: 10, 2: 6, 3: 3
    }
};

export const COMBINED_EVENTS = ['Decathlon', 'Heptathlon', 'Pentathlon'];

export const TEN_K_POINTS = {
    'OW': {
        1: 280, 2: 250, 3: 225, 4: 205, 5: 185, 6: 170, 7: 155, 8: 145,
        9: 95, 10: 85, 11: 75, 12: 65, 13: 60, 14: 55, 15: 50, 16: 40
    },
    'DF': {
        1: 175, 2: 150, 3: 135, 4: 120, 5: 105, 6: 95, 7: 85, 8: 75,
        9: 50, 10: 40, 11: 35, 12: 30
    },
    'GW': {
        1: 140, 2: 120, 3: 105, 4: 90, 5: 80, 6: 70, 7: 60, 8: 50,
        9: 40, 10: 32, 11: 27, 12: 24
    },
    'GL': {
        1: 110, 2: 90, 3: 75, 4: 65, 5: 55, 6: 50, 7: 45, 8: 40,
        9: 30, 10: 25, 11: 22, 12: 20
    },
    'A': {
        1: 80, 2: 70, 3: 60, 4: 50, 5: 45, 6: 40, 7: 35, 8: 30
    },
    'B': {
        1: 60, 2: 50, 3: 45, 4: 40, 5: 35, 6: 30, 7: 25, 8: 20
    },
    'C': {
        1: 45, 2: 38, 3: 32, 4: 26, 5: 22, 6: 19, 7: 17, 8: 15
    },
    'D': {
        1: 30, 2: 22, 3: 18, 4: 16, 5: 14, 6: 12, 7: 11, 8: 10
    },
    'E': {
        1: 20, 2: 14, 3: 10, 4: 8, 5: 7, 6: 6
    },
    'F': {
        1: 10, 2: 6, 3: 3
    }
};

// Update getPointsTable function to handle 10000m
export const getPointsTable = (eventType) => {
    if (eventType === '10000m') {
        return TEN_K_POINTS;
    } else if (SPECIAL_EVENTS.includes(eventType)) {
        return SPECIAL_EVENTS_POINTS;
    } else if (COMBINED_EVENTS.includes(eventType)) {
        return COMBINED_EVENTS_POINTS;
    } else {
        return COMPETITION_POINTS;
    }
};

// Update the existing calculatePerformancesBatch function to use the correct points table
export const calculatePerformancesBatch = (basePoints, eventType, gender = 'mens', season = 'outdoor') => {
    try {
        let pointsTable;
        
        if (SPECIAL_EVENTS.includes(eventType)) {
            pointsTable = SPECIAL_EVENTS_POINTS;
        } else if (COMBINED_EVENTS.includes(eventType)) {
            pointsTable = COMBINED_EVENTS_POINTS;
        } else {
            pointsTable = COMPETITION_POINTS;
        }
        
        // ... rest of the function remains the same
    } catch (e) {
        console.error(`Error in batch calculation: ${e.message}`);
        return {};
    }
};