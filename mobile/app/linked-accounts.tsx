import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const LinkedAccountRow = ({
    icon,
    name,
    email,
    isConnected,
    onPress
}: {
    icon: string,
    name: string,
    email?: string,
    isConnected: boolean,
    onPress: () => void
}) => (
    <TouchableOpacity
        style={styles.accountRow}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.accountLeft}>
            <View style={styles.socialIconContainer}>
                <Ionicons name={icon as any} size={24} color={isConnected ? "#0F172A" : "#94A3B8"} />
            </View>
            <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{name}</Text>
                {email && <Text style={styles.accountEmail}>{email}</Text>}
            </View>
        </View>
        <View style={[styles.statusBadge, isConnected ? styles.statusBadgeConnected : styles.statusBadgeDisconnected]}>
            <Text style={[styles.statusText, isConnected ? styles.statusTextConnected : styles.statusTextDisconnected]}>
                {isConnected ? 'Linked' : 'Link'}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function LinkedAccountsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [accounts, setAccounts] = useState([
        { id: 'google', name: 'Google', icon: 'logo-google', email: 'imad.dev@gmail.com', isConnected: true },
        { id: 'apple', name: 'Apple', icon: 'logo-apple', email: undefined, isConnected: true },
        { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', email: undefined, isConnected: false },
    ]);

    const toggleAccount = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setAccounts(prev => prev.map(acc =>
            acc.id === id ? { ...acc, isConnected: !acc.isConnected } : acc
        ));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <BlurView intensity={35} tint="light" style={styles.backButtonBlur}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </BlurView>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Linked Accounts</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Connect your accounts</Text>
                    <Text style={styles.infoDescription}>
                        Link your social accounts to sign in faster and find friends on Neark.
                    </Text>
                </View>

                <View style={styles.accountsCard}>
                    {accounts.map((acc, index) => (
                        <React.Fragment key={acc.id}>
                            <LinkedAccountRow
                                icon={acc.icon}
                                name={acc.name}
                                email={acc.email}
                                isConnected={acc.isConnected}
                                onPress={() => toggleAccount(acc.id)}
                            />
                            {index < accounts.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>

                <TouchableOpacity style={styles.securityNote}>
                    <Ionicons name="shield-checkmark" size={18} color="#64748B" />
                    <Text style={styles.securityNoteText}>
                        Neark will never post to any of your accounts without your permission.
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButtonBlur: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    infoBox: {
        marginTop: 10,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 24,
        fontFamily: Fonts.black,
        color: '#0F172A',
        marginBottom: 8,
    },
    infoDescription: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
        fontFamily: Fonts.regular,
    },
    accountsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    accountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    socialIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    accountEmail: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 2,
        fontFamily: Fonts.regular,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        minWidth: 70,
        alignItems: 'center',
    },
    statusBadgeConnected: {
        backgroundColor: '#F1F5F9',
    },
    statusBadgeDisconnected: {
        backgroundColor: '#0033FF',
    },
    statusText: {
        fontSize: 13,
        fontFamily: Fonts.bold,
    },
    statusTextConnected: {
        color: '#64748B',
    },
    statusTextDisconnected: {
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 16,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 12,
        gap: 10,
    },
    securityNoteText: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: Fonts.regular,
        flex: 1,
    },
});
