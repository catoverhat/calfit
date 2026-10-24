import { useAppTheme } from '@/theme/app-theme-provider';
import { NativeTabs } from "expo-router/unstable-native-tabs";

import { Fonts, Typography } from "@/theme/tokens";

export default function AppTabs() {
  const { DesignColors } = useAppTheme();
  return (
    <NativeTabs
      backgroundColor={DesignColors.surfaceContainer}
      disableIndicator
      iconColor={{
        default: DesignColors.secondary,
        selected: DesignColors.primaryContainer,
      }}
      labelStyle={{
        default: {
          color: DesignColors.secondary,
          fontFamily: Fonts.label,
          fontSize: Typography.xs.fontSize,
          fontWeight: "500",
        },
        selected: {
          color: DesignColors.primaryContainer,
          fontFamily: Fonts.label,
          fontSize: Typography.xs.fontSize,
          fontWeight: "700",
        },
      }}
      rippleColor="transparent"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="calendar_today"
          sf={{ default: "calendar", selected: "calendar" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="plan">
        <NativeTabs.Trigger.Label>Plan</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="calendar_month"
          sf={{ default: "calendar.badge.plus", selected: "calendar.badge.plus" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="workouts">
        <NativeTabs.Trigger.Label>Workouts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="fitness_center"
          sf={{
            default: "dumbbell",
            selected: "dumbbell.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="bar_chart"
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="person"
          sf={{ default: "person", selected: "person.fill" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
