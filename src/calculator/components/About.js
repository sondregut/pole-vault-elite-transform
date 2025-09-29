function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About World Athletics Points Conversion</h1>
        
        <section className="about-section">
          <h2>What is World Athletics Points?</h2>
          <p>
            World Athletics Points is a scoring system used in athletics (track and field) 
            to compare performances across different events. This system allows for the comparison of performances 
            in different events on a standardized scale, making it possible to evaluate achievements across diverse 
            disciplines within athletics.
          </p>
          <p>
            The scoring tables are regularly updated to reflect current world records and performance standards. 
            The current scoring tables were last updated <a href="https://worldathletics.org/news/news/scoring-tables-2025" target="_blank" rel="noopener noreferrer">Jan. 9th, 2025</a>, incorporating new performance trends.
          </p>
        </section>

        <section className="about-section">
          <h2>How it Works</h2>
          <p>
            The scoring system uses mathematical formulas that take into account the level, depth, and progression of performances in each event. Each performance is converted into points, ranging from 0 to 1400 points.
          </p>
          <p>
            The formulas consider:
          </p>
          <ul>
            <li>The type of event (track, field, or combined events)</li>
            <li>Gender-specific standards</li>
            <li>Indoor vs outdoor conditions</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Wind Modifications</h2>
          <p>
            For certain events (sprints, hurdles, long jump, and triple jump), wind conditions affect the scoring. 
            The modifications are applied as follows:
          </p>
          <ul>
            <li>Headwinds result in additional points being awarded</li>
            <li>Tailwinds above +2.0 m/s result in point deductions</li>
            <li>Wind between 0 and +2.0 m/s has no effect on points</li>
            <li>The magnitude of adjustment increases with stronger winds</li>
          </ul>
          <p>
            Wind adjustments ensure fair comparison of performances achieved under different conditions.
          </p>
        </section>

        <section className="about-section">
          <h2>Using the Calculator</h2>
          <p>
            This tool offers two main functions:
          </p>
          <ul>
            <li><strong>Performance → Points:</strong> Convert an athletic performance into World Athletics points</li>
            <li><strong>Points → Performance:</strong> Calculate the required performance for a specific points target</li>
          </ul>
          <p>
            Additional features include:
          </p>
          <ul>
            <li>Wind adjustment calculations for relevant events</li>
            <li>Competition level bonus point calculations</li>
            <li>Equivalent performance calculations across different events</li>
            <li>Support for both indoor and outdoor seasons</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Data Sources</h2>
          <p>
            All calculations are based on the official World Athletics Scoring Tables and Competition Regulations. 
            The scoring formulas and competition categories are regularly updated to align with World Athletics 
            standards.
          </p>
        </section>

        <section className="about-section">
          <h2>Understanding Results</h2>
          <p>
            When using the calculator, you might see "NaN" (Not a Number) in some cases:
          </p>
          <ul>
            <li>When the required performance points would need to be over 1400 to achieve the placing target</li>
            <li>When the calculation would result in an impossible performance for that event</li>
          </ul>
          <p>
            For example, if you input 1300 points and look at first place in OW (which adds 375 bonus points), 
            you would need a performance worth more than 1400 points to achieve this - which isn't possible 
            with the World Athletics scoring tables.
          </p>
        </section>

        <section className="about-section">
          <h2>Competition Categories</h2>
          <div className="competition-categories">
            <div className="category">
              <h3>OW (Olympic/World)</h3>
              <ul>
                <li>Olympic Games</li>
                <li>World Athletics Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>DF (Diamond Final)</h3>
              <ul>
                <li>Diamond League Finals*</li>
              </ul>
            </div>

            <div className="category">
              <h3>GW (Gold/World)</h3>
              <ul>
                <li>World Athletics Indoor Championships</li>
                <li>World Athletics Cross Country Championships (senior race)</li>
                <li>Diamond League Meetings (DL disciplines only)</li>
                <li>World Athletics Continental Tour Gold (Hammer Throw only)</li>
              </ul>
            </div>

            <div className="category">
              <h3>GL (Gold Level)</h3>
              <ul>
                <li>Area Senior Outdoor Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category A</h3>
              <ul>
                <li>Major Games (All-African, Asian, Commonwealth, Pan American, European, South American)</li>
                <li>Diamond League Meetings (Additional international events with at least 50% of DL prize money)</li>
                <li>World Athletics Continental Tour Gold Meetings**</li>
                <li>World Athletics Indoor Tour Gold Level Meetings**</li>
                <li>Area Senior Indoor Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category B</h3>
              <ul>
                <li>Regional Games & Athletics Championships</li>
                <li>World Athletics Continental Tour Silver Meetings**</li>
                <li>World Athletics Indoor Tour Silver Meetings**</li>
                <li>Area second tier Championships</li>
                <li>National Senior Championships (In Outdoor Main Events)</li>
                <li>NCAA Div. I Outdoor Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category C</h3>
              <ul>
                <li>World Athletics Series - U20 events</li>
                <li>World Athletics Continental Tour Bronze Meetings**</li>
                <li>World Athletics Indoor Tour Bronze Meetings**</li>
                <li>Asian Grand Prix Series</li>
                <li>Area third tier Championships</li>
                <li>Regional Games & Championships</li>
                <li>NCAA Div. I Indoor Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category D</h3>
              <ul>
                <li>Regional Championships, Games and Cups - third tier</li>
                <li>World Athletics Continental Tour Challenger Series</li>
                <li>World Athletics Indoor Tour Challenger Series</li>
                <li>Area fourth tier Championships</li>
                <li>Traditional International Meetings</li>
                <li>National Senior Championships (indoor and Similar Events)</li>
                <li>Mediterranean U23 Championships</li>
                <li>Youth Olympic Games</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category E</h3>
              <ul>
                <li>International Matches (Senior)</li>
                <li>National Winter Throwing Championships</li>
                <li>Designated national permit meetings</li>
                <li>Area U18 Championships</li>
                <li>European Youth Olympic Festival</li>
                <li>Mediterranean U23 Indoor Championships</li>
              </ul>
            </div>

            <div className="category">
              <h3>Category F</h3>
              <ul>
                <li>National permit meetings</li>
                <li>Other competitions</li>
              </ul>
            </div>
          </div>
          
          <div className="footnotes">
            <p>* Athletes who are NOT invited based on their standings in the Diamond League prior to the Final (i.e. Wild Card athletes) will receive Diamond League ranking points (GW category) and not Diamond League Final ranking points (DF category).</p>
            <p>** Only events awarding official Prize Money in accordance with the Tour Regulations.</p>
          </div>

          <div className="source">
            <p>Source: <a href="https://worldathletics.org/world-ranking-rules/track-field-events-2024" target="_blank" rel="noopener noreferrer">World Athletics Ranking Rules 2024</a></p>
          </div>
        </section>

        <section className="about-section author-section">
          <h2>The Author</h2>
          <p>
            This calculator was developed by Simen Guttormsen, a Norwegian pole vaulter and master's student at Duke University. All questions or suggested improvements can be emailed <a href="mailto:simen@stavhopp.no">here</a>.
          </p>
        </section>


      </div>
    </div>
  );
}

export default About; 