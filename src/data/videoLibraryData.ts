
export interface VideoExercise {
  id: string;
  title: string;
  category: 'Warm-up' | 'Strength' | 'Rehab' | 'PVD' | 'Med Ball' | 'Gym';
  description: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  youtubeId: string;
  instructions: string[];
  keyPoints: string[];
  equipment: string[];
  targetMuscles: string[];
}

export const videoExercises: VideoExercise[] = [
  {
    id: '1',
    title: 'Dynamic Warm-up Routine',
    category: 'Warm-up',
    description: 'Essential warm-up exercises to prepare your body for pole vault training',
    difficulty: 1,
    duration: '8:30',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Start with 5 minutes of light jogging',
      'Perform leg swings - 10 each direction',
      'Do arm circles - 10 forward, 10 backward',
      'Complete walking lunges for 20 meters',
      'Finish with high knees for 30 seconds'
    ],
    keyPoints: [
      'Keep movements controlled and smooth',
      'Gradually increase range of motion',
      'Focus on proper form over speed',
      'Listen to your body'
    ],
    equipment: ['Open space', 'Comfortable athletic wear'],
    targetMuscles: ['Hip flexors', 'Glutes', 'Calves', 'Shoulders']
  },
  {
    id: '2',
    title: 'Core Strengthening Circuit',
    category: 'Strength',
    description: 'Build the core strength essential for pole vault technique',
    difficulty: 2,
    duration: '12:15',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Plank hold for 30 seconds',
      'Russian twists - 20 reps',
      'Dead bug exercise - 10 each side',
      'Mountain climbers - 30 seconds',
      'Repeat circuit 3 times with 1 minute rest'
    ],
    keyPoints: [
      'Maintain proper spinal alignment',
      'Breathe steadily throughout',
      'Quality over quantity',
      'Engage deep core muscles'
    ],
    equipment: ['Exercise mat', 'Water bottle'],
    targetMuscles: ['Rectus abdominis', 'Obliques', 'Transverse abdominis', 'Hip flexors']
  },
  {
    id: '3',
    title: 'Shoulder Rehabilitation',
    category: 'Rehab',
    description: 'Gentle exercises for shoulder recovery and injury prevention',
    difficulty: 1,
    duration: '6:45',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Arm circles - start small, gradually increase',
      'Wall slides - 15 repetitions',
      'External rotation with band - 12 reps',
      'Pendulum swings - 10 each direction',
      'Gentle cross-body stretches'
    ],
    keyPoints: [
      'Stop if you feel pain',
      'Move slowly and controlled',
      'Focus on pain-free range of motion',
      'Ice after session if needed'
    ],
    equipment: ['Resistance band', 'Wall space'],
    targetMuscles: ['Deltoids', 'Rotator cuff', 'Rhomboids', 'Trapezius']
  },
  {
    id: '4',
    title: 'PVD Technique Drills',
    category: 'PVD',
    description: 'Progressive vault drills for technique development',
    difficulty: 3,
    duration: '15:20',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Set up proper runway approach',
      'Practice plant and takeoff sequence',
      'Work on pole drop timing',
      'Focus on swing-up mechanics',
      'Complete with landing preparation'
    ],
    keyPoints: [
      'Always use proper safety equipment',
      'Start with lower heights',
      'Maintain consistent approach speed',
      'Keep pole tip stable at plant'
    ],
    equipment: ['Pole vault pole', 'Landing pit', 'Standards', 'Safety gear'],
    targetMuscles: ['Full body coordination', 'Core', 'Shoulders', 'Legs']
  },
  {
    id: '5',
    title: 'Medicine Ball Power Training',
    category: 'Med Ball',
    description: 'Explosive power development using medicine ball exercises',
    difficulty: 2,
    duration: '10:30',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Overhead slam - 8 reps',
      'Rotational throws - 6 each side',
      'Chest pass against wall - 10 reps',
      'Single leg RDL with ball - 8 each leg',
      'Rest 90 seconds between exercises'
    ],
    keyPoints: [
      'Use full body in each movement',
      'Focus on explosive power',
      'Control the eccentric phase',
      'Maintain proper posture'
    ],
    equipment: ['Medicine ball (8-12 lbs)', 'Wall or partner', 'Open space'],
    targetMuscles: ['Core', 'Shoulders', 'Glutes', 'Hamstrings']
  },
  {
    id: '6',
    title: 'Gym Strength Fundamentals',
    category: 'Gym',
    description: 'Essential gym exercises for pole vault strength development',
    difficulty: 2,
    duration: '18:00',
    youtubeId: 'dQw4w9WgXcQ',
    instructions: [
      'Squats - 3 sets of 8-10 reps',
      'Pull-ups - 3 sets to failure',
      'Overhead press - 3 sets of 6-8 reps',
      'Romanian deadlifts - 3 sets of 8 reps',
      'Rest 2-3 minutes between sets'
    ],
    keyPoints: [
      'Use proper form before adding weight',
      'Control the movement tempo',
      'Progressive overload principle',
      'Track your progress'
    ],
    equipment: ['Barbell', 'Weight plates', 'Pull-up bar', 'Squat rack'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Lats', 'Deltoids', 'Hamstrings']
  }
];

export const categories = ['All', 'Warm-up', 'Strength', 'Rehab', 'PVD', 'Med Ball', 'Gym'] as const;
