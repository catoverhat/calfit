import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { SemanticColors } from "@/theme/tokens";
import { styles } from "../routine-list-screen.styles";
import type { RoutineSummaryViewModel } from "../routine.viewmodel";

export function RoutineCard({ routine }: { routine: RoutineSummaryViewModel }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {routine.imageUrl ? (
          <Image
            accessibilityLabel={`${routine.title} exercise preview`}
            contentFit="cover"
            source={routine.imageUrl}
            style={styles.cardImage}
            transition={180}
          />
        ) : (
          <View style={styles.iconTile}>
            <AppIcon
              color={SemanticColors.action}
              name={routine.focus === "cardio" ? "running" : "strength"}
              size={24}
            />
          </View>
        )}
        <View style={styles.cardTitleBlock}>
          <View style={styles.cardTitleRow}>
            <ThemedText numberOfLines={1} style={styles.cardTitle}>
              {routine.title}
            </ThemedText>
            <View
              style={[
                styles.statusDot,
                !routine.active && styles.statusDotInactive,
              ]}
            />
          </View>
          <ThemedText numberOfLines={2} style={styles.cardDescription}>
            {routine.description}
          </ThemedText>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Metric
          icon="exercises"
          label="Exercises"
          value={String(routine.exerciseCount)}
        />
        <Metric
          icon="sets"
          label="Target sets"
          value={String(routine.setCount)}
        />
      </View>

      <View style={styles.scheduleBlock}>
        <ThemedText style={styles.metaLabel}>Weekly schedule</ThemedText>
        <View style={styles.scheduleRow}>
          {routine.schedule.length ? (
            routine.schedule.map((day) => (
              <View
                accessibilityLabel={day.longLabel}
                key={day.day}
                style={styles.scheduleChip}
              >
                <ThemedText style={styles.scheduleText}>{day.label}</ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={styles.unscheduledText}>Flexible</ThemedText>
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <ThemedText style={styles.lastCompleted}>
          {routine.lastCompleted}
        </ThemedText>
        <View style={styles.actionRow}>
          <Link
            href={{
              pathname: "/routines/[id]/edit",
              params: { id: routine.id },
            }}
            asChild
          >
            <Pressable
              accessibilityLabel={`Edit ${routine.title}`}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.footerActionButtonContent,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={styles.footerActionButtonText}>
                    Edit
                  </ThemedText>
                  <AppIcon
                    color={SemanticColors.actionSoft}
                    name="edit"
                    size={16}
                  />
                </View>
              )}
            </Pressable>
          </Link>
          <Link
            href={{ pathname: "/routines/[id]", params: { id: routine.id } }}
            asChild
          >
            <Pressable
              accessibilityLabel={`Open ${routine.title}`}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.footerActionButtonContent,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={styles.footerActionButtonText}>
                    View
                  </ThemedText>
                  <AppIcon
                    color={SemanticColors.actionSoft}
                    name="open"
                    size={16}
                  />
                </View>
              )}
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: "exercises" | "sets";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <AppIcon color={SemanticColors.textMuted} name={icon} size={16} />
      <View style={styles.metricTextBlock}>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      </View>
    </View>
  );
}
