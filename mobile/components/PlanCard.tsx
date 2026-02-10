import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PlanItem } from '../types/types';

interface PlanCardProps {
  item: PlanItem;
  isSelected: boolean;
  onPress: (id: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item.id)}
      style={[
        styles.card,
        isSelected ? styles.selectedCard : styles.unselectedCard
      ]}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.label, isSelected ? styles.selectedLabel : styles.unselectedLabel]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 112, // Equivalent to w-28
    height: 112,
    marginHorizontal: 8, // Equivalent to mx-2
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unselectedCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
    borderColor: '#0057FF',
    borderWidth: 1,
  },
  emoji: {
    fontSize: 36, // text-4xl
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  unselectedLabel: {
    color: '#4B5563', // gray-600
  },
  selectedLabel: {
    color: '#0057FF',
  },
});
