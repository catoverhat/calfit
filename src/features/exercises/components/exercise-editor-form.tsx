import { useAppTheme } from '@/theme/app-theme-provider';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import type { ExerciseEditorData, ExerciseEditorSaveInput } from '../exercise-catalog.viewmodel';


import { ExerciseCategoryPicker } from './exercise-category-picker';
import { useStyles } from './exercise-editor-form.styles';

export function ExerciseEditorForm({
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
  const { scheme } = useAppTheme();
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  const [active, setActive] = useState(data.initialValues.active);
  const [categoryId, setCategoryId] = useState<string | null>(data.initialValues.categoryId);
  const [description, setDescription] = useState(data.initialValues.description);
  const [imageUrl, setImageUrl] = useState<string | null>(data.initialValues.imageUrl);
  const [name, setName] = useState(data.initialValues.name);
  const [videoUrl, setVideoUrl] = useState<string | null>(data.initialValues.videoUrl);
  const selectedCategory = data.categories.find((category) => category.id === categoryId) ?? null;
  const muscleGroup = selectedCategory?.muscleGroup ?? data.initialValues.muscleGroup;

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
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Exercise details</Text>

          {error ? (
            <StatusCard body={error} title="Local exercise unavailable" />
          ) : isLoading ? (
            <StatusCard body="Preparing local exercise data." title="Loading exercise" />
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exercise name</Text>
            <TextInput keyboardAppearance={scheme}
              accessibilityLabel="Exercise name"
              onChangeText={setName}
              placeholder="Exercise name"
              placeholderTextColor={SemanticColors.textMuted}
              selectionColor={SemanticColors.action}
              style={styles.nameInput}
              value={name}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description & coaching cues</Text>
            <TextInput keyboardAppearance={scheme}
              accessibilityLabel="Description and coaching cues"
              multiline
              onChangeText={setDescription}
              placeholder="Describe the movement and key cues"
              placeholderTextColor={SemanticColors.textMuted}
              selectionColor={SemanticColors.action}
              style={styles.descriptionInput}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Image URL (optional)</Text>
            <TextInput keyboardAppearance={scheme}
              accessibilityLabel="Exercise image URL"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(value) => setImageUrl(value || null)}
              placeholder="https://example.com/exercise.jpg"
              placeholderTextColor={SemanticColors.textMuted}
              selectionColor={SemanticColors.action}
              style={styles.urlInput}
              value={imageUrl ?? ''}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Video URL (optional)</Text>
            <TextInput keyboardAppearance={scheme}
              accessibilityLabel="Exercise video URL"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(value) => setVideoUrl(value || null)}
              placeholder="https://example.com/demo"
              placeholderTextColor={SemanticColors.textMuted}
              selectionColor={SemanticColors.action}
              style={styles.urlInput}
              value={videoUrl ?? ''}
            />
          </View>

          <ExerciseCategoryPicker
            categories={data.categories}
            onSelect={setCategoryId}
            selectedId={categoryId}
          />
          <InfoRow label="Primary muscle group" value={muscleGroup} />

          <View style={styles.statusCard}>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>Active</Text>
              <Text style={styles.statusSubtitle}>Visibility in workout selector</Text>
            </View>
            <Pressable
              accessibilityLabel={active ? 'Deactivate exercise' : 'Activate exercise'}
              accessibilityRole="switch"
              accessibilityState={{ checked: active }}
              hitSlop={9}
              onPress={() => setActive((value) => !value)}
              style={[styles.switchTrack, active && styles.switchTrackActive]}>
              <View style={[styles.switchThumb, active && styles.switchThumbActive]} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Save exercise"
          accessibilityRole="button"
          accessibilityState={{ disabled: saveDisabled }}
          disabled={saveDisabled}
          onPress={handleSaveExercise}
          style={({ pressed }) => [
            styles.saveButton,
            saveDisabled && styles.saveButtonDisabled,
            pressed && !saveDisabled && styles.saveButtonPressed,
          ]}>
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save exercise'}</Text>
          <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  // Read-only: no trailing icon, so it does not look like a control.
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}. Set by the category.`}
      style={styles.selectRow}>
      <View style={styles.selectCopy}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.selectValue}>{value}</Text>
      </View>
    </View>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  const styles = useStyles();
  return (
    <View style={styles.statusMessage}>
      <Text style={styles.statusMessageTitle}>{title}</Text>
      <Text selectable style={styles.statusMessageBody}>
        {body}
      </Text>
    </View>
  );
}
