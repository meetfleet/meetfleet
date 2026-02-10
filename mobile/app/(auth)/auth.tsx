import { AuthButton } from '@/components/auth/AuthButton';
import { PhoneInput, Country } from '@/components/auth/PhoneInput';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '@/services/auth';

export default function AuthScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+212');
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsLoading(true);

        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        try {
            // Check if user exists in the backend
            const response = await authService.checkUserExists(fullPhoneNumber);

            if (response.exists) {
                // User exists - send verification code and go to verify screen
                await sendVerificationCode(fullPhoneNumber);
                router.push({
                    pathname: '/(auth)/verify',
                    params: { phone: fullPhoneNumber }
                });
            } else {
                // New user - go directly to emoji selection (first step of signup)
                router.push({
                    pathname: '/(auth)/emoji',
                    params: { phone: fullPhoneNumber }
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock function - replace with your actual API call
    const checkUserExists = async (phone: string): Promise<{ exists: boolean }> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, you can return false to always go to signup flow
        // or true to always go to signin flow
        return { exists: false };
    };

    // Mock function - replace with your actual API call
    const sendVerificationCode = async (phone: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Verification code sent to:', phone);
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Implement social login
        console.log('Social login with:', provider);
    };

    const isButtonDisabled = !/^\d{8,15}$/.test(phoneNumber) || !termsAccepted || isLoading;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to Neark</Text>
                        <Text style={styles.subtitle}>
                            We only use phone numbers to make sure everyone on Neark is real
                        </Text>
                    </View>

                    <View style={styles.inputSection}>
                        <PhoneInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            onCountryChange={(country: Country) => setCountryCode(country.dialCode)}
                        />
                    </View>

                    <View style={styles.socialButtons}>
                        <Text style={styles.sectionLabel}>Or continue with</Text>
                        <SocialLoginButton
                            provider="google"
                            onPress={() => handleSocialLogin('google')}
                        />
                        <SocialLoginButton
                            provider="apple"
                            onPress={() => handleSocialLogin('apple')}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setTermsAccepted(!termsAccepted);
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                            {termsAccepted && (
    <Ionicons
        name="checkmark"
        size={16}
        color="#FFF"
        style={{ opacity: 0, transform: [{ scale: 0.5 }] }}
    />
)}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text 
                                style={styles.termsLink}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    // TODO: Navigate to Terms of Service
                                }}
                            >
                                Terms of Service
                            </Text>
                            {' '}and{' '}
                            <Text 
                                style={styles.termsLink}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    // TODO: Navigate to Privacy Policy
                                }}
                            >
                                Privacy Policy
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <AuthButton
                            title={isLoading ? "Please wait..." : "Continue"}
                            onPress={handleContinue}
                            disabled={isButtonDisabled}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 34,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    inputSection: {
        marginBottom: 32,
    },
    socialButtons: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 16,
    },
    termsContainer: {
        flexDirection: 'row',
        marginBottom: 32,
        paddingHorizontal: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#0033FF',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transitionProperty: 'backgroundColor, borderColor',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease-out',
    },
    checkboxChecked: {
        backgroundColor: '#0033FF',
        transform: [{ scale: 1.1 }],
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#64748B',
        lineHeight: 20,
    },
    termsLink: {
        fontFamily: Fonts.bold,
        color: '#0F172A',
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: 'auto',
    },
});
