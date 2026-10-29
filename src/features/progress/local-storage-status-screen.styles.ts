import { createThemedStyles } from '@/theme/create-themed-styles';
import { StyleSheet } from 'react-native';

import { Fonts, MaxContentWidth, Radius, Spacing, Typography } from '@/theme/tokens';

export const useStyles = createThemedStyles(({ DesignColors, SemanticColors }) => StyleSheet.create({
  scrollContent: { alignItems: 'center', flexGrow: 1, paddingBottom: 112, paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
  content: { gap: Spacing.three, maxWidth: Math.min(MaxContentWidth, 430), width: '100%' },
  headingBlock: { gap: Spacing.one },
  title: { ...Typography['2xl'], color: SemanticColors.textPrimary, fontFamily: Fonts.heading },
  subtitle: { color: SemanticColors.textSecondary, fontFamily: Fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  statusCard: { borderCurve: 'continuous', borderRadius: Radius.md, borderWidth: 1, gap: Spacing.three, padding: Spacing.three },
  readyCard: { backgroundColor: SemanticColors.successTint, borderColor: SemanticColors.successBorder },
  errorCard: { backgroundColor: DesignColors.surfaceContainerLow, borderColor: SemanticColors.border },
  statusHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  statusTitleRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  statusDot: { borderRadius: Radius.full, height: 10, width: 10 },
  statusTitle: { ...Typography.lg, color: SemanticColors.textPrimary, fontFamily: Fonts.heading },
  statusBody: { color: SemanticColors.textPrimary, fontFamily: Fonts.bodyMedium, fontSize: 13, lineHeight: 19 },
  retryButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: SemanticColors.action, borderRadius: Radius.sm, flexDirection: 'row', gap: Spacing.one, minHeight: 48, paddingHorizontal: Spacing.three },
  retryText: { color: DesignColors.onPrimaryContainer, fontFamily: Fonts.bodyBold, fontSize: 12, textTransform: 'uppercase' },
  guidelinesBlock: { borderTopColor: SemanticColors.border, borderTopWidth: 1, gap: Spacing.three, paddingTop: Spacing.three },
  guidelinesTitle: { ...Typography.lg, color: SemanticColors.textPrimary, fontFamily: Fonts.heading },
  guidelineRow: { flexDirection: 'row', gap: Spacing.two },
  guidelineIcon: { alignItems: 'center', backgroundColor: SemanticColors.actionTint, borderRadius: Radius.sm, height: 32, justifyContent: 'center', width: 32 },
  guidelineCopy: { flex: 1, gap: Spacing.half },
  guidelineTitle: { color: SemanticColors.textPrimary, fontFamily: Fonts.bodyBold, fontSize: 13, lineHeight: 17 },
  guidelineBody: { color: SemanticColors.textSecondary, fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.72 },
}));
