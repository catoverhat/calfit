import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ComponentTokens, DesignColors, SemanticColors } from '@/theme/tokens';

import { styles } from '../body-measurements-screen.styles';

export type HistoryMeasurement = {
  bmi: string;
  bodyFat: string;
  date: string;
  weight: string;
};

export function BodyMeasurementForm({
  bmi,
  bodyFat,
  date,
  onAdd,
  onBmiChange,
  onBodyFatChange,
  onDateChange,
  onWeightChange,
  weight,
}: {
  bmi: string;
  bodyFat: string;
  date: string;
  onAdd: () => void;
  onBmiChange: (value: string) => void;
  onBodyFatChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  weight: string;
}) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Add Measurement</Text>
      <View style={styles.fields}>
        <MeasurementInput
          accessibilityLabel="Measurement date"
          icon
          label="Measurement Date"
          onChangeText={onDateChange}
          value={date}
        />
        <MeasurementInput
          accessibilityLabel="Weight in kilograms"
          keyboardType="decimal-pad"
          label="Weight (kg)"
          onChangeText={onWeightChange}
          placeholder="0.0"
          value={weight}
        />
        <MeasurementInput
          accessibilityLabel="BMI"
          keyboardType="decimal-pad"
          label="BMI"
          onChangeText={onBmiChange}
          placeholder="0.0"
          value={bmi}
        />
        <MeasurementInput
          accessibilityLabel="Body fat percentage"
          keyboardType="decimal-pad"
          label="Body Fat %"
          onChangeText={onBodyFatChange}
          placeholder="0.0"
          value={bodyFat}
        />
      </View>
      <Pressable
        accessibilityLabel="Add measurement"
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={16} />
        <Text style={styles.addButtonText}>Add Measurement</Text>
      </Pressable>
    </View>
  );
}

export function BodyMeasurementHistory({ history }: { history: HistoryMeasurement[] }) {
  return (
    <View style={styles.historyBlock}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>History</Text>
        <Pressable
          accessibilityLabel="View all measurements"
          accessibilityRole="button"
          style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      <View style={styles.historyList}>
        {history.map((measurement, index) => (
          <HistoryRow key={`${measurement.date}-${index}`} measurement={measurement} />
        ))}
      </View>
    </View>
  );
}

export function MeasurementInput({
  accessibilityLabel,
  icon = false,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  value,
}: {
  accessibilityLabel: string;
  icon?: boolean;
  keyboardType?: 'decimal-pad' | 'default';
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputShell}>
        {icon ? <AppIcon color={SemanticColors.action} name="today" size={16} /> : null}
        <TextInput
          accessibilityLabel={accessibilityLabel}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={SemanticColors.textMuted}
          selectionColor={ComponentTokens.input.selectionColor}
          style={[styles.input, icon && styles.inputWithIcon]}
          value={value}
        />
        {icon ? <AppIcon color={SemanticColors.textPrimary} name="today" size={14} /> : null}
      </View>
    </View>
  );
}

export function HistoryRow({ measurement }: { measurement: HistoryMeasurement }) {
  return (
    <Pressable
      accessibilityLabel={`${measurement.date}, ${measurement.weight}, body fat ${measurement.bodyFat}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.historyRow, pressed && styles.pressed]}>
      <View style={styles.historyIcon}>
        <AppIcon color={SemanticColors.actionSoft} name="today" size={17} />
      </View>
      <View style={styles.historyCopy}>
        <Text style={styles.historyDate}>{measurement.date}</Text>
        <Text style={styles.historyWeight}>Weight: {measurement.weight}</Text>
      </View>
      <View style={styles.historyStats}>
        <Text style={styles.bodyFat}>BF%: {measurement.bodyFat}</Text>
        <Text style={styles.bmi}>BMI: {measurement.bmi}</Text>
      </View>
    </Pressable>
  );
}
