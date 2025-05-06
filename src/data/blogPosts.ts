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
    title: "Tempo Runs: A Practical Cornerstone for Speed‑Power Athletes",
    slug: "tempo-runs-sprint-jump-training",
    author: "Sondre Guttormsen",
    date: "June 6, 2025",
    excerpt: "Tempo running—sub‑maximal sprints of 100 – 400 m with short, incomplete recoveries—has been part of high‑level speed training since the 1980s.",
    content: `
      <p>Tempo running—sub‑maximal sprints of 100 – 400 m with short, incomplete recoveries—has been part of high‑level speed training since the 1980s. Yet debate persists: some modern coaches insist that only acceleration and maximal‑velocity work matter; others, following Charlie Francis, Clyde Hart, or the Jamaican sprint camps, keep at least one tempo session in the weekly plan. Recent pieces by Ryan Banta and Joel Smith offer fresh perspective on why this "middle‑gear" work still deserves attention.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">1 | What exactly is tempo?</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Category</th>
              <th class="border p-2 text-left">Typical intensity</th>
              <th class="border p-2 text-left">Usual rep length</th>
              <th class="border p-2 text-left">Recovery</th>
              <th class="border p-2 text-left">Common purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2"><strong>Extensive tempo</strong></td>
              <td class="border p-2">65-75% v<sub>max</sub></td>
              <td class="border p-2">100-200 m</td>
              <td class="border p-2">Walk-back / 30-90 s</td>
              <td class="border p-2">Active recovery, capillary development, technical rhythm</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Intensive tempo</strong></td>
              <td class="border p-2">80-89%</td>
              <td class="border p-2">120-300 m</td>
              <td class="border p-2">1-3 min</td>
              <td class="border p-2">Lactate buffering, 400 m race rhythm</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p>Charlie Francis capped extensive sessions at roughly 2 000 m to "flush, not fry" the CNS and kept the pace strict—about 100 m PB × 1.33 seconds <a href="https://www.charliefrancis.com/products/the-charlie-francis-training-system-cfts" class="text-primary hover:underline">Francis 1985</a>.</p>
      
      <div class="my-8 rounded-xl overflow-hidden">
        <video 
          src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tempo.MP4" 
          controls 
          class="w-full h-auto max-h-[500px]"
          poster="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tempo%202.PNG"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      <h3 class="text-xl font-bold mt-8 mb-4">2 | Why many coaches skip tempo (and why that can be short‑sighted)</h3>
      
      <p><strong>"It isn't specific."</strong><br />
      High‑intensity purists argue that long runs teach slow mechanics. Banta counters that when tempo is broken into shorter chunks—say 5 × (100+100+100)—athletes keep posture, ground contact and rhythm intact <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</p>
      
      <p><strong>Fear of technique breakdown.</strong><br />
      Technique does suffer if reps are too long (for example, 5 × 300 m). Reducing segment length or running on grass preserves form while still delivering the aerobic and tendon stimulus.</p>
      
      <p><strong>"General fitness can come from circuits."</strong><br />
      True, but tempo delivers work‑capacity, tendon loading and technical rehearsal simultaneously—one session instead of several <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">3 | Documented benefits</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">System / quality</th>
              <th class="border p-2 text-left">Evidence & rationale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2"><strong>Lower‑leg stiffness</strong></td>
              <td class="border p-2">Long‑stride calf loading in sets like 6 × 200 m creates tendon resilience valuable to single‑leg jumpers <a href="https://www.just-fly-sports.com/speed-training-interview-with-ryan-banta/" class="text-primary hover:underline">Smith 2013 via Banta interview</a>.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Circulatory efficiency</strong></td>
              <td class="border p-2">Francis considered expanded capillary beds a "hidden secret" that speeds recovery between hard sessions <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Lactate buffering</strong></td>
              <td class="border p-2">Intensive tempo at 80‑85 % raises sodium‑bicarbonate levels, delaying acidosis in 200/400 m events <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Work‑capacity and robustness</strong></td>
              <td class="border p-2">Adding one tempo day per week yields ~ +13 extra sessions over a 13‑week season—effectively two more micro‑cycles of training volume <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Session‑to‑session freshness</strong></td>
              <td class="border p-2">Extensive tempo elevates HR without heavy CNS cost, allowing high‑quality lifts or speed the following day <a href="https://www.charliefrancis.com/products/the-charlie-francis-training-system-cfts" class="text-primary hover:underline">Francis 1985</a>.</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Weather insurance</strong></td>
              <td class="border p-2">Moderate‑intensity runs on turf are a safe fallback when lightning or cold cancels max‑velocity work <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a>.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 class="text-xl font-bold mt-8 mb-4">4 | Building tempo into a high‑/low week</h3>
      
      <div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Day</th>
              <th class="border p-2 text-left">Primary focus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2"><strong>Mon</strong></td>
              <td class="border p-2">Short‑approach vault and power throws</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Tue</strong></td>
              <td class="border p-2">Acceleration sprints + weight‑room strength</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Wed</strong></td>
              <td class="border p-2">Technical drills and gymnastics‑based core</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Thu</strong></td>
              <td class="border p-2">Full‑approach vault + mixed lifting</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Fri</strong></td>
              <td class="border p-2">Extensive tempo (e.g., 6 × 200 m @ 70 % on grass)</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Sat</strong></td>
              <td class="border p-2">Hill sprints (moderate intensity) + high‑bar strength</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Sun</strong></td>
              <td class="border p-2">Rest / mobility work</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p>This alternation mirrors Francis's high‑low blueprint: neural‑max days are buffered by metabolic‑low days, keeping injury risk down while maintaining output.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">5 | Selecting the right format</h3>
      
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Jump‑centric stiffness:</strong> 8 × 200 m @ 75 %, 3′ rest (grass)</li>
        <li><strong>400 m rhythm & buffering:</strong> 3 × 4 × 150 m @ 82 %, 2′ between reps / 6′ between sets</li>
        <li><strong>Recovery flush:</strong> 10 × 100 m @ 70 %, walk‑back (barefoot on turf if weather allows)</li>
        <li><strong>Cooldown option:</strong> 6-8 × 100 m descending 90 → 50 % to reduce calf cramps <a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">Banta 2021</a></li>
      </ul>
      
      <h3 class="text-xl font-bold mt-8 mb-4">6 | Implementation guidelines</h3>
      
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Measure, don't guess.</strong><br /> A 10.9 s sprinter should hit ~ 14.5 s for 100 m tempo—not 13.0 s.</li>
        <li><strong>Surface choice matters.</strong><br /> Grass or turf reduces joint stress and maximises tendon stimulus.</li>
        <li><strong>Split reps before form disintegrates.</strong><br /> Replace 300 m slogging with 100‑m splits if posture falters.</li>
        <li><strong>Positioning in the micro‑cycle.</strong><br /> Banta prefers Tuesday tempo following a high‑intensity Monday, avoiding heavy CNS work after large tempo volume <a href="https://www.just-fly-sports.com/speed-training-interview-with-ryan-banta/" class="text-primary hover:underline">Banta interview</a>.</li>
        <li><strong>Progress conservatively.</strong><br /> Start at 600‑800 m total, add 10 % weekly, and unload every fourth week.</li>
      </ul>
      
      <h3 class="text-xl font-bold mt-8 mb-4">Closing thoughts</h3>
      
      <p>Tempo running is neither old‑fashioned nor a cure‑all—but used judiciously, it:</p>
      
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li>protects connective tissue,</li>
        <li>sharpens technical rhythm in low‑stress conditions,</li>
        <li>boosts aerobic support for sprint repeatability, and</li>
        <li>adds flexible training volume without compromising peak speed.</li>
      </ul>
      
      <p>If you coach or train for speed‑power events, a well‑timed tempo session can be the difference between arriving at race day ready or merely recovered. As Francis put it three decades ago, tempo lets you "flush today so you can sprint tomorrow."</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4">Further reading</h3>
      
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li>C. Francis – The Charlie Francis Training System<br /><a href="https://www.charliefrancis.com/products/the-charlie-francis-training-system-cfts" class="text-primary hover:underline">https://www.charliefrancis.com/products/the-charlie-francis-training-system-cfts</a></li>
        <li>R. Banta – "Ending the War on Tempo Running with Sprinters"<br /><a href="https://simplifaster.com/articles/tempo-running-sprinters-training/" class="text-primary hover:underline">https://simplifaster.com/articles/tempo-running-sprinters-training/</a></li>
        <li>J. Smith – "Speed Training Interview with Ryan Banta"<br /><a href="https://www.just-fly-sports.com/speed-training-interview-with-ryan-banta/" class="text-primary hover:underline">https://www.just-fly-sports.com/speed-training-interview-with-ryan-banta/</a></li>
      </ul>
    `,
    coverImage: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tempo%202.PNG",
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
