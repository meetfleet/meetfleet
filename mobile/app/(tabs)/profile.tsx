import { NotificationOverlay } from '@/components/NotificationOverlay';
import { BadgesSection } from '@/components/profile/BadgesSection';
import { InterestsSection } from '@/components/profile/InterestsSection';
import { ProfileCarousel } from '@/components/profile/ProfileCarousel';
import { ProfileImageCarousel } from '@/components/profile/ProfileImageCarousel';
import { ProfileOptionsModal } from '@/components/profile/ProfileOptionsModal';
import { StatsCarousel } from '@/components/profile/StatsCarousel';
import { ScreenHeader } from '@/components/ScreenHeader';
import { MOCK_NOTIFICATIONS } from '@/data/mock-notifications';
import { authService } from '@/services/auth';
import { AppNotification } from '@/types/notification-types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- Floating Orb Background Component ---
const FloatingOrb = ({ delay = 0, size = 300, top = 0, left = 0, color = '#E0EAFF' }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-12, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    translateX.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.98, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
        },
        animatedStyle
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[color + '25', color + '08']}
        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

// --- Fast iOS Micro-Animation Hook ---
const useFastEntranceAnimation = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const scale = useSharedValue(0.97);

  useEffect(() => {
    // Ultra-fast, haptic-like iOS spring animation
    opacity.value = withTiming(1, {
      duration: 180,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });

    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 380,
      mass: 0.4,
    });

    scale.value = withSpring(1, {
      damping: 16,
      stiffness: 350,
      mass: 0.35,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return animatedStyle;
};

export default function ProfileScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const profileAnimation = useFastEntranceAnimation(0);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const imagesAnimation = useFastEntranceAnimation(50);
  const statsAnimation = useFastEntranceAnimation(100);
  const interestsAnimation = useFastEntranceAnimation(150);
  const badgesAnimation = useFastEntranceAnimation(200);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Glassomorphism Background with Gradient */}
      <LinearGradient
        colors={['#F0F4FF', '#FAFBFF', '#F5F8FF']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Orbs */}
      <FloatingOrb delay={0} size={380} top={-120} left={-80} color="#E0EAFF" />
      <FloatingOrb delay={1500} size={320} top={height * 0.3} left={width - 200} color="#DBEAFE" />
      <FloatingOrb delay={3000} size={280} top={height * 0.6} left={-60} color="#E0E7FF" />

      {/* Header with Back Button and Notification Button - Sticky */}
      <ScreenHeader
        showBackButton={true}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          marginBottom: 0,
          backgroundColor: 'rgba(240, 244, 255, 0.98)',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'rgba(148, 163, 184, 0.25)',
        }}
        rightElement={
          <View style={styles.headerIcons}>
            {/* EDIT BUTTON */}
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => router.push('/edit-profile')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Pencil size={20} color="#1F2937" strokeWidth={2} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => router.push('/(tabs)/settings')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="settings-outline" size={23} color="#1F2937" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => setNotificationVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={23} color="#1F2937" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>5</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Animated Profile Card with Soft Shadow */}
        <Animated.View style={[styles.sectionContainer, profileAnimation]}>
          <View style={styles.cardWrapper}>
            <ProfileCarousel
              name={user?.username}
              age={user?.age}
              emoji={user?.emoji}
              bio={user?.bio}
              avatarUrl={user?.avatarUrl}
              isPremium={!!user?.isPremium}
              plansCount={user?.plansCount ?? 0}
            />
          </View>
        </Animated.View>

        {/* Profile Image Carousel */}
        <Animated.View style={[styles.sectionContainer, imagesAnimation]}>
          <View style={styles.cardWrapper}>
            <ProfileImageCarousel photos={user?.photos} />
          </View>
        </Animated.View>

        {/* Stats Carousel */}
        <Animated.View style={[styles.sectionContainer, statsAnimation]}>
          <View style={styles.cardWrapper}>
            <StatsCarousel
              plans={user?.plansCount}
              rating={user?.rating}
              trustScore={user?.trustScore}
            />
          </View>
        </Animated.View>

        {/* Interests Section */}
        <Animated.View style={[styles.sectionContainer, interestsAnimation]}>
          <View style={styles.cardWrapper}>
            <InterestsSection interests={user?.interests} />
          </View>
        </Animated.View>

        {/* Badges Section */}
        <Animated.View style={[styles.sectionContainer, badgesAnimation]}>
          <View style={styles.cardWrapper}>
            <BadgesSection />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Notification Overlay */}
      <NotificationOverlay
        isVisible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        notifications={MOCK_NOTIFICATIONS}
        onNotificationPress={(notification: AppNotification) => {
          console.log('Notification pressed:', notification);
          setNotificationVisible(false);
        }}
        onClearAll={() => {
          console.log('Clear all notifications');
          setNotificationVisible(false);
        }}
      />

      <ProfileOptionsModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  scrollContent: {
    paddingBottom: 120, // Increased padding to avoid navbar overlap
    paddingTop: 110, // Increased to clear sticky header
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationBtn: {
    borderRadius: 26,
    overflow: 'visible',
    shadowColor: '#4F89FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsBtn: {
    borderRadius: 26,
    overflow: 'visible',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 26,
    overflow: 'hidden',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4F89FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardWrapper: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
});