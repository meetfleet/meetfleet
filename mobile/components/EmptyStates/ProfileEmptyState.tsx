import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

interface ProfileEmptyStateProps {
  onAddContent?: () => void;
}

/**
 * Empty state for Profile screen (app/(tabs)/profile.tsx)
 * Shown when profile sections are empty
 */
export const ProfileEmptyState: React.FC<ProfileEmptyStateProps> = ({ onAddContent }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.lightGray }]}>
        <Ionicons name="person-circle-outline" size={64} color={theme.primary} />
      </View>
      <Text style={[styles.heading, { color: theme.text }]}>Complete Your Profile</Text>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Add your interests, badges, and stats to make your profile stand out
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onAddContent}>
        <Text style={styles.buttonText}>Add Profile Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
});