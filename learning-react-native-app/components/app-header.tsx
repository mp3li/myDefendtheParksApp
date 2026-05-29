import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, type Href } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette, SurfaceColors } from '@/constants/theme';
import { usePageSections } from '@/context/page-sections-context';

function CompassMark({ size = 34 }: { size?: number }) {
  return (
    <View style={[styles.compass, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.compassCrossVertical} />
      <View style={styles.compassCrossHorizontal} />
      <View style={styles.compassNeedle} />
      <View style={styles.compassNeedleTail} />
    </View>
  );
}

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { sections, jumpToSection } = usePageSections();
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([pathname]);
  const suppressNextHistoryPush = useRef(false);
  const menuSections = sections.length > 0 ? sections : [{ id: 'top', label: 'Top' }];
  const showBackBar = pathname !== '/';

  useEffect(() => {
    setHistory((current) => {
      if (suppressNextHistoryPush.current) {
        suppressNextHistoryPush.current = false;
        return current.length > 0 && current[current.length - 1] === pathname ? current : [pathname];
      }
      if (current[current.length - 1] === pathname) {
        return current;
      }
      return [...current, pathname];
    });
  }, [pathname]);

  const goBack = () => {
    const previousPath = history.length > 1 ? history[history.length - 2] : '/';
    suppressNextHistoryPush.current = true;
    setHistory((current) => (current.length > 1 ? current.slice(0, -1) : ['/']));
    router.push(previousPath as Href);
  };

  const returnHome = () => {
    suppressNextHistoryPush.current = true;
    setHistory(['/']);
    router.replace('/');
  };

  return (
    <>
      <ThemedView style={styles.headerShell}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <ThemedView style={styles.header}>
            <ThemedText
              type="title"
              style={styles.appTitle}
              lightColor={Palette.yosemiteIvory}
              darkColor={Palette.yosemiteIvory}
              numberOfLines={2}
              accessibilityRole="header">
              Defend the Parks by mp3li
            </ThemedText>
            <Pressable
              style={styles.menuButton}
              accessibilityRole="button"
              accessibilityLabel="Jump to section"
              onPress={() => setMenuOpen(true)}>
              <CompassMark />
              <ThemedText
                type="defaultSemiBold"
                style={styles.jumpLabel}
                lightColor={Palette.yosemiteIvory}
                darkColor={Palette.yosemiteIvory}>
                Jump To
              </ThemedText>
            </Pressable>
          </ThemedView>
          {showBackBar ? (
            <View style={styles.backBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={styles.backButton}
                onPress={goBack}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.backBarText}
                  lightColor={Palette.yosemiteIvory}
                  darkColor={Palette.yosemiteIvory}>
                  ‹ Back
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Return to homepage"
                style={styles.homeButton}
                onPress={returnHome}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.backBarText}
                  lightColor={Palette.yosemiteIvory}
                  darkColor={Palette.yosemiteIvory}>
                  Return to Homepage
                </ThemedText>
              </Pressable>
            </View>
          ) : null}
        </SafeAreaView>
      </ThemedView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <ThemedView style={styles.menuCard}>
            <ThemedText type="subtitle" lightColor={Palette.cedar} darkColor={Palette.summitBlush}>
              Jump to
            </ThemedText>
            <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuScrollContent}>
              {menuSections.map((section) => (
                <Pressable
                  key={section.id}
                  style={styles.menuRow}
                  accessibilityRole="button"
                  accessibilityLabel={`Jump to ${section.label}`}
                  onPress={() => {
                    setMenuOpen(false);
                    jumpToSection(section.id);
                  }}>
                  <ThemedText type="defaultSemiBold">{section.label}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.summitBlush,
    backgroundColor: SurfaceColors.navLight,
  },
  safeHeader: {
    backgroundColor: SurfaceColors.navLight,
  },
  appTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 24,
    lineHeight: 28,
  },
  menuButton: {
    width: 54,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jumpLabel: {
    marginTop: 1,
    fontSize: 9,
    lineHeight: 10,
    textTransform: 'uppercase',
  },
  compass: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.campfire,
    backgroundColor: Palette.night,
    shadowColor: Palette.campfire,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  compassCrossVertical: {
    position: 'absolute',
    width: 1,
    height: '78%',
    backgroundColor: 'rgba(247, 239, 226, 0.35)',
  },
  compassCrossHorizontal: {
    position: 'absolute',
    width: '78%',
    height: 1,
    backgroundColor: 'rgba(247, 239, 226, 0.35)',
  },
  compassNeedle: {
    position: 'absolute',
    top: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Palette.campfire,
  },
  compassNeedleTail: {
    position: 'absolute',
    bottom: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Palette.yosemiteIvory,
  },
  headerShell: {
    backgroundColor: SurfaceColors.navLight,
  },
  backBar: {
    minHeight: 22,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.campfire,
  },
  backButton: {
    paddingVertical: 2,
    paddingRight: 8,
  },
  homeButton: {
    paddingVertical: 2,
    paddingLeft: 8,
  },
  backBarText: {
    fontSize: 11,
    lineHeight: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 4, 12, 0.58)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 76,
    paddingHorizontal: 14,
  },
  menuCard: {
    width: '88%',
    maxWidth: 360,
    maxHeight: '72%',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Palette.campfire,
    backgroundColor: 'rgba(247, 239, 226, 0.95)',
  },
  menuScroll: {
    flexGrow: 0,
  },
  menuScrollContent: {
    gap: 4,
  },
  menuRow: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
