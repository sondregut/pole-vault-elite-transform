import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import CompetitionTable from './CompetitionTable';
import About from './components/About';
import Form from './components/CalculatorForm/Form';
import WindAdjustment from './components/CalculatorForm/WindAdjustment';
import ResultsDisplay from './components/CalculatorForm/ResultsDisplay';
import EventComparison from './components/EventComparison';
import { calculatePoints, calculatePerformance } from './utils/calculators';
import { EVENT_CODES } from './utils/eventCodes';
import { needsWindInput } from './utils/windModification';
import Disclaimer from './components/Disclaimer';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [gender, setGender] = useState('mens');
  const [season, setSeason] = useState('outdoor');
  const [mode, setMode] = useState('points');
  const [eventType, setEventType] = useState('100m');
  const [performance, setPerformance] = useState('');
  const [points, setPoints] = useState(null);
  const [windSpeed, setWindSpeed] = useState('');
  const [showWind, setShowWind] = useState(false);
  const [adjustedPoints, setAdjustedPoints] = useState(null);

  const calculate = async () => {
    try {
      if (mode === 'points') {
        const result = calculatePoints({
          mode,
          performance,
          eventType: EVENT_CODES[eventType] || eventType,
          gender,
          season,
          windSpeed
        });

        if (result) {
          setPoints(result.points);
          setAdjustedPoints(result.adjustedPoints);
        }
      } else {
        const performance = calculatePerformance(
          EVENT_CODES[eventType] || eventType,
          Number(points),
          gender,
          season
        );
        
        if (['800m', '1500m', '3000m', '3000mSC', '5000m', '10000m'].includes(eventType)) {
          const minutes = Math.floor(performance / 60);
          const seconds = (performance % 60).toFixed(2);
          setPerformance(`${minutes}:${seconds.padStart(5, '0')}`);
        } else {
          setPerformance(performance.toFixed(2));
        }
        
        setPoints(Number(points));
        setAdjustedPoints(Number(points));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculatorForm = (
    <div className="calculator-form">
      <Form
        mode={mode}
        setMode={setMode}
        gender={gender}
        setGender={setGender}
        season={season}
        setSeason={setSeason}
        eventType={eventType}
        setEventType={setEventType}
        performance={performance}
        setPerformance={setPerformance}
        points={points}
        setPoints={setPoints}
      />
      {mode === 'points' && season === 'outdoor' && needsWindInput(eventType, season) && (
        <WindAdjustment
          eventType={eventType}
          windSpeed={windSpeed}
          setWindSpeed={setWindSpeed}
          showWind={showWind}
          setShowWind={setShowWind}
        />
      )}
      <button className="calculate-button" onClick={calculate}>
        Calculate
      </button>
      <ResultsDisplay 
        mode={mode}
        points={points}
        performance={performance}
        eventType={eventType}
        windSpeed={windSpeed}
        adjustedPoints={adjustedPoints}
      />
    </div>
  );

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Disclaimer />
      <main className="main-content">
        {activeTab === 'calculator' ? (
          <div className="calculator-page">
            <div className="calculator-sidebar">
              <h1>World Athletics Points Calculator</h1>
              <p className="calculator-info">
                Enter a performance to calculate points, or enter points to find equivalent performances. 
                Points range: 0-1400. Higher points indicate better performances.
              </p>
              {calculatorForm}
            </div>
            <div className="calculator-main">
              <EventComparison 
                points={showWind ? adjustedPoints : points}
                gender={gender} 
                season={season} 
              />
            </div>
          </div>
        ) : activeTab === 'competition' ? (
          <div className="competition-page">
            <div className="competition-sidebar">
              {calculatorForm}
            </div>
            <div className="competition-main">
              <CompetitionTable 
                points={showWind ? adjustedPoints : points}
                eventType={eventType}
                gender={gender}
                season={season}
              />
            </div>
          </div>
        ) : (
          <About />
        )}
      </main>
    </div>
  );
}

export default App;