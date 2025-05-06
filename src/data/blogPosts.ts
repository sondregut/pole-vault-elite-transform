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
    id: 4,
    title: "Tempo Runs: the Low-Key Keystone of Sprint & Jump Training",
    slug: "tempo-runs-sprint-jump-training",
    author: "Sondre Guttormsen",
    date: "June 6, 2025",
    excerpt: "When people picture a 'speed' workout they see explosive block starts or razor-sharp fly sprints. Yet the late Charlie Francis sprinkled tempo into almost every world-class program he wrote.",
    content: `
      <p>When people picture a "speed" workout they see explosive block starts or razor-sharp fly sprints. Yet the late Charlie Francis sprinkled <em>tempo</em> into almost every world-class program he wrote, from Ben Johnson's 9.79 season to today's elite copy-cats. Below is a deeper look at what tempo really is, the two main flavours, common use-cases, and how <em>I, Sondre</em> fold it into my training week.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">1 | What exactly counts as "tempo"?</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Tempo type</th>
              <th class="border p-2 text-left">Speed band</th>
              <th class="border p-2 text-left">Typical rep & rest</th>
              <th class="border p-2 text-left">Session volume</th>
              <th class="border p-2 text-left">Primary purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2"><strong>Extensive</strong></td>
              <td class="border p-2">≈ 65–75% of max</td>
              <td class="border p-2">100–200m, walk-back/30–90s</td>
              <td class="border p-2">≤ 2000m</td>
              <td class="border p-2">Active recovery, capillarisation, technique rehearsal</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Intensive</strong></td>
              <td class="border p-2">≈ 80–89%</td>
              <td class="border p-2">120–300m, 1–3 min</td>
              <td class="border p-2">≤ 1400m</td>
              <td class="border p-2">Aerobic-speed bridge, early special endurance</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p>Francis insisted the intensity be low enough that "the last rep is the same speed as the first," because once fatigue alters mechanics the session stops benefiting recovery and starts <em>stealing</em> from tomorrow's speed. He also capped extensive work at ~2 km to avoid the slow-twitch creep he saw in programs that made sprinters jog laps.</p>
      
      <blockquote class="border-l-4 border-primary pl-4 italic my-6">
        <p><strong>Quick test:</strong> if you can't speak a full sentence while running, you're too fast for extensive tempo.</p>
      </blockquote>
      
      <h3 class="text-xl font-bold mt-8 mb-4">2 | Why tempo pays off for sprinters & jumpers</h3>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Metabolic flush without CNS cost</strong> – Reps at 65–75% raise heart-rate and pump fresh blood through spilled-glycogen muscle, yet the central nervous system stays untouched, leaving you fresh for next-day speed.</li>
        <li><strong>Aerobic "battery" for round-to-round recovery</strong> – Sub-max work expands capillary density and mitochondrial enzymes in fast-twitch fibres so you bounce back quicker between heats, plyo sets or strength circuits.</li>
        <li><strong>Low-impact tendon seasoning</strong> – Grass or turf surfaces plus trainers offer thousands of gentle contacts that armour the plantar fascia, Achilles and patellar tendon against the violent spikes days bring.</li>
        <li><strong>Technical rehearsal</strong> – Relaxed upright running lets you groove front-side mechanics minus the white-noise of maximal effort. Francis often placed tempo the day <em>after</em> pure speed so athletes could "write the movement they just learned in pen".</li>
        <li><strong>Body-composition & general fitness</strong> – Forty-plus seconds of running at ~70% HRmax burns calories and improves cardiac stroke volume without risking fibre-type shift.</li>
      </ul>
      
      <h3 class="text-xl font-bold mt-8 mb-4">3 | My weekly dose (Sondre's template)</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Day</th>
              <th class="border p-2 text-left">Main theme</th>
              <th class="border p-2 text-left">Example session</th>
              <th class="border p-2 text-left">Why here?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">Mon</td>
              <td class="border p-2">Max-acceleration + lift</td>
              <td class="border p-2">Blocks & cleans</td>
              <td class="border p-2">Heavy CNS</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border p-2"><strong>Tue</strong></td>
              <td class="border p-2"><strong>Tempo (recovery)</strong></td>
              <td class="border p-2">10 × 100m on grass, walk-back (~70%)</td>
              <td class="border p-2">Flush hamstrings, reinforce upright mechanics</td>
            </tr>
            <tr>
              <td class="border p-2">Thu</td>
              <td class="border p-2">Max-velocity flys</td>
              <td class="border p-2">4 × 60m fly-20s</td>
              <td class="border p-2">Speed focus</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border p-2"><strong>Fri</strong></td>
              <td class="border p-2"><strong>Tempo</strong></td>
              <td class="border p-2">6 × 150m, 2′ rest (≈ 1000m total)</td>
              <td class="border p-2">Aerobic top-up before weekend jump session</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p>Both Tuesday's 100s and Friday's 150s land at ~1000m—about half Francis's ceiling—so I stay fresh yet consistently rack up >2 km of low-cost running every week.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">4 | Progressions & variations</h3>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Short‐to‑long extensive:</strong> start with 8 × 100m, add 1–2 reps weekly until 12 × 100m, then switch to 6 × 150m.</li>
        <li><strong>Grass turns to Mondo:</strong> begin on thick in‑field turf early GPP; move to trainers on the track as competition nears.</li>
        <li><strong>Intensive bridge (pre‑SPP):</strong> 2 × 4 × 150m at ~80% with 3′ recoveries, borrowed from Simon Hansen's elite 100m plan.</li>
        <li><strong>Tempo circuits:</strong> interleave 100m strides with core or medicine‑ball throws (Francis's "tempo + core" days) to pack more work into 40 min.</li>
      </ul>
      
      <h3 class="text-xl font-bold mt-8 mb-4">5 | Common pitfalls</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Mistake</th>
              <th class="border p-2 text-left">Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2"><strong>Running 80%+ and calling it recovery</strong></td>
              <td class="border p-2">Use a stopwatch: 100m time × 1.33 ≈ 75% pace (e.g., 11s sprinter → 14.7s tempo)</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Too much volume too soon</strong></td>
              <td class="border p-2">Start at 600–800m, add 10% weekly; stop when pace drops >2%.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Racing on concrete</strong></td>
              <td class="border p-2">Keep it soft: grass, finely-rubbered Mondo in flats, or astro-turf.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Skipping tempo in taper</strong></td>
              <td class="border p-2">Keep one micro-dose (6 × 100m) for blood flow—volume, not intensity, fattigues you.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 class="text-xl font-bold mt-8 mb-4">6 | Placing tempo in a full micro-cycle</h3>
      
      <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
Mon   Speed/accel  | heavy weights
Tue   Extensive tempo (900–1200m) + core
Wed   Jumps / plyos | light weights
Thu   Max-velocity / flys
Fri   Extensive or early-season intensive tempo
Sat   Off or drills / mobility
Sun   Rest
      </pre>
      
      <p>This high-low model—hard CNS one day, easy metabolic the next—was the backbone of Francis's entire Training System and is still copied in modern elite templates.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">7 | Take-away</h3>
      
      <p>Tempo looks boring on Instagram, but its return on time is huge:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Faster recovery</strong>,</li>
        <li><strong>Lower injury risk</strong>,</li>
        <li><strong>Cleaner mechanics</strong>, and</li>
        <li><strong>Deeper gas-tank</strong> between heats and sets.</li>
      </ul>
      
      <p>Work it once or twice a week, stay under that ~75% threshold, and your next <em>real</em> speed day will feel like you swapped legs with Usain Bolt.</p>
      
      <blockquote class="border-l-4 border-primary pl-4 italic mt-8 mb-6">
        <p>"Tempo does not affect the CNS—so you can train hard again tomorrow." — Charlie Francis</p>
      </blockquote>
    `,
    coverImage: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
    category: "Training"
  },
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
