import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { useAppTheme } from '@/theme/app-theme-provider';

import { formatWeekRange } from './plan-calendar';
import { useStyles } from './weekly-plan-screen.styles';

type WeeklyPlanNavigationProps = {
  dates: string[];
  maxWeek: number;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onSelectWeek: (week: number) => void;
  onSelectYear: (year: number) => void;
  week: number;
  year: number;
};

export function WeeklyPlanNavigation({ dates, maxWeek, onNextWeek, onPreviousWeek, onSelectWeek, onSelectYear, week, year }: WeeklyPlanNavigationProps) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const weekList = useRef<FlatList<number>>(null);
  const weeks = useMemo(() => Array.from({ length: maxWeek }, (_, index) => index + 1), [maxWeek]);
  const range = formatWeekRange(dates);

  useEffect(() => {
    if (!expanded) return;
    const timer = setTimeout(() => {
      weekList.current?.scrollToIndex({ animated: false, index: week - 1, viewPosition: 0.45 });
    }, 60);
    return () => clearTimeout(timer);
  }, [week, year, expanded]);

  return (
    <View style={styles.weekPicker}>
      <View style={styles.weekNavigation}>
        <NavigationArrow label="Previous week" onPress={onPreviousWeek} />
        <Pressable
          accessibilityLabel={`Week ${week}, ${year}. ${range}. Choose a week`}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((open) => !open)}
          style={({ pressed }) => [styles.weekNavigationLabel, pressed && styles.pressed]}>
          <ThemedText style={styles.weekTitle}>{range}</ThemedText>
          <View style={styles.weekNavigationMeta}>
            <ThemedText style={styles.weekRange}>Week {week} · Choose week</ThemedText>
            <AppIcon color={SemanticColors.textMuted} name={expanded ? 'chevronUp' : 'chevronDown'} size={16} />
          </View>
        </Pressable>
        <NavigationArrow forward label="Next week" onPress={onNextWeek} />
      </View>
      {expanded ? (
        <>
          <View style={styles.yearControls}>
            <NavigationArrow label="Previous year" onPress={() => onSelectYear(year - 1)} />
            <ThemedText style={styles.year}>{year}</ThemedText>
            <NavigationArrow forward label="Next year" onPress={() => onSelectYear(year + 1)} />
          </View>
          <FlatList
            contentContainerStyle={styles.weekRail}
            data={weeks}
            horizontal
            keyExtractor={(item) => String(item)}
            onScrollToIndexFailed={(info) => weekList.current?.scrollToOffset({ animated: false, offset: Math.max(0, info.index * 70 - 120) })}
            ref={weekList}
            renderItem={({ item }) => (
              <Pressable
                accessibilityLabel={`Week ${item}`}
                accessibilityRole="button"
                accessibilityState={{ selected: item === week }}
                onPress={() => { onSelectWeek(item); setExpanded(false); }}
                style={({ pressed }) => [styles.weekChip, item === week && styles.weekChipSelected, pressed && styles.pressed]}>
                <ThemedText style={[styles.weekChipText, item === week && styles.weekChipTextSelected]}>W{item}</ThemedText>
              </Pressable>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </>
      ) : null}
    </View>
  );
}

function NavigationArrow({ forward = false, label, onPress }: { forward?: boolean; label: string; onPress: () => void }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <AppIcon color={SemanticColors.textPrimary} name={forward ? 'chevronRight' : 'chevronLeft'} size={20} />
    </Pressable>
  );
}
