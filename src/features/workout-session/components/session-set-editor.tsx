import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ComponentTokens, DesignColors, SemanticColors } from '@/theme/tokens';
import { styles } from '../active-workout-session-screen.styles';

const completedSetRows = [
  { id: 1, reps: '10 reps', weight: '135 lb' },
  { id: 2, reps: '8 reps', weight: '145 lb' },
] as const;

export function SessionSetEditor({
  completedSets,
  currentReps,
  currentSetDone,
  currentWeight,
  onCurrentRepsChange,
  onCurrentSetDoneChange,
  onCurrentWeightChange,
  onToggleCompletedSet,
}: {
  completedSets: Set<number>;
  currentReps: string;
  currentSetDone: boolean;
  currentWeight: string;
  onCurrentRepsChange: (value: string) => void;
  onCurrentSetDoneChange: (done: boolean) => void;
  onCurrentWeightChange: (value: string) => void;
  onToggleCompletedSet: (setId: number) => void;
}) {
  return (
    <View style={styles.setList}>
      {completedSetRows.map((setRow) => {
        const completed = completedSets.has(setRow.id);

        return (
          <View key={setRow.id} style={styles.completedSetRow}>
            <View style={styles.setNumber}>
              <Text style={styles.setNumberText}>{setRow.id}</Text>
            </View>
            <Text style={styles.setValue}>{setRow.weight}</Text>
            <Text style={styles.setValue}>{setRow.reps}</Text>
            <Pressable
              accessibilityLabel={`Toggle set ${setRow.id}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: completed }}
              onPress={() => onToggleCompletedSet(setRow.id)}
              style={({ pressed }) => [
                styles.setCheckButton,
                !completed && styles.setCheckButtonInactive,
                pressed && styles.pressed,
              ]}>
              <AppIcon
                color={completed ? DesignColors.primaryFixed : SemanticColors.textMuted}
                name="check"
                size={16}
              />
            </Pressable>
          </View>
        );
      })}
      <View style={styles.currentSetRow}>
        <View style={styles.currentSetNumber}>
          <Text style={styles.currentSetNumberText}>3</Text>
        </View>
        <TextInput
          accessibilityLabel="Current set weight"
          keyboardType="number-pad"
          onChangeText={onCurrentWeightChange}
          selectionColor={ComponentTokens.input.selectionColor}
          style={styles.currentInput}
          value={currentWeight}
        />
        <Text style={styles.multiplyText}>x</Text>
        <TextInput
          accessibilityLabel="Current set repetitions"
          keyboardType="number-pad"
          onChangeText={onCurrentRepsChange}
          selectionColor={ComponentTokens.input.selectionColor}
          style={styles.currentInput}
          value={currentReps}
        />
        <Pressable
          accessibilityLabel="Complete current set"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: currentSetDone }}
          onPress={() => onCurrentSetDoneChange(!currentSetDone)}
          style={({ pressed }) => [
            styles.currentToggle,
            currentSetDone && styles.currentToggleDone,
            pressed && styles.pressed,
          ]}>
          <AppIcon
            color={currentSetDone ? DesignColors.onPrimaryContainer : DesignColors.primaryFixed}
            name={currentSetDone ? 'check' : 'stop'}
            size={16}
          />
        </Pressable>
      </View>
    </View>
  );
}
