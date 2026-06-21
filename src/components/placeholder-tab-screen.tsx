import { ScrollView, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PlaceholderTabScreenProps = {
  description: string;
  icon?: AppIconName;
  title: string;
};

export function PlaceholderTabScreen({
  description,
  icon,
  title,
}: PlaceholderTabScreenProps) {
  const theme = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: theme.background }}>
      <View style={styles.content}>
        <Header avatarUrl={MOCK_USER.avatarUrl} profileName={MOCK_USER.name} />
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          {icon ? (
            <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSelected }]}>
              <AppIcon color={theme.primary} name={icon} size={28} />
            </View>
          ) : null}
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.description} themeColor="textSecondary">
            {description}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  content: {
    flex: 1,
    gap: Spacing.five,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 280,
    padding: Spacing.four,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: Spacing.two,
    width: 56,
  },
  title: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
    textAlign: 'center',
  },
  description: {
    ...Typography.sm,
    fontFamily: Fonts.body,
    maxWidth: 360,
    textAlign: 'center',
  },
});
