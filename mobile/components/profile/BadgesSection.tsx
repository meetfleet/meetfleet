import { BADGES, BADGE_ASSETS } from '@/constants/badges';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BadgeItem } from './BadgeItem';

export function BadgesSection() {
  // Always assign "The Genesis" to new users (simulated by finding it in our constant)
  const genesisBadge = BADGES.find(b => b.name === 'The Genesis');

  // Teaser badge using the teaser.png asset
  const teaserBadge = {
    id: 'teaser',
    name: 'More Badges',
    description: 'To come',
    image: BADGE_ASSETS['Teaser'],
    requirements: 'To come'
  };

  // If for some reason Genesis is missing, fallback or handle gracefully
  if (!genesisBadge) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Badges</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Primary Static Badge: The Genesis */}
        <View style={styles.primaryBadgeContainer}>
          <BadgeItem
            badge={genesisBadge}
            size={80}
            isUnlocked={true}
            showDetails={true}
          />
        </View>

        {/* Teaser Card - Identical in style to primary badge */}
        <View style={styles.primaryBadgeContainer}>
          <BadgeItem
            badge={teaserBadge}
            size={80}
            isUnlocked={false}
            showDetails={true}
            customDate="To come"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    paddingBottom: 30,
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'stretch', // Ensure equal height
    gap: 12,
  },
  primaryBadgeContainer: {
    // BadgeItem handles its own size
  },
});