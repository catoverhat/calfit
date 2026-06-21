import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { MOCK_USER, MOCK_WORKOUTS } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function WorkoutListScreen() {
  const theme = useTheme();

  return (
    <TabScreen contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Header avatarUrl={MOCK_USER.avatarUrl} profileName={MOCK_USER.name} />
        <View style={styles.heading}>
          <ThemedText style={styles.title}>Workouts</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Choose a session and open its detail route.
          </ThemedText>
        </View>

        {MOCK_WORKOUTS.map((workout) => (
          <Link
            key={workout.id}
            href={{ pathname: '/workouts/[id]', params: { id: workout.id } }}
            asChild>
            <Pressable
              accessibilityLabel={`Open ${workout.title}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
                pressed && styles.pressed,
              ]}>
              <Image
                accessibilityLabel="Athlete performing a strength workout"
                contentFit="cover"
                source={workout.imageUrl}
                style={styles.image}
                transition={200}
              />
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardTitle}>{workout.title}</ThemedText>
                <View style={styles.metadata}>
                  <ThemedText style={styles.metadataText} themeColor="textSecondary">
                    {workout.duration}
                  </ThemedText>
                  <ThemedText style={styles.metadataText} themeColor="textSecondary">
                    {workout.intensity}
                  </ThemedText>
                </View>
              </View>
              <AppIcon color={Palette.primary[600]} name="play" size={16} />
            </Pressable>
          </Link>
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  content: {
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  heading: {
    gap: Spacing.one,
  },
  title: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  subtitle: {
    ...Typography.sm,
    fontFamily: Fonts.body,
  },
  card: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 2px 10px rgba(26, 28, 35, 0.05)',
    flexDirection: 'row',
    gap: Spacing.three,
    overflow: 'hidden',
    paddingRight: Spacing.three,
  },
  image: {
    alignSelf: 'stretch',
    minHeight: 104,
    width: 120,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  cardTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  metadata: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  metadataText: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
