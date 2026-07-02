import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { EXERCISE_CATALOG } from '@/constants/exercise-catalog';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Space,
  Spacing,
  TypeScale,
  Typography,
} from '@/constants/theme';

type ExerciseEditorScreenProps = {
  exerciseId?: string;
  mode: 'create' | 'edit';
};

const DEFAULT_EXERCISE = {
  name: 'Dumbbell Incline Bench Press',
  description:
    'Maintain a 45-degree angle. Drive through the chest and keep shoulder blades retracted. Slow eccentric phase for maximum hypertrophy.',
  category: 'Strength',
  muscleGroup: 'Chest',
  imageUrl:
    'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1200&q=85',
};

export function ExerciseEditorScreen({ exerciseId, mode }: ExerciseEditorScreenProps) {
  const sourceExercise = useMemo(
    () => EXERCISE_CATALOG.find((exercise) => exercise.id === exerciseId),
    [exerciseId]
  );
  const initialExercise =
    mode === 'edit' && sourceExercise
      ? {
          name:
            sourceExercise.id === 'bench-press'
              ? DEFAULT_EXERCISE.name
              : sourceExercise.name,
          description:
            sourceExercise.id === 'bench-press'
              ? DEFAULT_EXERCISE.description
              : `Refine ${sourceExercise.name.toLowerCase()} mechanics with controlled tempo, stable positioning, and clean range of motion.`,
          category: sourceExercise.catalogCategory,
          muscleGroup: sourceExercise.muscleGroup,
          imageUrl: sourceExercise.imageUrl,
        }
      : mode === 'edit'
        ? DEFAULT_EXERCISE
        : {
            ...DEFAULT_EXERCISE,
            name: '',
            description: '',
          };

  const [active, setActive] = useState(true);
  const [category] = useState(initialExercise.category);
  const [description, setDescription] = useState(initialExercise.description);
  const [muscleGroup] = useState(initialExercise.muscleGroup);
  const [name, setName] = useState(initialExercise.name);

  const title = mode === 'edit' ? 'Edit Exercise' : 'Create Exercise';
  const subtitle =
    mode === 'edit'
      ? 'Update the technical specifications for this movement.'
      : 'Define the technical specifications for this movement.';

  const saveExercise = () => {
    router.replace('/exercises');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Pressable
          accessibilityLabel={mode === 'edit' ? 'Update exercise video' : 'Add exercise video'}
          accessibilityRole="button"
          onPress={() => undefined}
          style={({ pressed }) => [styles.videoCard, pressed && styles.pressed]}>
          <Image
            accessibilityLabel="Exercise video preview"
            contentFit="cover"
            source={initialExercise.imageUrl}
            style={styles.videoImage}
            transition={200}
          />
          <View style={styles.videoOverlay} />
          <View style={styles.videoAction}>
            <View style={styles.playTile}>
              <AppIcon color={SemanticColors.action} name="play" size={20} />
            </View>
            <Text style={styles.videoActionText}>
              {mode === 'edit' ? 'Update Video' : 'Add Video'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityLabel="Add Reference Image"
          accessibilityRole="button"
          onPress={() => undefined}
          style={({ pressed }) => [styles.referenceCard, pressed && styles.pressed]}>
          <View style={styles.cameraWrap}>
            <AppIcon color={SemanticColors.actionSoft} name="camera" size={24} />
          </View>
          <Text style={styles.referenceText}>Add Reference Image</Text>
          <Text style={styles.referenceHint}>Max 5MB - JPG/PNG</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Exercise Identity</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exercise Name</Text>
            <TextInput
              accessibilityLabel="Exercise Name"
              onChangeText={setName}
              placeholder="Exercise name"
              placeholderTextColor="rgba(229, 226, 225, 0.26)"
              selectionColor={SemanticColors.action}
              style={styles.nameInput}
              value={name}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description & Coaching Cues</Text>
            <TextInput
              accessibilityLabel="Description and Coaching Cues"
              multiline
              onChangeText={setDescription}
              placeholder="Describe the movement and key cues"
              placeholderTextColor="rgba(229, 226, 225, 0.26)"
              selectionColor={SemanticColors.action}
              style={styles.descriptionInput}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <SelectLikeRow label="Category" value={category} />
          <SelectLikeRow label="Primary Muscle Group" value={muscleGroup} />

          <View style={styles.statusCard}>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>Active Status</Text>
              <Text style={styles.statusSubtitle}>Visibility in workout selector</Text>
            </View>
            <Pressable
              accessibilityLabel={active ? 'Deactivate exercise' : 'Activate exercise'}
              accessibilityRole="switch"
              accessibilityState={{ checked: active }}
              onPress={() => setActive((value) => !value)}
              style={[styles.switchTrack, active && styles.switchTrackActive]}>
              <View style={[styles.switchThumb, active && styles.switchThumbActive]} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Save Exercise"
          accessibilityRole="button"
          onPress={saveExercise}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
          <Text style={styles.saveButtonText}>Save Exercise</Text>
          <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SelectLikeRow({ label, value }: { label: string; value: string }) {
  return (
    <Pressable
      accessibilityLabel={`${label}: ${value}`}
      accessibilityRole="button"
      onPress={() => undefined}
      style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}>
      <View style={styles.selectCopy}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.selectValue}>{value}</Text>
      </View>
      <View style={styles.selectIcons}>
        <AppIcon color={SemanticColors.textMuted} name="chevronDown" size={15} />
        <AppIcon color={SemanticColors.actionSoft} name="chevrons" size={15} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: SemanticColors.canvas,
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  titleBlock: {
    gap: Space.xs,
  },
  title: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
  },
  subtitle: {
    ...Typography.sm,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    lineHeight: 20,
  },
  videoCard: {
    aspectRatio: 1.78,
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoImage: {
    height: '100%',
    width: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
  },
  videoAction: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    gap: Space.xs,
    justifyContent: 'center',
  },
  playTile: {
    alignItems: 'center',
    borderColor: SemanticColors.action,
    borderRadius: Radius.sm,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  videoActionText: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    textTransform: 'uppercase',
  },
  referenceCard: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.card.background,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: Space.xs,
    justifyContent: 'center',
    minHeight: 120,
    padding: Spacing.three,
  },
  cameraWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
  },
  referenceText: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  referenceHint: {
    color: SemanticColors.textMuted,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
  section: {
    gap: Spacing.three,
  },
  sectionLabel: {
    ...Typography.xs,
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  inputGroup: {
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.input.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.input.radius,
    borderWidth: ComponentTokens.input.borderWidth,
    gap: Space.xs,
    padding: Spacing.three,
  },
  inputLabel: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
  nameInput: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    minHeight: 32,
    padding: 0,
  },
  descriptionInput: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    minHeight: 112,
    padding: 0,
  },
  selectRow: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.input.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.input.radius,
    borderWidth: ComponentTokens.input.borderWidth,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 70,
    padding: Spacing.three,
  },
  selectCopy: {
    flex: 1,
    gap: Space.xs,
  },
  selectValue: {
    ...Typography.base,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  selectIcons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Space.sm,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.input.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.input.radius,
    borderWidth: ComponentTokens.input.borderWidth,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 76,
    padding: Spacing.three,
  },
  statusCopy: {
    flex: 1,
    gap: 2,
  },
  statusTitle: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  statusSubtitle: {
    color: SemanticColors.textMuted,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  switchTrack: {
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderRadius: Radius.full,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 52,
  },
  switchTrackActive: {
    backgroundColor: SemanticColors.action,
  },
  switchThumb: {
    backgroundColor: SemanticColors.textPrimary,
    borderRadius: Radius.full,
    height: 24,
    width: 24,
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.button.primaryBackground,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    boxShadow: '0 14px 28px rgba(255, 95, 31, 0.24)',
    flexDirection: 'row',
    gap: Space.sm,
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: Spacing.three,
  },
  saveButtonPressed: {
    backgroundColor: DesignColors.inversePrimary,
    transform: [{ scale: 0.99 }],
  },
  saveButtonText: {
    ...Typography.lg,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
  },
  pressed: {
    opacity: 0.72,
  },
});
