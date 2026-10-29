import { StyleSheet } from "react-native";

import { createThemedStyles } from "@/theme/create-themed-styles";
import {
  Fonts,
  Radius,
  Space,
  TouchTarget,
  TypeScale,
  Typography,
} from "@/theme/tokens";

export const useStyles = createThemedStyles(
  ({ SemanticColors, ComponentTokens }) =>
    StyleSheet.create({
      card: {
        backgroundColor: SemanticColors.card,
        borderColor: SemanticColors.border,
        borderRadius: Radius.md,
        borderWidth: 1,
        gap: Space.lg,
        padding: Space.lg,
      },
      activeCard: { borderColor: SemanticColors.actionBorder },
      completedCard: { borderColor: SemanticColors.successBorder },
      statusRow: { alignItems: "center", flexDirection: "row", gap: Space.sm },
      statusIcon: {
        alignItems: "center",
        backgroundColor: SemanticColors.actionTint,
        borderRadius: Radius.full,
        height: 40,
        justifyContent: "center",
        width: 40,
      },
      completedIcon: { backgroundColor: SemanticColors.successTint },
      statusLabel: {
        ...TypeScale.labelMd,
        color: SemanticColors.actionSoft,
        flex: 1,
        letterSpacing: 0.7,
        textTransform: "uppercase",
      },
      successText: { color: SemanticColors.success },
      copy: { gap: Space.base },
      title: { ...TypeScale.headlineMd, color: SemanticColors.textPrimary },
      description: {
        ...Typography.base,
        color: SemanticColors.textSecondary,
        fontFamily: Fonts.body,
      },
      metadata: { flexDirection: "row", flexWrap: "wrap", gap: Space.md },
      metaItem: { alignItems: "center", flexDirection: "row", gap: Space.base },
      metaText: {
        ...Typography.sm,
        color: SemanticColors.textSecondary,
        fontFamily: Fonts.bodyMedium,
      },
      actions: { gap: Space.base },
      primaryButton: {
        alignItems: "center",
        backgroundColor: ComponentTokens.button.primaryBackground,
        borderRadius: Radius.md,
        flexDirection: "row",
        gap: Space.base,
        justifyContent: "center",
        minHeight: 56,
        paddingHorizontal: Space.md,
        paddingVertical: Space.md,
      },
      primaryLabel: {
        ...Typography.base,
        color: SemanticColors.actionText,
        flexShrink: 1,
        fontFamily: Fonts.bodyBold,
        textAlign: "center",
      },
      planButton: {
        alignItems: "center",
        flexDirection: "row",
        gap: Space.base,
        minHeight: TouchTarget.min,
        paddingVertical: Space.base,
      },
      planLabel: {
        ...Typography.sm,
        color: SemanticColors.textSecondary,
        flex: 1,
        fontFamily: Fonts.bodyMedium,
      },
      disabled: { opacity: 0.6 },
      pressed: { opacity: 0.72 },
    }),
);
