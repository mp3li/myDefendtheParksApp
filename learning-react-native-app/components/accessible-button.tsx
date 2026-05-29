import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import { Fonts, Palette, SurfaceColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MIN_TOUCH_TARGET_SIZE } from '@/hooks/use-responsive-layout';

interface AccessibleButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  accessibilityHint?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Accessible button component with proper sizing and contrast
 * Meets WCAG 2.1 AA standards for touch targets and color contrast
 */
export function AccessibleButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  accessibilityHint,
  style,
  testID,
}: AccessibleButtonProps) {
  const { scale } = useWindowDimensions();
  const primaryColor = useThemeColor({ light: Palette.cedar, dark: Palette.campfire }, 'tint');
  const primaryTextColor = useThemeColor({ light: Palette.yosemiteIvory, dark: Palette.night }, 'text');
  const secondaryTextColor = useThemeColor({ light: Palette.night, dark: Palette.yosemiteIvory }, 'text');
  const backgroundColor = useThemeColor(
    { light: SurfaceColors.glassLight, dark: SurfaceColors.glassDark },
    'background'
  );

  // Calculate button dimensions to meet minimum 48x48 touch target
  const buttonDimensions = useMemo(() => {
    switch (size) {
      case 'small':
        return {
          minHeight: Math.max(40, MIN_TOUCH_TARGET_SIZE * 0.85),
          minWidth: MIN_TOUCH_TARGET_SIZE * 1.2,
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
        };
      case 'large':
        return {
          minHeight: Math.max(56, MIN_TOUCH_TARGET_SIZE * 1.2),
          minWidth: MIN_TOUCH_TARGET_SIZE * 1.5,
          paddingHorizontal: 20,
          paddingVertical: 12,
          fontSize: 18,
        };
      case 'medium':
      default:
        return {
          minHeight: MIN_TOUCH_TARGET_SIZE,
          minWidth: MIN_TOUCH_TARGET_SIZE,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 16,
        };
    }
  }, [size]);

  // Get variant styles with proper contrast
  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          borderWidth: 0,
          textColor: primaryTextColor,
        };
      case 'secondary':
        return {
          backgroundColor,
          borderWidth: 1,
          borderColor: Palette.campfire,
          textColor: secondaryTextColor,
        };
      case 'outline':
        return {
          backgroundColor: 'rgba(170, 82, 21, 0.18)',
          borderWidth: 2,
          borderColor: Palette.campfire,
          textColor: secondaryTextColor,
        };
      default:
        return {
          backgroundColor: primaryColor,
          borderWidth: 0,
          textColor: primaryTextColor,
        };
    }
  }, [variant, primaryColor, primaryTextColor, secondaryTextColor, backgroundColor]);

  const buttonStyle = [
    styles.button,
    {
      minHeight: buttonDimensions.minHeight,
      minWidth: buttonDimensions.minWidth,
      paddingHorizontal: buttonDimensions.paddingHorizontal,
      paddingVertical: buttonDimensions.paddingVertical,
      backgroundColor: disabled ? '#ccc' : variantStyle.backgroundColor,
      borderWidth: variantStyle.borderWidth,
      borderColor: variantStyle.borderColor,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      fontSize: buttonDimensions.fontSize * Math.min(scale, 1.3),
      color: disabled ? '#666' : variantStyle.textColor,
    },
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text
        style={textStyle}
        allowFontScaling={true}
        maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Fonts.sans,
  },
});
