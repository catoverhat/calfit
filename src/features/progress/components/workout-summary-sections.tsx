import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { ComponentTokens, DesignColors, SemanticColors } from '@/theme/tokens';
import { styles } from '../workout-summary-screen.styles';

const summaryStats = [
  { icon: 'timer', label: 'Duration', value: '52m' },
  { icon: 'strength', label: 'Exercises', value: '6' },
  { icon: 'sets', label: 'Total Sets', value: '18' },
  { icon: 'volume', label: 'Total Volume', value: '12,450 lb' },
] satisfies { icon: AppIconName; label: string; value: string }[];

const intensityBars = [
  { height: 54, tone: 'muted' },
  { height: 116, tone: 'active' },
  { height: 82, tone: 'muted' },
  { height: 128, tone: 'active' },
  { height: 68, tone: 'muted' },
  { height: 100, tone: 'active' },
] as const;

export function WorkoutSummaryHero() {
  return (
    <View style={styles.heroBlock}>
      <View style={styles.endedPill}>
        <AppIcon color={SemanticColors.action} name="trophy" size={14} />
        <Text style={styles.endedText}>Workout Session Ended</Text>
      </View>
      <Text style={styles.title}>Workout Completed!</Text>
      <View style={styles.checkRing}>
        <AppIcon color={SemanticColors.action} name="check" size={26} />
      </View>
      <Text style={styles.subtitle}>
        You&apos;ve reached your goals for today.{'\n'}Discipline pays off.
      </Text>
    </View>
  );
}

export function WorkoutSummaryStats() {
  return (
    <View style={styles.statsGrid}>
      {summaryStats.map((stat) => (
        <View key={stat.label} style={styles.statCard}>
          <AppIcon color={SemanticColors.action} name={stat.icon} size={18} />
          <View style={styles.statCopy}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function PersonalRecordSummary() {
  return (
    <View style={styles.recordCard}>
      <View style={styles.sectionTitleRow}>
        <AppIcon color={SemanticColors.action} name="star" size={20} />
        <Text style={styles.recordTitle}>New Personal Record</Text>
      </View>
      <Text style={styles.recordDescription}>
        You hit a new PR on Barbell Deadlift. Your volume increased by 12% compared to last
        week&apos;s session.
      </Text>
      <View style={styles.prRow}>
        <View style={styles.prBox}>
          <Text style={styles.prLabel}>Previous Best</Text>
          <Text style={styles.prValue}>315 lb</Text>
        </View>
        <View style={[styles.prBox, styles.prBoxActive]}>
          <Text style={styles.prLabelActive}>Today&apos;s PR</Text>
          <Text style={styles.prValueActive}>335 lb</Text>
        </View>
      </View>
    </View>
  );
}

export function WorkoutNotesSection({
  notes,
  onNotesChange,
}: {
  notes: string;
  onNotesChange: (notes: string) => void;
}) {
  return (
    <View style={styles.notesBlock}>
      <View style={styles.sectionTitleRow}>
        <AppIcon color={SemanticColors.textPrimary} name="notes" size={17} />
        <Text style={styles.notesTitle}>Workout Notes</Text>
      </View>
      <TextInput
        accessibilityLabel="Workout notes"
        multiline
        numberOfLines={4}
        onChangeText={onNotesChange}
        placeholder="How did you feel? Note any adjustments for next time..."
        placeholderTextColor={DesignColors.onSecondaryContainer}
        selectionColor={ComponentTokens.input.selectionColor}
        style={styles.notesInput}
        textAlignVertical="top"
        value={notes}
      />
    </View>
  );
}

export function WorkoutSummaryActions({
  onHistory,
  onSave,
}: {
  onHistory: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityLabel="Save workout"
        accessibilityRole="button"
        onPress={onSave}
        style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="save" size={16} />
        <Text style={styles.saveText}>Save Workout</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="View workout history"
        accessibilityRole="button"
        onPress={onHistory}
        style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}>
        <AppIcon color={SemanticColors.action} name="history" size={17} />
        <Text style={styles.historyText}>View History</Text>
      </Pressable>
    </View>
  );
}

export function IntensityDistributionChart() {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Intensity Distribution</Text>
        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      <View style={styles.chartPlot}>
        <View style={styles.barRow}>
          {intensityBars.map((bar, index) => (
            <View
              key={`${bar.tone}-${index}`}
              style={[
                styles.bar,
                {
                  backgroundColor:
                    bar.tone === 'active'
                      ? SemanticColors.action
                      : DesignColors.surfaceContainerHighest,
                  height: bar.height,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>Start</Text>
          <Text style={styles.chartLabel}>Peak</Text>
          <Text style={styles.chartLabel}>End</Text>
        </View>
      </View>
    </View>
  );
}
