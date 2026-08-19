import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';
import { styles } from './exercise-editor-form.styles';

export function ExerciseMediaCards({
  imageUrl,
  mode,
}: {
  imageUrl: string | null;
  mode: 'create' | 'edit';
}) {
  return (
    <>
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
          <Text style={styles.videoActionText}>{mode === 'edit' ? 'Update Video' : 'Add Video'}</Text>
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
    </>
  );
}
