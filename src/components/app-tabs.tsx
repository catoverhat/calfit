import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { usePathname } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors, Fonts, Typography } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const pathname = usePathname();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const sessionFocused = /^\/workouts\/[^/]+\/session\/?$/.test(pathname);

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      disableIndicator
      hidden={sessionFocused}
      iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      labelStyle={{
        default: {
          color: colors.textSecondary,
          fontFamily: Fonts.label,
          fontSize: Typography.xs.fontSize,
        },
        selected: {
          color: colors.primary,
          fontFamily: Fonts.bodySemiBold,
          fontSize: Typography.xs.fontSize,
        },
      }}
      rippleColor={colors.backgroundSelected}
      tintColor={colors.primary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="home"
          sf={{ default: 'house', selected: 'house.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="workouts">
        <NativeTabs.Trigger.Label>Workouts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="fitness_center"
          sf={{ default: 'dumbbell', selected: 'dumbbell.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="bar_chart"
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="person"
          sf={{ default: 'person', selected: 'person.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
