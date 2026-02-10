import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';

interface PlanInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText: string;
  onPress: () => void;
}

export function PlanInfoCard({ icon, title, subtitle, buttonText, onPress }: PlanInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="black" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.blackButton} onPress={onPress}>
        <Text style={styles.blackButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20, // Adjusted from 30 to fit better in the list, but keeping structure
    paddingVertical: 24,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'column',
    alignItems: "flex-start",
    gap: 6,
    flex: 1,
  },
  iconContainer: {
    marginBottom: 6,
  },
  cardTextContainer: {
    gap: 4,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18, // Slightly adjusted for mobile list context
    fontFamily: Fonts.light,
    marginBottom: 2,
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#3337FF',
    fontFamily: Fonts.light,
  },
  blackButton: {
    marginTop: 10,
    fontFamily: Fonts.light,
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  blackButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});
