import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { PlanItem } from '../types/types';
import { PlanCard } from './PlanCard';

interface AutoScrollRowProps {
  items: PlanItem[];
  direction: 'left' | 'right';
  selectedId: string | null;
  onSelect: (id: string) => void;
  isPaused: boolean;
  hasUserInteracted: boolean;
  onUserInteraction: () => void;
}

const ITEM_WIDTH = 112; // Card width
const ITEM_MARGIN = 16; // Total horizontal margin
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN;
const SCROLL_SPEED = 25; // pixels per second

export const AutoScrollRow: React.FC<AutoScrollRowProps> = ({ 
  items, 
  direction, 
  selectedId, 
  onSelect,
  isPaused,
  hasUserInteracted,
  onUserInteraction,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef(Date.now());
  
  const contentWidth = items.length * TOTAL_ITEM_WIDTH;
  
  // Triple items for infinite loop illusion
  const displayItems = [...items, ...items, ...items];

  useEffect(() => {
    // Initialize scroll position to middle section
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: contentWidth, // Start at middle section
        animated: false,
      });
      scrollPosition.current = contentWidth;
    }, 100);
  }, [contentWidth]);

  useEffect(() => {
    // Auto-scroll ONLY if user has never interacted
    if (isPaused || hasUserInteracted) {
      // Stop auto-scroll permanently
      if (animationFrameId.current != null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    // Auto-scroll animation using requestAnimationFrame
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;

      const movement = SCROLL_SPEED * deltaTime;
      const newPosition = direction === 'left' 
        ? scrollPosition.current + movement
        : scrollPosition.current - movement;

      scrollPosition.current = newPosition;

      // Handle wrapping for infinite scroll
      if (scrollPosition.current >= contentWidth * 2) {
        scrollPosition.current = contentWidth;
        scrollViewRef.current?.scrollTo({
          x: contentWidth,
          animated: false,
        });
      } else if (scrollPosition.current <= 0) {
        scrollPosition.current = contentWidth;
        scrollViewRef.current?.scrollTo({
          x: contentWidth,
          animated: false,
        });
      } else {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current != null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [direction, contentWidth, isPaused, hasUserInteracted]);

  const handleCardPress = (id: string) => {
    onSelect(id);
  };

  const handleScrollBeginDrag = () => {
    if (!hasUserInteracted) {
      onUserInteraction();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    scrollPosition.current = x;
    
    // Handle infinite scroll wrapping during manual scroll
    if (hasUserInteracted) {
      if (x <= TOTAL_ITEM_WIDTH) {
        scrollViewRef.current?.scrollTo({
          x: contentWidth + TOTAL_ITEM_WIDTH,
          animated: false,
        });
        scrollPosition.current = contentWidth + TOTAL_ITEM_WIDTH;
      } else if (x >= contentWidth * 2 - TOTAL_ITEM_WIDTH) {
        scrollViewRef.current?.scrollTo({
          x: contentWidth - TOTAL_ITEM_WIDTH,
          animated: false,
        });
        scrollPosition.current = contentWidth - TOTAL_ITEM_WIDTH;
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Masks */}
      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.leftGradient}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rightGradient}
        pointerEvents="none"
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={handleScroll}
        decelerationRate="normal"
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true} // Always allow manual scrolling
      >
        <View style={styles.row}>
          {displayItems.map((item, index) => (
            <PlanCard
              key={`${item.id}-${index}`}
              item={item}
              isSelected={selectedId === item.id}
              onPress={handleCardPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 32,
    zIndex: 10,
  },
  rightGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    zIndex: 10,
  },
});
