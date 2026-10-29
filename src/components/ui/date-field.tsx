import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { useAppTheme } from '@/theme/app-theme-provider';
import { createThemedStyles } from '@/theme/create-themed-styles';
import { Radius, Space, TouchTarget, TypeScale } from '@/theme/tokens';

import { formatDateLabel, parseDateKey, toDateKey } from './date-field-value';

export type DateFieldProps = {
  accessibilityLabel: string;
  /** Shows a Clear action so an optional date can be emptied again. */
  clearable?: boolean;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange: (value: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** YYYY-MM-DD, or an empty string for no date. */
  value: string;
};

export function DateField({
  accessibilityLabel,
  clearable = false,
  disabled = false,
  maximumDate,
  minimumDate,
  onChange,
  placeholder,
  style,
  textStyle,
  value,
}: DateFieldProps) {
  const styles = useStyles();
  const { scheme, SemanticColors } = useAppTheme();
  const [draft, setDraft] = useState<Date | null>(null);
  const label = formatDateLabel(value);
  const initial = parseDateKey(value) ?? maximumDate ?? new Date();

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        maximumDate,
        minimumDate,
        mode: 'date',
        onValueChange: (_, date) => onChange(toDateKey(date)),
        value: initial,
      });
      return;
    }
    setDraft(initial);
  };

  return (
    <>
      <Pressable
        accessibilityHint="Opens a date picker."
        accessibilityLabel={`${accessibilityLabel}: ${label ?? 'not set'}`}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={open}
        style={({ pressed }) => [styles.field, style, disabled && styles.disabled, pressed && styles.pressed]}>
        <Text style={[textStyle, styles.fieldText, !label && { color: SemanticColors.textMuted }]}>
          {label ?? placeholder}
        </Text>
        <AppIcon color={SemanticColors.actionSoft} name="calendar" size={18} />
      </Pressable>

      <Modal animationType="fade" onRequestClose={() => setDraft(null)} transparent visible={draft !== null}>
        <View style={styles.backdrop}>
          <View accessibilityViewIsModal style={styles.sheet}>
            <Text accessibilityRole="header" style={styles.title}>{accessibilityLabel}</Text>
            {draft ? (
              <DateTimePicker
                accentColor={SemanticColors.action}
                display="inline"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                mode="date"
                onValueChange={(_, date) => setDraft(date)}
                themeVariant={scheme}
                value={draft}
              />
            ) : null}
            <View style={styles.actions}>
              {clearable && value ? (
                <SheetButton label="Clear" onPress={() => { onChange(''); setDraft(null); }} />
              ) : null}
              <SheetButton label="Cancel" onPress={() => setDraft(null)} />
              <SheetButton
                label="Done"
                onPress={() => {
                  if (draft) onChange(toDateKey(draft));
                  setDraft(null);
                }}
                primary
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function SheetButton({ label, onPress, primary = false }: { label: string; onPress: () => void; primary?: boolean }) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, primary && styles.buttonPrimary, pressed && styles.pressed]}>
      <Text style={[styles.buttonText, primary && styles.buttonTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = createThemedStyles(({ SemanticColors }) => StyleSheet.create({
  field: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Space.base,
    minHeight: TouchTarget.min,
  },
  fieldText: { flex: 1 },
  disabled: { opacity: 0.54 },
  pressed: { opacity: 0.72 },
  backdrop: { backgroundColor: SemanticColors.scrim, flex: 1, justifyContent: 'flex-end' },
  sheet: {
    alignSelf: 'center',
    backgroundColor: SemanticColors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: Space.md,
    maxWidth: 480,
    padding: Space.lg,
    paddingBottom: Space.xl,
    width: '100%',
  },
  title: { ...TypeScale.headlineSm, color: SemanticColors.textPrimary },
  actions: { flexDirection: 'row', gap: Space.base, justifyContent: 'flex-end' },
  button: {
    alignItems: 'center',
    borderColor: SemanticColors.borderStrong,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
    paddingHorizontal: Space.md,
  },
  buttonPrimary: { backgroundColor: SemanticColors.action, borderColor: SemanticColors.action },
  buttonText: { ...TypeScale.labelLg, color: SemanticColors.textPrimary, textTransform: 'none' },
  buttonTextPrimary: { color: SemanticColors.actionText },
}));
