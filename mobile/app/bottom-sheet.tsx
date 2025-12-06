import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Stack } from 'expo-router';
import PlanTab from '../components/PlanTab';
import SuggestionTab from '../components/SuggestionTab';
import { Fonts } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_POSITION = -SCREEN_HEIGHT * 0.7;

const TABS = ['Plan', 'Suggestion'] as const;
type TabType = typeof TABS[number];

export default function BottomSheetPage() {
    const translateY = useSharedValue(SHEET_POSITION);
    const [activeTab, setActiveTab] = useState<TabType>('Plan');

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const renderTabContent = () => {
        return activeTab === 'Plan' ? <PlanTab /> : <SuggestionTab />;
    };

    const getButtonText = () => {
        return activeTab === 'Plan' ? 'Interested' : 'Send';
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.contentContainer} />

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

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.mainButton}>
                        <Text style={styles.mainButtonText}>{getButtonText()}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    contentContainer: {
        flex: 1,
    },
    bottomSheetContainer: {
        height: SCREEN_HEIGHT * 0.7,
        width: '100%',
        backgroundColor: '#f9f9f9f5',
        position: 'absolute',
        top: SCREEN_HEIGHT,
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
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
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
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        padding: 8,
        width: '80%',
    },
    segment: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeSegment: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
        backgroundColor: 'white',
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
