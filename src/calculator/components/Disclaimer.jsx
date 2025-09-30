import React, { useState } from 'react';

function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="disclaimer-wrapper">
      <button 
        className="disclaimer-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        ⚠️ Disclaimer {isExpanded ? '▼' : '▶'}
      </button>
      
      {isExpanded && (
        <div className="disclaimer-content">
          <p>This scoring table is currently in active development and beta testing. Please note:</p>
          <ul>
            <li>While we strive for accuracy, there may be small variations in calculations as World Athletics has not publicly released their official scoring coefficients</li>
            <li>Some scoring ranges and competition points are approximated based on available data</li>
            <li>The platform is  being updated and may occasionally experience bugs or technical issues</li>
            <li>Additional unofficial events and features will be added soon</li>
            <li>This tool is provided for reference purposes only and should not be considered official</li>
          </ul>
          <p>We welcome feedback and bug reports to help improve the accuracy and functionality of this service. Feel free to contact me <a href="mailto:simen@stavhopp.no">here</a></p>
        </div>
      )}
    </div>
  );
}

export default Disclaimer; 