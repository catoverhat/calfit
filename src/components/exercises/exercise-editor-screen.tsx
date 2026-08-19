import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
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
import type {
  ExerciseEditorCategoryOption,
  ExerciseEditorData,
  ExerciseEditorSaveInput,
} from '@/hooks/exercise-catalog-view-model';
import { useExerciseEditor } from '@/hooks/use-exercise-editor';

type ExerciseEditorScreenProps = {
  exerciseId?: string;
  mode: 'create' | 'edit';
};

export function ExerciseEditorScreen({ exerciseId, mode }: ExerciseEditorScreenProps) {
  const { data, error, isLoading, isSaving, saveExercise } = useExerciseEditor({ exerciseId, mode });

  return (
    <ExerciseEditorForm
      data={data}
      error={error}
      isLoading={isLoading}
      isSaving={isSaving}
      key={`${mode}-${exerciseId ?? 'new'}-${data.initialValues.name}-${data.initialValues.categoryId ?? 'none'}`}
      mode={mode}
      saveExercise={saveExercise}
    />
  );
}

function ExerciseEditorForm({
  data,
  error,
  isLoading,
  isSaving,
  mode,
  saveExercise,
}: {
  data: ExerciseEditorData;
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  mode: 'create' | 'edit';
  saveExercise: (input: ExerciseEditorSaveInput) => Promise<void>;
}) {
  const [active, setActive] = useState(data.initialValues.active);
  const [categoryId, setCategoryId] = useState<string | null>(data.initialValues.categoryId);
  const [description, setDescription] = useState(data.initialValues.description);
  const [imageUrl] = useState<string | null>(data.initialValues.imageUrl);
  const [name, setName] = useState(data.initialValues.name);
  const [videoUrl] = useState<string | null>(data.initialValues.videoUrl);
  const selectedCategory = data.categories.find((category) => category.id === categoryId) ?? null;
  const muscleGroup = selectedCategory?.muscleGroup ?? data.initialValues.muscleGroup;

  const title = mode === 'edit' ? 'Edit Exercise' : 'Create Exercise';
  const subtitle =
    mode === 'edit'
      ? 'Update the technical specifications for this movement.'
      : 'Define the technical specifications for this movement.';
  const saveDisabled = isLoading || isSaving || !name.trim();

  const handleSaveExercise = () => {
    saveExercise({
      active,
      categoryId,
      description,
      imageUrl,
      name,
      videoUrl,
    });
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
          {imageUrl ? (
            <Image
              accessibilityLabel="Exercise video preview"
              contentFit="cover"
              source={imageUrl}
              style={styles.videoImage}
              transition={200}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <AppIcon color={SemanticColors.actionSoft} name="camera" size={30} />
            </View>
          )}
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

          {error ? (
            <StatusCard body={error} title="Local exercise unavailable" />
          ) : isLoading ? (
            <StatusCard body="Preparing local exercise data." title="Loading exercise" />
          ) : null}

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

          <CategoryPicker
            categories={data.categories}
            onSelect={setCategoryId}
            selectedId={categoryId}
          />
          <InfoRow label="Primary Muscle Group" value={muscleGroup} />

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
          accessibilityState={{ disabled: saveDisabled }}
          disabled={saveDisabled}
          onPress={handleSaveExercise}
          style={({ pressed }) => [
            styles.saveButton,
            saveDisabled && styles.saveButtonDisabled,
            pressed && !saveDisabled && styles.saveButtonPressed,
          ]}>
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Exercise'}</Text>
          <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function CategoryPicker({
  categories,
  onSelect,
  selectedId,
}: {
  categories: ExerciseEditorCategoryOption[];
  onSelect: (categoryId: string) => void;
  selectedId: string | null;
}) {
  return (
    <View style={styles.categoryGroup}>
      <Text style={styles.inputLabel}>Category</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.categoryChips}
        showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const selected = category.id === selectedId;

          return (
            <Pressable
              accessibilityLabel={`Choose ${category.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={category.id}
              onPress={() => onSelect(category.id)}
              style={({ pressed }) => [
                styles.categoryChip,
                selected && styles.categoryChipSelected,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={styles.selectRow}>
      <View style={styles.selectCopy}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.selectValue}>{value}</Text>
      </View>
      <View style={styles.selectIcons}>
        <AppIcon color={SemanticColors.actionSoft} name="chevrons" size={15} />
      </View>
    </View>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.statusMessage}>
      <Text style={styles.statusMessageTitle}>{title}</Text>
      <Text selectable style={styles.statusMessageBody}>
        {body}
      </Text>
    </View>
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
  videoPlaceholder: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    height: '100%',
    justifyContent: 'center',
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
  categoryGroup: {
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.input.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.input.radius,
    borderWidth: ComponentTokens.input.borderWidth,
    gap: Space.sm,
    padding: Spacing.three,
  },
  categoryChips: {
    gap: Space.sm,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: SemanticColors.card,
    borderColor: SemanticColors.border,
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: Spacing.three,
  },
  categoryChipSelected: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  categoryChipText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  categoryChipTextSelected: {
    color: DesignColors.onPrimaryContainer,
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
  saveButtonDisabled: {
    opacity: 0.54,
  },
  saveButtonText: {
    ...Typography.lg,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
  },
  pressed: {
    opacity: 0.72,
  },
  statusMessage: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Space.xs,
    padding: Spacing.three,
  },
  statusMessageTitle: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  statusMessageBody: {
    ...Typography.xs,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
  },
});
