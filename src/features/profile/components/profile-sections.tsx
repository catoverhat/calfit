import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Header } from "@/components/layout/header";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";
import { useStyles } from "../profile-setup-screen.styles";

export function ProfileHeader({ name }: { name: string }) {
  return (
    <Header
      profileIsInteractive={false}
      profileName={name}
      showAction={false}
      statusLabel="Made for you"
    />
  );
}

export function ProfileSection({
  children,
  description,
  icon,
  title,
}: {
  children: ReactNode;
  description: string;
  icon: AppIconName;
  title: string;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <AppIcon color={SemanticColors.actionSoft} name={icon} size={18} />
        </View>
        <View style={styles.sectionHeading}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            {title}
          </Text>
          <Text style={styles.sectionDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export function ProfileSecuritySection({
  isWebSession,
  onLock,
}: {
  isWebSession: boolean;
  onLock: () => void;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <ProfileSection
      title="Privacy & security"
      description="Your profile stays on this device."
      icon="shield"
    >
      <View style={styles.securityRow}>
        <View style={styles.securityCopy}>
          <Text style={styles.unitLabel}>App lock</Text>
          <Text style={styles.fieldHelper}>
            {isWebSession
              ? "Lock this session. Select Continue on Web to return."
              : "Lock now. Use device authentication to return."}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Lock Calfit now"
          accessibilityRole="button"
          onPress={onLock}
          style={({ pressed }) => [
            styles.lockButton,
            pressed && styles.pressed,
          ]}
        >
          <AppIcon color={SemanticColors.actionSoft} name="lock" size={16} />
          <Text style={styles.lockButtonText}>Lock app</Text>
        </Pressable>
      </View>
    </ProfileSection>
  );
}
