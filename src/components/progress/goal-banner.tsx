import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';

type GoalBannerProps = {
  detail: string;
  title: string;
};

export function GoalBanner({ detail, title }: GoalBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconCircle}>
        <AppIcon color={Palette.primary[600]} name="flame" size={20} />
      </View>
      <View style={styles.copy}>
        <ThemedText selectable style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText selectable style={styles.detail}>
          {detail}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 12,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 104,
    padding: Spacing.three,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  copy: {
    flex: 1,
  },
  title: {
    ...Typography.sm,
    color: Palette.secondary[950],
    fontFamily: Fonts.bodySemiBold,
  },
  detail: {
    ...Typography.xs,
    color: Palette.secondary[800],
    fontFamily: Fonts.body,
  },
});
