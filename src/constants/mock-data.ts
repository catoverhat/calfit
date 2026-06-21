export const MOCK_USER = {
  name: 'Alex',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
} as const;

export const MOCK_WORKOUTS = [
  {
    id: 'full-body-power',
    title: 'Full Body Power',
    duration: '45 mins',
    intensity: 'Intense',
    imageUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85',
    description: 'A strength-focused session built around powerful compound movements.',
    exercises: [
      { id: 'goblet-squat', name: 'Goblet Squat', sets: 4, reps: '10 reps' },
      { id: 'dumbbell-press', name: 'Dumbbell Press', sets: 4, reps: '8 reps' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 3, reps: '12 reps' },
    ],
  },
] as const;
