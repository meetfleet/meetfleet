import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/constants/theme'; // Assuming theme usage or fallback

// --- Glass Back Button Component (Internal) ---
const GlassBackButton = () => {
    const router = useRouter();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.94, {
            damping: 15,
            stiffness: 400,
        });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 350,
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[animatedStyle]}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => router.back()}
                activeOpacity={0.9}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <BlurView intensity={35} tint="light" style={styles.backButton}>
                    <ChevronLeft size={24} color="#0F172A" strokeWidth={2.5} style={{ marginRight: 2 }} />
                </BlurView>
            </TouchableOpacity>
        </Animated.View>
    );
};

interface ScreenHeaderProps {
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
    rightElement?: React.ReactNode;
    style?: any;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ScreenHeader({
    title,
    subtitle,
    showBackButton = true,
    rightElement,
    style
}: ScreenHeaderProps) {
    const insets = useSafeAreaInsets();
    // Default top padding if insets are 0 (e.g. some emulators or issues), though usually safe to trust insets
    // But better to stick to insets.top.
    // If we want a minimum padding, we can do Math.max(insets.top, 20) but usually insets.top is correct.
    
    // We want some extra padding above the content? 
    // The original code had paddingTop: 50. 
    // On iPhone X, status bar is 44. So 50 is close to status bar + a bit.
    // Actually, usually we just want to clear the status bar.
    // Let's assume we want insets.top + some small padding if needed, or just insets.top.
    // The original code `paddingTop: 50` suggests it includes the status bar height.
    // If we use insets.top, we might need to add a bit of padding if the design calls for it.
    // However, usually headers are just `paddingTop: insets.top`.
    // Let's add a small constant if the original design had spacing below status bar.
    // 50 - 44 (iPhone X) = 6. 
    // 50 - 20 (old iPhone) = 30. 
    // It seems it was a fixed 50. 
    // Let's use `insets.top + 6` or similar to be safe, or just `insets.top`.
    // Let's stick to `insets.top` and maybe add `paddingVertical` or `minHeight`.
    
    // Actually, looking at `height: 106`. 106 - 50 = 56. 
    // So the content height is 56?
    // 12 paddingBottom. 
    // 56 - 12 = 44.
    // 44 is the button height.
    // So the layout is:
    // Top padding: 50
    // Content height: 44
    // Bottom padding: 12
    // Total: 106
    
    // So we want `paddingTop: insets.top`.
    // But if we want to maintain the look, maybe we need to add some spacing?
    // Let's try `paddingTop: insets.top`.
    
    const paddingTop = insets.top > 0 ? insets.top : 20; // Fallback for no notch devices often 20
    
    return (
        <View style={[
            styles.header, 
            { paddingTop: paddingTop + 10, height: paddingTop + 10 + 44 + 12 }, // Adding 10 extra padding to breathe? 
            // Original was 50. If insets.top is 47 (14 Pro), 47+10=57. Close enough.
            // If insets.top is 20, 20+10=30. Original was 50. This might be too small?
            // The original 50 was probably covering 20 status bar + 30 padding.
            // Or 44 status bar + 6 padding.
            // Let's use `Math.max(insets.top, 20) + 10`.
            style
        ]}>
            <View style={styles.headerLeft}>
                {showBackButton && <GlassBackButton />}
            </View>

            <View style={[styles.headerCenter, { top: paddingTop + 10 }]}>
                {title && (
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title}
                    </Text>
                )}
                {subtitle && (
                    <Text style={styles.headerSub} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>

            <View style={styles.headerRight}>
                {rightElement}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        position: 'relative',
        zIndex: 100,
    },
    headerLeft: {
        zIndex: 10,
        width: 44, // Reserve space matching button
    },
    headerRight: {
        zIndex: 10,
        minWidth: 44, // Reserve space at least matching button
        alignItems: 'flex-end',
    },
    headerCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 12, // match paddingBottom
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, // Below buttons
        pointerEvents: 'none', // Let clicks pass through if empty
    },
    headerTitle: {
        fontSize: 18, // Standardized size (Settings used 18, Messages used 16, preferring 18 for main titles)
        fontWeight: '600',
        color: '#0F172A',
        letterSpacing: -0.3,
    },
    headerSub: {
        marginTop: 2,
        fontSize: 12,
        color: '#0F172A', // fallback color
        opacity: 0.5,
        fontWeight: '400',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});
