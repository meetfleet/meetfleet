import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface StatsCarouselProps {
  plans?: number | null;
  rating?: number | null;
  trustScore?: number | null;
}

export function StatsCarousel({ plans, rating, trustScore }: StatsCarouselProps) {
  const safePlans = plans ?? 0;
  const safeRating = rating ?? 0;
  const safeTrust = trustScore ?? 0;

  const stats = [
    { label: 'Plans', value: String(safePlans), icon: 'happy-outline', color: '#9CA3AF' },
    { label: 'Rating', value: safeRating.toFixed(1), icon: 'star-outline', color: '#9CA3AF' },
    { label: 'Trust', value: `${safeTrust}%`, icon: 'shield-outline', color: '#9CA3AF' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.header}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    width: 140,
    height: 100,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background for depth
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)', // Low opacity outline
    // Optional: Add a subtle shadow for better separation on light backgrounds
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline', // Better alignment for text and value
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
  },
});
