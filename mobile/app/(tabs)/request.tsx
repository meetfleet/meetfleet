import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fingersCrossedImage = require('@/assets/fingers_crossed.png');
const avatarImage = require('@/assets/avatar.png');

const RequestScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Gradient or Color to match app */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F8FAFC' }]} />

      {/* Header Area */}
      <View style={[styles.customHeaderContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.customBackButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BlurView intensity={35} tint="light" style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Request Details</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Image
          source={fingersCrossedImage}
          style={styles.mainImage}
        />
        <Text style={styles.title}>Request Sent To Jamila</Text>
        <Text style={styles.subtitle}>
          If your request got accepted, you'll be notified immediately
        </Text>

        <View style={styles.replyTimeContainer}>
          <Image
            source={avatarImage}
            style={styles.avatarImage}
          />
          <Text style={styles.replyTimeText}>
            Jamila's Usual reply time: 13 mins
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.navButtonText}>Navigation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.activityButton]}
          onPress={() => router.push('/plans/sent')}
        >
          <Text style={[styles.navButtonText, styles.activityButtonText]}>
            Plan Status
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Header
  customHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
    zIndex: 100,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  customBackButton: {},
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  replyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#F1F5F9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  replyTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
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
});

export default RequestScreen;
