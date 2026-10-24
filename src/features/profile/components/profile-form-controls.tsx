import { useAppTheme } from '@/theme/app-theme-provider';
import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';


import { useStyles } from '../profile-setup-screen.styles';

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type SetupFieldProps = {
  accessory?: ReactNode;
  helper?: string;
  keyboardType?: 'decimal-pad' | 'default' | 'numeric';
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};
export function SetupField({
  accessory,
  helper,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  value,
}: SetupFieldProps) {
  const { scheme } = useAppTheme();
  const styles = useStyles();
  const { SemanticColors, ComponentTokens } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldRow}>
        <TextInput keyboardAppearance={scheme}
          accessibilityLabel={label}
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={SemanticColors.textMuted}
          selectionColor={ComponentTokens.input.selectionColor}
          style={styles.input}
          value={value}
        />
        {accessory ? <View style={styles.fieldAccessory}>{accessory}</View> : null}
      </View>
      {helper ? <Text style={styles.fieldHelper}>{helper}</Text> : null}
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
  const styles = useStyles();
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
  disabled = false,
}: {
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
  variant?: 'compact' | 'wide';
  disabled?: boolean;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.segmented, variant === 'wide' && styles.segmentedWide]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityLabel={`Select ${option.label}`}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
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
  const { SemanticColors } = useAppTheme();
  return (
    <AppIcon color={SemanticColors.textPrimary} name="calendar" size={18} />
  );
}

export function GearIcon() {
  const { SemanticColors } = useAppTheme();
  return (
    <AppIcon color={SemanticColors.action} name="settings" size={18} />
  );
}
