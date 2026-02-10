import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Fonts, Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BlurView } from 'expo-blur';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function LocationPermissionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [showPopup, setShowPopup] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];

    useEffect(() => {
        if (showPopup) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [showPopup]);

    const handleAllow = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Simulate detection delay
        setTimeout(() => {
            router.push({
                pathname: '/(auth)/location-confirmation',
                params: params
            });
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Location"
                rightElement={
                    <TouchableOpacity
                        onPress={() => setShowPopup(true)}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Enable</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <MapPin size={48} color="#0F172A" strokeWidth={1.5} />
                    </View>
                </View>

                <Text style={styles.title}>Enable Location</Text>
                <Text style={styles.description}>
                    Neark uses your location to show you local orbits, hotspots, and events happening nearby in real-time.
                </Text>

                <View style={styles.infoBox}>
                    <Navigation size={18} color="#64748B" />
                    <Text style={styles.infoText}>
                        Your privacy is important. We only use your location when the app is active to help you connect.
                    </Text>
                </View>
            </View>

            {showPopup && (
                <View style={StyleSheet.absoluteFill}>
                    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                    <Animated.View style={[
                        styles.popupContainer,
                        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                    ]}>
                        <View style={styles.popup}>
                            <Text style={styles.popupTitle}>Allow "Neark" to use your location?</Text>
                            <Text style={styles.popupMessage}>
                                This allows the app to show you relevant people and places in your immediate orbit.
                            </Text>

                            <View style={styles.popupActions}>
                                <TouchableOpacity
                                    style={styles.popupButton}
                                    onPress={() => setShowPopup(false)}
                                >
                                    <Text style={styles.popupButtonTextGray}>Don't Allow</Text>
                                </TouchableOpacity>
                                <View style={styles.popupDivider} />
                                <TouchableOpacity
                                    style={styles.popupButton}
                                    onPress={handleAllow}
                                >
                                    <Text style={styles.popupButtonTextBlue}>Allow</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            )}
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
        paddingHorizontal: 32,
        alignItems: 'center',
        paddingTop: 60,
    },
    iconContainer: {
        marginBottom: 40,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: {
        fontSize: 28,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        gap: 12,
        marginTop: 'auto',
        marginBottom: 40,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#64748B',
        lineHeight: 18,
    },
    nextButton: {
        paddingHorizontal: 4,
    },
    nextText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    // Mock iOS Popup
    popupContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        width: 270,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 14,
        overflow: 'hidden',
    },
    popupTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        paddingTop: 18,
        paddingHorizontal: 16,
        color: '#000',
    },
    popupMessage: {
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 20,
        color: '#000',
    },
    popupActions: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#3F3F3F',
        height: 44,
    },
    popupButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupDivider: {
        width: StyleSheet.hairlineWidth,
        height: '100%',
        backgroundColor: '#3F3F3F',
    },
    popupButtonTextGray: {
        fontSize: 17,
        color: '#007AFF',
    },
    popupButtonTextBlue: {
        fontSize: 17,
        fontWeight: '600',
        color: '#007AFF',
    },
});
