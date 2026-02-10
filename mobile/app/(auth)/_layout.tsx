import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="verify" />
            <Stack.Screen name="emoji" />
            <Stack.Screen name="identity" />
            <Stack.Screen name="bio" />
            <Stack.Screen name="interests" />
            <Stack.Screen name="location-permission" />
            <Stack.Screen name="location-confirmation" />
            <Stack.Screen name="photo-upload" />
            <Stack.Screen name="success" />
        </Stack>
    );
}
