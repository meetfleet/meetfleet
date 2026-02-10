import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const TRENDY_EASING = Easing.bezier(0.33, 1, 0.48, 1);
const DURATION = 350;

// --- SVG COMPONENTS (Preserved) ---
const CustomCardChip = () => (
    <Svg width="42" height="32" viewBox="0 0 30 23" fill="none">
        <Defs>
            <RadialGradient id="grad1" cx="0" cy="0" r="1" gradientTransform="matrix(-15.8 13.9 -19 -11.6 17.2 8.1)" gradientUnits="userSpaceOnUse">
                <Stop stopColor="white" />
                <Stop offset="1" stopColor="#DDDCDA" />
            </RadialGradient>
        </Defs>
        <Rect y="0.1" width="30" height="22" rx="5" fill="url(#grad1)" fillOpacity={0.2} />
        <Path d="M15 0.3L11.6 6.1C11.6 6.1 13 11.1 11.6 15.4L15 21.9L18.3 15.4C18.3 15.4 17 11.8 18.3 6.1C18.3 6.1 15 0.3 15 0.3Z" stroke="#C7C7B6" strokeWidth="1.3" />
        <Path d="M0 6.3H11.6M18 6.3H30M0 15.1H11.6M18 15.1H30" stroke="#C7C7B6" strokeWidth="1.3" />
    </Svg>
);

const CardLogo = ({ type }: { type: 'visa' | 'mastercard' | 'other' }) => {
    if (type === 'visa') {
        return (
            <Svg width="57" height="19" viewBox="0 0 57 19" fill="none">
                <Path d="M28.2122 0.325042L24.405 18.1229H19.8009L23.6096 0.325042H28.2122ZM47.5835 11.8169L50.0063 5.1338L51.4013 11.8169H47.5835ZM52.7203 18.1229H56.9783L53.2613 0.325042H49.3313C48.4472 0.325042 47.7023 0.839702 47.372 1.6305L40.4632 18.1229H45.2976L46.2577 15.4646H52.1642L52.7203 18.1229ZM40.7033 12.3119C40.7228 7.61455 34.2076 7.35572 34.2527 5.2572C34.2663 4.61914 34.875 3.9397 36.2053 3.76664C36.8651 3.68011 38.683 3.6139 40.7447 4.56271L41.5528 0.78929C40.4452 0.386742 39.0201 -5.4678e-06 37.2466 -5.4678e-06C32.6959 -5.4678e-06 29.4929 2.41904 29.4658 5.88322C29.4364 8.44523 31.7516 9.87559 33.4965 10.7266C35.2911 11.5986 35.893 12.1585 35.8862 12.9387C35.8734 14.1328 34.4551 14.6595 33.1293 14.6806C30.8149 14.716 29.4718 14.0546 28.4018 13.5565L27.5674 17.4555C28.6426 17.9491 30.6283 18.3795 32.6877 18.4013C37.5243 18.4013 40.6882 16.0124 40.7033 12.3119ZM21.6338 0.325042L14.1742 18.1229H9.30752L5.63643 3.91938C5.41371 3.04431 5.21958 2.72378 4.5424 2.35584C3.43558 1.7554 1.60793 1.19184 0 0.841959L0.109854 0.325042H7.94412C8.94259 0.325042 9.84023 0.989435 10.0667 2.1399L12.0057 12.4391L16.7972 0.325042H21.6338Z" fill="#D9D9D9" fillOpacity={0.4} />
            </Svg>
        );
    }
    if (type === 'mastercard') {
        return (
            <Svg width="54" height="32" viewBox="0 0 54 32" fill="none">
                <Circle cx="15.8807" cy="15.8807" r="15.8807" fill="#D9D9D9" fillOpacity={0.4} />
                <Circle cx="37.8764" cy="15.8807" r="15.8807" fill="#D9D9D9" fillOpacity={0.4} />
            </Svg>
        );
    }
    return (
        <Svg width="51" height="27" viewBox="0 0 51 27" fill="none">
            <Rect width="50.9376" height="27" rx="13.5" fill="#D9D9D9" fillOpacity={0.2} />
        </Svg>
    );
};

