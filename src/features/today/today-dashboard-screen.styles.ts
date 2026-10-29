import { StyleSheet } from "react-native";

import { createThemedStyles } from "@/theme/create-themed-styles";
import {
  Fonts,
  MaxContentWidth,
  Radius,
  Space,
  TouchTarget,
  TypeScale,
  Typography,
} from "@/theme/tokens";

export const useStyles = createThemedStyles(
  ({ DesignColors, SemanticColors }) => {
    const metricCard = {
      backgroundColor: SemanticColors.card,
      borderColor: SemanticColors.border,
      borderRadius: Radius.md,
      borderWidth: 1,
      gap: Space.md,
      padding: Space.md,
    };

    return StyleSheet.create({
      safeArea: { backgroundColor: SemanticColors.canvas, flex: 1 },
      screen: { backgroundColor: SemanticColors.canvas, flex: 1 },
      scrollContent: {
        alignItems: "center",
        flexGrow: 1,
        paddingBottom: Space.xl,
        paddingHorizontal: Space.md,
        paddingTop: Space.base,
      },
      content: {
        gap: Space.lg,
        maxWidth: Math.min(MaxContentWidth, 640),
        width: "100%",
      },
      greetingBlock: { gap: Space.base },
      dateLabel: {
        ...TypeScale.labelMd,
        color: SemanticColors.textMuted,
        letterSpacing: 0.7,
        textTransform: "uppercase",
      },
      greeting: { ...TypeScale.headlineLg, color: SemanticColors.textPrimary },
      section: { gap: Space.md },
      sectionHeading: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        columnGap: Space.sm,
      },
      sectionTitle: {
        ...TypeScale.headlineSm,
        color: SemanticColors.textPrimary,
      },
      sectionAction: {
        alignItems: "center",
        flexDirection: "row",
        gap: Space.xs,
        minHeight: TouchTarget.min,
      },
      sectionActionText: {
        ...Typography.sm,
        color: SemanticColors.actionSoft,
        fontFamily: Fonts.bodySemiBold,
      },
      progressGrid: { flexDirection: "row", flexWrap: "wrap", gap: Space.sm },
      progressLink: { flexBasis: 144, flexGrow: 1, minWidth: 0 },
      progressCard: { ...metricCard, flex: 1 },
      progressStandaloneCard: {
        ...metricCard,
        flexBasis: 144,
        flexGrow: 1,
        minWidth: 0,
      },
      progressCardTop: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      progressLabel: {
        ...Typography.sm,
        color: SemanticColors.textSecondary,
        fontFamily: Fonts.bodyMedium,
      },
      progressValue: {
        ...TypeScale.headlineLg,
        color: SemanticColors.textPrimary,
        fontVariant: ["tabular-nums"],
      },
      metricCopy: { gap: Space.xs },
      metricHelper: {
        ...Typography.xs,
        color: SemanticColors.textMuted,
        fontFamily: Fonts.body,
      },
      measurementRow: {
        alignItems: "center",
        borderColor: SemanticColors.border,
        borderRadius: Radius.md,
        borderWidth: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Space.sm,
        minHeight: 80,
        padding: Space.md,
      },
      measurementIcon: {
        alignItems: "center",
        backgroundColor: DesignColors.surfaceContainerHigh,
        borderRadius: Radius.full,
        height: 40,
        justifyContent: "center",
        width: 40,
      },
      measurementCopy: { flex: 1, gap: Space.xs, minWidth: 96 },
      measurementValue: {
        ...Typography.base,
        color: SemanticColors.textPrimary,
        flexShrink: 1,
        fontFamily: Fonts.bodySemiBold,
        fontVariant: ["tabular-nums"],
      },
      tipCard: {
        alignItems: "flex-start",
        flexDirection: "row",
        gap: Space.sm,
        paddingVertical: Space.base,
      },
      tipCopy: { flex: 1, gap: Space.xs },
      tipTitle: {
        ...Typography.sm,
        color: SemanticColors.textSecondary,
        fontFamily: Fonts.bodySemiBold,
      },
      tipText: {
        ...Typography.sm,
        color: SemanticColors.textMuted,
        fontFamily: Fonts.body,
      },
      pressed: { opacity: 0.72 },
    });
  },
);
