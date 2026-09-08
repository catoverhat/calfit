import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ComponentTokens, DesignColors, SemanticColors } from '@/theme/tokens';
import type { MeasurementViewItem } from '../progress.viewmodel';
import { styles } from '../body-measurements-screen.styles';

export function BodyMeasurementForm({ bmi, bodyFat, date, disabled, isSaving, onAdd, onBmiChange, onBodyFatChange, onDateChange, onWeightChange, weight, weightUnit }: { bmi: string; bodyFat: string; date: string; disabled: boolean; isSaving: boolean; onAdd: () => void; onBmiChange: (value: string) => void; onBodyFatChange: (value: string) => void; onDateChange: (value: string) => void; onWeightChange: (value: string) => void; weight: string; weightUnit: string }) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Add Measurement</Text>
      <View style={styles.fields}>
        <MeasurementInput accessibilityLabel="Measurement date in YYYY-MM-DD format" icon label="Measurement Date (YYYY-MM-DD)" onChangeText={onDateChange} value={date} />
        <MeasurementInput accessibilityLabel={`Weight in ${weightUnit}`} keyboardType="decimal-pad" label={`Weight (${weightUnit})`} onChangeText={onWeightChange} placeholder="0.0" value={weight} />
        <MeasurementInput accessibilityLabel="BMI" keyboardType="decimal-pad" label="BMI" onChangeText={onBmiChange} placeholder="0.0" value={bmi} />
        <MeasurementInput accessibilityLabel="Body fat percentage" keyboardType="decimal-pad" label="Body Fat %" onChangeText={onBodyFatChange} placeholder="0.0" value={bodyFat} />
      </View>
      <Pressable accessibilityLabel="Add measurement" accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onAdd} style={({ pressed }) => [styles.addButton, disabled && styles.disabled, pressed && !disabled && styles.addButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={16} />
        <Text style={styles.addButtonText}>{isSaving ? 'Saving...' : 'Add Measurement'}</Text>
      </Pressable>
    </View>
  );
}

export function BodyMeasurementHistory({ history }: { history: MeasurementViewItem[] }) {
  return (
    <View style={styles.historyBlock}>
      <Text style={styles.historyTitle}>History</Text>
      {history.length === 0 ? <Text style={styles.emptyText}>No body measurements saved yet.</Text> : <View style={styles.historyList}>{history.map((measurement) => <HistoryRow key={measurement.id} measurement={measurement} />)}</View>}
    </View>
  );
}

function MeasurementInput({ accessibilityLabel, icon = false, keyboardType = 'default', label, onChangeText, placeholder, value }: { accessibilityLabel: string; icon?: boolean; keyboardType?: 'decimal-pad' | 'default'; label: string; onChangeText: (value: string) => void; placeholder?: string; value: string }) {
  return <View style={styles.fieldBlock}><Text style={styles.inputLabel}>{label}</Text><View style={styles.inputShell}>{icon ? <AppIcon color={SemanticColors.action} name="today" size={16} /> : null}<TextInput accessibilityLabel={accessibilityLabel} keyboardType={keyboardType} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={SemanticColors.textMuted} selectionColor={ComponentTokens.input.selectionColor} style={[styles.input, icon && styles.inputWithIcon]} value={value} /></View></View>;
}

function HistoryRow({ measurement }: { measurement: MeasurementViewItem }) {
  return <View accessibilityLabel={`${measurement.date}, ${measurement.weight}, body fat ${measurement.bodyFat}`} style={styles.historyRow}><View style={styles.historyIcon}><AppIcon color={SemanticColors.actionSoft} name="body" size={17} /></View><View style={styles.historyCopy}><Text style={styles.historyDate}>{measurement.date}</Text><Text style={styles.historyWeight}>Weight: {measurement.weight}</Text></View><View style={styles.historyStats}><Text style={styles.bodyFat}>BF%: {measurement.bodyFat}</Text><Text style={styles.bmi}>BMI: {measurement.bmi}</Text></View></View>;
}
