import { Link, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { Header } from "@/components/layout/header";
import { TabScreen } from "@/components/layout/tab-screen";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { useAppTheme } from "@/theme/app-theme-provider";

import { RoutineCard } from "./components/routine-card";
import { useStyles } from "./routine-list-screen.styles";
import { useRoutineList } from "./use-routine-list";

const focusFilters = ["All", "Strength", "Cardio"] as const;
type FocusFilter = (typeof focusFilters)[number];

export function RoutineListScreen() {
  const styles = useStyles();
  const { DesignColors, SemanticColors, scheme } = useAppTheme();
  const { error, isLoading, profileName, reload, routines } = useRoutineList();
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<FocusFilter>("All");
  const [searchFocused, setSearchFocused] = useState(false);
  const search = query.trim().toLocaleLowerCase();
  const visibleRoutines = routines.filter(
    (routine) =>
      (focus === "All" || routine.focus === focus.toLowerCase()) &&
      `${routine.title} ${routine.description}`
        .toLocaleLowerCase()
        .includes(search),
  );

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={styles.content}>
        <Header profileName={profileName} showAction={false} />
        <View style={styles.heading}>
          <ThemedText style={styles.eyebrow}>
            Your training, your way
          </ThemedText>
          <ThemedText accessibilityRole="header" style={styles.title}>
            Workouts
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Find your next session or build one of your own.
          </ThemedText>
        </View>

        <View style={styles.libraryActions}>
          <Link href="/workouts/create" asChild>
            <Pressable
              accessibilityLabel="Create workout"
              accessibilityRole="button"
              style={styles.createLink}
            >
              {({ pressed }) => (
                <View style={[styles.createButton, pressed && styles.pressed]}>
                  <AppIcon
                    color={DesignColors.onPrimaryContainer}
                    name="add"
                    size={20}
                  />
                  <ThemedText style={styles.createButtonText}>
                    Create workout
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </Link>
          <Link href={"/workouts/exercises" as Href} asChild>
            <Pressable
              accessibilityLabel="Browse and manage exercises"
              accessibilityRole="button"
              style={styles.catalogLink}
            >
              {({ pressed }) => (
                <View style={[styles.manageButton, pressed && styles.pressed]}>
                  <AppIcon
                    color={SemanticColors.actionSoft}
                    name="exercises"
                    size={20}
                  />
                  <ThemedText style={styles.manageButtonText}>
                    Exercises
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </Link>
        </View>

        {!isLoading && !error && routines.length > 0 ? (
          <View style={styles.discovery}>
            <View
              style={[
                styles.searchField,
                searchFocused && styles.searchFieldFocused,
              ]}
            >
              <AppIcon
                color={SemanticColors.textMuted}
                name="search"
                size={20}
              />
              <TextInput
                accessibilityLabel="Search workouts by name or description"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={scheme}
                onBlur={() => setSearchFocused(false)}
                onChangeText={setQuery}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search workouts"
                placeholderTextColor={SemanticColors.textMuted}
                returnKeyType="search"
                selectionColor={SemanticColors.action}
                style={styles.searchInput}
                value={query}
              />
              {query ? (
                <Pressable
                  accessibilityLabel="Clear workout search"
                  accessibilityRole="button"
                  onPress={() => setQuery("")}
                  style={({ pressed }) => [
                    styles.clearSearch,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon
                    color={SemanticColors.textSecondary}
                    name="close"
                    size={20}
                  />
                </Pressable>
              ) : null}
            </View>
            <View accessibilityLabel="Workout type" style={styles.filters}>
              {focusFilters.map((filter) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: focus === filter }}
                  key={filter}
                  onPress={() => setFocus(filter)}
                  style={({ pressed }) => [
                    styles.filter,
                    focus === filter && styles.filterSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.filterText,
                      focus === filter && styles.filterTextSelected,
                    ]}
                  >
                    {filter}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <ThemedText
              accessibilityLiveRegion="polite"
              style={styles.resultCount}
            >
              {visibleRoutines.length}{" "}
              {visibleRoutines.length === 1 ? "workout" : "workouts"}
              {search || focus !== "All"
                ? ` of ${routines.length}`
                : " in your library"}
            </ThemedText>
          </View>
        ) : null}

        {isLoading ? (
          <View
            accessibilityLabel="Loading workouts"
            accessibilityState={{ busy: true }}
            style={styles.stateCard}
          >
            <ActivityIndicator color={SemanticColors.action} size="large" />
            <ThemedText style={styles.stateText}>
              Loading your workouts...
            </ThemedText>
          </View>
        ) : error ? (
          <View accessibilityLiveRegion="polite" style={styles.stateCard}>
            <View style={styles.stateIcon}>
              <AppIcon color={SemanticColors.danger} name="warning" size={24} />
            </View>
            <ThemedText style={styles.stateTitle}>
              Workouts unavailable
            </ThemedText>
            <ThemedText style={styles.stateText}>{error}</ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={reload}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.retryText}>Try again</ThemedText>
            </Pressable>
          </View>
        ) : routines.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.stateIcon}>
              <AppIcon
                color={SemanticColors.actionSoft}
                name="strength"
                size={24}
              />
            </View>
            <ThemedText style={styles.stateTitle}>
              Your next session starts here
            </ThemedText>
            <ThemedText style={styles.stateText}>
              Create a workout above, add your exercises, and set your targets.
              You can use it again whenever you train.
            </ThemedText>
          </View>
        ) : visibleRoutines.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.stateIcon}>
              <AppIcon
                color={SemanticColors.textMuted}
                name="search"
                size={24}
              />
            </View>
            <ThemedText style={styles.stateTitle}>No workouts found</ThemedText>
            <ThemedText style={styles.stateText}>
              Try a different name or show all workout types.
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setQuery("");
                setFocus("All");
              }}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.retryText}>
                Reset search & filters
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {visibleRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </View>
        )}
      </View>
    </TabScreen>
  );
}
