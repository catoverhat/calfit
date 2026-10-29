import { useAppTheme } from '@/theme/app-theme-provider';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';

import { DayCard } from './weekly-plan-day-card';
import { WeeklyPlanNavigation } from './weekly-plan-navigation';
import { WeeklyPlanOverview } from './weekly-plan-overview';
import { getIsoWeek, parseLocalDateKey } from './plan-calendar';
import { useStyles } from './weekly-plan-screen.styles';
import { useWeeklyPlan } from './use-weekly-plan';
import type { WorkoutDefinition, WorkoutPlanDay } from './weekly-plan.viewmodel';

type PickerState = { day: WorkoutPlanDay; mode: 'assign' | 'change' } | null;
type ChangeState = { day: WorkoutPlanDay; workout: WorkoutDefinition } | null;
type TargetState =
  | { day: WorkoutPlanDay; kind: 'move' }
  | { day: WorkoutPlanDay; kind: 'replace_move'; replacement: WorkoutDefinition }
  | null;

export function WeeklyPlanScreen({ initialDate }: { initialDate?: string }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const planner = useWeeklyPlan(initialDate);
  const { width } = useWindowDimensions();
  const wide = width >= 720;
  const [picker, setPicker] = useState<PickerState>(null);
  const [change, setChange] = useState<ChangeState>(null);
  const [target, setTarget] = useState<TargetState>(null);
  const [swapTarget, setSwapTarget] = useState<WorkoutPlanDay | null>(null);

  const selectWorkout = (workout: WorkoutDefinition) => {
    if (!picker) return;
    if (picker.mode === 'assign') {
      void planner.assign(picker.day.date, workout.id);
      setPicker(null);
      return;
    }
    setChange({ day: picker.day, workout });
    setPicker(null);
  };

  const chooseTarget = (day: WorkoutPlanDay) => {
    if (!target || day.date === target.day.date || !day.editable) return;
    if (target.kind === 'replace_move') {
      if (day.entryId) return;
      void planner.replaceAndMove(target.day.entryId as string, target.replacement.id, day.date);
      setTarget(null);
      return;
    }
    if (day.entryId) {
      setSwapTarget(day);
      return;
    }
    void planner.move(target.day.entryId as string, day.date);
    setTarget(null);
  };

  return (
    <>
      <TabScreen contentContainerStyle={styles.scrollContent} style={styles.screen}>
        <View style={styles.content}>
          <Header profileName={planner.profileName} showAction={false} />
          <View style={styles.headingRow}>
            <View style={styles.heading}>
              <ThemedText style={styles.eyebrow}>Weekly planning</ThemedText>
              <ThemedText accessibilityRole="header" style={styles.title}>Your week</ThemedText>
              <ThemedText style={styles.subtitle}>Make room for training and recovery.</ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Return to the current week"
              accessibilityRole="button"
              onPress={planner.goToToday}
              style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.actionSoft} name="calendar" size={18} />
              <ThemedText style={styles.todayButtonText}>Today</ThemedText>
            </Pressable>
          </View>

          <WeeklyPlanNavigation
            dates={planner.dates}
            maxWeek={planner.maxWeek}
            onNextWeek={() => navigateWeek(planner, 1)}
            onPreviousWeek={() => navigateWeek(planner, -1)}
            onSelectWeek={planner.selectWeek}
            onSelectYear={planner.selectYear}
            week={planner.week}
            year={planner.year}
          />

          {!planner.isLoading && !planner.error ? <WeeklyPlanOverview days={planner.weekModel.days} /> : null}

          <View style={styles.weekSummary}>
            <View>
              <ThemedText style={styles.sectionTitle}>Daily schedule</ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Copy assignments from the previous week"
              accessibilityRole="button"
              accessibilityState={{
                disabled:
                  planner.isLoading || !planner.weekModel.isEmpty ||
                  planner.isSaving ||
                  planner.dates[6] < planner.today,
              }}
              disabled={planner.isLoading || !planner.weekModel.isEmpty || planner.isSaving || planner.dates[6] < planner.today}
              onPress={() => void planner.copyPreviousWeek()}
              style={({ pressed }) => [
                styles.copyButton,
                (planner.isLoading || planner.isSaving || !planner.weekModel.isEmpty || planner.dates[6] < planner.today) && styles.disabled,
                pressed && styles.pressed,
              ]}>
              <AppIcon color={SemanticColors.actionSoft} name="copy" size={17} />
              <ThemedText style={styles.copyButtonText}>Copy previous week</ThemedText>
            </Pressable>
          </View>

          {planner.error ? (
            <View accessibilityLiveRegion="polite" style={styles.errorBanner}>
              <AppIcon color={SemanticColors.danger} name="warning" size={18} />
              <ThemedText style={styles.errorText}>{planner.error}</ThemedText>
              <Pressable
                accessibilityLabel="Retry loading workout plan"
                accessibilityRole="button"
                onPress={planner.retry}
                style={styles.errorRetry}>
                <ThemedText style={styles.errorAction}>Retry</ThemedText>
              </Pressable>
            </View>
          ) : null}

            <View style={[styles.dayGrid, wide && styles.dayGridWide]}>
              {planner.weekModel.days.map((day) => (
                <DayCard
                  day={day}
                  busy={planner.isLoading || planner.savingDates.includes(day.date)}
                  initialLoading={planner.isLoading}
                  disabled={planner.isSaving || planner.isLoading}
                  key={day.date}
                  onAssign={() => setPicker({ day, mode: 'assign' })}
                  onChange={() => setPicker({ day, mode: 'change' })}
                  onMove={() => setTarget({ day, kind: 'move' })}
                  onRemove={() => day.entryId && void planner.remove(day.entryId)}
                  onStart={() => day.entryId && void planner.start(day.entryId)}
                  onView={() =>
                    day.workout &&
                    router.push({ pathname: '/workouts/[id]', params: { id: day.workout.id } })
                  }
                  wide={wide}
                />
              ))}
            </View>
        </View>
      </TabScreen>

      <View pointerEvents="box-none" style={styles.noticeDock}>
        {planner.notice && planner.undoLast ? (
            <View style={styles.undoBanner}>
              <ThemedText style={styles.noticeText}>{planner.notice}</ThemedText>
              <Pressable
                accessibilityLabel="Undo last plan change"
                accessibilityRole="button"
                accessibilityState={{ disabled: planner.isSaving }}
                disabled={planner.isSaving}
                onPress={() => void planner.undoLast?.()}
                style={styles.undoButton}>
                <AppIcon color={SemanticColors.actionSoft} name="undo" size={17} />
                <ThemedText style={styles.undoText}>Undo</ThemedText>
              </Pressable>
            </View>
          ) : null}
      </View>

      <WorkoutPicker
        key={picker?.day.date ?? 'closed'}
        onClose={() => setPicker(null)}
        onCreate={() => {
          if (!picker) return;
          router.push({ pathname: '/workouts/create', params: { plannedDate: picker.day.date } });
          setPicker(null);
        }}
        onSelect={selectWorkout}
        open={Boolean(picker)}
        title={picker ? `${picker.mode === 'change' ? 'Change' : 'Plan'} ${picker.day.weekday}, ${picker.day.dateLabel}` : 'Plan a workout'}
        workouts={planner.workouts.filter((workout) => workout.active)}
      />

      <ChoiceSheet
        change={change}
        onClose={() => setChange(null)}
        onMoveOriginal={() => {
          if (!change) return;
          setTarget({ day: change.day, kind: 'replace_move', replacement: change.workout });
          setChange(null);
        }}
        onReplace={() => {
          if (!change) return;
          void planner.replace(change.day.date, change.workout.id);
          setChange(null);
        }}
      />

      <TargetSheet
        allowOccupied={target?.kind === 'move'}
        onClose={() => {
          setTarget(null);
          setSwapTarget(null);
        }}
        onNextWeek={() => navigateWeek(planner, 1)}
        onPreviousWeek={() => navigateWeek(planner, -1)}
        onSelect={chooseTarget}
        open={Boolean(target)}
        sourceDate={target?.day.date}
        swapTarget={swapTarget}
        week={planner.weekModel}
        onConfirmSwap={() => {
          if (!target || target.kind !== 'move' || !swapTarget) return;
          void planner.move(target.day.entryId as string, swapTarget.date);
          setTarget(null);
          setSwapTarget(null);
        }}
      />

    </>
  );
}

