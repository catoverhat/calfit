import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { SemanticColors } from '@/theme/tokens';
import { RoutineEditorFooter, RoutineExerciseSection, RoutineIdentitySection } from './components/routine-editor-sections';
import { styles } from './routine-editor-screen.styles';
import { useRoutineEditor } from './use-routine-editor';

export function RoutineEditorScreen({ mode, plannedDate, routineId }: { mode: 'create' | 'edit'; plannedDate?: string; routineId?: string }) {
  const editor = useRoutineEditor({ mode, plannedDate, routineId });

  if (editor.isLoading || !editor.draft) {
    return <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.stateContent} style={styles.screen}><ActivityIndicator color={SemanticColors.action} size="large" /><ThemedText style={styles.stateText}>{editor.error ?? 'Loading workout editor…'}</ThemedText></ScrollView>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <RoutineIdentitySection draft={editor.draft} mode={mode} setDraftField={editor.setDraftField} />
          <RoutineExerciseSection
            addTarget={editor.addTarget}
            exercises={editor.draft.exercises}
            moveExercise={editor.moveExercise}
            onAdd={() => router.push('/workouts/add-exercise')}
            removeExercise={editor.removeExercise}
            removeTarget={editor.removeTarget}
            units={editor.units}
            updateTarget={editor.updateTarget}
          />
          {editor.error ? <View style={styles.errorBanner}><ThemedText style={styles.errorText}>{editor.error}</ThemedText></View> : null}
          <RoutineEditorFooter isSaving={editor.isSaving} onSave={editor.save} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
