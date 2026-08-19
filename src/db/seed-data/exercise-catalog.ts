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
] as const satisfies readonly ExerciseCatalogItem[];
