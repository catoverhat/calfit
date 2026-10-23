import { Link, type Href } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Header } from "@/components/layout/header";
import { TabScreen } from "@/components/layout/tab-screen";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { DesignColors, SemanticColors } from "@/theme/tokens";
import { RoutineCard } from "./components/routine-card";
import { styles } from "./routine-list-screen.styles";
import { useRoutineList } from "./use-routine-list";

const ErrorState = ({
  error,
  reload,
}: {
  error: string;
  reload: () => void;
}) => {
  return (
    <View style={styles.stateCard}>
      <View style={styles.stateIcon}>
        <AppIcon color={SemanticColors.danger} name="warning" size={22} />
      </View>
      <ThemedText style={styles.stateTitle}>Workouts unavailable</ThemedText>
      <ThemedText style={styles.stateText}>{error}</ThemedText>
      <Pressable
        accessibilityRole="button"
        onPress={reload}
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
      >
        <ThemedText style={styles.retryText}>Try again</ThemedText>
      </Pressable>
    </View>
  );
};

export function RoutineListScreen() {
  const { error, isLoading, profileName, reload, routines } = useRoutineList();

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      style={styles.screen}
    >
      <View style={styles.content}>
        <Header profileName={profileName} showAction={false} />
        <View style={styles.headingRow}>
          <View style={styles.heading}>
            <ThemedText style={styles.eyebrow}>Your program</ThemedText>
            <ThemedText style={styles.title}>Workout Library</ThemedText>
            {!isLoading && !error ? (
              <ThemedText style={styles.subtitle}>
                {routines.length}{" "}
                {routines.length === 1 ? "workout" : "workouts"} stored locally
              </ThemedText>
            ) : null}
          </View>
          <Link href="/workouts/create" asChild>
            <Pressable
              accessibilityLabel="Create workout"
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View style={[styles.createButton, pressed && styles.pressed]}>
                  <AppIcon
                    color={DesignColors.onPrimaryContainer}
                    name="add"
                    size={20}
                  />
                </View>
              )}
            </Pressable>
          </Link>
        </View>

        <Link href={'/workouts/exercises' as Href} asChild>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.manageButton, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.actionSoft} name="exercises" size={18} />
            <ThemedText style={styles.manageButtonText}>Manage Exercises</ThemedText>
            <AppIcon color={SemanticColors.textMuted} name="chevronRight" size={18} />
          </Pressable>
        </Link>

        {isLoading ? (
          <View accessibilityLabel="Loading workouts" style={styles.stateCard}>
            <ActivityIndicator color={SemanticColors.action} size="large" />
            <ThemedText style={styles.stateText}>
              Loading your workouts…
            </ThemedText>
          </View>
        ) : error ? (
          <ErrorState error={error} reload={reload} />
        ) : routines.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.stateIcon}>
              <AppIcon
                color={SemanticColors.actionSoft}
                name="routines"
                size={24}
              />
            </View>
            <ThemedText style={styles.stateTitle}>
              Build your first workout
            </ThemedText>
            <ThemedText style={styles.stateText}>
              Combine exercises and set reusable training targets.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </View>
        )}
      </View>
    </TabScreen>
  );
}
