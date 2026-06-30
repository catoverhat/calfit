import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MockWorkout = (typeof import('@/constants/mock-data').MOCK_WORKOUTS)[number];

type WorkoutDetailScreenProps = {
  workout?: MockWorkout;
};

export function WorkoutDetailScreen({ workout }: WorkoutDetailScreenProps) {
  const theme = useTheme();

  if (!workout) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.missingContent}
        style={{ backgroundColor: theme.background }}>
        <ThemedText style={styles.title}>Workout not found</ThemedText>
        <Link href="/workouts/index" asChild>
          <Pressable style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>Back to Workouts</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: theme.background }}>
      <View style={styles.content}>
        <Image
          accessibilityLabel="Athlete performing the selected workout"
          contentFit="cover"
          source={workout.imageUrl}
          style={styles.heroImage}
          transition={200}
        />
        <View style={styles.summary}>
          <ThemedText style={styles.title}>{workout.title}</ThemedText>
          <ThemedText style={styles.description} themeColor="textSecondary">
            {workout.description}
          </ThemedText>
          <View style={styles.metadata}>
            <ThemedText style={styles.metadataText}>{workout.duration}</ThemedText>
            <ThemedText style={styles.metadataText}>{workout.intensity}</ThemedText>
          </View>
        </View>

        <View style={styles.exerciseSection}>
          <ThemedText style={styles.sectionTitle}>Exercises</ThemedText>
          {workout.exercises.map((exercise, index) => (
            <View
              key={exercise.id}
              style={[
                styles.exerciseRow,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}>
              <View style={styles.exerciseIndex}>
                <ThemedText style={styles.exerciseIndexText}>{index + 1}</ThemedText>
              </View>
              <View style={styles.exerciseCopy}>
                <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
                <ThemedText style={styles.exerciseDetail} themeColor="textSecondary">
                  {exercise.sets} sets · {exercise.reps}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <Link
          href={{ pathname: '/workouts/[id]/session', params: { id: workout.id } }}
          asChild>
          <Pressable
            accessibilityLabel={`Start ${workout.title}`}
            accessibilityRole="button"
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
            <ThemedText style={styles.startButtonText}>Start Workout</ThemedText>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: Spacing.five,
  },
  content: {
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  heroImage: {
    aspectRatio: 1.7,
    width: '100%',
  },
  summary: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  title: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  description: {
    ...Typography.sm,
    fontFamily: Fonts.body,
  },
  metadata: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metadataText: {
    ...Typography.xs,
    backgroundColor: Palette.primary[100],
    borderRadius: 6,
    color: Palette.primary[900],
    fontFamily: Fonts.bodySemiBold,
    overflow: 'hidden',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  exerciseSection: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  sectionTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
    marginBottom: Spacing.one,
  },
  exerciseRow: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  exerciseIndex: {
    alignItems: 'center',
    backgroundColor: Palette.primary[100],
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  exerciseIndexText: {
    ...Typography.sm,
    color: Palette.primary[800],
    fontFamily: Fonts.bodyBold,
  },
  exerciseCopy: {
    flex: 1,
  },
  exerciseName: {
    ...Typography.sm,
    fontFamily: Fonts.bodySemiBold,
  },
  exerciseDetail: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
  missingContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.three,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  backButton: {
    backgroundColor: Palette.primary[700],
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButtonText: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
  },
  startButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.primary[600],
    borderCurve: 'continuous',
    borderRadius: 9,
    justifyContent: 'center',
    marginHorizontal: Spacing.three,
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    width: '90%',
  },
  startButtonText: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
});
