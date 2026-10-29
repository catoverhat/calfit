import { createThemedStyles } from '@/theme/create-themed-styles';
import { StyleSheet } from 'react-native';

import { Fonts, Typography, Spacing, Radius, MaxContentWidth } from '@/theme/tokens';

export const useStyles = createThemedStyles(({ DesignColors, SemanticColors, ComponentTokens }) => StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  headingBlock: {
    gap: Spacing.one,
  },
  title: {
    ...Typography['2xl'],
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 31,
  },
  subtitle: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 280,
  },
  filterScroll: { flexGrow: 0, flexShrink: 0 },
  filterContent: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  filterChip: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
    flexShrink: 0,
    paddingVertical: Spacing.two,
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  filterChipSelected: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  filterText: {
    ...Typography.xs,
    textAlign: 'center',
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  filterTextSelected: {
    color: DesignColors.onPrimaryContainer,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    minHeight: 138,
    padding: Spacing.three,
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  cardTitleMuted: {
    color: SemanticColors.textMuted,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  statusDot: {
    backgroundColor: SemanticColors.action,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusDotMuted: {
    backgroundColor: SemanticColors.textMuted,
  },
  statusText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  statusTextMuted: {
    color: SemanticColors.textMuted,
  },
  ring: {
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 4,
    // min sizes let the ring grow with large system text instead of clipping "100%".
    minHeight: 56,
    justifyContent: 'center',
    minWidth: 56,
    paddingHorizontal: 4,
  },
  ringText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  metricsRow: {
    borderTopColor: SemanticColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  metric: {
    flex: 1,
    gap: Spacing.half,
  },
  metricLabel: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  metricValue: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  monthSeparator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  monthLabel: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  monthLine: {
    backgroundColor: SemanticColors.border,
    flex: 1,
    height: 1,
  },
  pressed: {
    opacity: 0.68,
  },
  statusCard: { backgroundColor: DesignColors.surfaceContainerLow, borderColor: SemanticColors.border, borderRadius: Radius.md, borderWidth: 1, gap: Spacing.one, padding: Spacing.three },
  statusTitle: { color: SemanticColors.textPrimary, fontFamily: Fonts.bodyBold, fontSize: 14, lineHeight: 19 },
  statusBody: { color: SemanticColors.textSecondary, fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 17 },
}));
