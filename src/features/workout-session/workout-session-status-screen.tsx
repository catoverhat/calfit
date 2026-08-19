import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts, SemanticColors, Spacing, TypeScale } from '@/theme/tokens';

type WorkoutSessionStatusScreenProps = {
  body: string;
  title: string;
};

export function WorkoutSessionStatusScreen({ body, title }: WorkoutSessionStatusScreenProps) {
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
});
