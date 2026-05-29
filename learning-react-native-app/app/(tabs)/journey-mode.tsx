import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccessibleButton } from '@/components/accessible-button';
import { CollapsiblePreviewSection } from '@/components/collapsible-preview-section';
import { JourneyModePanel } from '@/components/journey-mode-panel';
import { ResponsiveContainer } from '@/components/responsive-layout';
import { glassSurfaceStyle, ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';
import { useAppStateContext } from '@/context/app-state-context';
import { usePageSections } from '@/context/page-sections-context';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { requestJourneyModePermissions, setJourneyModeBaseline, setJourneyModeEnabled, startJourneyModeTask } from '@/services/journey-mode';
import { fetchLocationContext, fetchNearbySovereignties } from '@/services/location-context';
import type { IndigenousContextData, NearbySovereignty } from '@/types/parks';

function formatCoordinate(value: number) {
  return value.toFixed(5);
}

function BulletList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <ThemedText>{emptyText}</ThemedText>;
  }

  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <ThemedText key={`${item}-${index}`}>• {item}</ThemedText>
      ))}
    </View>
  );
}

export default function JourneyModeScreen() {
  const { reportError, showSnackbar } = useAppStateContext();
  const { setJumpHandler, setSections } = usePageSections();
  const { getResponsivePadding } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const padding = getResponsivePadding();
  const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [context, setContext] = useState<IndigenousContextData | null>(null);
  const [nearby, setNearby] = useState<NearbySovereignty[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      setSections([
        { id: 'overview', label: 'Overview' },
        { id: 'journey', label: 'How Journey Mode Works' },
        { id: 'results', label: 'Current Location Results' },
      ]);
      setJumpHandler((id) => {
        scrollRef.current?.scrollTo({ y: sectionOffsets.current[id] ?? 0, animated: true });
      });

      return () => {
        setSections([]);
        setJumpHandler(null);
      };
    }, [setJumpHandler, setSections])
  );

  const loadJourneyLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      setPermissionMessage('');
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setPermissionMessage('Location permission is needed to get Journey Mode coordinates.');
        return;
      }
      await requestJourneyModePermissions();

      const nextLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const nextCoordinate = {
        latitude: nextLocation.coords.latitude,
        longitude: nextLocation.coords.longitude,
      };
      setCoordinate(nextCoordinate);
      const nextContext = await fetchLocationContext(nextCoordinate.latitude, nextCoordinate.longitude);
      setContext(nextContext);
      await setJourneyModeBaseline(nextContext);
      await setJourneyModeEnabled(true);
      try {
        await startJourneyModeTask();
      } catch {
        setPermissionMessage('Journey Mode is enabled, but background updates may be limited in this runtime.');
      }
      setNearby(await fetchNearbySovereignties(nextCoordinate.latitude, nextCoordinate.longitude, nextContext));
      showSnackbar('Journey Mode location context updated.', 'info');
    } catch (error) {
      reportError(error, 'Unable to load Journey Mode location context.');
    } finally {
      setLoadingLocation(false);
    }
  }, [reportError, showSnackbar]);

  const languages = context?.languages ?? [];
  const territories = context?.territories ?? [];
  const treaties = context?.treaties ?? [];

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ScreenBackground variant="journey">
        <ResponsiveContainer style={{ gap: padding, paddingTop: 0 }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ gap: padding, paddingTop: padding, paddingBottom: 28 }}>
          <ThemedView
            style={[styles.noteCard, glassSurfaceStyle, { gap: 10 }]}
            onLayout={(event) => {
              sectionOffsets.current.overview = event.nativeEvent.layout.y;
            }}>
            <ThemedText
              type="title"
              accessibilityRole="header"
              lightColor={Palette.cedar}
              darkColor={Palette.yosemiteIvory}>
              Journey Mode
            </ThemedText>
            <ThemedText>
              Use Journey Mode to receive real-time updates and notifications when you have traveled
              into a new area that returns new information from the Native Land API. Defend the Parks
              app can use your device location with your permission to gather your exact coordinates.
              Then the app will compare those coordinates to the data from the Native Land API, so you
              can learn about Indigenous languages, territories, treaties, and nearby sovereignty
              records associated with the land you are currently on, as you go on a journey.
            </ThemedText>
            <AccessibleButton
              label="Begin Journey Mode"
              onPress={() => {
                void loadJourneyLocation();
              }}
              variant="primary"
              accessibilityHint="Requests location permission and loads Native Land context for Journey Mode"
            />
            {permissionMessage ? <ThemedText>{permissionMessage}</ThemedText> : null}
            {coordinate ? (
              <ThemedText>
                Coordinates: {formatCoordinate(coordinate.latitude)}, {formatCoordinate(coordinate.longitude)}
              </ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView
            style={styles.transparentWrap}
            onLayout={(event) => {
              sectionOffsets.current.journey = event.nativeEvent.layout.y;
            }}>
            <JourneyModePanel
              title="How Journey Mode Works"
              currentContext={context}
              showToggle={false}
              description="With your permission, this app can run a background service checking your location similar to how navigation apps use your location as you go on a drive and give you directions. Instead of directions, you will receive real-time updates and notifications when you have traveled into a new area that returns new information from the Native Land API, along with all available information for the current location."
            />
          </ThemedView>

          <ThemedView
            style={[styles.noteCard, glassSurfaceStyle]}
            onLayout={(event) => {
              sectionOffsets.current.results = event.nativeEvent.layout.y;
            }}>
            <ThemedText type="subtitle">Current Location Results</ThemedText>
            {loadingLocation ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Palette.campfire} />
                <ThemedText>Getting updated Journey Mode results...</ThemedText>
              </View>
            ) : null}
            {context ? (
              <View style={styles.resultsStack}>
                <CollapsiblePreviewSection title="Languages Returned Here" collapsible={languages.length > 4}>
                  <BulletList items={languages} emptyText="No language records were returned." />
                </CollapsiblePreviewSection>
                <CollapsiblePreviewSection title="Territories Returned Here" collapsible={territories.length > 4}>
                  <BulletList items={territories} emptyText="No territory records were returned." />
                </CollapsiblePreviewSection>
                <CollapsiblePreviewSection title="Treaties Returned Here" collapsible={treaties.length > 4}>
                  <BulletList items={treaties} emptyText="No treaty records were returned." />
                </CollapsiblePreviewSection>
                <CollapsiblePreviewSection title="Nearby Sovereignties" collapsible={nearby.length > 4}>
                  <BulletList
                    items={nearby.map((item) => `${item.name} (${item.category})`)}
                    emptyText="No nearby records were returned."
                  />
                </CollapsiblePreviewSection>
              </View>
            ) : (
              <ThemedText>Use Begin Journey Mode to load the current Journey Mode context.</ThemedText>
            )}
          </ThemedView>
        </ScrollView>
        </ResponsiveContainer>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  noteCard: {
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  transparentWrap: {
    backgroundColor: 'transparent',
  },
  bulletList: {
    gap: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultsStack: {
    gap: 10,
    backgroundColor: 'transparent',
  },
});
