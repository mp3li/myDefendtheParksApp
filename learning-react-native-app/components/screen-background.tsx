import { ImageBackground } from 'expo-image';
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Palette, SurfaceColors } from '@/constants/theme';

type ScreenBackgroundVariant = 'main' | 'where' | 'journey';

const BACKGROUND_IMAGES = {
  main: require('@/assets/images/maria-orlova-3UWc-EMf0zA-unsplash.jpg'),
  where: require('@/assets/images/evan-wise-2wvXI4mjYJ8-unsplash.jpg'),
  journey: require('@/assets/images/evan-wise-mNSSpeJsnQA-unsplash.jpg'),
};

export function ScreenBackground({
  children,
  variant = 'main',
  style,
}: {
  children: ReactNode;
  variant?: ScreenBackgroundVariant;
  style?: ViewStyle;
}) {
  return (
    <ImageBackground source={BACKGROUND_IMAGES[variant]} style={[styles.background, style]} contentFit="cover">
      <View style={styles.dimLayer}>{children}</View>
    </ImageBackground>
  );
}

export const glassSurfaceStyle = {
  backgroundColor: SurfaceColors.glassLight,
  borderColor: 'rgba(170, 82, 21, 0.42)',
  borderWidth: 1,
} as const;

export const warmGlassSurfaceStyle = {
  backgroundColor: SurfaceColors.glassWarm,
  borderColor: 'rgba(170, 82, 21, 0.48)',
  borderWidth: 1,
} as const;

export const blushGlassSurfaceStyle = {
  backgroundColor: SurfaceColors.glassBlush,
  borderColor: 'rgba(102, 49, 12, 0.48)',
  borderWidth: 1,
} as const;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  dimLayer: {
    flex: 1,
    backgroundColor: `${Palette.night}8f`,
  },
});
