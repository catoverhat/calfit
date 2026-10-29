import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { Pressable, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../routine-list-screen.styles";
import type { RoutineSummaryViewModel } from "../routine.viewmodel";

export function RoutineCard({ routine }: { routine: RoutineSummaryViewModel }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();

  return (
    <Link
      href={
        {
          pathname: "/workouts/[id]",
          params: { id: routine.id },
        } as unknown as Href
      }
      asChild
    >
      <Pressable
        accessibilityHint="Opens workout details and training targets"
        accessibilityLabel={`${routine.title}, ${routine.focus}, ${routine.exerciseCount} exercises, ${routine.setCount} sets${routine.active ? "" : ", inactive"}. ${routine.lastCompleted}.`}
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <View style={[styles.card, pressed && styles.cardPressed]}>
            <View style={styles.cardHeader}>
              {routine.imageUrl ? (
                <Image
                  accessible={false}
                  contentFit="cover"
                  source={routine.imageUrl}
                  style={styles.cardImage}
                  transition={180}
                />
              ) : (
                <View style={styles.iconTile}>
                  <AppIcon
                    color={SemanticColors.actionSoft}
                    name={routine.focus === "cardio" ? "running" : "strength"}
                    size={24}
                  />
                </View>
              )}
              <View style={styles.cardTitleBlock}>
                <View style={styles.cardLabels}>
                  <ThemedText style={styles.focusLabel}>
                    {routine.focus === "cardio" ? "Cardio" : "Strength"}
                  </ThemedText>
                  {!routine.active ? (
                    <View style={styles.statusPill}>
                      <ThemedText style={styles.statusText}>
                        Inactive
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
                <ThemedText style={styles.cardTitle}>
                  {routine.title}
                </ThemedText>
              </View>
              <AppIcon
                color={SemanticColors.textMuted}
                name="chevronRight"
                size={20}
              />
            </View>
            {routine.description !== "No description yet." ? (
              <ThemedText numberOfLines={2} style={styles.cardDescription}>
                {routine.description}
              </ThemedText>
            ) : null}
            <View style={styles.metricRow}>
              <View style={styles.metric}>
                <AppIcon
                  color={SemanticColors.textMuted}
                  name="exercises"
                  size={16}
                />
                <ThemedText style={styles.metricText}>
                  {routine.exerciseCount}{" "}
                  {routine.exerciseCount === 1 ? "exercise" : "exercises"}
                </ThemedText>
              </View>
              <View style={styles.metric}>
                <AppIcon
                  color={SemanticColors.textMuted}
                  name="sets"
                  size={16}
                />
                <ThemedText style={styles.metricText}>
                  {routine.setCount} {routine.setCount === 1 ? "set" : "sets"}
                </ThemedText>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <AppIcon
                color={SemanticColors.textMuted}
                name="history"
                size={14}
              />
              <ThemedText style={styles.lastCompleted}>
                {routine.lastCompleted === "Never completed"
                  ? "No sessions yet"
                  : routine.lastCompleted}
              </ThemedText>
              <ThemedText style={styles.openLabel}>View workout</ThemedText>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
