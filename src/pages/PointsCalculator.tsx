import { useEffect } from 'react';
import '../calculator/App.css';
import CalculatorApp from '../calculator/App.jsx';

const PointsCalculator = () => {
  useEffect(() => {
    // Set page title
    document.title = 'World Athletics Points Calculator - Pole Vault Elite Transform';
  }, []);

  return (
    <div className="points-calculator-page">
      <CalculatorApp />
    </div>
  );
};

export default PointsCalculator;