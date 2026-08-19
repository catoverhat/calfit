import { NativeTabs } from "expo-router/unstable-native-tabs";

import { DesignColors, Fonts, Typography } from "@/theme/tokens";

export default function AppTabs() {
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

      <NativeTabs.Trigger name="routines">
        <NativeTabs.Trigger.Label>Routines</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="alt_route"
          sf={{ default: "figure.run", selected: "figure.run" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="exercises">
        <NativeTabs.Trigger.Label>Exercises</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="apps"
          sf={{
            default: "list.bullet.rectangle",
            selected: "list.bullet.rectangle.fill",
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
