import { ScreenHeader } from '@/components/ScreenHeader';
import { Slider } from '@miblanchard/react-native-slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  Ghost,
  Globe,
  Lock,
  MessageCircle,
  Sparkles,
  UserPlus,
  UserX
} from 'lucide-react-native';
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
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- Custom Range Slider Component ---
interface RangeSliderSectionProps {
  title: string;
  values: number[]; // Expecting an array like [10, 50]
  onValueChange: (values: number[]) => void;
  min: number;
  max: number;
}

const RangeSliderSection = ({ title, values, onValueChange, min, max }: RangeSliderSectionProps) => {
  // Explicitly tell TypeScript this state can be a number OR null
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const renderThumb = (index: number) => {
    const isDragging = dragIndex === index;
    // Safely access the value, defaulting to min if undefined to prevent NaN
    const value = values[index] !== undefined ? Math.round(values[index]) : min;

    return (
      <View style={[styles.customThumb, isDragging && styles.customThumbActive]}>
        <Text style={[styles.customThumbText, isDragging && styles.customThumbTextActive]}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.sliderSection}>
      <Text style={styles.sliderLabel}>{title}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          animateTransitions
          value={values}
          minimumValue={min}
          maximumValue={max}
          step={1}
          onValueChange={(vals) => onValueChange(vals as number[])}
          // The library passes the actual value array and the index of the thumb being moved
          onSlidingStart={(val, index) => setDragIndex(index)}
          onSlidingComplete={() => setDragIndex(null)}
          // FIX: The library passes 'index' directly as a number, not as an object
          renderThumbComponent={(index) => renderThumb(index)}
          trackStyle={styles.trackStyle}
          minimumTrackTintColor="#64748B"
          maximumTrackTintColor="#E2E8F0"
        />
      </View>
    </View>
  );
};

