import { ExerciseEditorForm } from './components/exercise-editor-form';
import { useExerciseEditor } from './use-exercise-editor';

type ExerciseEditorScreenProps = {
  exerciseId?: string;
  mode: 'create' | 'edit';
  returnTo?: string;
};

export function ExerciseEditorScreen({ exerciseId, mode, returnTo }: ExerciseEditorScreenProps) {
  const { data, error, isLoading, isSaving, saveExercise } = useExerciseEditor({ exerciseId, mode, returnTo });

  return (
    <ExerciseEditorForm
      data={data}
      error={error}
      isLoading={isLoading}
      isSaving={isSaving}
      key={`${mode}-${exerciseId ?? 'new'}-${data.initialValues.name}-${data.initialValues.categoryId ?? 'none'}`}
      mode={mode}
      saveExercise={saveExercise}
    />
  );
}