function WorkoutPicker({ onClose, onCreate, onSelect, open, title, workouts }: {
  onClose: () => void;
  onCreate: () => void;
  onSelect: (workout: WorkoutDefinition) => void;
  open: boolean;
  title: string;
  workouts: WorkoutDefinition[];
}) {
  const { scheme } = useAppTheme();
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  const [query, setQuery] = useState('');
  const visible = workouts.filter((workout) =>
    `${workout.title} ${workout.description}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <Sheet onClose={onClose} open={open} title={title}>
      <View style={styles.searchBox}>
        <AppIcon color={SemanticColors.textMuted} name="search" size={18} />
        <TextInput keyboardAppearance={scheme}
          accessibilityLabel="Search workouts"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setQuery}
          placeholder="Search workouts"
          placeholderTextColor={SemanticColors.textMuted}
          style={styles.searchInput}
          value={query}
        />
        {query ? <Pressable accessibilityLabel="Clear workout search" accessibilityRole="button" onPress={() => setQuery('')} style={styles.iconButton}>
          <AppIcon color={SemanticColors.textMuted} name="close" size={18} />
        </Pressable> : null}
      </View>
      <ScrollView contentContainerStyle={styles.sheetList} keyboardShouldPersistTaps="handled">
        {visible.map((workout) => (
          <Pressable
            accessibilityLabel={`Assign ${workout.title}`}
            accessibilityRole="button"
            key={workout.id}
            onPress={() => onSelect(workout)}
            style={({ pressed }) => [styles.workoutOption, pressed && styles.pressed]}>
            <View style={styles.optionIcon}><AppIcon color={SemanticColors.action} name={workout.focus === 'cardio' ? 'running' : 'strength'} size={20} /></View>
            <View style={styles.optionCopy}>
              <ThemedText style={styles.optionTitle}>{workout.title}</ThemedText>
              <ThemedText numberOfLines={2} style={styles.optionMeta}>{workout.exerciseCount} exercises · {workout.description}</ThemedText>
            </View>
            <AppIcon color={SemanticColors.textMuted} name="chevronRight" size={18} />
          </Pressable>
        ))}
        {visible.length === 0 ? <View style={styles.pickerEmpty}>
          <AppIcon color={SemanticColors.textMuted} name={workouts.length === 0 ? 'strength' : 'search'} size={32} />
          <ThemedText style={styles.optionTitle}>{workouts.length === 0 ? 'Build your first workout' : 'No workouts found'}</ThemedText>
          <ThemedText style={styles.emptyText}>{workouts.length === 0 ? 'Create a workout with your exercises, then add it to this day.' : 'Try a different name or clear your search.'}</ThemedText>
        </View> : null}
      </ScrollView>
      <Pressable accessibilityRole="button" onPress={onCreate} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={19} />
        <ThemedText style={styles.primaryButtonText}>Create workout</ThemedText>
      </Pressable>
    </Sheet>
  );
}

function ChoiceSheet({ change, onClose, onMoveOriginal, onReplace }: {
  change: ChangeState;
  onClose: () => void;
  onMoveOriginal: () => void;
  onReplace: () => void;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Sheet onClose={onClose} open={Boolean(change)} title="How should this change work?">
      <ThemedText style={styles.sheetDescription}>
        {change ? `${change.workout.title} will be assigned to ${change.day.weekday}, ${change.day.dateLabel}.` : ''}
      </ThemedText>
      <Pressable accessibilityLabel="Replace original workout" accessibilityRole="button" onPress={onReplace} style={({ pressed }) => [styles.choiceCard, pressed && styles.pressed]}>
        <AppIcon color={SemanticColors.action} name="swap" size={21} />
        <View style={styles.optionCopy}><ThemedText style={styles.optionTitle}>Replace</ThemedText><ThemedText style={styles.optionMeta}>Remove the original assignment.</ThemedText></View>
      </Pressable>
      <Pressable accessibilityLabel="Move original workout before replacing" accessibilityRole="button" onPress={onMoveOriginal} style={({ pressed }) => [styles.choiceCard, pressed && styles.pressed]}>
        <AppIcon color={SemanticColors.actionSoft} name="move" size={21} />
        <View style={styles.optionCopy}><ThemedText style={styles.optionTitle}>Move original</ThemedText><ThemedText style={styles.optionMeta}>Choose an empty current or future date first.</ThemedText></View>
      </Pressable>
    </Sheet>
  );
}

function TargetSheet({ allowOccupied, onClose, onConfirmSwap, onNextWeek, onPreviousWeek, onSelect, open, sourceDate, swapTarget, week }: {
  allowOccupied: boolean;
  onClose: () => void;
  onConfirmSwap: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onSelect: (day: WorkoutPlanDay) => void;
  open: boolean;
  sourceDate?: string;
  swapTarget: WorkoutPlanDay | null;
  week: { days: WorkoutPlanDay[]; week: number; year: number };
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Sheet onClose={onClose} open={open} title={swapTarget ? 'Preview swap' : 'Choose destination'}>
      {swapTarget ? (
        <>
          <ThemedText style={styles.sheetDescription}>Both dates are occupied. Confirm to swap the two workouts.</ThemedText>
          <View style={styles.swapPreview}><ThemedText style={styles.optionTitle}>{sourceDate}</ThemedText><AppIcon color={SemanticColors.action} name="swap" size={22} /><ThemedText style={styles.optionTitle}>{swapTarget.date}</ThemedText></View>
          <Pressable accessibilityRole="button" onPress={onConfirmSwap} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><ThemedText style={styles.primaryButtonText}>Confirm swap</ThemedText></Pressable>
        </>
      ) : (
        <>
          <View style={styles.targetHeader}>
            <IconButton label="Previous week" name="chevronLeft" onPress={onPreviousWeek} />
            <ThemedText style={styles.targetTitle}>Week {week.week}, {week.year}</ThemedText>
            <IconButton label="Next week" name="chevronRight" onPress={onNextWeek} />
          </View>
          <View style={styles.targetDays}>
            {week.days.map((day) => (
              <Pressable
                accessibilityLabel={`${day.weekday}, ${day.dateLabel}. ${day.entryId ? (allowOccupied ? 'Swap workouts' : 'Occupied') : 'Empty'}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: !day.editable || day.date === sourceDate || (Boolean(day.entryId) && !allowOccupied) }}
                disabled={!day.editable || day.date === sourceDate || (Boolean(day.entryId) && !allowOccupied)}
                key={day.date}
                onPress={() => onSelect(day)}
                style={({ pressed }) => [styles.targetDay, (!day.editable || day.date === sourceDate || (Boolean(day.entryId) && !allowOccupied)) && styles.disabled, pressed && styles.pressed]}>
                <View><ThemedText style={styles.optionTitle}>{day.weekday}</ThemedText><ThemedText style={styles.optionMeta}>{day.dateLabel}</ThemedText></View>
                <ThemedText style={day.entryId ? styles.occupiedText : styles.emptyDateText}>{day.entryId ? (allowOccupied ? 'Swap' : 'Occupied') : 'Empty'}</ThemedText>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </Sheet>
  );
}

function Sheet({ children, onClose, open, title }: { children: React.ReactNode; onClose: () => void; open: boolean; title: string }) {
  const styles = useStyles();
  return (
    <Modal animationType="slide" onRequestClose={onClose} presentationStyle="overFullScreen" transparent visible={open}>
      <View style={styles.modalBackdrop}>
        <Pressable accessibilityLabel="Close sheet" accessibilityRole="button" onPress={onClose} style={styles.backdropPress} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.sheetHeader}><ThemedText style={styles.sheetTitle}>{title}</ThemedText><IconButton label="Close" name="close" onPress={onClose} /></View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function IconButton({ label, name, onPress }: { label: string; name: 'chevronLeft' | 'chevronRight' | 'close'; onPress: () => void }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><AppIcon color={SemanticColors.textPrimary} name={name} size={20} /></Pressable>;
}

function navigateWeek(planner: ReturnType<typeof useWeeklyPlan>, direction: -1 | 1) {
  const nextDate = new Date(parseLocalDateKey(planner.dates[0]));
  nextDate.setDate(nextDate.getDate() + direction * 7);
  const { week, year } = getIsoWeek(nextDate);
  if (year !== planner.year) planner.selectYear(year);
  planner.selectWeek(week);
}
