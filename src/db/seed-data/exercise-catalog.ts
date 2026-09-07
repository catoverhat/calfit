export type ExerciseMuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders';
export type ExerciseCatalogCategory = 'Strength' | 'Cardio' | 'Mobility';

export type ExerciseCatalogItem = {
  catalogCategory: ExerciseCatalogCategory;
  equipment: string;
  id: string;
  imageUrl: string;
  muscleGroup: ExerciseMuscleGroup;
  name: string;
  tags: readonly string[];
};

export const EXERCISE_CATALOG = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    catalogCategory: 'Strength',
    equipment: 'Barbell',
    imageUrl:
      'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Barbell'],
  },
  {
    id: 'squat',
    name: 'Squat',
    muscleGroup: 'Legs',
    catalogCategory: 'Strength',
    equipment: 'Barbell',
    imageUrl:
      'https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Legs'],
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    muscleGroup: 'Back',
    catalogCategory: 'Strength',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Back'],
  },
  {
    id: 'running',
    name: 'Running',
    muscleGroup: 'Legs',
    catalogCategory: 'Cardio',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    tags: ['Cardio', 'High Intensity'],
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    muscleGroup: 'Chest',
    catalogCategory: 'Strength',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Dumbbell'],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    catalogCategory: 'Strength',
    equipment: 'Machine',
    imageUrl:
      'https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Machine'],
  },
  {
    id: 'shoulder-mobility',
    name: 'Shoulder Mobility',
    muscleGroup: 'Shoulders',
    catalogCategory: 'Mobility',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=85',
    tags: ['Mobility', 'Shoulders'],
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    muscleGroup: 'Chest',
    catalogCategory: 'Strength',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Bodyweight'],
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    catalogCategory: 'Strength',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Dumbbell'],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'Legs',
    catalogCategory: 'Strength',
    equipment: 'Barbell',
    imageUrl:
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Hamstrings'],
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'Legs',
    catalogCategory: 'Strength',
    equipment: 'Machine',
    imageUrl:
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Calves'],
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroup: 'Legs',
    catalogCategory: 'Strength',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Dumbbell'],
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Press',
    muscleGroup: 'Chest',
    catalogCategory: 'Strength',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Dumbbell'],
  },
  {
    id: 'single-arm-row',
    name: 'Single-arm Row',
    muscleGroup: 'Back',
    catalogCategory: 'Strength',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=900&q=85',
    tags: ['Strength', 'Back'],
  },
  {
    id: 'warm-up-jog',
    name: 'Warm-up Jog',
    muscleGroup: 'Legs',
    catalogCategory: 'Cardio',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=900&q=85',
    tags: ['Cardio', 'Warm-up'],
  },
  {
    id: 'tempo-run',
    name: 'Tempo Run',
    muscleGroup: 'Legs',
    catalogCategory: 'Cardio',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=900&q=85',
    tags: ['Cardio', 'Running'],
  },
  {
    id: 'cooldown-walk',
    name: 'Cooldown Walk',
    muscleGroup: 'Legs',
    catalogCategory: 'Mobility',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=900&q=85',
    tags: ['Mobility', 'Cooldown'],
  },
] as const satisfies readonly ExerciseCatalogItem[];
