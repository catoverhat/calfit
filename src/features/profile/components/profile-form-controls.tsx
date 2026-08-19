import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Palette } from '@/theme/tokens';

import { styles } from '../profile-setup-screen.styles';

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type SetupFieldProps = {
  accessory?: ReactNode;
  keyboardType?: 'default' | 'numeric';
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};
export function SetupField({
  accessory,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  value,
}: SetupFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldRow}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.14)"
          selectionColor={Palette.primary[500]}
          style={styles.input}
          value={value}
        />
        {accessory ? <View style={styles.fieldAccessory}>{accessory}</View> : null}
      </View>
    </View>
  );
}

export function UnitCard<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
}) {
  return (
    <View style={styles.unitCard}>
      <Text style={styles.unitLabel}>{label}</Text>
      <SegmentedControl onChange={onChange} options={options} value={value} variant="wide" />
    </View>
  );
}

export function SegmentedControl<T extends string>({
  onChange,
  options,
  value,
  variant = 'compact',
}: {
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
  variant?: 'compact' | 'wide';
}) {
  return (
    <View style={[styles.segmented, variant === 'wide' && styles.segmentedWide]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityLabel={`Select ${option.label}`}
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              variant === 'wide' && styles.segmentWide,
              selected && styles.segmentSelected,
              pressed && styles.segmentPressed,
            ]}>
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CalendarIcon() {
  return (
    <View accessibilityElementsHidden style={styles.calendarIcon}>
      <View style={styles.calendarTop} />
      <View style={styles.calendarBody} />
    </View>
  );
}

export function GearIcon() {
  return (
    <View accessibilityElementsHidden style={styles.gearIcon}>
      <Text style={styles.gearText}>*</Text>
    </View>
  );
}
