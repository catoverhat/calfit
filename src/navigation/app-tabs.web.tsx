import { Image, type ImageSource } from 'expo-image';
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/theme/tokens';

const WEB_TAB_BAR_SPACE = 92;

const tabIcons = {
  today: require('@/assets/icons/tabs/today.svg'),
  routines: require('@/assets/icons/tabs/routines.svg'),
  exercises: require('@/assets/icons/tabs/exercises.svg'),
  progress: require('@/assets/icons/tabs/progress.svg'),
  profile: require('@/assets/icons/tabs/profile.svg'),
} satisfies Record<string, ImageSource>;

type TabIcon = keyof typeof tabIcons;

type TabButtonProps = TabTriggerSlotProps & {
  icon: TabIcon;
  label: string;
};

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.tabSlot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="today" href="/(tabs)" asChild>
            <TabButton icon="today" label="Today" />
          </TabTrigger>
          <TabTrigger name="routines" href="/routines" asChild>
            <TabButton icon="routines" label="Routines" />
          </TabTrigger>
          <TabTrigger name="exercises" href="/exercises" asChild>
            <TabButton icon="exercises" label="Exercises" />
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
  const color = isFocused ? Palette.primary[500] : Palette.neutral[300];

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

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
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
    backgroundColor: Palette.secondary[950],
    borderColor: Palette.secondary[800],
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.24)',
    flexDirection: 'row',
    maxWidth: Math.min(MaxContentWidth, 520),
    minHeight: 62,
    overflow: 'hidden',
    paddingHorizontal: Spacing.two,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.half,
    justifyContent: 'center',
    minHeight: 60,
    minWidth: 52,
    paddingHorizontal: Spacing.half,
    paddingVertical: Spacing.two,
  },
  icon: {
    height: 20,
    width: 20,
  },
  label: {
    ...Typography.xs,
    fontFamily: Fonts.label,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.58,
  },
});
