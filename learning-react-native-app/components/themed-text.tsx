import { StyleSheet, Text, type TextProps, useWindowDimensions, AccessibilityRole } from 'react-native';
import { useMemo } from 'react';

import { Fonts, Palette } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.5,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    {
      light: lightColor ?? (type === 'title' || type === 'subtitle' ? Palette.cedar : undefined),
      dark: darkColor,
    },
    type === 'link' ? 'tint' : 'text'
  );
  const { scale } = useWindowDimensions();

  // Responsive font size based on scale
  const responsiveStyle = useMemo(() => {
    const baseStyle =
      type === 'default'
        ? styles.default
        : type === 'title'
          ? styles.title
          : type === 'defaultSemiBold'
            ? styles.defaultSemiBold
            : type === 'subtitle'
              ? styles.subtitle
              : styles.link;
    const baseFontSize = 'fontSize' in baseStyle ? baseStyle.fontSize : undefined;
    const baseLineHeight = 'lineHeight' in baseStyle ? baseStyle.lineHeight : undefined;

    // Apply dynamic type scaling for accessibility
    return {
      ...baseStyle,
      fontSize: (baseFontSize || 16) * Math.min(scale, 1.3), // Cap at 1.3x for readability
      lineHeight: (baseLineHeight || 24) * Math.min(scale, 1.3),
    };
  }, [type, scale]);

  return (
    <Text
      style={[{ color }, responsiveStyle, style]}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Fonts.sans,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 23,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 21,
    fontFamily: Fonts.serif,
  },
  link: {
    lineHeight: 22,
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
});
