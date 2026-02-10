import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface SwipeDismissConfig {
    threshold?: number;
    onDismiss: () => void;
    resistance?: number;
}

export const useSwipeDismiss = ({
    threshold = 120,
    onDismiss,
    resistance = 0.6,
}: SwipeDismissConfig) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const isDismissing = useSharedValue(false);
    const hasTriggeredHaptic = useRef(false);

    // Resistance curve for elastic feel
    const applyResistance = (distance: number) => {
        'worklet';
        if (distance >= 0) return 0; // Only allow left swipe (negative direction)
        return distance * resistance - Math.log(1 + Math.abs(distance) * 0.01) * 20;
    };

    // Trigger haptic feedback
    const triggerLightHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const triggerMediumHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Pan gesture
    const panGesture = Gesture.Pan()
        .onStart(() => {
            if (!isDismissing.value) {
                runOnJS(triggerLightHaptic)();
            }
        })
        .onUpdate((event) => {
            if (isDismissing.value) return;

            const translation = applyResistance(event.translationX);
            translateX.value = translation;

            // Fade out as user swipes left
            opacity.value = 1 - Math.min(Math.abs(translation) / threshold, 0.5);

            // Trigger medium haptic when crossing threshold
            if (Math.abs(translation) > threshold && !hasTriggeredHaptic.current) {
                runOnJS(triggerMediumHaptic)();
                hasTriggeredHaptic.current = true;
            } else if (Math.abs(translation) <= threshold) {
                hasTriggeredHaptic.current = false;
            }
        })
        .onEnd((event) => {
            if (isDismissing.value) return;

            const translation = applyResistance(event.translationX);

            // Dismiss if threshold crossed (swiped left far enough)
            if (Math.abs(translation) > threshold) {
                isDismissing.value = true;

                // Animate out to the left
                translateX.value = withTiming(-400, {
                    duration: 250,
                    easing: Easing.out(Easing.cubic),
                });
                opacity.value = withTiming(0, {
                    duration: 200
                }, () => {
                    runOnJS(onDismiss)();
                });
            } else {
                // Snap back
                translateX.value = withSpring(0, {
                    damping: 20,
                    stiffness: 300,
                    mass: 0.8,
                });
                opacity.value = withSpring(1, {
                    damping: 15,
                    stiffness: 250,
                });
                hasTriggeredHaptic.current = false;
            }
        });

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    return {
        panGesture,
        animatedStyle,
        isDismissing: isDismissing.value,
    };
};
