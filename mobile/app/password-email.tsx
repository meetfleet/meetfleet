import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts, Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default"
}: {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    secureTextEntry?: boolean,
    keyboardType?: any
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {secureTextEntry && (
                    <TouchableOpacity style={styles.eyeIcon}>
                        <Ionicons name="eye-outline" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default function PasswordEmailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('imad.dev@gmail.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = (type: 'email' | 'password') => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Logic to save
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <BlurView intensity={35} tint="light" style={styles.backButtonBlur}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </BlurView>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Password & Email</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <Text style={styles.pageTitle}>Account Security</Text>
                        <Text style={styles.pageSubtitle}>Update your credentials to keep your account safe.</Text>
                    </Animated.View>

                    {/* Email Section */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(500)}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIconColor}>
                                <Ionicons name="mail" size={20} color="#0033FF" />
                            </View>
                            <Text style={styles.sectionTitle}>Email Address</Text>
                        </View>

                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => handleSave('email')}
                        >
                            <Text style={styles.saveButtonText}>Update Email</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Password Section */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(500)}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIconColor, { backgroundColor: '#F0F9FF' }]}>
                                <Ionicons name="lock-closed" size={20} color="#0EA5E9" />
                            </View>
                            <Text style={styles.sectionTitle}>Change Password</Text>
                        </View>

                        <InputField
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        <InputField
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        <InputField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: '#0F172A' }]}
                            onPress={() => handleSave('password')}
                        >
                            <Text style={styles.saveButtonText}>Update Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot your current password?</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.footerNote}>
                        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
                        <Text style={styles.footerNoteText}>
                            Changing your password will log you out from all other active sessions.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButtonBlur: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    backButton: {},
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pageTitle: {
        fontSize: 28,
        fontFamily: Fonts.black,
        color: '#0F172A',
        marginTop: 10,
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
        fontFamily: Fonts.regular,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    sectionIconColor: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#F0F3FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#475569',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        height: 56,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputWrapperFocused: {
        borderColor: '#0033FF',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0F172A',
        fontFamily: Fonts.regular,
    },
    eyeIcon: {
        padding: 8,
    },
    saveButton: {
        height: 56,
        backgroundColor: '#0033FF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#0033FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#FFFFFF',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#64748B',
        fontFamily: Fonts.regular,
        textDecorationLine: 'underline',
    },
    footerNote: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 12,
        gap: 10,
    },
    footerNoteText: {
        fontSize: 13,
        color: '#94A3B8',
        fontFamily: Fonts.regular,
        flex: 1,
        lineHeight: 18,
    },
});
