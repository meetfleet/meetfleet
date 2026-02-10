import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import PlanTab from './PlanTab';
import SuggestionTab from './SuggestionTab';
import { Fonts } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

const TABS = ['Plan', 'Suggestion'] as const;
type TabType = typeof TABS[number];

interface PlanBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function PlanBottomSheet({ isVisible, onClose }: PlanBottomSheetProps) {
    const [showModal, setShowModal] = useState(isVisible);
    const translateY = useSharedValue(SHEET_HEIGHT);
    const [activeTab, setActiveTab] = useState<TabType>('Plan');

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            translateY.value = withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.cubic)
            });
        } else {
            translateY.value = withTiming(SHEET_HEIGHT, {
                duration: 200,
                easing: Easing.in(Easing.cubic)
            }, () => {
                runOnJS(setShowModal)(false);
            });
        }
    }, [isVisible]);

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleClose = () => {
        onClose();
    };

    const renderTabContent = () => {
        return activeTab === 'Plan' ? <PlanTab /> : <SuggestionTab />;
    };

    const getButtonText = () => {
        return activeTab === 'Plan' ? 'Interested' : 'Send';
    };

    const handleMainButtonPress = () => {
        if (activeTab === 'Plan') {
            router.push('/(tabs)/request');
        }
    };

    const context = useSharedValue(0);
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = translateY.value;
        })
        .onUpdate((event) => {
            translateY.value = Math.max(0, context.value + event.translationY);
        })
        .onEnd((event) => {
            if (event.translationY > 100 || event.velocityY > 500) {
                runOnJS(handleClose)();
            } else {
                translateY.value = withSpring(0, { damping: 50 });
            }
        });

    if (!showModal) return null;

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                {/* Close when clicking the blurred background */}
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={StyleSheet.absoluteFill}>
                        <BlurView
                            style={styles.backdrop}
                            intensity={20}
                            tint="dark"
                        />
                    </View>
                </TouchableWithoutFeedback>

                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                        <View style={styles.handleBar} />

                        <View style={styles.segmentedControlContainer}>
                            <View style={styles.segmentedControl}>
                                {TABS.map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[styles.segment, activeTab === tab && styles.activeSegment]}
                                        onPress={() => setActiveTab(tab)}
                                        activeOpacity={0.8}
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

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.mainButton} onPress={handleMainButtonPress}>
                                <Text style={styles.mainButtonText}>{getButtonText()}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)', // Transparent overlay, blur handles visual
        justifyContent: 'flex-end', // Aligns sheet to bottom
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomSheetContainer: {
        height: SHEET_HEIGHT,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        paddingTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    handleBar: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
        alignSelf: 'center',
        marginVertical: 12,
    },
    segmentedControlContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9', // Solid light gray background instead of transparent
        borderRadius: 25,
        padding: 4,
        width: '85%',
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 22,
    },
    activeSegment: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        color: '#666',
        fontFamily: Fonts.regular,
    },
    activeSegmentText: {
        color: '#000',
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
        paddingBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    mainButton: {
        backgroundColor: '#4a6cf7',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    mainButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
});