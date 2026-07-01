import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Fonts, Palette, Typography } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Palette.secondary[950]}
      disableIndicator
      iconColor={{ default: Palette.neutral[300], selected: Palette.primary[500] }}
      labelStyle={{
        default: {
          color: Palette.neutral[300],
          fontFamily: Fonts.label,
          fontSize: Typography.xs.fontSize,
        },
        selected: {
          color: Palette.primary[500],
          fontFamily: Fonts.bodySemiBold,
          fontSize: Typography.xs.fontSize,
        },
      }}
      rippleColor={Palette.secondary[800]}
      tintColor={Palette.primary[500]}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="calendar_today"
          sf={{ default: 'calendar', selected: 'calendar' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="routines">
        <NativeTabs.Trigger.Label>Routines</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="alt_route"
          sf={{ default: 'figure.run', selected: 'figure.run' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="exercises">
        <NativeTabs.Trigger.Label>Exercises</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="apps"
          sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }}
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
