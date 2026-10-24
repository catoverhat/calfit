import { useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { useAppTheme } from '@/theme/app-theme-provider';
import { useStyles } from '../profile-setup-screen.styles';

type SegmentOption<T extends string> = { label: string; value: T };

export function SetupField({ accessory, disabled, helper, keyboardType = 'default', label, onChangeText, optional, placeholder, value, ...inputProps }: {
  accessory?: ReactNode;
  disabled?: boolean;
  helper?: string;
  keyboardType?: TextInputProps['keyboardType'];
  label: string;
  onChangeText: (value: string) => void;
  optional?: boolean;
  placeholder: string;
  value: string;
} & Pick<TextInputProps, 'autoCapitalize' | 'autoComplete' | 'maxLength'>) {
  const styles = useStyles();
  const { scheme, SemanticColors, ComponentTokens } = useAppTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}{optional ? <Text style={styles.optionalLabel}> (optional)</Text> : null}</Text>
        {accessory}
      </View>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        accessibilityHint={helper}
        accessibilityState={{ disabled }}
        editable={!disabled}
        keyboardAppearance={scheme}
        keyboardType={keyboardType}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={SemanticColors.textMuted}
        selectionColor={ComponentTokens.input.selectionColor}
        style={[styles.input, focused && styles.inputFocused, disabled && styles.controlDisabled]}
        value={value}
      />
      {helper ? <Text style={styles.fieldHelper}>{helper}</Text> : null}
    </View>
  );
}

export function UnitCard<T extends string>({ disabled, label, helper, onChange, options, value }: {
  disabled?: boolean;
  label: string;
  helper: string;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
}) {
  const styles = useStyles();
  return (
    <View style={styles.unitRow}>
      <View style={styles.unitCopy}>
        <Text style={styles.unitLabel}>{label}</Text>
        <Text style={styles.fieldHelper}>{helper}</Text>
      </View>
      <SegmentedControl accessibilityLabel={`${label} unit`} disabled={disabled} onChange={onChange} options={options} value={value} />
    </View>
  );
}

export function SegmentedControl<T extends string>({ accessibilityLabel, disabled = false, onChange, options, value }: {
  accessibilityLabel: string;
  disabled?: boolean;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="radiogroup" style={[styles.segmented, disabled && styles.controlDisabled]}>
      {options.map((option) => (
        <Pressable
          accessibilityLabel={`${accessibilityLabel}: ${option.label}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: option.value === value, disabled }}
          disabled={disabled}
          key={option.value}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => [styles.segment, option.value === value && styles.segmentSelected, pressed && styles.pressed]}>
          {option.value === value ? <AppIcon color={SemanticColors.actionSoft} name="check" size={12} /> : null}
          <Text style={[styles.segmentText, option.value === value && styles.segmentTextSelected]}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
