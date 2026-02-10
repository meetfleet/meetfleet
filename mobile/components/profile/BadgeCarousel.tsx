import { Badge } from '@/constants/badges';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { BadgeItem } from './BadgeItem';

interface BadgeCarouselProps {
    badges: Badge[];
    size?: number;
}

const DURATION = 4000; // Time for one full cycle phase

export function BadgeCarousel({ badges, size = 80 }: BadgeCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    useEffect(() => {
        // 1. Wait a bit
        // 2. Animate OUT (Fade out, scale down slightly)
        // 3. Change Index
        // 4. Animate IN (Fade in, scale up)

        // Cycle every 4 seconds
        const interval = setInterval(() => {
            opacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }, (finished) => {
                if (finished) {
                    runOnJS(setCurrentIndex)((prev) => (prev + 1) % badges.length);
                    opacity.value = withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) });
                }
            });

            scale.value = withTiming(0.8, { duration: 500, easing: Easing.out(Easing.cubic) }, (finished) => {
                if (finished) {
                    scale.value = withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) });
                }
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [badges.length]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));

    if (badges.length === 0) return null;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[styles.content, animatedStyle]}>
                <BadgeItem
                    badge={badges[currentIndex]}
                    size={size}
                    showDetails={false}
                    isUnlocked={false}
                    variant="minimal"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});



