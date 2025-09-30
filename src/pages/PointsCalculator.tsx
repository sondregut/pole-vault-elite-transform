import { useEffect } from 'react';
import '../calculator/App.css';
import CalculatorApp from '../calculator/App.jsx';

const PointsCalculator = () => {
  useEffect(() => {
    // Set page title
    document.title = 'World Athletics Points Calculator - Pole Vault Elite Transform';

    // Override body styles temporarily
    const originalOverflow = document.body.style.overflow;
    const originalBackground = document.body.style.background;
    const originalColor = document.body.style.color;

    document.body.style.overflow = 'auto';
    document.body.style.background = '#0f172a';
    document.body.style.color = '#f8fafc';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.background = originalBackground;
      document.body.style.color = originalColor;
    };
  }, []);

  return (
    <div className="points-calculator-page">
      <CalculatorApp />
    </div>
  );
};

export default PointsCalculator;