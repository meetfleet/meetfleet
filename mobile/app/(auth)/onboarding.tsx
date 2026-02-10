import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Better Plans',
        description: 'Elegant dinners, spontaneous games, casual meetups, choose how you connect.',
        image: require('@/assets/images/onboarding/Better Plans.png'),
    },
    {
        id: '2',
        title: 'Be Heard',
        description: 'Unlike other apps, ours lets you modify any plan freely, creatively, so everyone feels aligned.',
        image: require('@/assets/images/onboarding/Be Heard.png'),
    },
    {
        id: '3',
        title: 'Fleet Radar',
        description: 'Our tech will help you fight loneliness, powered by the latest algorithms designed to serve you.',
        image: require('@/assets/images/onboarding/Fleet Radar.png'),
    },
    {
        id: '4',
        title: 'Finances',
        description: 'Our tech will help you fight loneliness, powered by the latest algorithms designed to serve you.',
        image: require('@/assets/images/onboarding/Finances.png'),
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const hintAnimation = useRef(new Animated.Value(0)).current;
    const [hasScrolled, setHasScrolled] = useState(false);

    // Scroll hint animation on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.sequence([
                Animated.timing(hintAnimation, {
                    toValue: -30,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(hintAnimation, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleSkip = async () => {
        await AsyncStorage.setItem('HAS_LAUNCHED', 'true');
        router.replace('/(auth)/auth');
    };

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const onScrollBeginDrag = () => {
        if (!hasScrolled) {
            setHasScrolled(true);
        }
    };

    const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const targetIndex = Math.round(offsetX / width);

        // Snap to the nearest page
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({
                offset: targetIndex * width,
                animated: true,
            });
        }
    };

    const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
        <View style={styles.slide}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const renderPagination = () => (
        <View style={styles.paginationContainer}>
            <View style={styles.pagination}>
                {ONBOARDING_DATA.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [1, 1.4, 1],
                        extrapolate: 'clamp',
                    });
                    const backgroundColor = scrollX.interpolate({
                        inputRange,
                        outputRange: ['#E0E0E0', '#0033FF', '#E0E0E0'],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.dot,
                                { transform: [{ scale }], backgroundColor },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={{ width: 40, height: 40 }}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[
                    styles.flatListWrapper,
                    { transform: [{ translateX: hasScrolled ? 0 : hintAnimation }] }
                ]}
            >
                <Animated.FlatList
                    ref={flatListRef}
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    bounces={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollBeginDrag={onScrollBeginDrag}
                    onScrollEndDrag={onScrollEndDrag}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    snapToInterval={width}
                    snapToAlignment="center"
                    decelerationRate="fast"
                />
            </Animated.View>

            {renderPagination()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        height: 60,
    },
    logoContainer: { width: 40, height: 40, justifyContent: 'center' },
    skipText: { fontSize: 16, color: '#666', fontWeight: '500' },
    flatListWrapper: { flex: 1 },
    slide: { width, flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: width * 1, height: height * 0.4, marginTop: height * 0.1 },
    paginationContainer: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        alignItems: 'center',
    },
    pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 2 },
    textContainer: { paddingHorizontal: 22, paddingBottom: 40, marginTop: 40 },
    title: { fontSize: 32, fontWeight: '200', color: '#0033FF', marginBottom: 12 },
    description: { fontSize: 18, fontWeight: '300', color: '#666', lineHeight: 24 },
});