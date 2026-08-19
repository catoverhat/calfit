import { StyleSheet } from 'react-native';

import { DesignColors, SemanticColors, Fonts, Typography, Spacing, Radius, ComponentTokens, MaxContentWidth } from '@/theme/tokens';

export const styles = StyleSheet.create({
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
    maxWidth: 330,
  },
  statusList: {
    gap: Spacing.two,
  },
  statusCard: {
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusDot: {
    borderRadius: Radius.full,
    height: 10,
    width: 10,
  },
  statusTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  statusBody: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  footerText: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E2231A',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 36,
    paddingHorizontal: Spacing.three,
  },
  retryText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  progressBlock: {
    gap: Spacing.one,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    backgroundColor: DesignColors.surfaceContainerHighest,
    borderRadius: Radius.full,
    height: 5,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: DesignColors.primaryFixedDim,
    borderRadius: Radius.full,
    height: '100%',
  },
  errorBlock: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: 'rgba(255, 72, 72, 0.28)',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  errorCopy: {
    flex: 1,
  },
  errorTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  errorCode: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.6,
    lineHeight: 16,
  },
  errorDetail: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  guidelinesBlock: {
    borderTopColor: SemanticColors.border,
    borderTopWidth: 1,
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  guidelinesTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  guidelinesList: {
    gap: Spacing.two,
  },
  guidelineRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  guidelineIcon: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  guidelineIconInfo: {
    backgroundColor: 'rgba(141, 205, 255, 0.12)',
  },
  guidelineIconLocal: {
    backgroundColor: 'rgba(255, 95, 31, 0.12)',
  },
  guidelineCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  guidelineTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  guidelineBody: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
