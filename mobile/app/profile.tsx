import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { BadgesSection } from '@/components/profile/BadgesSection';
import { InterestsSection } from '@/components/profile/InterestsSection';
import { ProfileCarousel } from '@/components/profile/ProfileCarousel';
import { StatsCarousel } from '@/components/profile/StatsCarousel';

import { ProfileOptionsModal } from '@/components/profile/ProfileOptionsModal';
import { useState } from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
               <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 10 }}
              onPress={() => setMenuVisible(true)}
            >
               <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCarousel />
        <StatsCarousel />
        <InterestsSection />
        <BadgesSection />
      </ScrollView>

      <ProfileOptionsModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
