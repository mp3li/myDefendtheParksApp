import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack, useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppErrorBoundary } from '@/components/app-error-boundary';
import { AppHeader } from '@/components/app-header';
import { Palette } from '@/constants/theme';
import { AppStateProvider, GlobalSnackbar, useAppStateContext } from '@/context/app-state-context';
import { PageSectionsProvider } from '@/context/page-sections-context';
import { SavedParksProvider } from '@/context/saved-parks-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/tasks/journey-mode-task';

export const unstable_settings = {
  anchor: '(tabs)',
};

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.meadowBloom,
    background: Palette.night,
    card: Palette.deepPine,
    text: Palette.graniteShadows,
    border: Palette.valleyMoss,
    notification: Palette.meadowBloom,
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Palette.summitBlush,
    background: Palette.night,
    card: Palette.deepPine,
    text: Palette.yosemiteIvory,
    border: Palette.valleyMoss,
    notification: Palette.summitBlush,
  },
};

function AppNavigator() {
  const router = useRouter();
  const { reportError } = useAppStateContext();

  const handleIncomingUrl = useCallback(
    (url: string | null) => {
      if (!url) {
        return;
      }

      const parsedUrl = Linking.parse(url);
      if (parsedUrl.path === 'where-are-we' || parsedUrl.hostname === 'where-are-we') {
        router.push('/where-are-we' as Href);
      } else if (parsedUrl.path === 'journey-mode' || parsedUrl.hostname === 'journey-mode') {
        router.push('/journey-mode' as Href);
      }
    },
    [router]
  );

  useEffect(() => {
    void Linking.getInitialURL().then(handleIncomingUrl);
    const subscription = Linking.addEventListener('url', (event) => {
      handleIncomingUrl(event.url);
    });

    return () => subscription.remove();
  }, [handleIncomingUrl]);

  return (
    <AppErrorBoundary
      onError={(error) => {
        reportError(error, 'The app hit a rendering issue and recovered.');
      }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </AppErrorBoundary>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'LeagueSpartan-Bold': require('@/assets/fonts/LeagueSpartan-Bold.otf'),
    'Aileron-Regular': require('@/assets/fonts/Aileron-Regular.otf'),
    'Aileron-Italic': require('@/assets/fonts/Aileron-Italic.otf'),
    ...MaterialIcons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <SavedParksProvider>
          <PageSectionsProvider>
            <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
              <AppHeader />
              <AppNavigator />
              <GlobalSnackbar />
              <StatusBar style="auto" />
            </ThemeProvider>
          </PageSectionsProvider>
        </SavedParksProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
