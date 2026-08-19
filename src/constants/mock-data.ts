export const MOCK_USER = {
  name: 'Alex',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
} as const;

export const MOCK_WORKOUTS = [
  {
    id: 'push-day',
    title: 'Push Day',
    duration: '45 mins',
    intensity: 'Intense',
    imageUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85',
    description: 'Focus on chest, shoulders, and triceps with heavy compound movements.',
    exercises: [
      { id: 'bench-press', name: 'Bench Press', sets: 4, reps: '8-10 reps' },
      { id: 'shoulder-press', name: 'Shoulder Press', sets: 3, reps: '12 reps' },
      { id: 'push-ups', name: 'Push-ups', sets: 3, reps: 'AMRAP' },
    ],
  },
  {
    id: 'leg-day',
    title: 'Leg Day',
    duration: '50 mins',
    intensity: 'Heavy',
    imageUrl:
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=1200&q=85',
    description: 'High volume hypertrophy for quads, hamstrings, and calves.',
    exercises: [
      { id: 'back-squat', name: 'Back Squat', sets: 4, reps: '6-8 reps' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 4, reps: '10 reps' },
      { id: 'calf-raise', name: 'Standing Calf Raise', sets: 4, reps: '15 reps' },
    ],
  },
  {
    id: 'full-body-power',
    title: 'Full Body',
    duration: '40 mins',
    intensity: 'Conditioning',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85',
    description: 'Efficient full body conditioning for busy days.',
    exercises: [
      { id: 'goblet-squat', name: 'Goblet Squat', sets: 4, reps: '10 reps' },
      { id: 'dumbbell-press', name: 'Dumbbell Press', sets: 4, reps: '8 reps' },
      { id: 'row', name: 'Single-arm Row', sets: 3, reps: '12 reps' },
    ],
  },
  {
    id: 'running-day',
    title: 'Running Day',
    duration: '35 mins',
    intensity: 'Cardio',
    imageUrl:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1200&q=85',
    description: '5km tempo run or interval training for cardiovascular endurance.',
    exercises: [
      { id: 'warm-up', name: 'Warm-up Jog', sets: 1, reps: '8 mins' },
      { id: 'tempo-run', name: 'Tempo Run', sets: 1, reps: '5 km' },
      { id: 'cooldown', name: 'Cooldown Walk', sets: 1, reps: '5 mins' },
    ],
  },
] as const;
