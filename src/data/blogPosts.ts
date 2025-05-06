
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to Improve Your Takeoff in Pole Vault",
    slug: "improve-takeoff-pole-vault",
    author: "Sondre Guttormsen",
    date: "May 1, 2025",
    excerpt: "The takeoff is one of the most critical elements in pole vault. Learn the techniques to master this crucial phase and add height to your jumps.",
    content: `
      <p>The takeoff in pole vault is often considered the make-or-break moment of your jump. It's where all the kinetic energy from your run is transferred into the pole, setting you up for a successful vault.</p>
      
      <h2>Why the Takeoff Is Critical</h2>
      <p>A good takeoff allows you to:</p>
      <ul>
        <li>Efficiently transfer your horizontal momentum into the pole</li>
        <li>Maintain proper body position for the swing phase</li>
        <li>Generate maximum bend in the pole</li>
        <li>Set up the timing for the rest of your vault</li>
      </ul>
      
      <h2>Key Takeoff Techniques</h2>
      <p>Here are some specific techniques to focus on:</p>
      
      <h3>1. Proper Foot Placement</h3>
      <p>Your takeoff foot should land directly under your body's center of mass. Too far forward and you'll lose energy; too far back and you won't generate enough force.</p>
      
      <h3>2. Maintain Speed Through Takeoff</h3>
      <p>Many vaulters slow down right before takeoff. Instead, focus on accelerating through the last few steps.</p>
      
      <h3>3. Strong Arm Position</h3>
      <p>Keep your top arm extended and strong at takeoff. This creates the leverage needed for transferring energy to the pole.</p>
      
      <h3>4. Jump Up, Not Forward</h3>
      <p>A common mistake is jumping forward into the pit rather than upward into the pole. Think about jumping straight up, while your momentum carries you forward.</p>
      
      <h2>Drills to Improve Takeoff</h2>
      <p>Try these drills to develop a stronger takeoff:</p>
      <ul>
        <li><strong>Box Drills:</strong> Practice jumping onto a plyometric box with the same foot you use for takeoff</li>
        <li><strong>Short Run Vaults:</strong> Use 3-4 steps to focus specifically on the takeoff</li>
        <li><strong>Jump and Reach:</strong> Practice explosive vertical jumps while reaching with your top arm</li>
      </ul>
      
      <p>Remember, consistency is key. The takeoff should be practiced regularly until it becomes second nature. In my own training, I spend at least one session per week focusing exclusively on takeoff technique.</p>
    `,
    coverImage: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg",
    category: "Technique"
  },
  {
    id: 2,
    title: "Strength Training for Pole Vaulters: What Works",
    slug: "strength-training-pole-vault",
    author: "Sondre Guttormsen",
    date: "April 15, 2025",
    excerpt: "Not all strength training is created equal for pole vaulters. Discover the specific exercises and training protocols that will improve your vaulting performance.",
    content: `
      <p>Strength training is essential for pole vaulters, but it needs to be specific to the demands of the sport. Generic workouts won't optimize your performance.</p>
      
      <h2>Prioritize Power Over Mass</h2>
      <p>As a pole vaulter, your power-to-weight ratio is crucial. Focus on exercises that build explosive power without adding excessive muscle mass.</p>
      
      <h2>Key Movement Patterns</h2>
      <p>These are the fundamental movement patterns that should form the core of your strength training:</p>
      
      <h3>1. Olympic Lifts</h3>
      <p>Clean and jerk, power clean, and snatch variations develop the explosive triple extension (ankle, knee, hip) that's crucial for takeoff.</p>
      
      <h3>2. Plyometrics</h3>
      <p>Box jumps, depth jumps, and bounding exercises develop your fast-twitch muscle fibers and reactive strength.</p>
      
      <h3>3. Core Stability</h3>
      <p>Exercises like hollow holds, hanging leg raises, and anti-rotation movements build the core strength needed for the swing phase.</p>
      
      <h3>4. Upper Body Pulling</h3>
      <p>Pull-ups, rows, and lat pulldowns develop the back strength needed to maintain proper position on the pole.</p>
      
      <h2>Sample Weekly Split</h2>
      <p>Here's how I structure my training week during the off-season:</p>
      <ul>
        <li><strong>Monday:</strong> Lower body power (Olympic lifts, plyometrics)</li>
        <li><strong>Tuesday:</strong> Upper body strength and core</li>
        <li><strong>Wednesday:</strong> Active recovery and mobility</li>
        <li><strong>Thursday:</strong> Total body power and strength</li>
        <li><strong>Friday:</strong> Specialized core and stabilization work</li>
        <li><strong>Saturday/Sunday:</strong> Rest or light activity</li>
      </ul>
      
      <p>The key is to integrate your strength training with your technical vault practice. Your gym work should complement what you're doing on the runway, not detract from it.</p>
    `,
    coverImage: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg",
    category: "Training"
  },
  {
    id: 3,
    title: "Mental Preparation for Competition Day",
    slug: "mental-preparation-competition",
    author: "Sondre Guttormsen",
    date: "March 20, 2025",
    excerpt: "The mental aspect of pole vault is just as important as physical training. Learn how to prepare your mind for peak performance on competition day.",
    content: `
      <p>While we spend countless hours preparing physically for competitions, mental preparation is often overlooked. Yet, it can be the difference between a good jump and a great one.</p>
      
      <h2>Pre-Competition Routine</h2>
      <p>Having a consistent pre-competition routine helps calm nerves and creates a sense of familiarity, even in new environments.</p>
      
      <h3>1. Visualization</h3>
      <p>I spend at least 15 minutes the night before and again on competition day visualizing successful jumps. I see every detail: the run, takeoff, swing, and clearance.</p>
      
      <h3>2. Focus Cues</h3>
      <p>Develop 2-3 technical cues to focus on during your jump. These should be simple reminders like "drive knee" or "extend top arm." Too many cues can overload your brain.</p>
      
      <h3>3. Breathing Techniques</h3>
      <p>Use controlled breathing to manage adrenaline and anxiety. I use a 4-7-8 pattern (inhale for 4, hold for 7, exhale for 8) when I feel nervous before a jump.</p>
      
      <h2>During Competition</h2>
      
      <h3>1. Stay Present</h3>
      <p>Focus only on the current jump, not your previous attempts or what height might be coming next.</p>
      
      <h3>2. Routine Between Jumps</h3>
      <p>Develop a consistent routine for what you do between jumps. This might include reviewing your last attempt, visualizing your next jump, and physical reset activities.</p>
      
      <h3>3. Positive Self-Talk</h3>
      <p>The way you talk to yourself matters. Replace thoughts like "Don't hit the bar" with positives like "Drive through to clearance."</p>
      
      <h2>Managing Pressure</h2>
      <p>The highest pressure situations are often when you're on your third attempt or jumping at a PR height. Here's how to handle them:</p>
      <ul>
        <li>Stick to your routine - don't rush or change your approach</li>
        <li>Focus on execution, not outcome</li>
        <li>Embrace the pressure rather than fighting it</li>
        <li>Remember previous successes in similar situations</li>
      </ul>
      
      <p>Mental toughness isn't innate - it's a skill you develop through practice. Include mental training in your regular routine, not just before competitions.</p>
    `,
    coverImage: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
    category: "Mental Training"
  }
];
