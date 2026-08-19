import { styles } from './routine-editor-screen.styles';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  RoutineEditorFooter,
  RoutineExerciseSection,
  RoutineIdentitySection,
} from './components/routine-editor-sections';
import {
  type EditableExercise,
} from './components/routine-exercise-card';

type RoutineEditorScreenProps = {
  mode: 'create' | 'edit';
  routineId?: string;
};

const initialExercises: EditableExercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    sets: '4',
    reps: '8-10',
    weight: '85',
    speed: '-',
    dist: '-',
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    sets: '3',
    reps: '12',
    weight: '40',
    speed: '-',
    dist: '-',
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    sets: '3',
    reps: 'AMRAP',
    weight: 'BW',
    speed: '-',
    dist: '-',
  },
];

export function RoutineEditorScreen({ mode, routineId }: RoutineEditorScreenProps) {
  const [active, setActive] = useState(true);
  const [routineName, setRoutineName] = useState('Hypertrophy A');
  const [description, setDescription] = useState(
    'Focus on high intensity and 2-second eccentric phases. Targets chest and shoulders.'
  );
  const [exercises, setExercises] = useState(initialExercises);

  const deleteExercise = (id: string) => {
    setExercises((items) => items.filter((item) => item.id !== id));
  };

  const saveRoutine = () => {
    router.replace('/routines');
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.content}>
        <RoutineIdentitySection
          active={active}
          description={description}
          mode={mode}
          onActiveChange={setActive}
          onDescriptionChange={setDescription}
          onNameChange={setRoutineName}
          routineId={routineId}
          routineName={routineName}
        />
        <RoutineExerciseSection
          exercises={exercises}
          onAdd={() => router.push('/routines/add-exercise')}
          onDelete={deleteExercise}
        />
        <RoutineEditorFooter onSave={saveRoutine} />
      </View>
    </ScrollView>
  );
}
