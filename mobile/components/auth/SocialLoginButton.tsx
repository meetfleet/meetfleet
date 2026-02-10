import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SocialLoginButtonProps {
    provider: 'google' | 'apple';
    onPress: () => void;
    labelPrefix?: string;
}

const GoogleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 16 16">
        <Path
            fill="#f44336"
            d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
            opacity={0.987}
        />
        <Path
            fill="#ffc107"
            d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
            opacity={0.997}
        />
        <Path
            fill="#448aff"
            d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
            opacity={0.999}
        />
        <Path
            fill="#43a047"
            d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
            opacity={0.993}
        />
    </Svg>
);

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
    provider,
    onPress,
    labelPrefix = 'Login with',
}) => {
    const isGoogle = provider === 'google';

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    {isGoogle ? (
                        <GoogleIcon />
                    ) : (
                        <Ionicons name="logo-apple" size={24} color="#000" />
                    )}
                </View>
                <Text style={styles.text}>
                    {labelPrefix} {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFFFFF',
        borderRadius: 99,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
    },
});
