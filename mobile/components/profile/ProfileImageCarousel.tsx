import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 100) / 2.5; // Bigger images, better for 3 slots

interface ImageSlot {
  id: number;
  image?: string;
  isEmpty: boolean;
}

interface ProfileImageCarouselProps {
  photos?: string[];
}

export function ProfileImageCarousel({ photos }: ProfileImageCarouselProps) {
  const MAX_SLOTS = 3;
  const safePhotos = Array.isArray(photos) ? photos.slice(0, MAX_SLOTS) : [];
  const slots: ImageSlot[] = Array.from({ length: MAX_SLOTS }).map((_, index) => {
    const photo = safePhotos[index];
    return {
      id: index + 1,
      image: photo,
      isEmpty: !photo,
    };
  });

  const handleImagePress = (slot: ImageSlot) => {
    if (slot.isEmpty) {
      console.log('Upload new image');
      // TODO: Implement image picker
    } else {
      console.log('View image', slot.id);
      // TODO: Implement image viewer
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Photos</Text>
        <Text style={styles.subtitle}>{safePhotos.length} of 3</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={IMAGE_SIZE + 16}
        snapToAlignment="start"
      >
        {slots.map((slot, index) => (
          <TouchableOpacity
            key={slot.id}
            style={styles.imageSlot}
            onPress={() => handleImagePress(slot)}
            activeOpacity={0.7}
          >
            {slot.isEmpty ? (
              <View style={styles.emptySlot}>
                <LinearGradient
                  colors={['#EFF6FF', '#F0F9FF']}
                  style={styles.emptyGradient}
                >
                  <View style={styles.plusIconContainer}>
                    <LinearGradient
                      colors={['#FFF', '#FFFFFF']}
                      style={styles.plusGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="add" size={16} color="#0033FF" />
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <Image source={{ uri: slot.image as string }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>{index + 1}</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  imageSlot: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptySlot: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#4F89FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  plusGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A', // Solid background
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});