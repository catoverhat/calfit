import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import type { ExerciseEditorData, ExerciseEditorSaveInput } from '../exercise-catalog.viewmodel';
import { DesignColors, SemanticColors } from '@/theme/tokens';

import { ExerciseCategoryPicker } from './exercise-category-picker';
import { styles } from './exercise-editor-form.styles';
import { ExerciseMediaCards } from './exercise-media-cards';
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

        <ExerciseMediaCards imageUrl={imageUrl} mode={mode} />

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

          <ExerciseCategoryPicker
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
