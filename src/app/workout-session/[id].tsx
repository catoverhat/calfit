import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActiveWorkoutSessionScreen } from '@/components/workouts/active-workout-session-screen';
import { MOCK_WORKOUTS } from '@/constants/mock-data';
import { Fonts, SemanticColors, Spacing, TypeScale } from '@/constants/theme';
import { useWorkoutSessionData } from '../../hooks/use-workout-session-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { error, isLoading, workout } = useWorkoutSessionData(id);

  if (isLoading) {
    return <WorkoutSessionStatusScreen body="Loading your local workout session." title="Preparing Session" />;
  }

  if (!workout) {
    return <WorkoutSessionStatusScreen body={error ?? 'Workout session not found.'} title="Session Unavailable" />;
  }

  return <ActiveWorkoutSessionScreen workout={workout} />;
}

function WorkoutSessionStatusScreen({ body, title }: { body: string; title: string }) {
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
