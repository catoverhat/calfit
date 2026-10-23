import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { distanceFromCanonical, formatUnitNumber, speedFromCanonical, weightFromCanonical, type RoutineExerciseTargetRow } from '@/db';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { getRoutineTotals } from './routine.viewmodel';
import { styles } from './routine-detail-screen.styles';
import { useRoutineDetail } from './use-routine-detail';

export function RoutineDetailScreen({ routineId }: { routineId?: string }) {
  const { activeSessionId, error, isLoading, isStarting, reload, routine, startWorkout, units } = useRoutineDetail(routineId);

  if (isLoading) {
    return <StateScreen loading message="Loading workout…" />;
  }

  if (!routine) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.stateContent} style={styles.screen}>
        <View style={styles.stateIcon}><AppIcon color={SemanticColors.danger} name="warning" size={24} /></View>
        <ThemedText style={styles.title}>{error ? 'Workout unavailable' : 'Workout not found'}</ThemedText>
        <ThemedText style={styles.stateText}>{error ?? 'This workout no longer exists.'}</ThemedText>
        {error ? <Pressable onPress={reload} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><ThemedText style={styles.secondaryButtonText}>Try again</ThemedText></Pressable> : null}
        <Link href={'/workouts' as Href} asChild><Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><ThemedText style={styles.primaryButtonText}>Back to workouts</ThemedText></Pressable></Link>
      </ScrollView>
    );
  }

  const totals = getRoutineTotals(routine);
  const hero = routine.exercises.find((exercise) => exercise.exercise.image_url)?.exercise.image_url;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <View style={styles.content}>
        {hero ? <Image accessibilityLabel={`${routine.name} preview`} contentFit="cover" source={hero} style={styles.heroImage} transition={200} /> : <View style={styles.heroFallback}><AppIcon color={SemanticColors.action} name="strength" size={42} /></View>}
        <View style={styles.summary}>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}><ThemedText style={styles.eyebrow}>{routine.active ? 'Active workout' : 'Inactive workout'}</ThemedText><ThemedText style={styles.title}>{routine.name}</ThemedText></View>
            <Link href={{ pathname: '/workouts/[id]/edit', params: { id: routine.routine_id } } as unknown as Href} asChild><Pressable accessibilityLabel={`Edit ${routine.name}`} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><AppIcon color={SemanticColors.actionSoft} name="edit" size={20} /></Pressable></Link>
          </View>
          <ThemedText style={styles.description}>{routine.description ?? 'No description yet.'}</ThemedText>
          <View style={styles.statsRow}><Stat label="Exercises" value={String(totals.exerciseCount)} /><Stat label="Target sets" value={String(totals.setCount)} /></View>
          {error ? <ThemedText style={styles.inlineError}>{error}</ThemedText> : null}
          <Pressable accessibilityLabel={activeSessionId ? 'Resume active workout' : `Start ${routine.name}`} accessibilityRole="button" disabled={isStarting || (!activeSessionId && !routine.active)} onPress={startWorkout} style={({ pressed }) => [styles.startButton, ((!activeSessionId && !routine.active) || isStarting) && styles.buttonDisabled, pressed && styles.pressed]}>
            {isStarting ? <ActivityIndicator color={DesignColors.onPrimaryContainer} /> : <AppIcon color={DesignColors.onPrimaryContainer} name="play" size={20} />}
            <ThemedText style={styles.startButtonText}>{isStarting ? 'Opening…' : activeSessionId ? 'Resume active workout' : 'Start workout'}</ThemedText>
          </Pressable>
        </View>
        <View style={styles.exerciseSection}>
          <ThemedText style={styles.sectionEyebrow}>Workout plan</ThemedText><ThemedText style={styles.sectionTitle}>Exercises</ThemedText>
          {routine.exercises.map((item, index) => (
            <View key={item.routine_exercise_id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}><View style={styles.exerciseIndex}><ThemedText style={styles.exerciseIndexText}>{index + 1}</ThemedText></View><View style={styles.exerciseCopy}><ThemedText style={styles.exerciseName}>{item.exercise.name}</ThemedText><ThemedText style={styles.exerciseDescription}>{item.exercise.description ?? `${item.targets.length} target sets`}</ThemedText></View></View>
              <View style={styles.targetList}>{item.targets.map((target) => <TargetRow key={target.routine_exercise_target_id} target={target} units={units} />)}</View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StateScreen({ loading, message }: { loading: boolean; message: string }) {
  return <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.stateContent} style={styles.screen}>{loading ? <ActivityIndicator color={SemanticColors.action} size="large" /> : null}<ThemedText style={styles.stateText}>{message}</ThemedText></ScrollView>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.stat}><ThemedText style={styles.statValue}>{value}</ThemedText><ThemedText style={styles.statLabel}>{label}</ThemedText></View>;
}

function TargetRow({ target, units }: { target: RoutineExerciseTargetRow; units: { distanceUnit: 'km' | 'mi'; speedUnit: 'kmh' | 'mph'; weightUnit: 'kg' | 'lb' } }) {
  const values = [target.target_reps !== null ? `${target.target_reps} reps` : null, target.target_weight !== null ? `${formatUnitNumber(weightFromCanonical(target.target_weight, units.weightUnit))} ${units.weightUnit}` : null, target.target_speed !== null ? `${formatUnitNumber(speedFromCanonical(target.target_speed, units.speedUnit))} ${units.speedUnit === 'kmh' ? 'km/h' : 'mph'}` : null, target.target_duration_seconds !== null ? formatDuration(target.target_duration_seconds) : null, target.target_distance !== null ? `${formatUnitNumber(distanceFromCanonical(target.target_distance, units.distanceUnit), 2)} ${units.distanceUnit}` : null, target.rest_time_seconds !== null ? `${target.rest_time_seconds}s rest` : null].filter(Boolean);
  return <View style={styles.targetRow}><ThemedText style={styles.setNumber}>SET {target.set_number}</ThemedText><ThemedText style={styles.targetText}>{values.join('  ·  ') || 'Open target'}</ThemedText></View>;
}

function formatDuration(seconds: number): string { return seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds} sec`; }
