import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export function InterestsSection() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const interests = [
    { label: 'Art', icon: 'color-palette-outline' },
    { label: 'Sports', icon: 'bicycle-outline' },
    { label: 'Music', icon: 'musical-notes-outline' },
    { label: 'Pop Culture', icon: 'star-outline' },
    { label: 'Photography', icon: 'camera-outline' },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <ThemedText type="subtitle" style={styles.title}>Interests</ThemedText>
      <View style={styles.chipsContainer}>
        {interests.map((item, index) => (
          <View key={index} style={[styles.chip, { borderColor: colors.border }]}>
            <Ionicons name={item.icon as any} size={18} color={colors.text} />
            <ThemedText style={styles.chipText}>{item.label}</ThemedText>
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
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
