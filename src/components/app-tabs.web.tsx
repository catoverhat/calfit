import { Image, type ImageSource } from 'expo-image';
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WEB_TAB_BAR_SPACE = 92;

const tabIcons = {
  home: require('@/assets/icons/tabs/home.svg'),
  workouts: require('@/assets/icons/tabs/workouts.svg'),
  progress: require('@/assets/icons/tabs/progress.svg'),
  profile: require('@/assets/icons/tabs/profile.svg'),
} satisfies Record<string, ImageSource>;

type TabIcon = keyof typeof tabIcons;

type TabButtonProps = TabTriggerSlotProps & {
  icon: TabIcon;
  label: string;
};

export default function AppTabs() {
  const pathname = usePathname();
  const sessionFocused = /^\/workouts\/[^/]+\/session\/?$/.test(pathname);

  return (
    <Tabs>
      <TabSlot style={[styles.tabSlot, sessionFocused && styles.focusedTabSlot]} />
      <TabList asChild style={sessionFocused ? styles.hidden : undefined}>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="home" label="Home" />
          </TabTrigger>
          <TabTrigger name="workouts" href="/workouts/index" asChild>
            <TabButton icon="workouts" label="Workouts" />
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <TabButton icon="progress" label="Progress" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon="profile" label="Profile" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ icon, isFocused, label, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.primary : theme.textSecondary;

  return (
    <Pressable
      {...props}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <Image contentFit="contain" source={tabIcons[icon]} style={styles.icon} tintColor={color} />
      <ThemedText style={[styles.label, { color }]}>{label}</ThemedText>
    </Pressable>
  );
}

function CustomTabList({ style, ...props }: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={[styles.tabListContainer, style]}>
      <ThemedView
        type="backgroundElement"
        style={[styles.innerContainer, { borderColor: theme.border }]}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabSlot: {
    height: '100%',
    paddingBottom: WEB_TAB_BAR_SPACE,
  },
  focusedTabSlot: {
    paddingBottom: 0,
  },
  hidden: {
    display: 'none',
  },
  tabListContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    position: 'absolute',
    right: 0,
    zIndex: 100,
  },
  innerContainer: {
    borderCurve: 'continuous',
    borderRadius: 14,
    borderWidth: 1,
    boxShadow: '0 4px 18px rgba(26, 28, 35, 0.12)',
    flexDirection: 'row',
    maxWidth: Math.min(MaxContentWidth, 520),
    minHeight: 64,
    overflow: 'hidden',
    paddingHorizontal: Spacing.two,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.half,
    justifyContent: 'center',
    minHeight: 62,
    minWidth: 64,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
  },
  icon: {
    height: 20,
    width: 20,
  },
  label: {
    ...Typography.xs,
    fontFamily: Fonts.label,
  },
  pressed: {
    opacity: 0.58,
  },
});
