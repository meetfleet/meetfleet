import React from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const mapIcon = require('@/assets/map.png');
const clockIcon = require('@/assets/clock.png');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STACK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
];

const EventCard = ({ event, onPress, isPast = false }: { event: any; onPress?: () => void; isPast?: boolean }) => {
  const cardScale = useSharedValue(1);
  const cardTranslateY = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { translateY: cardTranslateY.value },
    ],
  }));

  const handlePressIn = () => {
    cardScale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.cubic) });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    cardScale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) });
  };

  return (
    <AnimatedPressable
      style={[
        styles.card,
        cardStyle,
        isPast && styles.cardPast
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <View style={[styles.header, isPast && { opacity: 0.6 }]}>
        <View style={[styles.iconContainer, isPast && { backgroundColor: '#E5E7EB' }]}>
          <Text style={[styles.icon, isPast && { color: '#9CA3AF' }]}>{event.icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isPast && { color: '#6B7280' }]}>{event.title}</Text>
          <View style={styles.hostInfo}>
            <Text style={[styles.hostAvatar, isPast && { opacity: 0.5 }]}>{event.host.avatar}</Text>
            <Text style={styles.hostName}>{`${event.host.name}, ${event.host.age}`}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.detailsContainer, isPast && { opacity: 0.6 }]}>
        <View style={styles.detailItem}>
          <View style={styles.iconBox}>
            <Image source={mapIcon} style={[styles.detailIcon, isPast && { tintColor: '#9CA3AF' }]} />
          </View>
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>WHERE</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconBox}>
            <Image source={clockIcon} style={[styles.detailIcon, isPast && { tintColor: '#9CA3AF' }]} />
          </View>
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>WHEN</Text>
            <Text style={styles.detailValue}>{event.when}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.descriptionContainer, isPast && { backgroundColor: '#F3F4F6' }]}>
        <Text style={[styles.descriptionText, isPast && { color: '#9CA3AF' }]}>"{event.description}"</Text>
      </View>

      <View style={styles.footerRow}>
        <View style={[styles.distanceContainer, isPast && { opacity: 0.7 }]}>
          <View style={[styles.distanceDot, isPast && { backgroundColor: '#9CA3AF' }]} />
          <Text style={styles.distanceText}>{event.distance}</Text>
        </View>

        {/* Avatar Stack - Only show if NOT past */}
        {!isPast && (
          <View style={styles.stackContainer}>
            <View style={styles.avatarStack}>
              {STACK_AVATARS.map((avatar, idx) => (
                <View key={idx} style={[styles.avatarWrapper, { marginLeft: idx > 0 ? -12 : 0, zIndex: STACK_AVATARS.length - idx }]}>
                  <Image source={{ uri: avatar }} style={styles.stackImg} />
                </View>
              ))}
            </View>
            <View style={styles.goingPill}>
              <Text style={styles.goingText}>+5 going</Text>
            </View>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardPast: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
    shadowOpacity: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.black,
    color: Colors.light.text,
    lineHeight: 28.8,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  hostAvatar: {
    fontSize: 16,
  },
  hostName: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: Fonts.regular,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  },
  descriptionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  descriptionText: {
    color: '#6B7280',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22.5,
    fontFamily: Fonts.regular,
  },

  // Footer & Stack
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  distanceText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: 18,
    padding: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stackImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  goingPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  goingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  }
});


export default EventCard;
