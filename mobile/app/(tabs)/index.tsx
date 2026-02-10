import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { NotificationOverlay } from '../../components/NotificationOverlay';
import { PremiumUpgradeOverlay } from '../../components/PremiumUpgradeOverlay';
import { MOCK_NOTIFICATIONS } from '../../data/mock-notifications';
import { authService } from '../../services/auth';
import { AppNotification } from '../../types/notification-types';
// --- Types & Interfaces ---
interface OrbitUser {
  name: string;
  status: 'online' | 'busy' | 'offline';
  img: string;
}

interface Hotspot {
  name: string;
  type: string;
  dist: string;
  img: string;
}

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

interface HotspotCardProps {
  data: Hotspot;
}

// --- Constants ---
const { width, height } = Dimensions.get('window');
const GLOBAL_PADDING = 20;
const CARD_GAP = 16;
const CARD_WIDTH = width * 0.85;

// --- Mock Data ---
const ORBIT_USERS: OrbitUser[] = [
  { name: 'Sarah', status: 'online', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Karim', status: 'busy', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { name: 'Elena', status: 'busy', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { name: 'Mike', status: 'online', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Amina', status: 'online', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'Youssef', status: 'busy', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
  { name: 'Lina', status: 'online', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80' },
  { name: 'Omar', status: 'offline', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
];

const HOTSPOTS: Hotspot[] = [
  { name: 'The Void', type: 'Lounge', dist: '1.2km', img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80' },
  { name: 'Sky Garden', type: 'Rooftop', dist: '3km', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80' },
  { name: 'Blue Note', type: 'Jazz Club', dist: '500m', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
  { name: 'Zenith', type: 'Spa', dist: '2.1km', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80' },
];

const SUBSCRIBER_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
];

// --- Animated Components ---

const PulsingRing = ({ delay = 0, size = 150 }) => {
  const ring = useSharedValue(0);

  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3500, easing: Easing.bezier(0.33, 0, 0.67, 1) }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(ring.value, [0, 0.4, 1], [0.7, 0.35, 0]),
      transform: [{ scale: interpolate(ring.value, [0, 1], [0.88, 1.65]) }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style
      ]}
    />
  );
};

const LiveDot = () => {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.liveDot, style]} />;
};

const FloatingOrb = ({ delay = 0, size = 300, top = 0, left = 0, color = '#E0EAFF' }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(12, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-12, { duration: 8000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay + 1000,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: 7000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.98, { duration: 6000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
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

// --- Chart Component ---
const MiniLineChart = () => {
  return (
    <Svg width="90" height="60" viewBox="0 0 120 60">
      <Defs>
        <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34D399" stopOpacity="0.35" />
          <Stop offset="1" stopColor="#34D399" stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M 0 48 Q 30 42, 38 32 T 75 20 Q 95 14, 120 10 L 120 60 L 0 60 Z"
        fill="url(#chartGradient)"
      />
      <Path
        d="M 0 48 Q 30 42, 38 32 T 75 20 Q 95 14, 120 10"
        stroke="#34D399"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="120" cy="10" r="5.5" fill="#FFF" stroke="#34D399" strokeWidth="2.5" />
    </Svg>
  );
};

// --- Glass Container (Refactored to Solid for Android Optimization) ---
const GlassContainer: React.FC<GlassContainerProps> = ({ children, style, intensity = 35, tint = 'light' }) => (
  <View style={[styles.glassWrapper, style]}>
    <View style={styles.glassInner}>
      {children}
    </View>
  </View>
);

// --- Enhanced Hotspot Card ---
const HotspotCard: React.FC<HotspotCardProps> = ({ data }) => (
  <TouchableOpacity style={styles.hotspotCard} activeOpacity={0.85}>
    <View style={styles.hotspotImageWrapper}>
      <ImageBackground
        source={{ uri: data.img }}
        style={styles.hotspotImg}
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.hotspotGradient}
        >
          <View style={styles.hotspotContent}>
            <View style={styles.hotspotTopRow}>
              <View style={styles.distanceBadge}>
                <Ionicons name="location-sharp" size={11} color="#FFF" />
                <Text style={styles.distanceText}>{data.dist}</Text>
              </View>
            </View>
            <View style={styles.hotspotBottom}>
              <Text style={styles.hotspotName}>{data.name}</Text>
              <Text style={styles.hotspotType}>{data.type}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  </TouchableOpacity>
);

// --- Live Radar Card ---
const LiveRadarCard = () => (
  <GlassContainer style={styles.scrollableCard}>
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Live Radar</Text>
          <Text style={styles.cardSubtitle}>Real-time tracking</Text>
        </View>
        <View style={styles.liveBadge}>
          <LiveDot />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.radarCircleContainer}>
        <PulsingRing delay={0} size={150} />
        <PulsingRing delay={600} size={150} />
        <PulsingRing delay={1200} size={150} />

        <View style={styles.radarCenter}>
          <View style={styles.radarCenterBlur}>
            <LinearGradient
              colors={['#0033FF', '#0033FF']}
              style={styles.radarCenterGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.radarNumber}>14</Text>
              <Text style={styles.radarLabel}>QRIB</Text>
              <Text style={styles.radarLabel}>قريب</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View style={styles.radarFooter}>
        <View style={styles.locationPill}>
          <Ionicons name="location" size={14} color="#4F89FF" />
          <Text style={styles.locationText}>Casa Marina</Text>
        </View>
      </View>
    </View>
  </GlassContainer>
);

// --- Subscribers Analytics Card ---
const SubscribersAnalyticsCard = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.analyticsCard} activeOpacity={0.9} onPress={onPress}>
    <View style={styles.analyticsBlur}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 249, 255, 0.95)']}
        style={styles.analyticsGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.analyticsTitle}>Subscribers Analytics</Text>
              <Text style={styles.cardSubtitle}>Weekly overview</Text>
            </View>
          </View>

          <View style={styles.analyticsBody}>
            <View style={styles.numberRow}>
              <Text style={styles.analyticsNumber}>2,485</Text>
              <View style={styles.activePill}>
                <View style={styles.activePillDot} />
                <Text style={styles.activePillText}>Active</Text>
              </View>
            </View>

            <View style={styles.subscriberRow}>
              <View style={styles.avatarStack}>
                {SUBSCRIBER_AVATARS.map((avatar, idx) => (
                  <View key={idx} style={[styles.avatarWrapper, { marginLeft: idx > 0 ? -12 : 0, zIndex: SUBSCRIBER_AVATARS.length - idx }]}>
                    <Image source={{ uri: avatar }} style={styles.stackImg} />
                  </View>
                ))}
              </View>
              <View style={styles.growthPill}>
                <Ionicons name="trending-up" size={13} color="#059669" />
                <Text style={styles.growthText}>+145</Text>
              </View>
            </View>
          </View>

          <View style={styles.graphWrapper}>
            <MiniLineChart />
          </View>
        </View>
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

// --- Liquid Transition Hook ---
const useProfileTransition = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const position = useSharedValue({ x: 0, y: 0 });
  const isAnimating = useSharedValue(false);
  const rotation = useSharedValue(0);

  const startTransition = (targetPosition: { x: number, y: number }) => {
    isAnimating.value = true;

    // Premium liquid easing curves
    const liquidEasing = Easing.bezier(0.34, 1.56, 0.64, 1.0);
    const flowEasing = Easing.bezier(0.25, 0.8, 0.25, 1);

    // Create a flowing, organic motion
    scale.value = withTiming(3.5, { duration: 600, easing: liquidEasing });
    opacity.value = withTiming(0.9, { duration: 600, easing: liquidEasing });

    // Add a subtle rotation for liquid-like flow
    rotation.value = withTiming(0.05, { duration: 600, easing: flowEasing });

    // Move to target position with organic flow
    position.value = withTiming(targetPosition, {
      duration: 600,
      easing: flowEasing
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
      { rotate: `${rotation.value}rad` },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return {
    startTransition,
    animatedStyle,
    isAnimating
  };
};

// --- Main Screen ---
export default function NewsScreen() {
  const router = useRouter();
  const { startTransition, animatedStyle, isAnimating } = useProfileTransition();
  const insets = useSafeAreaInsets();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [premiumOverlayVisible, setPremiumOverlayVisible] = useState(false);

  const handleProfilePress = () => {
    // Calculate target position (roughly where profile carousel is)
    const targetPosition = { x: width * 0.1, y: height * 0.1 };

    startTransition(targetPosition);

    // Navigate after animation starts
    setTimeout(() => {
      router.push('/(tabs)/profile');
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated Background with Gradient */}
      <LinearGradient
        colors={['#F0F4FF', '#F5F8FF', '#FAFCFF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Orbs - Minimal movements */}
      <View style={styles.orbsContainer}>
        <FloatingOrb delay={0} size={350} top={height * 0.08} left={width * -0.15} color="#E0EAFF" />
        <FloatingOrb delay={2000} size={400} top={height * 0.4} left={width * 0.55} color="#D6E4FF" />
        <FloatingOrb delay={4000} size={300} top={height * 0.65} left={width * -0.1} color="#EBF2FF" />
      </View>

      <View style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerGreeting}>Good Afternoon</Text>
            <Text style={styles.headerName}>Youssra</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.profileBtn} onPress={handleProfilePress}>
              <View style={styles.profileBlur}>
                <Image
                  source={require('../../assets/images/img.png')}
                  style={styles.profileImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBtn} onPress={() => setNotificationVisible(true)}>
              <View style={styles.notificationBlur}>
                <Ionicons name="notifications-outline" size={23} color="#1F2937" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>5</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContent}
              snapToInterval={CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
            >
              <LiveRadarCard />
              <SubscribersAnalyticsCard onPress={() => setPremiumOverlayVisible(true)} />
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderAligned}>
              <View>
                <Text style={styles.sectionTitle}>Your Orbit</Text>
                <Text style={styles.sectionSubtitle}>8 friends online now</Text>
              </View>
              <TouchableOpacity onPress={() => setPremiumOverlayVisible(true)}>
                <View style={styles.seeAllBtn}>
                  <Text style={styles.seeAllText}>See All</Text>
                  <Ionicons name="arrow-forward" size={14} color="#4F89FF" />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.orbitList}
            >
              {ORBIT_USERS.map((user, idx) => (
                <TouchableOpacity key={idx} style={styles.orbitUser} activeOpacity={0.75}>
                  <View style={styles.orbitAvatarContainer}>
                    <View style={styles.orbitAvatarBlur}>
                      <LinearGradient
                        colors={user.status === 'online' ? ['#4F89FF', '#2E5BFF'] : ['#93C5FD', '#60A5FA']}
                        style={styles.orbitAvatarGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.orbitAvatarInner}>
                          <Image source={{ uri: user.img }} style={styles.orbitAvatar} />
                        </View>
                      </LinearGradient>
                    </View>
                    <View style={[styles.statusIndicator, user.status === 'online' ? styles.statusOnline : styles.statusBusy]} />
                  </View>
                  <Text style={styles.orbitUserName}>{user.name}</Text>
                  <Text style={styles.orbitUserStatus}>{user.status === 'online' ? 'Online' : 'Busy'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderAligned}>
              <View>
                <Text style={styles.sectionTitle}>Active Hotspots</Text>
                <Text style={styles.sectionSubtitle}>Places near you</Text>
              </View>
              <TouchableOpacity>
                <View style={styles.filterBtn}>
                  <Ionicons name="options-outline" size={20} color="#4F89FF" />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hotspotsList}
            >
              {HOTSPOTS.map((spot, index) => (
                <HotspotCard key={index} data={spot} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* BottomNavbar is now handled in _layout.tsx */}

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

      <PremiumUpgradeOverlay
        visible={premiumOverlayVisible}
        onClose={() => setPremiumOverlayVisible(false)}
        onUpgrade={async () => {
          try {
            await authService.updateProfile({ isPremium: true });
          } catch (error) {
            console.error('Premium upgrade failed:', error);
          } finally {
            setPremiumOverlayVisible(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 10, paddingBottom: 120 },

  // Floating Orbs
  orbsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: GLOBAL_PADDING,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBtn: {
    borderRadius: 180,
    overflow: 'visible', // FIXED: Changed from hidden to visible
    shadowColor: '#4F89FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  profileBlur: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 26, // Perfect circle
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: { flex: 1 },
  headerGreeting: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '300',
    color: '#6B7280',
    letterSpacing: -1,
    marginBottom: 0,
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0,
  },
  notificationBtn: {
    borderRadius: 180,
    overflow: 'visible', // FIXED: Changed from hidden to visible
    shadowColor: '#4F89FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  notificationBlur: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 26, // Perfect circle
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

  // Glass Container
  glassWrapper: {
    borderRadius: 32,
    overflow: 'visible',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ebebebff',
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0,
    shadowRadius: 24,
    elevation: 8,
  },
  glassInner: {
    padding: 22,
    height: '100%',
    borderRadius: 32, // Added borderRadius here
    overflow: 'hidden', // Keep clipping for the blur effect itself
  },

  // Cards Section
  cardsSection: {
    marginBottom: 20,
    overflow: 'visible', // Ensure container doesn't clip
  },
  cardsScrollContent: {
    paddingHorizontal: GLOBAL_PADDING,
    paddingBottom: 40, // FIXED: Added paddingBottom to provide space for shadows
    gap: CARD_GAP,
  },
  scrollableCard: {
    width: CARD_WIDTH,
    height: 230,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.7,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: '#64748B',
    letterSpacing: 0.2,
  },

  // Live Badge
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 110, 110, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 0.8,
  },

  // Radar Styles
  pulseRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#4F89FF',
    backgroundColor: 'rgba(150, 185, 255, 0.04)',
  },
  radarCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    marginVertical: 16,
  },
  radarCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'visible', // FIXED: Changed from hidden to visible
    shadowColor: '#4F89FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 3.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  radarCenterBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 40, // Added borderRadius
    overflow: 'hidden', // Keep clipping for blur
  },
  radarCenterGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarNumber: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFF',
    letterSpacing: -1,
  },
  radarLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  radarFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F89FF',
    marginLeft: 5,
  },

  // Analytics Card
  analyticsCard: {
    width: CARD_WIDTH,
    height: 230,
    borderRadius: 32,
    overflow: 'visible',
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ebebebff',

    backgroundColor: '#FFFFFF',
  },
  analyticsBlur: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  analyticsGradient: {
    flex: 1,
    padding: 22,
  },
  analyticsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#047857',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  analyticsBody: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  analyticsNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: '#065f46',
    letterSpacing: -2,
  },
  activePill: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activePillDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
  },
  subscriberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: 18,
    padding: 2.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stackImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  growthText: {
    fontSize: 13,
    color: '#047857',
    marginLeft: 4,
  },

  graphWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    opacity: 0.2,
  },

  // Section
  section: {
    marginBottom: 10,
    overflow: 'visible', // Ensure section doesn't clip
  },
  sectionHeaderAligned: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: GLOBAL_PADDING,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: 0,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(79, 137, 255, 0.25)',
    overflow: 'hidden',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#4F89FF',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(79, 137, 255, 0.25)',
    overflow: 'hidden',
  },

  // Orbit List
  orbitList: {
    paddingHorizontal: GLOBAL_PADDING,
    paddingBottom: 20, // FIXED: Added paddingBottom for shadows
    gap: 15,
  },
  orbitUser: {
    alignItems: 'center',
  },
  orbitAvatarContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  orbitAvatarBlur: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  orbitAvatarGradient: {
    width: '100%',
    height: '100%',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  orbitAvatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 3.5,
    borderColor: '#FFF',
  },
  orbitAvatar: {
    width: '100%',
    height: '100%',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#F0F4FF',
  },
  statusOnline: {
    backgroundColor: '#4F89FF',
  },
  statusBusy: {
    backgroundColor: '#93C5FD',
  },
  orbitUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 0,
  },
  orbitUserStatus: {
    fontSize: 12,
    fontWeight: '300',
    color: '#94A3B8',
  },

  // Hotspots List
  hotspotsList: {
    paddingHorizontal: GLOBAL_PADDING,
    paddingBottom: 30, // FIXED: Added paddingBottom for shadows
    gap: 15,
  },
  hotspotCard: {
    width: width * 0.72,
  },
  hotspotImageWrapper: {
    height: 150,
    borderRadius: 16,
    overflow: 'visible', // FIXED: Changed from hidden to visible
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  hotspotImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16, // Added borderRadius
    overflow: 'hidden', // Keep clipping for image
  },
  hotspotGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 18,
  },
  hotspotContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hotspotTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  hotspotBottom: {
    gap: 5,
  },
  hotspotName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFF',
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  hotspotType: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.3,
  },
});
