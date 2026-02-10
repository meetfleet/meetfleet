export type NotificationType =
    | 'feedback'
    | 'interest'
    | 'declined'
    | 'status'
    | 'weather'
    | 'joined'
    | 'achievement'
    | 'messages'
    | 'viewed'
    | 'viewers'
    | 'premium'
    | 'trending'
    | 'location'
    | 'activity'
    | 'urgent'
    | 'image'
    | 'action'
    | 'celebration'
    | 'group'
    | 'milestone'
    | 'recommendation'
    | 'update';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title?: string;
    subtitle?: string;
    message: string;
    timestamp: string;
    icon?: string;
    image?: string;
    badge?: number;
    avatarUrl?: string;
    userName?: string;
    isRead: boolean;
    priority?: 'low' | 'medium' | 'high';
    actionLabel?: string;
    actions?: {
        label: string;
        onPress: () => void;
        type?: 'primary' | 'secondary';
    }[];
    attachment?: {
        name: string;
        type: 'file' | 'video' | 'image';
        url?: string;
    };
    metadata?: Record<string, any>;
}

export interface NotificationItemStyle {
    backgroundColor: string;
    gradientColors?: string[];
    textColor: string;
    iconColor?: string;
    borderColor?: string;
    hasShadow?: boolean;
    hasGradient?: boolean;
}
