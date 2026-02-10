import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import EventCard from '@/components/EventCard';
import PlanBottomSheet from '@/components/PlanBottomSheet';
import { eventsData } from '@/constants/events-data';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight, FadeOutRight, FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Search, Settings2, X } from 'lucide-react-native';
import FiltersBackdrop from '@/components/ui/filters-backdrop';

const FILTERS = ["Discover", "My Plans", "Sent", "Received", "History"];

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlanSheetVisible, setIsPlanSheetVisible] = useState(false);

  // Search State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilter, setActiveFilter] = useState("Discover");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSearchPress = () => {
    setIsSearchActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const closeSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>

        <View style={styles.headerRow}>
          {/* Normal Header Content */}
          {!isSearchActive && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.headerNormalContent}
            >
              <Text style={styles.headerTitle}>Plans</Text>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSearchPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Search size={22} color={Colors.light.text} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsFiltersOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconCircle,
                    isFiltersOpen && styles.iconCircleActive
                  ]}>
                    <Settings2
                      size={22}
                      color={isFiltersOpen ? Colors.light.primary : Colors.light.text}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Animated Search Bar */}
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
                  placeholder="Search plans..."
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
            {FILTERS.map((filter, index) => {
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

      <FlatList
        data={eventsData}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(300).delay(100 * index)}>
            <View>
              <EventCard
                event={item}
                isPast={activeFilter === 'History'}
                onPress={() => {
                  if (item.title === 'Afterwork drinks') {
                    setIsPlanSheetVisible(true);
                  }
                }}
              />
              {activeFilter === 'History' && (
                <View style={styles.historyOverlay}>
                  <Text style={styles.historyBadge}>COMPLETED</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <PlanBottomSheet
        isVisible={isPlanSheetVisible}
        onClose={() => setIsPlanSheetVisible(false)}
      />

      <FiltersBackdrop
        visible={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </View>
  );
};

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
    height: 60, // Fixed height for alignment
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
  iconCircleActive: {
    borderColor: Colors.light.primary,
    backgroundColor: '#F0F9FF',
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

  list: {
    paddingTop: 8,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  historyOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyBadge: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  }
});

export default EventsScreen;
