import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Fonts, Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { MapPin, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LocationConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const handleConfirm = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: '/(auth)/photo-upload',
            params: params
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Confirm Location"
                rightElement={
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Confirm</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                <View style={styles.mapMock}>
                    {/* Visual representation of a map */}
                    <View style={styles.mapCircle1} />
                    <View style={styles.mapCircle2} />
                    <View style={styles.mapPinContainer}>
                        <MapPin size={40} color="#0F172A" fill="#0F172A" style={{ opacity: 0.1 }} />
                        <View style={styles.mainPin}>
                            <MapPin size={32} color="#0033FF" fill="#0033FF" />
                        </View>
                    </View>
                </View>

                <View style={styles.locationInfo}>
                    <Text style={styles.label}>Detected Location</Text>
                    <View style={styles.addressCard}>
                        <View style={styles.addressIcon}>
                            <CheckCircle2 size={20} color="#00CC66" />
                        </View>
                        <View style={styles.addressContent}>
                            <Text style={styles.addressText}>Casablanca, Morocco</Text>
                            <Text style={styles.subAddressText}>Anfa District, Maarif</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                    <Text style={styles.editButtonText}>Not your location? Edit</Text>
                </TouchableOpacity>

                <Text style={styles.helperText}>
                    We use your location to connect you with the most relevant orbits and events in your current area.
                </Text>
            </View>
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
    mapMock: {
        height: 240,
        backgroundColor: '#F8F9FA',
        borderRadius: 32,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapCircle1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'rgba(0, 51, 255, 0.05)',
    },
    mapCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0, 51, 255, 0.1)',
    },
    mapPinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainPin: {
        position: 'absolute',
        shadowColor: '#0033FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    locationInfo: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#64748B',
        marginBottom: 12,
        marginLeft: 4,
    },
    addressCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    addressIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 204, 102, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressContent: {
        flex: 1,
    },
    addressText: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    subAddressText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#64748B',
        marginTop: 2,
    },
    editButton: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    editButtonText: {
        fontSize: 15,
        fontFamily: Fonts.bold,
        color: '#0033FF',
    },
    helperText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#94A3B8',
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    nextButton: {
        paddingHorizontal: 4,
    },
    nextText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
});
