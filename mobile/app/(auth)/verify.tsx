import { AuthButton } from '@/components/auth/AuthButton';
import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyScreen() {
    const router = useRouter();
    const { mode, phone } = useLocalSearchParams();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text.length === 1 && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (mode === 'signup') {
            router.push({
                pathname: '/(auth)/emoji',
                params: { phone }
            });
        } else {
            router.push('/(auth)/success?mode=signin');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Quick{"\n"}Verification</Text>
                        <Text style={styles.subtitle}>
                            Please enter the 4-digit code send to you at{"\n"}
                            <Text style={styles.phoneNumber}>{phone}</Text>
                        </Text>
                    </View>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <View key={index} style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}>
                                <TextInput
                                    ref={(ref) => { inputs.current[index] = ref!; }}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectionColor="#0F172A"
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.resendButton}>
                        <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <AuthButton
                            title="Verify"
                            onPress={handleVerify}
                            disabled={otp.some(d => d === '')}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    backButton: {
        marginBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 34,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    phoneNumber: {
        fontFamily: Fonts.bold,
        color: '#64748B',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    otpBox: {
        width: 70,
        height: 70,
        borderRadius: 35, // Circle
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
    },
    otpBoxFilled: {
        borderColor: '#0F172A',
    },
    otpInput: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
    resendButton: {
        alignItems: 'center',
        marginBottom: 48,
    },
    resendText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 20,
    },
});
