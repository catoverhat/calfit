import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/app-theme-provider';
import { Fonts, TouchTarget } from '@/theme/tokens';

import type { DateFieldProps } from './date-field';
import { toDateKey } from './date-field-value';

/** The native picker package has no web build, so web uses the browser's own date input. */
export function DateField({
  accessibilityLabel,
  disabled = false,
  maximumDate,
  minimumDate,
  onChange,
  style,
  textStyle,
  value,
}: DateFieldProps) {
  const { scheme, SemanticColors } = useAppTheme();
  const text = StyleSheet.flatten(textStyle) ?? {};
  return (
    <View style={[{ justifyContent: 'center', minHeight: TouchTarget.min }, style, disabled && { opacity: 0.54 }]}>
      {createElement('input', {
        'aria-label': accessibilityLabel,
        disabled,
        max: maximumDate ? toDateKey(maximumDate) : undefined,
        min: minimumDate ? toDateKey(minimumDate) : undefined,
        onChange: (event: { target: { value: string } }) => onChange(event.target.value),
        style: {
          background: 'transparent',
          border: 'none',
          color: SemanticColors.textPrimary,
          colorScheme: scheme,
          fontFamily: text.fontFamily ?? Fonts.bodyMedium,
          fontSize: text.fontSize ?? 16,
          minHeight: TouchTarget.min,
          outlineOffset: 2,
          width: '100%',
        },
        type: 'date',
        value,
      })}
    </View>
  );
}