// --- Floating Orb Background Component ---
const FloatingOrb = ({ delay = 0, size = 300, top = 0, left = 0, color = '#E0EAFF' }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(12, {
      duration: 8000,
      easing: Easing.inOut(Easing.ease),
    });

    translateX.value = withTiming(10, {
      duration: 7000,
      easing: Easing.inOut(Easing.ease),
    });

    scale.value = withTiming(1.05, {
      duration: 6000,
      easing: Easing.inOut(Easing.ease),
    });
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
        animatedStyle,
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



// --- Minimalist Toggle Switch ---
interface MinimalToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const MinimalToggle = ({ value, onValueChange }: MinimalToggleProps) => {
  const translateX = useSharedValue(value ? 20 : 0);

  useEffect(() => {
    translateX.value = withSpring(value ? 20 : 0, {
      damping: 80,
      stiffness: 100,
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      style={[styles.toggleTrack, value && styles.toggleTrackActive]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.toggleThumb, animatedStyle]} />
    </TouchableOpacity>
  );
};

// --- Section Header Component ---
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

// --- Setting Card Component ---
const SettingCard = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// --- Toggle Row Component ---
interface ToggleRowProps {
  icon: any;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleRow = ({
  icon: Icon,
  title,
  subtitle,
  value,
  onValueChange,
}: ToggleRowProps) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleLeft}>
      <View style={styles.iconContainer}>
        <Icon size={20} color="#64748B" strokeWidth={1.5} />
      </View>
      <View style={styles.toggleText}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <MinimalToggle value={value} onValueChange={onValueChange} />
  </View>
);

// --- Navigation Row Component ---
interface NavigationRowProps {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const NavigationRow = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: NavigationRowProps) => (
  <TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.navLeft}>
      <View style={styles.iconContainer}>
        <Icon size={20} color="#64748B" strokeWidth={1.5} />
      </View>
      <View style={styles.navText}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <ChevronRight size={20} color="#CBD5E1" strokeWidth={1.5} />
  </TouchableOpacity>
);

// --- Simple Navigation Row Component ---
const SimpleNavRow = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.simpleNavRow} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.simpleNavTitle}>{title}</Text>
    <ChevronRight size={20} color="#CBD5E1" strokeWidth={1.5} />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const [ghostMode, setGhostMode] = useState(true);

  // Use array state for ranges [min, max]
  const [discoveryRange, setDiscoveryRange] = useState<number[]>([10, 50]);
  const [ageRange, setAgeRange] = useState<number[]>([29, 35]);

  const [profileVisibility, setProfileVisibility] = useState('Everyone');
  const [pushNotifications, setPushNotifications] = useState(false);
  const [plansNotifications, setPlansNotifications] = useState(true);
  const [messagesNotifications, setMessagesNotifications] = useState(true);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Orbs */}
      <FloatingOrb delay={0} size={380} top={-120} left={-80} color="#E0EAFF" />
      <FloatingOrb delay={1500} size={320} top={height * 0.3} left={width - 200} color="#DBEAFE" />
      <FloatingOrb delay={3000} size={280} top={height * 0.6} left={-60} color="#E0E7FF" />

      {/* Header with Back Button and Title */}
      <ScreenHeader title="Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy & Visibility Section */}
        <SectionHeader
          title="Privacy & Visibility"
          subtitle="In Neark we care about your confidentiality"
        />

        <SettingCard>
          <ToggleRow
            icon={Ghost}
            title="Ghost Mode"
            subtitle="Navigate anonymously"
            value={ghostMode}
            onValueChange={setGhostMode}
          />
        </SettingCard>

        {/* --- SLIDERS SECTION --- */}
        <SettingCard style={{ marginTop: 12 }}>

          {/* Discovery Radius Slider */}
          <RangeSliderSection
            title="Discovery Radius km"
            values={discoveryRange}
            onValueChange={setDiscoveryRange}
            min={1}
            max={100}
          />

          <View style={styles.divider} />

          {/* Age Limit Slider */}
          <RangeSliderSection
            title="Age Limit"
            values={ageRange}
            onValueChange={setAgeRange}
            min={18}
            max={100}
          />

        </SettingCard>
        {/* ----------------------------- */}

        <SettingCard style={{ marginTop: 12 }}>
          <TouchableOpacity
            style={styles.visibilityRow}
            onPress={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
            activeOpacity={0.7}
          >
            <Text style={styles.visibilityLabel}>Profile Visibility</Text>
            <View style={styles.visibilityValue}>
              <Globe size={16} color="#0033FF" strokeWidth={1.5} />
              <Text style={styles.visibilityText}>{profileVisibility}</Text>
              <ChevronDown size={16} color="#0033FF" strokeWidth={1.5} />
            </View>
          </TouchableOpacity>
        </SettingCard>

        {/* Notifications Section */}
        <SectionHeader title="Notifications" subtitle="Customize your notifications" />

        <SettingCard>
          <ToggleRow
            icon={Bell}
            title="Push Notifications"
            subtitle="App reminders & updates"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
        </SettingCard>

        <SettingCard style={{ marginTop: 12 }}>
          <ToggleRow
            icon={Calendar}
            title="Plans"
            subtitle="Requests, suggestions..."
            value={plansNotifications}
            onValueChange={setPlansNotifications}
          />
        </SettingCard>

        <SettingCard style={{ marginTop: 12 }}>
          <ToggleRow
            icon={MessageCircle}
            title="Messages"
            subtitle="Requests, suggestions..."
            value={messagesNotifications}
            onValueChange={setMessagesNotifications}
          />
        </SettingCard>

        {/* Account Section */}
        <SectionHeader title="Account" subtitle="Global account settings" />

        <SettingCard>
          <NavigationRow
            icon={UserPlus}
            title="Linked accounts"
            subtitle="Other accounts for Log In"
            onPress={() => router.push('/linked-accounts')}
          />
        </SettingCard>

        <SettingCard style={{ marginTop: 12 }}>
          <NavigationRow
            icon={Lock}
            title="Password and Email"
            subtitle="Change account details"
            onPress={() => router.push('/password-email')}
          />
        </SettingCard>

        <SettingCard style={{ marginTop: 12 }}>
          <NavigationRow
            icon={Sparkles}
            title="Subscription"
            subtitle="Manage your plan"
            onPress={() => router.push('/settings/subscription')}
          />
        </SettingCard>

        <SettingCard style={{ marginTop: 12 }}>
          <NavigationRow
            icon={UserX}
            title="Blocked Users"
            subtitle="View people you blocked"
            onPress={() => router.push('/blocked-users')}
          />
        </SettingCard>

        {/* Simple Navigation Links */}
        <View style={{ marginTop: 24 }}>
          <SimpleNavRow title="Help & Support" onPress={() => { }} />
          <SimpleNavRow title="Terms of Service" onPress={() => { }} />
          <SimpleNavRow title="Contact Us" onPress={() => { }} />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginRight: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#0033FF',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // --- New Slider Styles ---
  sliderSection: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sliderContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 10,
  },
  trackStyle: {
    height: 6,
    borderRadius: 3,
  },
  customThumb: {
    width: 40,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  customThumbActive: {
    backgroundColor: '#0033FF',
    borderColor: '#0033FF',
    transform: [{ scale: 1.1 }],
  },
  customThumbText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  customThumbTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    marginHorizontal: -16,
  },

  // --- Other Styles ---
  visibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  visibilityLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  visibilityValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0033FF',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    flex: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 2,
  },
  navSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
  },
  simpleNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  simpleNavTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0F172A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
  },
});