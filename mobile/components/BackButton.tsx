import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  label?: string;
  onPress?: () => void;
  style?: object;
}

export function BackButton({ 
  label = 'Back', 
  onPress,
  style 
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={16} color="#000" />
        <Text style={styles.backButtonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: '#E5E5E5',
  },
  backButtonText: {
    fontSize: 15,
    color: '#000',
    marginLeft: 4,
  },
});