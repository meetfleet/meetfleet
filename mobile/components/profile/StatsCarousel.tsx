import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export function StatsCarousel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const stats = [
    { label: 'Plans', value: '12', icon: 'happy', color: colors.gold },
    { label: 'Rating', value: '4.9', icon: 'star', color: colors.gold },
    { label: 'Trust', value: '98%', icon: 'shield-checkmark', color: colors.gold },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {stats.map((stat, index) => (
        <ThemedView key={index} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
             <Ionicons name={stat.icon as any} size={24} color={stat.color} />
          </View>
          <View style={styles.footer}>
            <ThemedText type="subtitle" style={styles.value}>{stat.value}</ThemedText>
            <ThemedText style={[styles.label, { color: colors.icon }]}>{stat.label}</ThemedText>
          </View>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  card: {
    width: 150,
    height: 110,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  }
});
