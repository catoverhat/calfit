import { useAppTheme } from '@/theme/app-theme-provider';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { DateField } from '@/components/ui/date-field';

import { measurementDateInput, previewBmi, type MeasurementViewItem } from '../progress.viewmodel';
import { useStyles } from '../body-measurements-screen.styles';

export function BodyMeasurementForm({ bmi, bodyFat, date, disabled, error, heightCm, isSaving, onAdd, onBmiChange, onBodyFatChange, onDateChange, onWeightChange, weight, weightUnit }: { bmi: string; bodyFat: string; date: string; disabled: boolean; error: string | null; heightCm: number | null; isSaving: boolean; onAdd: () => void; onBmiChange: (value: string) => void; onBodyFatChange: (value: string) => void; onDateChange: (value: string) => void; onWeightChange: (value: string) => void; weight: string; weightUnit: string }) {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  const quickDates = [{ label: 'Today', value: measurementDateInput(0) }, { label: 'Yesterday', value: measurementDateInput(1) }];
  return (
    <View style={styles.formCard}>
      <Text accessibilityRole="header" style={styles.formTitle}>Add measurement</Text>
      <View style={styles.fields}>
        <View style={styles.quickDates}>
          {quickDates.map((option) => {
            const selected = option.value === date;
            return (
              <Pressable accessibilityLabel={`Measured ${option.label.toLowerCase()}`} accessibilityRole="button" accessibilityState={{ selected }} key={option.label} onPress={() => onDateChange(option.value)} style={({ pressed }) => [styles.quickDate, selected && styles.quickDateSelected, pressed && styles.pressed]}>
                <Text style={[styles.quickDateText, selected && styles.quickDateTextSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.fieldBlock}>
          <Text style={styles.inputLabel}>Date</Text>
          <DateField accessibilityLabel="Measurement date" maximumDate={new Date()} onChange={onDateChange} placeholder="Choose a date" style={styles.inputShell} textStyle={styles.dateText} value={date} />
        </View>
        <MeasurementInput accessibilityLabel={`Weight in ${weightUnit}`} label={`Weight (${weightUnit})`} onChangeText={onWeightChange} placeholder="0.0" value={weight} />
        <BmiField bmi={bmi} heightCm={heightCm} onBmiChange={onBmiChange} weight={weight} weightUnit={weightUnit} />
        <MeasurementInput accessibilityLabel="Body fat percentage" label="Body fat %" onChangeText={onBodyFatChange} placeholder="0.0" value={bodyFat} />
      </View>
      {error ? (
        <View accessibilityRole="alert" style={styles.formError}>
          <AppIcon color={SemanticColors.danger} name="warning" size={16} />
          <Text style={styles.formErrorText}>{error}</Text>
        </View>
      ) : null}
      <Pressable accessibilityLabel="Add measurement" accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onAdd} style={({ pressed }) => [styles.addButton, disabled && styles.disabled, pressed && !disabled && styles.addButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={16} />
        <Text style={styles.addButtonText}>{isSaving ? 'Saving...' : 'Add measurement'}</Text>
      </Pressable>
    </View>
  );
}

export function BodyMeasurementHistory({ history }: { history: MeasurementViewItem[] }) {
  const styles = useStyles();
  return (
    <View style={styles.historyBlock}>
      <Text style={styles.historyTitle}>History</Text>
      {history.length === 0 ? <Text style={styles.emptyText}>No body measurements saved yet.</Text> : <View style={styles.historyList}>{history.map((measurement) => <HistoryRow key={measurement.id} measurement={measurement} />)}</View>}
    </View>
  );
}

const WHO_BMI_URL = 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight';

/** With a profile height BMI is calculated, never typed; without one the manual field stays available. */
function BmiField({ bmi, heightCm, onBmiChange, weight, weightUnit }: { bmi: string; heightCm: number | null; onBmiChange: (value: string) => void; weight: string; weightUnit: string }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const [showInfo, setShowInfo] = useState(false);
  const calculated = previewBmi(weight, weightUnit, heightCm);

  return (
    <View style={styles.fieldBlock}>
      <View style={styles.bmiHeader}>
        <Text style={styles.inputLabel}>BMI</Text>
        <Pressable
          accessibilityLabel="How is BMI calculated?"
          accessibilityRole="button"
          accessibilityState={{ expanded: showInfo }}
          hitSlop={8}
          onPress={() => setShowInfo((value) => !value)}
          style={({ pressed }) => [styles.bmiInfoButton, pressed && styles.pressed]}>
          <AppIcon color={SemanticColors.info} name="info" size={16} />
          <Text style={styles.bmiInfoButtonText}>How is it calculated?</Text>
        </Pressable>
      </View>

      {heightCm ? (
        <View accessible accessibilityLabel={calculated ? `BMI ${calculated}, calculated from your weight and profile height.` : 'BMI is calculated when you enter your weight.'} accessibilityLiveRegion="polite" style={styles.bmiResult}>
          <Text style={[styles.bmiValue, !calculated && styles.bmiValueEmpty]}>{calculated ?? '—'}</Text>
          <Text style={styles.bmiCaption}>
            {calculated ? 'Calculated from your weight and profile height' : 'Enter your weight to calculate BMI'}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.inputShell}>
            <BareInput accessibilityLabel="BMI" onChangeText={onBmiChange} placeholder="0.0" value={bmi} />
          </View>
          <Link href="/profile" asChild>
            <Pressable accessibilityRole="link" style={({ pressed }) => [styles.bmiProfileLink, pressed && styles.pressed]}>
              <Text style={styles.bmiProfileLinkText}>Add your height in Profile to calculate BMI automatically</Text>
              <AppIcon color={SemanticColors.actionSoft} name="chevronRight" size={16} />
            </Pressable>
          </Link>
        </>
      )}

      {showInfo ? (
        <View style={styles.bmiInfo}>
          <Text style={styles.bmiFormula}>BMI = weight (kg) ÷ height (m)²</Text>
          <Text style={styles.bmiInfoText}>
            The formula comes from Adolphe Quetelet&apos;s index of weight to height (1835). Keys and colleagues named it the body mass index in &ldquo;Indices of relative weight and obesity&rdquo;, Journal of Chronic Diseases, 1972. The World Health Organization uses the same formula.
          </Text>
          <Text style={styles.bmiInfoText}>
            BMI does not tell muscle from fat, so it can read high for people who strength train. Calfit shows it as a number only, not as a health assessment.
          </Text>
          <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(WHO_BMI_URL)} style={({ pressed }) => [styles.bmiProfileLink, pressed && styles.pressed]}>
            <Text style={styles.bmiProfileLinkText}>WHO fact sheet on BMI</Text>
            <AppIcon color={SemanticColors.actionSoft} name="open" size={16} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function BareInput({ accessibilityLabel, onChangeText, placeholder, value }: { accessibilityLabel: string; onChangeText: (value: string) => void; placeholder: string; value: string }) {
  const { scheme, SemanticColors, ComponentTokens } = useAppTheme();
  const styles = useStyles();
  return <TextInput keyboardAppearance={scheme} accessibilityLabel={accessibilityLabel} keyboardType="decimal-pad" onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={SemanticColors.textMuted} selectionColor={ComponentTokens.input.selectionColor} style={styles.input} value={value} />;
}

function MeasurementInput({ accessibilityLabel, label, onChangeText, placeholder, value }: { accessibilityLabel: string; label: string; onChangeText: (value: string) => void; placeholder: string; value: string }) {
  const styles = useStyles();
  return <View style={styles.fieldBlock}><Text style={styles.inputLabel}>{label}</Text><View style={styles.inputShell}><BareInput accessibilityLabel={accessibilityLabel} onChangeText={onChangeText} placeholder={placeholder} value={value} /></View></View>;
}

function HistoryRow({ measurement }: { measurement: MeasurementViewItem }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return <View accessible accessibilityLabel={`${measurement.date}. Weight ${measurement.weight}, body fat ${measurement.bodyFat}, BMI ${measurement.bmi}.`} style={styles.historyRow}><View style={styles.historyIcon}><AppIcon color={SemanticColors.actionSoft} name="body" size={17} /></View><View style={styles.historyCopy}><Text style={styles.historyDate}>{measurement.date}</Text><Text style={styles.historyWeight}>Weight: {measurement.weight}</Text></View><View style={styles.historyStats}><Text style={styles.bodyFat}>BF%: {measurement.bodyFat}</Text><Text style={styles.bmi}>BMI: {measurement.bmi}</Text></View></View>;
}
