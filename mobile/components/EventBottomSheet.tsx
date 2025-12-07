import PlanTab from '@/components/PlanTab';
import SuggestionTab from '@/components/SuggestionTab';
import { Fonts } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TABS = ['Plan', 'Suggestion'] as const;
type TabType = typeof TABS[number];

interface EventBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EventBottomSheet({ isOpen, onClose }: EventBottomSheetProps) {
    const insets = useSafeAreaInsets();
    const MIN_HEIGHT = SCREEN_HEIGHT * 0.7;
    const MAX_HEIGHT = SCREEN_HEIGHT - 50; // Leave space for status bar/top area

    const sheetHeight = useSharedValue(MIN_HEIGHT);
    const translateY = useSharedValue(SCREEN_HEIGHT); // Start hidden (pushed down)

    const context = useSharedValue({ startHeight: MIN_HEIGHT });
    const [activeTab, setActiveTab] = useState<TabType>('Plan');

    useEffect(() => {
        if (isOpen) {
            // Reset height to min when opening? Or keep last state?
            // Usually reset to default view
            sheetHeight.value = MIN_HEIGHT;
            translateY.value = withSpring(0, {
                damping: 15,
                stiffness: 90,
                mass: 0.6,
            });
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT, {
                duration: 300,
                easing: Easing.out(Easing.quad),
            });
        }
    }, [isOpen]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { startHeight: sheetHeight.value };
        })
        .onUpdate((event) => {
            // Dragging UP is negative Y, so we subtract to increase height
            const newHeight = context.value.startHeight - event.translationY;
            // Clamp between MIN and MAX
            sheetHeight.value = Math.max(MIN_HEIGHT, Math.min(newHeight, MAX_HEIGHT));
        })
        .onEnd(() => {
            if (sheetHeight.value > MIN_HEIGHT + 100) {
                // Snap to full
                sheetHeight.value = withSpring(MAX_HEIGHT, { damping: 15 });
            } else {
                // Snap to min
                sheetHeight.value = withSpring(MIN_HEIGHT, { damping: 15 });
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        height: sheetHeight.value,
        transform: [{ translateY: translateY.value }],
    }));

    const renderTabContent = () => {
        return activeTab === 'Plan' ? <PlanTab /> : <SuggestionTab />;
    };

    const getButtonText = () => {
        return activeTab === 'Plan' ? 'Interested' : 'Send';
    };

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                <View style={styles.handle} />

                <View style={styles.segmentedControlContainer}>
                    <View style={styles.segmentedControl}>
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.segment, activeTab === tab && styles.activeSegment]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.segmentText,
                                    activeTab === tab && styles.activeSegmentText
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderTabContent()}
                    <View style={styles.bottomSpacer} />
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
                    <TouchableOpacity style={styles.mainButton} onPress={onClose}>
                        <Text style={styles.mainButtonText}>{getButtonText()}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0, // Anchor to bottom
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        paddingTop: 10,
        zIndex: 1000,
        overflow: 'hidden', // Ensure content stays within rounded corners
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 2,
    },
    segmentedControlContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        padding: 4,
        width: '80%',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeSegment: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        color: '#888',
        fontFamily: Fonts.regular,
    },
    activeSegmentText: {
        color: '#000',
        fontFamily: Fonts.regular,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    bottomSpacer: {
        height: 130,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    mainButton: {
        backgroundColor: '#4a6cf7',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#4a6cf7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    mainButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
});
