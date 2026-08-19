import { StyleSheet } from 'react-native';

import { DesignColors, SemanticColors, Fonts, Typography, TypeScale, Spacing, Space, Radius, ComponentTokens, MaxContentWidth } from '@/theme/tokens';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: SemanticColors.canvas,
    paddingBottom: 116,
    paddingHorizontal: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  heading: {
    gap: Space.xs,
    paddingTop: Space.xs,
  },
  eyebrow: {
    ...TypeScale.labelMd,
    color: DesignColors.onSurfaceVariant,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  cardTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.14)',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  iconButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  cardCopy: {
    gap: Space.xs,
  },
  cardTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  cardDescription: {
    ...Typography.sm,
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyMedium,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  metricBlock: {
    gap: Space.xs,
    minWidth: 82,
  },
  metaLabel: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  metricValue: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  scheduleChip: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: Space.xs,
  },
  scheduleText: {
    ...Typography.xs,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
  divider: {
    backgroundColor: SemanticColors.border,
    height: 1,
  },
  lastCompleted: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    fontStyle: 'italic',
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingBottom: Space.xs,
    paddingTop: Space.xs,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    boxShadow: '0 12px 22px rgba(255, 95, 31, 0.24)',
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
