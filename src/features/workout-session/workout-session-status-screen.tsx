import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts, SemanticColors, Spacing, TypeScale } from '@/theme/tokens';

type WorkoutSessionStatusScreenProps = {
  body: string;
  onBack?: () => void;
  onRetry?: () => void;
  title: string;
};

export function WorkoutSessionStatusScreen({ body, onBack, onRetry, title }: WorkoutSessionStatusScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.statusContent}
      style={styles.statusScreen}>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text selectable style={styles.statusBody}>
          {body}
        </Text>
        {onRetry || onBack ? <View style={styles.actions}>
          {onBack ? <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondaryButton}><Text style={styles.secondaryText}>Back</Text></Pressable> : null}
          {onRetry ? <Pressable accessibilityRole="button" onPress={onRetry} style={styles.primaryButton}><Text style={styles.primaryText}>Try Again</Text></Pressable> : null}
        </View> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statusScreen: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  statusContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.three,
  },
  statusCard: {
    backgroundColor: SemanticColors.card,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.one,
    padding: Spacing.three,
  },
  statusTitle: {
    ...TypeScale.headlineSm,
    color: SemanticColors.textPrimary,
  },
  statusBody: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: { flexDirection: 'row', gap: Spacing.one, justifyContent: 'flex-end', marginTop: Spacing.two },
  secondaryButton: { borderColor: SemanticColors.border, borderRadius: 8, borderWidth: 1, justifyContent: 'center', minHeight: 48, paddingHorizontal: Spacing.two },
  secondaryText: { color: SemanticColors.textPrimary, fontFamily: Fonts.bodyBold },
  primaryButton: { backgroundColor: SemanticColors.action, borderRadius: 8, justifyContent: 'center', minHeight: 48, paddingHorizontal: Spacing.two },
  primaryText: { color: '#1A100C', fontFamily: Fonts.bodyBold },
});
