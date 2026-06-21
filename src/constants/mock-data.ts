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

export type WeightTimeframe = '7W' | '1M' | '3M';

export const MOCK_PROGRESS = {
  goal: {
    remainingWorkouts: 2,
    title: "You're 2 workouts away from your monthly goal!",
    detail: 'Keep up the momentum.',
  },
  weightTrends: {
    '7W': {
      axisLabels: ['Mon', 'Wed', 'Fri', 'Sun'],
      values: [172.2, 172.8, 173.1, 175.4, 178.1, 180.1, 182],
    },
    '1M': {
      axisLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [170.8, 171.4, 172.1, 173.6, 175.2, 177.4, 179.3, 182],
    },
    '3M': {
      axisLabels: ['Jul', 'Aug', 'Sep', 'Now'],
      values: [164.5, 166.2, 168.8, 171.1, 173.8, 176.4, 179.5, 182],
    },
  } satisfies Record<
    WeightTimeframe,
    { axisLabels: readonly string[]; values: readonly number[] }
  >,
  heatmap: {
    month: 'September',
    days: [
      { date: 'September 1', intensity: 0 },
      { date: 'September 2', intensity: 0 },
      { date: 'September 3', intensity: 0 },
      { date: 'September 4', intensity: 1 },
      { date: 'September 5', intensity: 0 },
      { date: 'September 6', intensity: 3 },
      { date: 'September 7', intensity: 0 },
      { date: 'September 8', intensity: 1 },
      { date: 'September 9', intensity: 2 },
      { date: 'September 10', intensity: 0 },
      { date: 'September 11', intensity: 0 },
      { date: 'September 12', intensity: 0 },
      { date: 'September 13', intensity: 3 },
      { date: 'September 14', intensity: 2 },
      { date: 'September 15', intensity: 0 },
      { date: 'September 16', intensity: 1 },
      { date: 'September 17', intensity: 0 },
      { date: 'September 18', intensity: 0 },
      { date: 'September 19', intensity: 0 },
      { date: 'September 20', intensity: 0 },
      { date: 'September 21', intensity: 0 },
    ],
  },
  measurements: [
    { id: 'body-fat', icon: 'bodyFat', label: 'Body Fat %', value: '14.2%', change: '↓ 0.5%' },
    { id: 'bicep', icon: 'bicep', label: 'Bicep Size', value: '15.5 in', change: '↑ 0.2 in' },
    { id: 'waist', icon: 'waist', label: 'Waist', value: '32.0 in' },
  ],
} as const;
