
import { conversations } from '@/constants/messages-data';
import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  FadeInRight,
  FadeOutRight
} from 'react-native-reanimated';
import { Search, Settings2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const FILTERS = ["Active", "Received", "Sent", "Suggestions"];

function UnreadBadge({ count }: { count: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withSequence(
      withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const s = 1 + 0.12 * pulse.value;
    return { transform: [{ scale: s }] };
  });

  if (!count) return null;

  return (
    <Animated.View style={[styles.unreadBadge, style]}>
      <Text style={styles.unreadBadgeText}>{count}</Text>
    </Animated.View>
  );
}

function ConversationRow({
  name,
  avatarEmoji,
  preview,
  updatedAt,
  unreadCount,
  status,
  onPress,
}: {
  name: string;
  avatarEmoji: string;
  preview: string;
  updatedAt: string;
  unreadCount?: number;
  status: 'active' | 'pending';
  onPress: () => void;
}) {
  const press = useSharedValue(0);
  const fill = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    // soft horizontal stretch + compress
    const scaleX = 1 + 0.015 * press.value;
    const scale = 1 - 0.02 * press.value;
    return { transform: [{ scaleX }, { scale }] };
  });

  const bgStyle = useAnimatedStyle(() => {
    return { opacity: fill.value };
  });

  const onPressIn = () => {
    press.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.cubic) });
    fill.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
  };
  const onPressOut = () => {
    press.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
    fill.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.row, animatedStyle]}>
        <Animated.View pointerEvents="none" style={[styles.rowFill, bgStyle]} />
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{updatedAt}</Text>
          </View>
          <View style={styles.rowBottom}>
            <Text
              style={[styles.preview, status === 'pending' && styles.previewPending]}
              numberOfLines={1}
            >
              {preview}
            </Text>
            <UnreadBadge count={unreadCount ?? 0} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function MessagesInboxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("Active");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Example filtering logic
  const filtered = useMemo(() => {
    let data = conversations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q));
    }
    return data;
  }, [searchQuery]);

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const activeSearch = () => {
    setIsSearchActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const closeSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>

        <View style={styles.headerRow}>

          {!isSearchActive && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.headerNormalContent}
            >
              <Text style={styles.headerTitle}>Messages</Text>

              <View style={styles.headerActions}>
                {/* ONLY SEARCH BUTTON HERE - FILTER REMOVED */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={activeSearch}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Search size={22} color={Colors.light.text} />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Search Bar Animation */}
          {isSearchActive && (
            <Animated.View
              entering={FadeInRight.duration(300).springify()}
              exiting={FadeOutRight.duration(200)}
              style={styles.headerSearchContent}
            >
              <View style={styles.searchInputWrapper}>
                <Search size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search messages..."
                  placeholderTextColor="#94A3B8"
                  autoFocus
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity onPress={closeSearch} style={styles.closeBtn}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </View>

        {/* Filters Section */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveFilter(filter);
                  }}
                  style={[
                    styles.filterPill,
                    isActive ? styles.filterPillActive : styles.filterPillInactive
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Messages List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((c, idx) => (
          <Animated.View
            key={c.id}
            entering={FadeInDown.duration(180).delay(40 + idx * 40).easing(Easing.out(Easing.cubic))}
          >
            <ConversationRow
              name={c.name}
              avatarEmoji={c.avatarEmoji}
              preview={c.preview}
              updatedAt={c.updatedAt}
              unreadCount={c.unreadCount}
              status={c.status}
              onPress={() => router.push(`/messages/${c.id}`)}
            />
          </Animated.View>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#F8FAFC',
    zIndex: 10,
    paddingBottom: 12,
  },
  headerRow: {
    height: 60,
    justifyContent: 'center',
  },
  headerNormalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
  },
  headerSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    gap: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
    fontFamily: Fonts.black,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {},
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Search Styles
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
  },
  closeBtn: {
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },

  // Filters
  filtersWrapper: {
    marginTop: 8,
  },
  filtersScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillInactive: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: '#E2E8F0',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextInactive: {
    color: '#64748B',
  },

  // List Styles
  list: {
    paddingTop: 8,
    paddingBottom: 120,
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rowFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 51, 255, 0.06)',
    borderRadius: 18,
    opacity: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  rowBody: {
    flex: 1,
    gap: 6,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: Fonts.bold,
  },
  time: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.45,
    fontFamily: Fonts.regular,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: Fonts.regular,
  },
  previewPending: {
    opacity: 0.55,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});
