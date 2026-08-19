import { StyleSheet } from 'react-native';

import { Palette, Fonts, Typography, Spacing, MaxContentWidth } from '@/theme/tokens';

export const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: Spacing.five,
  },
  content: {
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  heroImage: {
    aspectRatio: 1.7,
    width: '100%',
  },
  summary: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  title: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  description: {
    ...Typography.sm,
    fontFamily: Fonts.body,
  },
  metadata: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metadataText: {
    ...Typography.xs,
    backgroundColor: Palette.primary[100],
    borderRadius: 6,
    color: Palette.primary[900],
    fontFamily: Fonts.bodySemiBold,
    overflow: 'hidden',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  exerciseSection: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  sectionTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
    marginBottom: Spacing.one,
  },
  exerciseRow: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  exerciseIndex: {
    alignItems: 'center',
    backgroundColor: Palette.primary[100],
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  exerciseIndexText: {
    ...Typography.sm,
    color: Palette.primary[800],
    fontFamily: Fonts.bodyBold,
  },
  exerciseCopy: {
    flex: 1,
  },
  exerciseName: {
    ...Typography.sm,
    fontFamily: Fonts.bodySemiBold,
  },
  exerciseDetail: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
  missingContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.three,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  backButton: {
    backgroundColor: Palette.primary[700],
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButtonText: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  startWorkoutButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  startWorkoutText: {
    ...Typography.sm,
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
  },
  editButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  editButtonText: {
    ...Typography.sm,
    color: Palette.primary[300],
    fontFamily: Fonts.bodyBold,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
