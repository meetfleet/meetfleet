import { Badge } from '@/constants/badges';
import React from 'react';
import { Image, ImageStyle, StyleSheet, Text, View } from 'react-native';

interface BadgeItemProps {
    badge: Badge;
    size?: number;
    showDetails?: boolean;
    isUnlocked?: boolean;
    style?: any;
    variant?: 'card' | 'minimal';
    customDate?: string;
}

export function BadgeItem({
    badge,
    size = 80,
    showDetails = true,
    isUnlocked = true,
    style,
    variant = 'card',
    customDate
}: BadgeItemProps) {
    if (!badge) return null;

    const isCard = variant === 'card';

    return (
        <View style={[isCard ? styles.card : styles.container, style]}>
            <View style={[styles.imageWrapper, { width: size, height: size }]}>
                <Image
                    source={badge.image}
                    style={[
                        styles.image,
                        { width: size, height: size },
                        !isUnlocked && styles.lockedImage
                    ] as ImageStyle}
                    resizeMode="contain"
                />
            </View>

            {showDetails && (
                <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={1}>{badge.name}</Text>
                    <Text style={styles.date}>{customDate || 'Joined 15 Jan 2026'}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 16,
        width: 142, // Total width including border
        minHeight: 164, // Total height including border
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        // Subtle but large spread shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 3,
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    image: {
        opacity: 1,
    },
    lockedImage: {
        opacity: 0.5,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 2,
        lineHeight: 18,
    },
    date: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
});

