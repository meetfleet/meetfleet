import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Aeonik-Black': require('../assets/fonts/Aeonik-Pro-Black.ttf'),
    'Aeonik-BlackItalic': require('../assets/fonts/Aeonik-Pro-Black-Italic.ttf'),
    'Aeonik-Bold': require('../assets/fonts/Aeonik-Pro-Bold.ttf'),
    'Aeonik-Light': require('../assets/fonts/Aeonik-Pro-Light.ttf'),
    'Aeonik-Regular': require('../assets/fonts/Aeonik-Pro-Regular.ttf'),
    'Aeonik-RegularItalic': require('../assets/fonts/Aeonik-Pro-Regular-Italic.ttf'),
    'Aeonik-Thin': require('../assets/fonts/Aeonik-Pro-Thin.ttf'),
    'Aeonik-ThinItalic': require('../assets/fonts/Aeonik-Pro-Thin-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Your existing Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* ADD THIS LINE BELOW: */}
          <Stack.Screen
            name="addcard"
            options={{
              headerShown: false,
              presentation: 'modal', // Optional: Makes it slide up like a card form
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="linked-accounts"
            options={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="password-email"
            options={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="blocked-users"
            options={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}