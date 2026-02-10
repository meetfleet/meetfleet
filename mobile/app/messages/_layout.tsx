import { Stack } from 'expo-router';
import React from 'react';

export default function MessagesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Fluid "poured upward" feel (no hard cuts)
        animation: 'slide_from_bottom',
        animationDuration: 220,
      }}
    />
  );
}

