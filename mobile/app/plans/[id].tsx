import { PlanInfoCard } from '@/components/PlanInfoCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Fonts } from '@/constants/theme';
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface PlanUser {
  name: string;
  avatar: any;
  replyTime?: string;
  age?: number;
  rating?: number;
}

interface PlanDetail {
  label: string;
  value: string;
  icon: IconName;
}

interface PlanInterest {
  icon: IconName;
  label: string;
}

interface PlanInfo {
  title: string;
  emoji: string;
  location?: string;
  distance?: string;
  time?: string;
  relativeTime?: string;
}

interface BasePlanData {
  state: 'sent' | 'pending' | 'received' | 'confirmed' | 'completed';
  headerTitle: string;
  user: PlanUser;
  plan: PlanInfo;
  details?: PlanDetail[];
  interests?: PlanInterest[];
  message?: string[];
}

// Unified PlanData interface since we want details available for all states now
type PlanData = BasePlanData;

// Mock Data
const MOCK_PLANS: Record<string, PlanData> = {
  'sent': {
    state: 'sent',
    headerTitle: 'Request Sent',
    user: {
      name: 'Jamila',
      avatar: require('@/assets/avatar.png'),
      replyTime: '13 mins',
      age: 24,
      rating: 4.5,
    },
    plan: {
      title: 'Girls Shopping',
      emoji: '🛍️',
      location: 'Mega Mall',
      distance: '2.5 km away',
      time: '14:00 Today',
      relativeTime: 'In 2 hours',
    },
    details: [
        { label: 'Duration', value: '3 hours', icon: 'hourglass-outline' },
        { label: 'Cost', value: 'Self', icon: 'wallet-outline' },
        { label: 'Smoker', value: 'No', icon: 'ban-outline' },
        { label: 'Job', value: 'Designer', icon: 'briefcase-outline' },
    ],
    interests: [
        { icon: 'shirt-outline', label: 'Fashion' },
        { icon: 'cafe-outline', label: 'Coffee' },
    ],
    message: [
        "Hey! Planning to go shopping at Mega Mall.",
        "Need some fashion advice!"
    ]
  },
  'pending': { 
    state: 'pending',
    headerTitle: 'Pending Request',
    user: {
      name: 'Sarah',
      avatar: { uri: 'https://i.pravatar.cc/150?u=sarah' },
      replyTime: '1 hour',
      age: 27,
      rating: 4.9,
    },
    plan: {
      title: 'Coffee Catchup',
      emoji: '☕',
      location: 'Starbucks Agdal',
      distance: '0.5 km away',
      time: '10:00 Tomorrow',
      relativeTime: 'Tomorrow morning',
    },
    details: [
        { label: 'Duration', value: '1 hour', icon: 'hourglass-outline' },
        { label: 'Cost', value: 'Split', icon: 'wallet-outline' },
        { label: 'Smoker', value: 'No', icon: 'ban-outline' },
        { label: 'Job', value: 'Student', icon: 'briefcase-outline' },
    ],
    interests: [
        { icon: 'cafe-outline', label: 'Coffee' },
        { icon: 'book-outline', label: 'Reading' },
    ],
    message: [
        "Long time no see! Let's catch up over coffee.",
    ]
  },
  'received': {
    state: 'received',
    headerTitle: 'Request',
    plan: {
      title: 'Fifa Night',
      emoji: '🎮',
      location: 'Zing Rabat',
      distance: '1 km away',
      time: '20:00 Today',
      relativeTime: '4 hours from now',
    },
    user: {
      name: 'Joseph',
      age: 29,
      rating: 4.9,
      avatar: { uri: 'https://i.pravatar.cc/150?u=joseph' },
    },
    details: [
        { label: 'Duration', value: '3 hours', icon: 'hourglass-outline' },
        { label: 'Cost', value: 'Split', icon: 'wallet-outline' },
        { label: 'Smoker', value: 'Yes', icon: 'ban-outline' },
        { label: 'Job', value: 'Dev', icon: 'briefcase-outline' },
    ],
    interests: [
        { icon: 'game-controller-outline', label: 'Gaming' },
        { icon: 'football-outline', label: 'Football' },
    ],
    message: [
        "Hey! Who's up for some FIFA tonight?",
        "I've got the snacks ready!"
    ]
  },
  'confirmed': {
    state: 'confirmed',
    headerTitle: 'Confirmed',
    plan: {
      title: 'Afterwork Drinks With Imad',
      emoji: '🍻',
      location: 'Zing Rabat',
      distance: '1 km away',
      time: '20:00 Today',
      relativeTime: '4 hours from now',
    },
    user: {
      name: 'Imad',
      age: 26,
      rating: 4.8,
      avatar: { uri: 'https://i.pravatar.cc/150?u=imad' },
    },
    details: [
        { label: 'Duration', value: '1-2 hours', icon: 'hourglass-outline' },
        { label: 'Cost', value: 'On Him', icon: 'wallet-outline' },
        { label: 'Smoker', value: 'No', icon: 'ban-outline' },
        { label: 'Job', value: 'Sales Mgr', icon: 'briefcase-outline' },
    ],
    interests: [
        { icon: 'color-palette-outline', label: 'Art' },
        { icon: 'bicycle-outline', label: 'Sports' },
        { icon: 'musical-notes-outline', label: 'Music' },
        { icon: 'star-outline', label: 'Pop Culture' },
    ],
    message: [
        "Hey nearkers! I'm always thirsty after work and looking for some company.",
        "You're all welcome to join!"
    ]
  },
  'completed': {
      state: 'completed',
      headerTitle: 'Completed',
      plan: {
        title: 'Afterwork Drinks With Imad',
        emoji: '🍻',
        location: 'Zing Rabat',
        distance: '1 km away',
        time: '20:00 Today',
        relativeTime: '4 hours from now',
      },
      user: {
        name: 'Imad',
        age: 26,
        rating: 4.8,
        avatar: { uri: 'https://i.pravatar.cc/150?u=imad' },
      },
      details: [
        { label: 'Duration', value: '1-2 hours', icon: 'hourglass-outline' },
        { label: 'Cost', value: 'On Him', icon: 'wallet-outline' },
        { label: 'Smoker', value: 'No', icon: 'ban-outline' },
        { label: 'Job', value: 'Sales Mgr', icon: 'briefcase-outline' },
    ],
    interests: [
        { icon: 'color-palette-outline', label: 'Art' },
        { icon: 'bicycle-outline', label: 'Sports' },
        { icon: 'musical-notes-outline', label: 'Music' },
        { icon: 'star-outline', label: 'Pop Culture' },
    ],
    message: [
        "Hey nearkers! I'm always thirsty after work and looking for some company.",
        "You're all welcome to join!"
    ]
    }
};

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Mobile keyboard handling
  const { keyboardHeight } = useMobileKeyboard();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(-keyboardHeight, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [keyboardHeight]);

  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  
  // Fallback to 'sent' if id not found or invalid
  const planId = typeof id === 'string' ? id : 'sent';
  const planData = MOCK_PLANS[planId] || MOCK_PLANS['sent'];

  const handleAccept = () => {
    router.push('/plans/success');
  };

  const handleDeny = () => {
    router.back();
  };

  const renderActionButtons = (actions: string[]) => (
    <View style={styles.actionButtonsRow}>
      {actions.map((action, index) => {
        let iconName: any = 'flag-outline';
        let label = action;
        
        if (action === 'Report') iconName = 'flag-outline';
        if (action === 'Inbox') iconName = 'chatbubble-outline';
        if (action === 'Call') iconName = 'call-outline';
        if (action === 'Profile') iconName = 'person-outline';

        return (
          <TouchableOpacity key={index} style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
                <Ionicons name={iconName} size={20} color="#0F172A" />
            </View>
            <Text style={styles.actionButtonText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDetailsGrid = () => {
      if (!planData.details) return null;
      return (
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Plan Details</Text>
              <View style={styles.detailsGrid}>
                  {planData.details.map((detail: any, index: number) => (
                      <View key={index} style={styles.detailItem}>
                          <View style={styles.detailIconBox}>
                              <Ionicons name={detail.icon} size={20} color="#4F46E5" />
                          </View>
                          <View>
                              <Text style={styles.detailLabel}>{detail.label}</Text>
                              <Text style={styles.detailValue}>{detail.value}</Text>
                          </View>
                      </View>
                  ))}
              </View>
          </View>
      );
  };

  const renderInterests = () => {
      if (!planData.interests) return null;
      return (
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestsContainer}>
                  {planData.interests.map((interest: any, index: number) => (
                      <View key={index} style={styles.chip}>
                          <Ionicons name={interest.icon} size={14} color="#334155" style={styles.chipIcon} />
                          <Text style={styles.chipText}>{interest.label}</Text>
                      </View>
                  ))}
              </View>
          </View>
      );
  };

  const renderMessage = () => {
      if (!planData.message) return null;
      return (
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>{planData.user.name}'s want to say</Text>
              {planData.message.map((text: string, index: number) => (
                  <Text key={index} style={styles.descriptionText}>{text}</Text>
              ))}
          </View>
      );
  };

  const renderStatusBadge = () => {
    if (planData.state === 'confirmed') {
      return (
        <View style={styles.headerBadgeConfirmed}>
          <Text style={styles.confirmedText}>Confirmed</Text>
        </View>
      );
    }
    if (planData.state === 'sent') {
      return (
        <View style={styles.headerBadgeSent}>
          <Text style={styles.sentText}>Sent</Text>
        </View>
      );
    }
    if (planData.state === 'pending') {
      return (
        <View style={styles.headerBadgePending}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      );
    }
    return null;
  };

  const renderPlanDetails = (showActions: string[]) => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Title & Emoji Row (80/20 Split) */}
      <View style={styles.headerTitleRow}>
         <View style={styles.titleContainer}>
            <Text style={styles.planTitle}>{planData.plan.title}</Text>
         </View>
         
         <View style={styles.emojiContainer}>
             <Text style={styles.emojiText}>{planData.plan.emoji}</Text>
         </View>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <Image source={typeof planData.user.avatar === 'string' ? { uri: planData.user.avatar } : planData.user.avatar} style={styles.userAvatar} />
        <Text style={styles.userName}>{planData.user.name}, {planData.user.age}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#4F46E5" />
          <Text style={styles.ratingText}>{planData.user.rating}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {renderActionButtons(showActions)}

      {/* Location Card */}
      <PlanInfoCard 
        icon="location-outline"
        title={planData.plan.location || 'Unknown Location'}
        subtitle={planData.plan.distance || ''}
        buttonText="Open in Map"
        onPress={() => {}}
      />

      {/* Time Card */}
      <PlanInfoCard 
        icon="time-outline"
        title={planData.plan.time || 'TBD'}
        subtitle={planData.plan.relativeTime || ''}
        buttonText="Add Reminder"
        onPress={() => {}}
      />

      {/* New Details Sections */}
      {renderDetailsGrid()}
      {renderInterests()}
      {renderMessage()}
      
      {planData.state === 'confirmed' && (
          <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Plan</Text>
          </TouchableOpacity>
      )}

      {planData.state === 'completed' && (
          <TouchableOpacity style={styles.viewPlanButton} onPress={() => router.push('/feedback/1')}>
              <Text style={styles.viewPlanButtonText}>Rate & Review</Text>
          </TouchableOpacity>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title={planData.headerTitle || 'Request Details'} 
        showBackButton={true}
      />
      
      {renderPlanDetails(
        (planData.state === 'received' || planData.state === 'pending' || planData.state === 'sent') 
        ? ['Report', 'Profile'] 
        : ['Report', 'Inbox', 'Call', 'Profile']
      )}

      {/* Footer for Received State */}
      {planData.state === 'received' && (
        <Animated.View style={[styles.footer, { paddingBottom: insets.bottom + 10 }, animatedFooterStyle]}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Footer for Sent/Pending State (Navigation) */}
      {(planData.state === 'sent' || planData.state === 'pending') && (
         <Animated.View style={[styles.footerSent, { paddingBottom: insets.bottom + 20 }, animatedFooterStyle]}>
            <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.replace('/(tabs)')}
            >
            <Text style={styles.navButtonText}>Navigation</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.navButton, styles.activityButton]}
            onPress={() => router.push('/(tabs)/events')}
            >
            <Text style={[styles.navButtonText, styles.activityButtonText]}>
                Plan Status
            </Text>
            </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Plan Details Styles
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align center vertically
    marginBottom: 20,
    marginTop: 10,
  },
  titleContainer: {
      width: '78%', // Slightly less than 80 to allow spacing
      justifyContent: 'center',
  },
  emojiContainer: {
      width: '20%',
      aspectRatio: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 999, // Circle
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#F1F5F9',
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  emojiText: {
      fontSize: 32,
  },
  planTitle: {
    fontSize: 28, // Adjusted for 80% width
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  // Badges for Header (no margin bottom)
  headerBadgeConfirmed: {
    backgroundColor: '#E0F2FE', // Light blue/green
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confirmedText: {
    color: '#0284C7',
    fontWeight: '600',
    fontSize: 12,
  },
  headerBadgeSent: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sentText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 12,
  },
  headerBadgePending: {
    backgroundColor: '#FFF7ED', // Orange tint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    color: '#EA580C', // Orange
    fontWeight: '600',
    fontSize: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Minimal shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
      marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  viewPlanButton: {
      backgroundColor: '#2563EB',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 20,
  },
  viewPlanButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
  },
  cancelButton: {
      alignItems: 'center',
      marginTop: 20,
  },
  cancelButtonText: {
      color: '#64748B',
      fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    gap: 12,
  },
  acceptButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  denyButton: {
    paddingVertical: 10,
  },
  denyButtonText: {
    color: '#64748B',
    fontSize: 16,
  },
  footerSent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityButton: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  activityButtonText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 12,
    color: '#0F172A',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    width: '48%', // Approx 2 columns
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    gap: 12,
    // Add shadow to match infoCard
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Fonts.regular,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#0F172A',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#334155',
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: Fonts.regular,
  },
});

