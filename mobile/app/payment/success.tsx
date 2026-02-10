import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 500 });
        textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

        const timer = setTimeout(() => {
            router.navigate('/payment');
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const contentStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: withTiming(textOpacity.value === 1 ? 0 : 20) }],
    }));

    const LottieComponent = () => {
        const sourceUrl = 'https://lottie.host/41a2cc09-1bbe-4acc-b557-82b32f40ef26/ckv1d8ABhL.lottie';

        if (Platform.OS === 'web') {
            return (
                <DotLottieReact
                    src={sourceUrl}
                    autoplay
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            );
        }

        return (
            <DotLottie
                source={{ uri: sourceUrl }}
                autoplay
                loop={true}
                style={styles.lottie}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <Animated.View style={[styles.lottieWrapper, contentStyle]}>
                    <LottieComponent />
                </Animated.View>

                <Animated.View style={[styles.textContainer, textStyle]}>
                    <Text style={styles.title}>Success!</Text>
                    <Text style={styles.subtitle}>Payment method added.</Text>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000000',
        letterSpacing: 0.5,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 18,
        color: '#475569',
        fontWeight: '500',
    },
});