export default function AddCardScreen() {
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const transitionValue = useSharedValue(0);

    const handleCardNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formatted);
    };

    const cardType = useMemo(() => {
        const firstDigit = cardNumber.charAt(0);
        if (firstDigit === '4') return 'visa';
        if (firstDigit === '5' || firstDigit === '2') return 'mastercard';
        return 'other';
    }, [cardNumber]);

    const onFocusCVV = () => {
        transitionValue.value = withTiming(1, { duration: DURATION, easing: TRENDY_EASING });
    };
    const onBlurCVV = () => {
        transitionValue.value = withTiming(0, { duration: DURATION, easing: TRENDY_EASING });
    };

    const frontStyle = useAnimatedStyle(() => {
        const translateY = interpolate(transitionValue.value, [0, 0.15, 1], [0, 5, -60]);
        const scale = interpolate(transitionValue.value, [0, 1], [1, 0.85]);
        const opacity = interpolate(transitionValue.value, [0, 0.35], [1, 0], Extrapolate.CLAMP);
        return { opacity, transform: [{ translateY }, { scale }] };
    });

    const backStyle = useAnimatedStyle(() => {
        const translateY = interpolate(transitionValue.value, [0, 1], [60, 0]);
        const scale = interpolate(transitionValue.value, [0, 0.8, 1], [0.85, 1.04, 1]);
        const opacity = interpolate(transitionValue.value, [0.3, 0.6], [0, 1], Extrapolate.CLAMP);
        return { opacity, transform: [{ translateY }, { scale }] };
    });

    const handleAddCard = () => {
        // Navigate to Success Screen
        router.push('/payment/success');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={0}
                >
                    <View style={styles.headerSection}>
                        {/* HEADER */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} hitSlop={15} style={styles.backButtonContainer}>
                                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.headerTitle}>Add Card</Text>
                            </View>

                            <TouchableOpacity onPress={handleAddCard} style={styles.saveButtonContainer}>
                                <Text style={styles.saveButton}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* CARD PREVIEW */}
                        <View style={styles.previewSection}>
                            <View style={styles.cardContainer}>
                                <Animated.View style={[styles.cardFace, backStyle]}>
                                    <BlurView intensity={50} tint="light" style={styles.glassCard}>
                                        <View style={styles.magneticStrip} />
                                        <View style={styles.cvvStrip}>
                                            <Text style={styles.cvvText}>{cvv || '•••'}</Text>
                                        </View>
                                        <Text style={styles.cvvLabel}>SECURITY CODE</Text>
                                    </BlurView>
                                </Animated.View>

                                <Animated.View style={[styles.cardFace, frontStyle]}>
                                    <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                        <View style={styles.cardContent}>
                                            <View style={styles.topRow}>
                                                <CustomCardChip />
                                                <CardLogo type={cardType} />
                                            </View>
                                            <Text style={styles.cardTextNumber}>{cardNumber || '•••• •••• •••• ••••'}</Text>
                                            <View style={styles.cardFooter}>
                                                <View>
                                                    <Text style={styles.cardLabel}>Card Holder</Text>
                                                    <Text style={styles.cardValue}>{cardHolder.toUpperCase() || 'YOUR NAME'}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.cardLabel}>Expires</Text>
                                                    <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </BlurView>
                                </Animated.View>
                            </View>
                        </View>
                    </View>

                    {/* FORM SECTION */}
                    <View style={styles.formContainer}>
                        <ScrollView
                            style={styles.formScroll}
                            contentContainerStyle={styles.formScrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Card Holder</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Sam Rogers"
                                    placeholderTextColor="#aaa"
                                    value={cardHolder}
                                    onChangeText={setCardHolder}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Card Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="•••• •••• •••• ••••"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChangeText={handleCardNumberChange}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.inputLabel}>Expiry</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="MM/YY"
                                        placeholderTextColor="#aaa"
                                        keyboardType="numeric"
                                        maxLength={5}
                                        value={expiry}
                                        onChangeText={setExpiry}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                    <Text style={styles.inputLabel}>CVV</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="•••"
                                        placeholderTextColor="#aaa"
                                        keyboardType="numeric"
                                        maxLength={3}
                                        value={cvv}
                                        onFocus={onFocusCVV}
                                        onBlur={onBlurCVV}
                                        onChangeText={setCvv}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    headerSection: {
        backgroundColor: '#0033FF',
        paddingBottom: 20,
        width: '100%',
        minHeight: Platform.OS === 'web' ? 350 : 0,
    },
    // Header styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
        marginTop: Platform.OS === 'android' ? 30 : 10,
        position: 'relative',
        zIndex: 100,
    },
    headerTitleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    backButtonContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    saveButtonContainer: {
        width: 60,
        alignItems: 'flex-end',
    },
    saveButton: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700'
    },

    previewSection: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 220,
        marginBottom: 10,
    },
    cardFace: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 24,
        overflow: 'hidden',
    },
    glassCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTextNumber: {
        color: '#fff',
        fontSize: 22,
        letterSpacing: 2,
        fontWeight: '300',
        marginTop: 25,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardValue: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    magneticStrip: {
        width: '120%',
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: -24,
        marginTop: 5,
    },
    cvvStrip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        height: 38,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15,
        borderRadius: 6,
    },
    cvvText: {
        color: '#1a1a1a',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 2,
    },
    cvvLabel: {
        color: 'rgba(255,255,255,0.5)',
        alignSelf: 'flex-end',
        marginTop: 10,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 25,
        paddingHorizontal: 25,
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    },
    formScroll: {
        flex: 1,
    },
    formScrollContent: {
        flexGrow: 1,
        paddingBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
    },
    inputLabel: {
        color: '#1A1A1A',
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 10,
        textTransform: 'uppercase',
        opacity: 0.4,
    },
    input: {
        backgroundColor: '#F0F2F5',
        borderRadius: 18,
        padding: 16,
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    nextButton: {
        backgroundColor: '#0033FF',
        borderRadius: 100,
        paddingVertical: 20,
        alignItems: 'center',
        marginTop: 15,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
    },
});