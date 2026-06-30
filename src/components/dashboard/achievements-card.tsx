import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Achievement = {
  detail: string;
  icon: AppIconName;
  id: string;
  title: string;
  tone: 'primary' | 'tertiary';
};

type AchievementsCardProps = {
  achievements: Achievement[];
};

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}>
      <ThemedText style={styles.sectionTitle}>Recent Achievements</ThemedText>
      <View style={styles.list}>
        {achievements.map((achievement) => {
          const isPrimary = achievement.tone === 'primary';
          const iconColor = isPrimary ? Palette.primary[800] : Palette.tertiary[800];
          const iconBackground = isPrimary ? Palette.primary[100] : Palette.tertiary[100];

          return (
            <View
              key={achievement.id}
              style={[
                styles.achievement,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}>
              <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
                <AppIcon color={iconColor} name={achievement.icon} size={20} />
              </View>
              <View style={styles.achievementCopy}>
                <ThemedText style={styles.achievementTitle}>{achievement.title}</ThemedText>
                <ThemedText style={styles.achievementDetail} themeColor="textSecondary">
                  {achievement.detail}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 2px 10px rgba(26, 28, 35, 0.04)',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  sectionTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  list: {
    gap: Spacing.two,
  },
  achievement: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 70,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  achievementCopy: {
    flex: 1,
  },
  achievementTitle: {
    ...Typography.sm,
    fontFamily: Fonts.bodySemiBold,
  },
  achievementDetail: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
});
