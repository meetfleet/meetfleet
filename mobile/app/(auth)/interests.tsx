import { ScreenHeader } from '@/components/ScreenHeader';
import { INTERESTS } from '@/constants/constants';
import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    Scroll as ScrollIcon,
    Shirt,
    Star,
    Utensils,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    case 'history': return ScrollIcon;
    case 'science': return FlaskConical;
    case 'animals': return Dog;
    case 'politics': return Landmark;
    case 'diy': return Hammer;
    case 'business': return Briefcase;
    default: return Star;
  }
};

export default function InterestsScreen() {
  const router = useRouter();
  const { phone, emoji, name, gender, age, bio } = useLocalSearchParams();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!selectedInterests.length) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(auth)/location-permission',
      params: {
        phone,
        emoji,
        name,
        gender,
        age,
        bio,
        interests: selectedInterests.join(','),
      },
    });
  };

  const isValid = selectedInterests.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Interests"
        rightElement={
          <TouchableOpacity
            onPress={handleNext}
            disabled={!isValid}
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          >
            <Text style={[styles.nextText, !isValid && styles.nextTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Select a few topics you care about. We’ll use them to personalize plans
          and orbits for you.
        </Text>

        <View style={styles.chipsContainer}>
          {(INTERESTS || []).map(int => {
            const isSelected = selectedInterests.includes(int.id);
            const IconComp = getInterestIcon(int.id);

            return (
              <TouchableOpacity
                key={int.id}
                style={[
                  styles.interestChip,
                  isSelected && styles.interestChipSelected,
                ]}
                onPress={() => toggleInterest(int.id)}
                activeOpacity={0.8}
              >
                <IconComp
                  size={16}
                  color={isSelected ? '#0033FF' : '#111827'}
                />
                <Text
                  style={[
                    styles.interestText,
                    isSelected && styles.interestTextSelected,
                  ]}
                >
                  {int.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.addButton, !isValid && styles.addButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
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
  interestChipSelected: {
    borderColor: '#0057FF',
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  interestText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 24,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#0F172A',
  },
  addButtonDisabled: {
    opacity: 0.3,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  nextButton: {
    paddingHorizontal: 4,
  },
  nextButtonDisabled: {
    opacity: 0.3,
  },
  nextText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#0F172A',
  },
  nextTextDisabled: {
    color: '#94A3B8',
  },
});