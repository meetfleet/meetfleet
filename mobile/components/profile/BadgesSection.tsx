import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export function BadgesSection() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const badges = [
    { name: 'Premium\nNearker', date: '15 Jan 2026', image: require('@/assets/badges/badge-1.png') },
    { name: 'Creative\nPlanner', date: '23 Feb 2026', image: require('@/assets/badges/badge-2.png') },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <ThemedText type="subtitle" style={styles.title}>Badges</ThemedText>
      <View style={styles.badgesRow}>
        {badges.map((badge, index) => (
          <View key={index} style={styles.badgeItem}>
            <View style={[styles.imageContainer, { backgroundColor: colors.lightGray }]}>
               <Image source={badge.image} style={styles.badgeImage} resizeMode="contain" />
            </View>
            <ThemedText style={styles.badgeName} numberOfLines={2}>{badge.name}</ThemedText>
            <ThemedText style={[styles.badgeDate, { color: colors.icon }]}>{badge.date}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 40,
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 20,
  },
  badgeItem: {
    alignItems: 'center',
    width: 100,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeImage: {
    width: 60,
    height: 60,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 12,
  },
});
