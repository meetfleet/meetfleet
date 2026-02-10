import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutUp,
} from 'react-native-reanimated';
import { AppNotification } from '../types/notification-types';
import { NotificationItem } from './NotificationItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NotificationOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    notifications: AppNotification[];
    onNotificationPress?: (notification: AppNotification) => void;
    onClearAll?: () => void;
}

type TabType = 'Inbox' | 'General';

export const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
    isVisible,
    onClose,
    notifications,
    onNotificationPress,
    onClearAll,
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('Inbox');
    const [localNotifications, setLocalNotifications] = useState(notifications);

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    const handleMarkAllAsRead = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleDismiss = (id: string) => {
        setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleSettings = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
        router.push('/(tabs)/profile');
    };

    const unreadCount = localNotifications.filter((n) => !n.isRead).length;

    // Filter notifications based on tab
    // Inbox: All notifications
    // General: System-wide updates like weather, joined, milestone, etc.
    const filteredNotifications = activeTab === 'Inbox'
        ? localNotifications
        : localNotifications.filter(n => ['weather', 'joined', 'achievement', 'premium', 'update', 'trending', 'celebration', 'location'].includes(n.type));

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                {/* Backdrop */}
                <Animated.View
                    entering={FadeIn.duration(150)}
                    exiting={FadeOut.duration(120)}
                    style={styles.backdrop}
                >
                    <Pressable onPress={handleClose} style={StyleSheet.absoluteFill} />
                </Animated.View>

                {/* Modal Container */}
                <View style={styles.modalWrapper} pointerEvents="box-none">
                    <Animated.View
                        entering={SlideInDown.duration(250).easing(Easing.out(Easing.cubic))}
                        exiting={SlideOutUp.duration(200).easing(Easing.in(Easing.cubic))}
                        style={styles.modalContainer}
                    >
                        {/* Header Top Row */}
                        <View style={styles.headerTop}>
                            <Text style={styles.headerTitle}>Notifications</Text>
                            <TouchableOpacity onPress={handleMarkAllAsRead}>
                                <Text style={styles.markReadText}>Mark all as read</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tabs Row */}
                        <View style={styles.tabsRow}>
                            <View style={styles.tabsContainer}>
                                <TouchableOpacity
                                    onPress={() => setActiveTab('Inbox')}
                                    style={[styles.tab, activeTab === 'Inbox' && styles.activeTab]}
                                >
                                    <Text style={[styles.tabText, activeTab === 'Inbox' && styles.activeTabText]}>
                                        Inbox
                                    </Text>
                                    <View style={[styles.unreadBadge, activeTab === 'Inbox' && styles.activeUnreadBadge]}>
                                        <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveTab('General')}
                                    style={[styles.tab, activeTab === 'General' && styles.activeTab]}
                                >
                                    <Text style={[styles.tabText, activeTab === 'General' && styles.activeTabText]}>
                                        General
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
                                <Ionicons name="settings-outline" size={20} color="#4E5D78" />
                            </TouchableOpacity>
                        </View>

                        {/* List */}
                        {filteredNotifications.length > 0 ? (
                            <>
                                <FlatList
                                    data={filteredNotifications}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <NotificationItem
                                            notification={item}
                                            onPress={onNotificationPress}
                                            onDismiss={handleDismiss}
                                        />
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.listContent}
                                    style={styles.list}
                                    nestedScrollEnabled={true}
                                />
                                <TouchableOpacity
                                    style={styles.clearFooter}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setLocalNotifications([]);
                                    }}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#007AFF" />
                                    <Text style={styles.clearText}>Clear All</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="notifications-off-outline" size={48} color="#C7C7CC" />
                                <Text style={styles.emptyText}>No notifications in {activeTab}</Text>
                            </View>
                        )}
                    </Animated.View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 80,
    },
    modalContainer: {
        width: SCREEN_WIDTH * 0.92,
        maxWidth: 420,
        height: SCREEN_HEIGHT * 0.7,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#272B41',
    },
    markReadText: {
        fontSize: 14,
        color: '#8E9AAF',
        fontWeight: '500',
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F1F3F5',
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4F46E5',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8E9AAF',
    },
    activeTabText: {
        color: '#272B41',
    },
    unreadBadge: {
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 6,
        marginLeft: 6,
    },
    activeUnreadBadge: {
        backgroundColor: '#3C3A7A',
    },
    unreadBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    settingsButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 8,
    },
    emptyContainer: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 12,
        color: '#8E9AAF',
        fontSize: 15,
    },
    clearFooter: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E7EB',
        gap: 6,
    },
    clearText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '600',
    },
});
