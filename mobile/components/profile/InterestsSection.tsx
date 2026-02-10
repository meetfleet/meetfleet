import {
  Bike,
  BookOpen,
  Briefcase,
  Camera,
  Cpu,
  Dog,
  Dumbbell,
  Film,
  FlaskConical,
  Gamepad2,
  Hammer,
  Landmark,
  Leaf,
  Music,
  Palette,
  Plane,
  Scroll,
  Shirt,
  Star,
  Utensils
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { INTERESTS } from '../../constants/constants';

const getInterestIcon = (id: string) => {
  switch (id) {
    case 'art': return Palette;
    case 'sports': return Bike;
    case 'music': return Music;
    case 'pop': return Star;
    case 'photo': return Camera;
    case 'gaming': return Gamepad2;
    case 'travel': return Plane;
    case 'foodie': return Utensils;
    case 'tech': return Cpu;
    case 'fashion': return Shirt;
    case 'reading': return BookOpen;
    case 'nature': return Leaf;
    case 'movies': return Film;
    case 'fitness': return Dumbbell;
    case 'history': return Scroll;
    case 'science': return FlaskConical;
    case 'animals': return Dog;
    case 'politics': return Landmark;
    case 'diy': return Hammer;
    case 'business': return Briefcase;
    default: return Star;
  }
};

export function InterestsSection({ interests }: { interests?: string[] | string | null }) {
  let interestIds: string[] = [];

  if (Array.isArray(interests)) {
    interestIds = interests;
  } else if (typeof interests === 'string') {
    interestIds = interests.split(',').map((id) => id.trim()).filter(Boolean);
  }

  const hasInterests = interestIds.length > 0;
  const visibleInterests = hasInterests
    ? (INTERESTS || []).filter((int) => interestIds.includes(int.id))
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interests</Text>
      {hasInterests && visibleInterests.length > 0 ? (
        <View style={styles.chipsContainer}>
          {visibleInterests.map((int) => {
            const IconComp = getInterestIcon(int.id);
            return (
              <View
                key={int.id}
                style={styles.interestChip}
              >
                <IconComp size={16} color={'#111827'} />
                <Text style={styles.interestText}>
                  {int.label}
                </Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          No interests yet. Pick some to personalize your orbit.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    gap: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '400',
  },
});