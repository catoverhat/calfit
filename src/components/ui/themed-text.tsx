import { useAppTheme } from "@/theme/app-theme-provider";
import { createThemedStyles } from "@/theme/create-themed-styles";
import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, Typography } from "@/theme/tokens";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Text
      style={[
        { color: SemanticColors.textPrimary },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const useStyles = createThemedStyles(({ SemanticColors }) =>
  StyleSheet.create({
    small: {
      ...Typography.sm,
      fontFamily: Fonts.bodyMedium,
    },
    smallBold: {
      ...Typography.sm,
      fontFamily: Fonts.bodyBold,
    },
    default: {
      ...Typography.base,
      fontFamily: Fonts.bodyMedium,
    },
    title: {
      ...Typography["5xl"],
      fontFamily: Fonts.heading,
    },
    subtitle: {
      ...Typography["3xl"],
      fontFamily: Fonts.heading,
    },
    link: {
      ...Typography.sm,
      fontFamily: Fonts.label,
    },
    linkPrimary: {
      ...Typography.sm,
      fontFamily: Fonts.label,
      color: SemanticColors.info,
    },
    code: {
      ...Typography.xs,
      fontFamily: Fonts.mono,
      fontWeight: Platform.select({ android: 700 }) ?? 500,
    },
  }),
);
