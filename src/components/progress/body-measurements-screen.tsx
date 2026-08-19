import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { AppIcon } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/constants/mock-data';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Spacing,
  TouchTarget,
  Typography,
} from '@/constants/theme';

type HistoryMeasurement = {
  bmi: string;
  bodyFat: string;
  date: string;
  weight: string;
};

type LineSegment = {
  left: `${number}%`;
  rotate: `${number}deg`;
  top: `${number}%`;
  width: number;
};

const trendSegments = [
  { left: '7%', top: '59%', width: 54, rotate: '-10deg' },
  { left: '24%', top: '50%', width: 58, rotate: '-13deg' },
  { left: '42%', top: '43%', width: 58, rotate: '-5deg' },
  { left: '60%', top: '45%', width: 54, rotate: '10deg' },
  { left: '75%', top: '53%', width: 42, rotate: '-2deg' },
  { left: '86%', top: '47%', width: 48, rotate: '-27deg' },
] satisfies LineSegment[];

const initialMeasurements = [
  { bmi: '23.8', bodyFat: '14.2%', date: 'Oct 24, 2023', weight: '82.8 kg' },
  { bmi: '23.5', bodyFat: '14.5%', date: 'Oct 17, 2023', weight: '83.5 kg' },
  { bmi: '23.2', bodyFat: '14.4%', date: 'Oct 10, 2023', weight: '83.2 kg' },
] satisfies HistoryMeasurement[];

export function BodyMeasurementsScreen() {
  const [date, setDate] = useState('10/27/2023');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [history, setHistory] = useState<HistoryMeasurement[]>(initialMeasurements);

  const addMeasurement = () => {
    setHistory((current) => [
      {
        bmi: bmi || '0.0',
        bodyFat: bodyFat ? `${bodyFat}%` : '0.0%',
        date: date || 'Today',
        weight: weight ? `${weight} kg` : '0.0 kg',
      },
      ...current,
    ]);
    setWeight('');
    setBmi('');
    setBodyFat('');
  };

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync body measurements"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <View style={styles.trendBlock}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.label}>Weight Trend</Text>
              <View style={styles.weightRow}>
                <Text style={styles.weightValue}>82.4</Text>
                <Text style={styles.weightUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.deltaPill}>
              <Text style={styles.deltaText}>-1.2 kg this month</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <LinePlot segments={trendSegments} style={styles.trendPlot} />
            <View style={styles.highlightPoint} />
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Week 1</Text>
              <Text style={styles.chartLabel}>Week 2</Text>
              <Text style={styles.chartLabel}>Week 3</Text>
              <Text style={styles.chartLabel}>Today</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add Measurement</Text>

          <View style={styles.fields}>
            <MeasurementInput
              accessibilityLabel="Measurement date"
              icon
              label="Measurement Date"
              onChangeText={setDate}
              value={date}
            />
            <MeasurementInput
              accessibilityLabel="Weight in kilograms"
              keyboardType="decimal-pad"
              label="Weight (kg)"
              onChangeText={setWeight}
              placeholder="0.0"
              value={weight}
            />
            <MeasurementInput
              accessibilityLabel="BMI"
              keyboardType="decimal-pad"
              label="BMI"
              onChangeText={setBmi}
              placeholder="0.0"
              value={bmi}
            />
            <MeasurementInput
              accessibilityLabel="Body fat percentage"
              keyboardType="decimal-pad"
              label="Body Fat %"
              onChangeText={setBodyFat}
              placeholder="0.0"
              value={bodyFat}
            />
          </View>

          <Pressable
            accessibilityLabel="Add measurement"
            accessibilityRole="button"
            onPress={addMeasurement}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
            <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={16} />
            <Text style={styles.addButtonText}>Add Measurement</Text>
          </Pressable>
        </View>

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
      </View>
    </TabScreen>
  );
}

function MeasurementInput({
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

function HistoryRow({ measurement }: { measurement: HistoryMeasurement }) {
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

function LinePlot({
  segments,
  style,
}: {
  segments: readonly LineSegment[];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.linePlot, style]}>
      {segments.map((segment, index) => (
        <View
          key={`${segment.left}-${index}`}
          style={[
            styles.lineSegment,
            {
              left: segment.left,
              top: segment.top,
              transform: [{ rotate: segment.rotate }],
              width: segment.width,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  trendBlock: {
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  trendHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  weightRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  weightValue: {
    ...Typography['2xl'],
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 32,
  },
  weightUnit: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  deltaPill: {
    backgroundColor: 'rgba(255, 95, 31, 0.16)',
    borderColor: 'rgba(255, 95, 31, 0.32)',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  deltaText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
  },
  chartCard: {
    backgroundColor: '#3A2119',
    borderColor: 'rgba(255, 95, 31, 0.16)',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    minHeight: 180,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  linePlot: {
    minHeight: 112,
    position: 'relative',
  },
  trendPlot: {
    minHeight: 118,
  },
  lineSegment: {
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 2,
    position: 'absolute',
  },
  highlightPoint: {
    backgroundColor: SemanticColors.action,
    borderColor: DesignColors.primaryFixedDim,
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 8,
    left: '49%',
    position: 'absolute',
    top: '44%',
    width: 8,
  },
  chartLabels: {
    bottom: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: Spacing.three,
    position: 'absolute',
    right: Spacing.three,
  },
  chartLabel: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
  },
  formCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  formTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  fields: {
    gap: Spacing.two,
  },
  fieldBlock: {
    gap: Spacing.one,
  },
  inputLabel: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 52,
    paddingHorizontal: Spacing.two,
  },
  input: {
    color: SemanticColors.textPrimary,
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 50,
    padding: 0,
  },
  inputWithIcon: {
    color: SemanticColors.textPrimary,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
  },
  addButtonPressed: {
    backgroundColor: DesignColors.inversePrimary,
    transform: [{ scale: 0.99 }],
  },
  addButtonText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  historyBlock: {
    gap: Spacing.two,
  },
  historyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  viewAllButton: {
    minHeight: 32,
    paddingHorizontal: Spacing.one,
    justifyContent: 'center',
  },
  viewAllText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  historyList: {
    gap: Spacing.two,
  },
  historyRow: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 72,
    padding: Spacing.two,
  },
  historyIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.12)',
    borderColor: 'rgba(255, 95, 31, 0.24)',
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  historyCopy: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  historyDate: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  historyWeight: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  historyStats: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  bodyFat: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  bmi: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
