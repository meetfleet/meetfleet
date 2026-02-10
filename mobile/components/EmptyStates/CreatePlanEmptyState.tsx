import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

interface CreatePlanEmptyStateProps {
  onAddFriends?: () => void;
}

/**
 * Empty state for Create Plan screen (app/create-plan.tsx)
 * Shown when no friends are available to invite
 */
export const CreatePlanEmptyState: React.FC<CreatePlanEmptyStateProps> = ({ onAddFriends }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.lightGray }]}>
        <Ionicons name="people-circle-outline" size={64} color={theme.primary} />
      </View>
      <Text style={[styles.heading, { color: theme.text }]}>No Friends to Invite</Text>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Add friends to start creating plans together
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onAddFriends}>
        <Text style={styles.buttonText}>Add Friends</Text>
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