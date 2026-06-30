export type SessionSetSeed = {
  completed: boolean;
  id: string;
  reps: string;
  weight: string;
};

export type SessionExerciseSeed = {
  id: string;
  name: string;
  sessionSets: readonly SessionSetSeed[];
  tip: string;
};

export type SessionSet = SessionSetSeed & {
  number: number;
};

export type SessionExercise = {
  id: string;
  name: string;
  sets: SessionSet[];
  tip: string;
};

export type WorkoutSessionState = {
  currentExerciseIndex: number;
  exercises: SessionExercise[];
};

export type WorkoutSessionAction =
  | { type: 'update-set'; setId: string; field: 'weight' | 'reps'; value: string }
  | { type: 'add-set' }
  | { type: 'finish-set' }
  | { type: 'next-exercise' };

export function createWorkoutSessionState(
  exercises: readonly SessionExerciseSeed[],
): WorkoutSessionState {
  return {
    currentExerciseIndex: 0,
    exercises: exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      tip: exercise.tip,
      sets: exercise.sessionSets.map((set, index) => ({ ...set, number: index + 1 })),
    })),
  };
}

export function getActiveSet(exercise?: SessionExercise): SessionSet | undefined {
  return exercise?.sets.find((set) => !set.completed);
}

export function isExerciseComplete(exercise?: SessionExercise): boolean {
  return Boolean(exercise?.sets.length) && exercise!.sets.every((set) => set.completed);
}

export function workoutSessionReducer(
  state: WorkoutSessionState,
  action: WorkoutSessionAction,
): WorkoutSessionState {
  const currentExercise = state.exercises[state.currentExerciseIndex];
  if (!currentExercise) return state;

  if (action.type === 'next-exercise') {
    if (!isExerciseComplete(currentExercise)) return state;
    if (state.currentExerciseIndex >= state.exercises.length - 1) return state;

    return { ...state, currentExerciseIndex: state.currentExerciseIndex + 1 };
  }

  const activeSet = getActiveSet(currentExercise);

  if (action.type === 'update-set') {
    if (!activeSet || activeSet.id !== action.setId) return state;

    return updateCurrentExercise(state, (exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.id === action.setId ? { ...set, [action.field]: action.value } : set,
      ),
    }));
  }

  if (action.type === 'finish-set') {
    if (!activeSet) return state;

    return updateCurrentExercise(state, (exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.id === activeSet.id ? { ...set, completed: true } : set,
      ),
    }));
  }

  if (action.type === 'add-set') {
    const previous = currentExercise.sets.at(-1);
    const number = currentExercise.sets.length + 1;
    const nextSet: SessionSet = {
      completed: false,
      id: `${currentExercise.id}-${number}`,
      number,
      reps: previous?.reps ?? '8',
      weight: previous?.weight ?? '0',
    };

    return updateCurrentExercise(state, (exercise) => ({
      ...exercise,
      sets: [...exercise.sets, nextSet],
    }));
  }

  return state;
}

function updateCurrentExercise(
  state: WorkoutSessionState,
  update: (exercise: SessionExercise) => SessionExercise,
): WorkoutSessionState {
  return {
    ...state,
    exercises: state.exercises.map((exercise, index) =>
      index === state.currentExerciseIndex ? update(exercise) : exercise,
    ),
  };
}

export function formatSessionDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}
