import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

interface EventsEmptyStateProps {
  onCreatePlan?: () => void;
  activeFilter?: string;
}

/**
 * Empty state for Events screen (app/(tabs)/events.tsx)
 * Shown when no events are available for the selected filter
 */
export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({ onCreatePlan, activeFilter }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'My Plans':
        return {
          title: 'No Plans Yet',
          subtitle: 'Create your first plan to get started with organizing events'
        };
      case 'Sent':
        return {
          title: 'No Sent Plans',
          subtitle: 'Plans you send to others will appear here'
        };
      case 'Received':
        return {
          title: 'No Received Plans',
          subtitle: 'Plans sent to you by others will appear here'
        };
      case 'History':
        return {
          title: 'No History',
          subtitle: 'Your completed and past plans will appear here'
        };
      default:
        return {
          title: 'No Events Found',
          subtitle: 'Discover and join exciting events happening around you'
        };
    }
  };

  const message = getEmptyStateMessage();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.lightGray }]}>
        <Ionicons name="calendar-clear-outline" size={64} color={theme.primary} />
      </View>
      <Text style={[styles.heading, { color: theme.text }]}>{message.title}</Text>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        {message.subtitle}
      </Text>
      {activeFilter === 'My Plans' && (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onCreatePlan}>
          <Text style={styles.buttonText}>Create a Plan</Text>
        </TouchableOpacity>
      )}
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