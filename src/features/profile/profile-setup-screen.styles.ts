import { createThemedStyles } from '@/theme/create-themed-styles';
import { StyleSheet } from 'react-native';

import { Fonts, Typography, Spacing, MaxContentWidth, Radius, TouchTarget, TypeScale } from '@/theme/tokens';

export const useStyles = createThemedStyles(({ DesignColors, SemanticColors, ComponentTokens }) => StyleSheet.create({
  safeArea: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  screen: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 104,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 640),
    width: '100%',
  },
  heroCopy: {
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  title: {
    ...TypeScale.headlineLg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: TypeScale.headlineLg.lineHeight,
  },
  subtitle: {
    ...Typography.sm,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
  },
  appearanceSection: { gap: Spacing.two },
  appearanceHelper: { ...Typography.sm, color: SemanticColors.textSecondary, fontFamily: Fonts.body },
  formStack: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  field: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.one,
    minHeight: 70,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  fieldLabel: {
    color: DesignColors.primary,
    fontFamily: Fonts.bodyBold,
    ...Typography.sm,
    textTransform: 'uppercase',
  },
  fieldHelper: {
    ...Typography.xs,
    color: SemanticColors.textMuted,
    fontFamily: Fonts.body,
  },
  fieldRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    ...Typography.base,
    color: SemanticColors.textPrimary,
    flex: 1,
    minWidth: 0,
    fontFamily: Fonts.bodySemiBold,
    minHeight: TouchTarget.min,
    padding: 0,
  },
  fieldAccessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  sectionTitle: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  unitStack: {
    gap: Spacing.two,
  },
  unitCard: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  unitLabel: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    ...Typography.sm,
  },
  segmented: {
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
  },
  segmentedWide: {
    alignSelf: 'stretch',
  },
  segment: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
    minWidth: TouchTarget.min,
    paddingHorizontal: Spacing.two,
  },
  segmentWide: {
    flex: 1,
    minHeight: TouchTarget.min,
  },
  segmentSelected: {
    backgroundColor: SemanticColors.action,
  },
  segmentPressed: {
    opacity: 0.72,
  },
  segmentText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    ...Typography.sm,
  },
  segmentTextSelected: {
    color: DesignColors.onPrimaryContainer,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: Spacing.three,
  },
  saveButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  saveButtonDisabled: {
    opacity: 0.54,
  },
  feedbackError: {
    color: SemanticColors.danger,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  feedbackSuccess: {
    color: SemanticColors.success,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  saveButtonText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  securitySection: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  securityCard: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  securityCopy: {
    gap: Spacing.one,
  },
  securityCardTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  securityCardDescription: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
  },
  lockButton: {
    alignItems: 'center',
    borderColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
    paddingHorizontal: Spacing.three,
  },
  lockButtonPressed: {
    backgroundColor: SemanticColors.actionTint,
    transform: [{ scale: 0.99 }],
  },
  lockButtonText: {
    color: DesignColors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
}));
