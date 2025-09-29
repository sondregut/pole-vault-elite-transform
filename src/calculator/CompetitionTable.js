import { useState, useEffect } from 'react';
import { COMPETITION_POINTS, MEET_LABELS, COMBINED_EVENTS, getPointsTable } from './utils/competitionPoints';
import { EVENT_CODES } from './utils/eventCodes';
import { calculatePerformancesBatch } from './utils/calculators';

// New Row component to handle the API calls
// function TableRow({ place, targetTotal, eventType, gender, season, baseMeet, basePlace }) {
//   const [performances, setPerformances] = useState({});
//
//   useEffect(() => {
//     const fetchPerformances = async () => {
//       if (targetTotal) {
//         try {
//           const response = await fetch('http://localhost:5001/api/calculate-performances-batch', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               base_points: targetTotal,
//               event_type: eventType,
//               gender: gender,
//               season: season
//             }),
//           });
//           
//           const data = await response.json();
//           if (data.performances) {
//             setPerformances(data.performances);
//           }
//         } catch (error) {
//           console.error('Error:', error);
//         }
//       } else {
//         setPerformances({});
//       }
//     };
//
//     fetchPerformances();
//   }, [targetTotal, eventType, gender, season]);
//
//   return (
//     <tr>
//       <td>{place}</td>
//       {Object.keys(MEET_LABELS).map(meet => (
//         <td key={meet}>
//           {COMPETITION_POINTS[meet][place] ? 
//             formatPerformance(performances[meet]?.[place], eventType) || '-' 
//             : '-'}
//         </td>
//       ))}
//     </tr>
//   );
// }

// Helper function to get the last scoring place for a meet
const getLastScoringPlace = (meet) => {
  return Math.max(...Object.keys(COMPETITION_POINTS[meet]).map(Number)) + 1;
};

// Main CompetitionTable component
function CompetitionTable({ points, eventType, gender, season }) {
  const [baseMeet, setBaseMeet] = useState('');
  const [basePlace, setBasePlace] = useState('');
  const [performances, setPerformances] = useState({});

  // Calculate equivalent performances when points or base selections change
  useEffect(() => {
    const calculateEquivalentPerformances = () => {
      if (!points) return;

      const basePoints = baseMeet && basePlace ? 
        (basePlace === 'other' ? points : points + COMPETITION_POINTS[baseMeet][basePlace]) : 
        points;

      const newPerformances = calculatePerformancesBatch(
        basePoints,
        EVENT_CODES[eventType] || eventType,
        gender,
        season
      );
      
      setPerformances(newPerformances);
    };

    calculateEquivalentPerformances();
  }, [points, eventType, gender, season, baseMeet, basePlace]);

  const formatPerformance = (performance, eventType) => {
    // First check if performance is valid
    if (!performance || performance === '-' || performance === 'NaN' || isNaN(performance)) {
      return '-';
    }

    // For combined events, return whole numbers
    if (COMBINED_EVENTS.includes(eventType)) {
      return Math.round(performance);
    }

    // For track events (ending with 'm' or 'mH' or 'mSC')
    if (eventType.endsWith('m') || eventType.endsWith('mH') || eventType.endsWith('mSC')) {
      if (['800m', '1500m', '3000m', '3000mSC', '5000m', '10000m'].includes(eventType)) {
        // Format mm:ss.xx for middle/long distance
        const minutes = Math.floor(performance / 60);
        const seconds = (performance % 60).toFixed(2);
        return `${minutes}:${seconds.padStart(5, '0')}`;
      }
      // Format ss.xx for sprints
      return Number(performance).toFixed(2);
    }

    // For field events
    return Number(performance).toFixed(2);
  };

  if (!points) {
    return (
      <div className="competition-table">
        <p>Please enter a performance or points in the calculator first.</p>
      </div>
    );
  }

  const getPoints = (basePoints, meet, place) => {
    const pointsTable = getPointsTable(eventType);
    return pointsTable[meet]?.[place] ? 
      (parseInt(basePoints) + parseInt(pointsTable[meet][place])) : 
      '-';
  };

  return (
    <div className="competition-table">
      <h2>Competition Level Comparison</h2>
      <div className="table-info">
        <p>This table shows the required performances to achieve the same ranking points at different competition levels.</p>
        <p>Each competition category (OW, DF, etc.) awards bonus points based on placement. 
           A lower required performance means more bonus points are awarded at that competition level.</p>
      </div>

      {/* Base Meet Selection */}
      <div className="settings-grid">
        <div className="setting-group">
          <label>Base Points</label>
          <div className="points-display">
            {points || 'Enter points'}
          </div>
        </div>
        <div className="setting-group">
          <label>Meet Level</label>
          <select value={baseMeet} onChange={(e) => setBaseMeet(e.target.value)}>
            <option value="">No bonus</option>
            {Object.keys(MEET_LABELS).map(meet => (
              <option key={meet} value={meet}>{MEET_LABELS[meet]}</option>
            ))}
          </select>
        </div>
        {baseMeet && (
          <div className="setting-group">
            <label>Place</label>
            <select value={basePlace} onChange={(e) => setBasePlace(e.target.value)}>
              <option value="">Select place</option>
              {Object.keys(COMPETITION_POINTS[baseMeet]).map(place => (
                <option key={place} value={place}>{place}</option>
              ))}
              <option value="other">{getLastScoringPlace(baseMeet)}+</option>
            </select>
          </div>
        )}
        {baseMeet && basePlace && (
          <div className="setting-group">
            <label>Total Points</label>
            <div className="points-breakdown">
              {points} + {basePlace === 'other' ? '0' : 
                getPointsTable(eventType)[baseMeet][basePlace]
              } = {
                basePlace === 'other' 
                  ? points 
                  : points + getPointsTable(eventType)[baseMeet][basePlace]
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Required Performances Table */}
      <div className="table-section">
        <h3>Required Performances for Equivalent Points</h3>
        <div className="equivalency-table">
          <table>
            <thead>
              <tr>
                <th>Place</th>
                {Object.keys(MEET_LABELS).map(meet => (
                  <th key={meet}>{MEET_LABELS[meet]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(16)].map((_, index) => {
                const place = index + 1;
                return (
                  <tr key={place}>
                    <td>{place}</td>
                    {Object.keys(MEET_LABELS).map(meet => (
                      <td key={meet}>
                        {performances[meet]?.[place] === 'NaN' ? 
                          'NaN' : 
                          (performances[meet]?.[place] ? 
                            formatPerformance(performances[meet][place], eventType) : 
                            '-'
                          )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Points Table */}
      <div className="table-section">
        <h3>Total Points (Performance + Placing)</h3>
        <div className="points-table">
          <table>
            <thead>
              <tr>
                <th>Place</th>
                {Object.keys(MEET_LABELS).map(meet => (
                  <th key={meet}>{MEET_LABELS[meet]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(16)].map((_, index) => {
                const place = index + 1;
                return (
                  <tr key={place}>
                    <td>{place}</td>
                    {Object.keys(MEET_LABELS).map(meet => (
                      <td key={meet}>
                        {points ? getPoints(points, meet, place) : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompetitionTable; 