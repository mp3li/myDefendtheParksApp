/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Palette = {
  campfire: '#aa5215',
  cedar: '#66310c',
  pine: '#151e08',
  deepPine: '#0b1406',
  night: '#04040c',
  graniteShadows: '#04040c',
  valleyMoss: '#151e08',
  yosemiteIvory: '#f7efe2',
  mistflower: '#0b1406',
  summitBlush: '#aa5215',
  meadowBloom: '#66310c',
  plum: '#04040c',
  rust: '#aa5215',
  gold: '#aa5215',
  blueGray: '#151e08',
  mist: '#f7efe2',
};

export const SurfaceColors = {
  glassLight: 'rgba(247, 239, 226, 0.76)',
  glassWarm: 'rgba(170, 82, 21, 0.24)',
  glassBlush: 'rgba(102, 49, 12, 0.32)',
  glassBloom: 'rgba(21, 30, 8, 0.42)',
  glassDark: 'rgba(4, 4, 12, 0.74)',
  navLight: 'rgba(11, 20, 6, 0.94)',
  navDark: 'rgba(4, 4, 12, 0.94)',
};

export const Colors = {
  light: {
    text: Palette.night,
    background: Palette.yosemiteIvory,
    tint: Palette.campfire,
    icon: Palette.cedar,
    tabIconDefault: Palette.yosemiteIvory,
    tabIconSelected: Palette.campfire,
  },
  dark: {
    text: Palette.yosemiteIvory,
    background: Palette.night,
    tint: Palette.campfire,
    icon: Palette.campfire,
    tabIconDefault: Palette.yosemiteIvory,
    tabIconSelected: Palette.campfire,
  },
};

export const Fonts = {
  sans: 'Aileron-Regular',
  sansItalic: 'Aileron-Italic',
  serif: 'LeagueSpartan-Bold',
  rounded: 'Aileron-Regular',
  mono: 'Aileron-Regular',
};
