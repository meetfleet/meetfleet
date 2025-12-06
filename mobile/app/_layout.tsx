import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}