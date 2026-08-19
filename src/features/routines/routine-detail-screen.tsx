import { styles } from './routine-detail-screen.styles';
import { Image } from 'expo-image';
import { Link, router, type Href } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { useTheme } from '@/theme/use-theme';

type MockWorkout = (typeof import('@/fixtures/mock-data').MOCK_WORKOUTS)[number];

type RoutineDetailScreenProps = {
  workout?: MockWorkout;
};

export function RoutineDetailScreen({ workout }: RoutineDetailScreenProps) {
  const theme = useTheme();

  const startWorkout = () => {
    if (!workout) return;

    router.push({
      pathname: '/workout-session/[id]',
      params: { id: workout.id },
    } as unknown as Href);
  };

  if (!workout) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.missingContent}
        style={{ backgroundColor: theme.background }}>
        <ThemedText style={styles.title}>Routine not found</ThemedText>
        <Link href="/routines" asChild>
          <Pressable style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>Back to Routines</ThemedText>
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
          <View style={styles.actionRow}>
            <Pressable
              accessibilityLabel={`Start ${workout.title}`}
              accessibilityRole="button"
              onPress={startWorkout}
              style={({ pressed }) => [styles.startWorkoutButton, pressed && styles.pressed]}>
              <ThemedText style={styles.startWorkoutText}>Start Workout</ThemedText>
            </Pressable>
            <Link
              href={{ pathname: '/routines/[id]/edit', params: { id: workout.id } }}
              asChild>
              <Pressable
                accessibilityLabel={`Edit ${workout.title}`}
                accessibilityRole="button"
                style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
                <ThemedText style={styles.editButtonText}>Edit Routine</ThemedText>
              </Pressable>
            </Link>
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
      </View>
    </ScrollView>
  );
}
