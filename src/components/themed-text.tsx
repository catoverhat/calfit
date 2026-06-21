import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
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
    ...Typography['5xl'],
    fontFamily: Fonts.heading,
  },
  subtitle: {
    ...Typography['3xl'],
    fontFamily: Fonts.heading,
  },
  link: {
    ...Typography.sm,
    fontFamily: Fonts.label,
  },
  linkPrimary: {
    ...Typography.sm,
    fontFamily: Fonts.label,
    color: Palette.tertiary[500],
  },
  code: {
    ...Typography.xs,
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
  },
});
