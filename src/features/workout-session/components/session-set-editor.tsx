import { useAppTheme } from '@/theme/app-theme-provider';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';

import type {
  WorkoutMetricField,
  WorkoutSessionExerciseViewModel,
  WorkoutSessionSetViewModel,
  WorkoutSessionViewModel,
} from '../workout-session.viewmodel';
import { useStyles } from '../active-workout-session-screen.styles';

export function SessionSetEditor({
  exercise,
  onBlurField,
  onToggleSet,
  onUpdateField,
  saveErrors,
  sets,
  units,
}: {
  exercise: WorkoutSessionExerciseViewModel;
  onBlurField: (setId: string) => void;
  onToggleSet: (setId: string) => void;
  onUpdateField: (setId: string, field: WorkoutMetricField, value: string) => void;
  saveErrors: Record<string, string>;
  sets: Record<string, WorkoutSessionSetViewModel>;
  units: Pick<WorkoutSessionViewModel, 'distanceUnit' | 'speedUnit' | 'weightUnit'>;
}) {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  return (
    <View style={styles.setList}>
      {exercise.sets.map((sourceSet) => {
        const set = sets[sourceSet.id];
        return (
          <View key={set.id} style={[styles.dynamicSetCard, set.completed && styles.dynamicSetCardCompleted]}>
            <View style={styles.dynamicSetHeader}>
              <View style={styles.setNumber}>
                <Text style={styles.setNumberText}>{set.setNumber}</Text>
              </View>
              <Text style={styles.dynamicSetLabel}>SET {set.setNumber}</Text>
              <Pressable
                accessibilityLabel={`${set.completed ? 'Reopen' : 'Complete'} set ${set.setNumber}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: set.completed }}
                onPress={() => onToggleSet(set.id)}
                style={({ pressed }) => [
                  styles.setCheckButton,
                  !set.completed && styles.setCheckButtonInactive,
                  pressed && styles.pressed,
                ]}>
                <AppIcon
                  color={set.completed ? DesignColors.primaryFixed : SemanticColors.textMuted}
                  name="check"
                  size={16}
                />
              </Pressable>
            </View>
            <View style={styles.dynamicFieldRow}>
              {set.fields.map((field) => (
                <MetricInput
                  field={field}
                  key={field}
                  onBlur={() => onBlurField(set.id)}
                  onChange={(value) => onUpdateField(set.id, field, value)}
                  set={set}
                  units={units}
                />
              ))}
            </View>
            {saveErrors[set.id] ? <Text style={styles.setError}>{saveErrors[set.id]}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

function MetricInput({ field, onBlur, onChange, set, units }: {
  field: WorkoutMetricField;
  onBlur: () => void;
  onChange: (value: string) => void;
  set: WorkoutSessionSetViewModel;
  units: Pick<WorkoutSessionViewModel, 'distanceUnit' | 'speedUnit' | 'weightUnit'>;
}) {
  const { scheme } = useAppTheme();
  const styles = useStyles();
  const { SemanticColors, ComponentTokens } = useAppTheme();
  const labels: Record<WorkoutMetricField, string> = {
    reps: 'Reps',
    weight: `Weight (${units.weightUnit})`,
    speed: `Speed (${units.speedUnit === 'kmh' ? 'km/h' : 'mph'})`,
    duration: 'Duration (sec)',
    distance: `Distance (${units.distanceUnit})`,
  };
  return (
    <View style={styles.dynamicField}>
      <Text style={styles.dynamicFieldLabel}>{labels[field]}</Text>
      <TextInput keyboardAppearance={scheme}
        accessibilityLabel={`${labels[field]} for set ${set.setNumber}`}
        keyboardType={field === 'reps' || field === 'duration' ? 'number-pad' : 'decimal-pad'}
        onBlur={onBlur}
        onChangeText={onChange}
        placeholder="—"
        placeholderTextColor={SemanticColors.textMuted}
        selectionColor={ComponentTokens.input.selectionColor}
        style={styles.dynamicInput}
        value={set[field]}
      />
    </View>
  );
}
