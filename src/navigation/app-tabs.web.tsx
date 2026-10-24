import type { Href } from 'expo-router';
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { DesignColors, Fonts, MaxContentWidth, Radius, SemanticColors, Spacing, Typography } from '@/theme/tokens';

const WEB_TAB_BAR_SPACE = 92;

const tabIcons = {
  today: 'today',
  plan: 'calendar',
  workouts: 'strength',
  progress: 'progress',
  profile: 'profile',
} satisfies Record<string, AppIconName>;

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
          <TabTrigger name="plan" href={'/plan' as Href} asChild>
            <TabButton icon="plan" label="Plan" />
          </TabTrigger>
          <TabTrigger name="workouts" href={'/workouts' as Href} asChild>
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
  const color = isFocused ? DesignColors.primaryContainer : DesignColors.secondary;

  return (
    <Pressable
      {...props}
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.tabContent, isFocused && styles.tabSelected]}>
        <AppIcon color={color} name={tabIcons[icon]} size={20} />
        <ThemedText style={[styles.label, { color }]}>{label}</ThemedText>
      </View>
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
    backgroundColor: DesignColors.surfaceContainer,
    borderColor: SemanticColors.borderStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    maxWidth: Math.min(MaxContentWidth, 640),
    minHeight: 62,
    paddingHorizontal: Spacing.two,
    width: '100%',
  },
  tabButton: {
    borderRadius: Radius.md,
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two,
  },
  tabContent: {
    alignItems: 'center',
    borderRadius: Radius.md,
    gap: Spacing.one,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.half,
    paddingVertical: Spacing.one,
  },
  tabSelected: { backgroundColor: SemanticColors.actionTint },
  label: {
    ...Typography.xs,
    fontFamily: Fonts.label,
  },
  pressed: {
    opacity: 0.58,
  },
});
