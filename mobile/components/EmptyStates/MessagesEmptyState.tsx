import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

interface MessagesEmptyStateProps {
  onStartChat?: () => void;
  activeFilter?: string;
}

/**
 * Empty state for Messages screen (app/(tabs)/messages.tsx)
 * Shown when no conversations are available for the selected filter
 */
export const MessagesEmptyState: React.FC<MessagesEmptyStateProps> = ({ onStartChat, activeFilter }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'Received':
        return {
          title: 'No Received Messages',
          subtitle: 'Messages you receive will appear here'
        };
      case 'Sent':
        return {
          title: 'No Sent Messages',
          subtitle: 'Messages you send will appear here'
        };
      case 'Suggestions':
        return {
          title: 'No Suggestions',
          subtitle: 'Friend suggestions will appear here based on your interests'
        };
      default:
        return {
          title: 'No Messages Yet',
          subtitle: 'Start conversations with friends to see them here'
        };
    }
  };

  const message = getEmptyStateMessage();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.lightGray }]}>
        <Ionicons name="chatbubbles-outline" size={64} color={theme.primary} />
      </View>
      <Text style={[styles.heading, { color: theme.text }]}>{message.title}</Text>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        {message.subtitle}
      </Text>
      {activeFilter !== 'Suggestions' && (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onStartChat}>
          <Text style={styles.buttonText}>Start a Chat</Text>
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