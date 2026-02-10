import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSwipeDismiss } from '../hooks/useSwipeDismiss';
import { AppNotification } from '../types/notification-types';

const { width } = Dimensions.get('window');

interface NotificationItemProps {
    notification: AppNotification;
    onPress?: (notification: AppNotification) => void;
    onDismiss?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onPress,
    onDismiss,
}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const isUnread = !notification.isRead;

    // Swipe to dismiss (left swipe)
    const { panGesture, animatedStyle } = useSwipeDismiss({
        threshold: 120,
        onDismiss: () => onDismiss?.(notification.id),
        resistance: 0.6,
    });

    // Handle background color based on type (inspired by screenshot)
    const getBgColor = () => {
        if (notification.type === 'feedback' || (notification.type === 'messages' && isUnread)) return '#003DFF';
        if (notification.type === 'achievement') return '#000000';
        return '#FFFFFF';
    };

    const isDarkBackground = notification.type === 'feedback' ||
        (notification.type === 'messages' && isUnread) ||
        notification.type === 'achievement';

    // Touch feedback
    const handlePressIn = () => {
        scale.value = withTiming(0.98, { duration: 100 });
        opacity.value = withTiming(0.9, { duration: 100 });
        Haptics.selectionAsync();
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
    };

    const handlePress = () => {
        onPress?.(notification);
    };

    const touchAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    // Render leading: Avatar or Icon
    const renderLeading = () => {
        if (notification.avatarUrl) {
            return (
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: notification.avatarUrl }}
                        style={styles.avatar}
                    />
                </View>
            );
        }

        const iconName = notification.icon || 'notifications-outline';
        let iconBg = '#F0F0F0';
        let iconColor = '#666666';

        if (notification.type === 'feedback' || notification.type === 'messages') {
            iconBg = 'rgba(255, 255, 255, 0.2)';
            iconColor = '#FFFFFF';
        } else if (notification.type === 'achievement') {
            iconBg = 'rgba(255, 255, 255, 0.1)';
            iconColor = '#FFFFFF';
        }

        return (
            <View style={[styles.avatarContainer, { backgroundColor: iconBg }]}>
                <Ionicons name={iconName as any} size={24} color={iconColor} />
            </View>
        );
    };

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[animatedStyle]}>
                <Pressable
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[styles.container, { backgroundColor: getBgColor() }]}
                >
                    <Animated.View style={[styles.innerContainer, touchAnimatedStyle]}>
                        {/* Leading */}
                        <View style={styles.leading}>
                            {renderLeading()}
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <View style={styles.headerRow}>
                                <Text style={[styles.title, isDarkBackground && styles.textWhite]} numberOfLines={1}>
                                    {notification.userName && (
                                        <Text style={{ fontWeight: '800' }}>{notification.userName} </Text>
                                    )}
                                    {notification.title || ''}
                                </Text>
                                <Text style={[styles.timestamp, isDarkBackground && styles.textTransparentWhite]}>
                                    {notification.timestamp}
                                </Text>
                            </View>

                            <Text style={[styles.message, isDarkBackground && styles.textWhite]} numberOfLines={2}>
                                {notification.message}
                            </Text>

                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                                <View style={styles.actionsContainer}>
                                    {notification.actions.map((action, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.actionButton,
                                                action.type === 'primary' ? styles.primaryAction : styles.secondaryAction
                                            ]}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                action.onPress();
                                            }}
                                        >
                                            <Text style={[
                                                styles.actionText,
                                                action.type === 'primary' ? styles.primaryActionText : styles.secondaryActionText
                                            ]}>
                                                {action.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </Animated.View>
                </Pressable>
                {!isDarkBackground && <View style={styles.separator} />}
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        marginHorizontal: 16,
        marginVertical: 4,
    },
    innerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
        marginTop: 4,
    },
    leading: {
        marginRight: 14,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
        marginRight: 8,
    },
    textWhite: {
        color: '#FFFFFF',
    },
    textTransparentWhite: {
        color: 'rgba(255, 255, 255, 0.6)',
    },
    message: {
        fontSize: 15,
        color: '#333333',
        lineHeight: 18,
    },
    timestamp: {
        fontSize: 13,
        color: '#8E8E93',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryAction: {
        backgroundColor: '#007AFF',
    },
    secondaryAction: {
        backgroundColor: '#F1F3F5',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    primaryActionText: {
        color: '#FFFFFF',
    },
    secondaryActionText: {
        color: '#000000',
    },
});
