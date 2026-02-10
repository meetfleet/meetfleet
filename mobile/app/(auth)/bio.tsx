import { ScreenHeader } from '@/components/ScreenHeader';
import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BioScreen() {
    const router = useRouter();
    const { phone, emoji, name, gender, age } = useLocalSearchParams();
    const [bio, setBio] = useState('');

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: '/(auth)/interests',
            params: { 
                phone, 
                emoji, 
                name, 
                gender, 
                age,
                bio
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Your Bio"
                rightElement={
                    <TouchableOpacity
                        onPress={handleNext}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tell us about yourself</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Just here to explore the best spots in town... 😎"
                                placeholderTextColor="#94A3B8"
                                maxLength={155}
                                autoFocus
                            />
                            <Text style={styles.charCount}>{bio.length}/155</Text>
                        </View>
                    </View>

                    <Text style={styles.helperText}>
                        Optional: You can always add this later. A good bio helps people get to know the real you.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        marginBottom: 16,
    },
    inputContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 180,
    },
    input: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
        lineHeight: 24,
        textAlignVertical: 'top',
        flex: 1,
    },
    charCount: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: '#94A3B8',
        alignSelf: 'flex-end',
        marginTop: 12,
    },
    helperText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#94A3B8',
        lineHeight: 20,
        marginTop: 8,
    },
    nextButton: {
        paddingHorizontal: 4,
    },
    nextText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
});
