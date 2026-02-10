import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';

const BlockedUserRow = ({
    user,
    onUnblock
}: {
    user: any,
    onUnblock: (id: string) => void
}) => (
    <Animated.View
        layout={Layout.springify()}
        entering={FadeInDown}
        exiting={FadeOut}
        style={styles.userRow}
    >
        <View style={styles.userLeft}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>{user.emoji || '👤'}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHandle}>@{user.handle}</Text>
            </View>
        </View>
        <TouchableOpacity
            style={styles.unblockButton}
            onPress={() => onUnblock(user.id)}
        >
            <Text style={styles.unblockText}>Unblock</Text>
        </TouchableOpacity>
    </Animated.View>
);

export default function BlockedUsersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState('');
    const [blockedUsers, setBlockedUsers] = useState([
        { id: '1', name: 'Marco Rossi', handle: 'marcorossi', emoji: '🍝' },
        { id: '2', name: 'Elena Gilbert', handle: 'elena_g', emoji: '🧛‍♀️' },
        { id: '3', name: 'Stefan Salvatore', handle: 'stefan_s', emoji: '🩸' },
        { id: '4', name: 'Damon Salvatore', handle: 'damon_s', emoji: '🥃' },
        { id: '5', name: 'Caroline Forbes', handle: 'caroline_f', emoji: '🎀' },
    ]);

    const handleUnblock = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setBlockedUsers(prev => prev.filter(user => user.id !== id));
    };

    const filteredUsers = blockedUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.handle.toLowerCase().includes(search.toLowerCase())
    );

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
                <Text style={styles.headerTitle}>Blocked Users</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search blocked users"
                        placeholderTextColor="#94A3B8"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setSearch('');
                        }}>
                            <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredUsers.length > 0 ? (
                    <View style={styles.listCard}>
                        {filteredUsers.map((user, index) => (
                            <React.Fragment key={user.id}>
                                <BlockedUserRow user={user} onUnblock={handleUnblock} />
                                {index < filteredUsers.length - 1 && <View style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </View>
                ) : (
                    <Animated.View entering={FadeIn} style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="shield-outline" size={64} color="#E2E8F0" />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {search ? 'No users found' : 'No blocked users'}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? "We couldn't find any anyone matching your search."
                                : "You haven't blocked anyone yet. Blocked users won't be able to see your profile or message you."}
                        </Text>
                    </Animated.View>
                )}
            </ScrollView>

            {blockedUsers.length > 0 && (
                <View style={styles.footerInfo}>
                    <Text style={styles.footerNote}>
                        Blocked users are not notified when you block them.
                    </Text>
                </View>
            )}
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
        paddingBottom: 12,
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
    backButton: {},
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    listCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 8,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    userLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarEmoji: {
        fontSize: 24,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    userHandle: {
        fontSize: 14,
        color: '#64748B',
        fontFamily: Fonts.regular,
        marginTop: 1,
    },
    unblockButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    unblockText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#0033FF',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emptyTitle: {
        fontSize: 22,
        fontFamily: Fonts.black,
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: Fonts.regular,
    },
    footerInfo: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    footerNote: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        fontFamily: Fonts.regular,
        lineHeight: 18,
    }
});
