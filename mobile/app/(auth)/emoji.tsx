import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Fonts, Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Search, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 4;
const ITEM_SIZE = (width - 80) / COLUMN_COUNT;

const EMOJIS = [
    // Emotion
    '✨', '😎', '🔥', '🌈', '💖', '⭐', '💫', '⚡', '🌙', '☀️',
    // Activities
    '🎮', '🎨', '🎵', '🎭', '🎬', '🎧', '🎸', '🎹', '🏏', '⚽',
    // Food & Drink
    '🍕', '🥑', '🍷', '☕', '🍣', '🍦', '🍩', '🍹', '🍔', '🌮',
    // Nature & Travel
    '🚀', '🌊', '🍀', '🧿', '💎', '🏝️', '🌋', '⛺', '✈️', '🧭',
    // Objects & Symbols
    '📸', '📱', '💻', '💡', '🔑', '❤️', '🔥', '💯', '✅', '👑',
    // More Playful
    '🦄', '👾', '🚀', '🔮', '🧿', '🍭', '🎀', '🎈', '🎉', '🎊'
];

export default function EmojiScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmojis = useMemo(() => {
        if (!searchQuery.trim()) return EMOJIS;
        // Basic filtering since we don't have emoji names, but keeping the structure for future
        return EMOJIS.filter(emoji => emoji.includes(searchQuery));
    }, [searchQuery]);

    const handleEmojiSelect = (emoji: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedEmoji(emoji);
    };

    const handleNext = () => {
        if (selectedEmoji) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({
                pathname: '/(auth)/identity',
                params: { phone, emoji: selectedEmoji }
            });
        }
    };

    const renderEmoji = ({ item }: { item: string }) => {
        const isSelected = selectedEmoji === item;
        return (
            <TouchableOpacity
                style={[
                    styles.emojiItem,
                    isSelected && styles.emojiItemSelected
                ]}
                onPress={() => handleEmojiSelect(item)}
                activeOpacity={0.7}
            >
                <Text style={styles.emojiText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Preferred Emoji"
                rightElement={
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.nextButton, !selectedEmoji && styles.nextButtonDisabled]}
                        disabled={!selectedEmoji}
                    >
                        <Text style={[styles.nextText, !selectedEmoji && styles.nextTextDisabled]}>Next</Text>
                    </TouchableOpacity>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <View style={styles.content}>
                    <Text style={styles.description}>
                        A light, playful introduction that sets the emotional tone for your profile.
                    </Text>

                    <View style={styles.searchWrapper}>
                        <View style={styles.searchContainer}>
                            <Search size={20} color="#94A3B8" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search emoji..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCorrect={false}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <X size={18} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={filteredEmojis}
                        renderItem={renderEmoji}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        numColumns={COLUMN_COUNT}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    flex: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    description: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    searchWrapper: {
        marginBottom: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
        marginLeft: 12,
        height: '100%',
    },
    listContainer: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    emojiItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 6,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    emojiItemSelected: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0F172A',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    emojiText: {
        fontSize: 28,
    },
    nextButton: {
        paddingHorizontal: 4,
    },
    nextButtonDisabled: {
        opacity: 0.3,
    },
    nextText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    nextTextDisabled: {
        color: '#94A3B8',
    },
});
