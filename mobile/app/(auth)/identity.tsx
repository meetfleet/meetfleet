import { ScreenHeader } from '@/components/ScreenHeader';
import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IdentityScreen() {
    const router = useRouter();
    const { phone, emoji } = useLocalSearchParams();
    const [name, setName] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [age, setAge] = useState('');

    const GENDERS = ['Man', 'Woman', 'Non-binary'];

    const handleNext = () => {
        if (name && gender && age) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({
                pathname: '/(auth)/bio',
                params: { 
                    phone, 
                    emoji, 
                    name, 
                    gender, 
                    age 
                }
            });
        }
    };

    const isFormValid = name.trim().length > 0 && gender !== null && age.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="About You"
                rightElement={
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
                        disabled={!isFormValid}
                    >
                        <Text style={[styles.nextText, !isFormValid && styles.nextTextDisabled]}>Next</Text>
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
                        <Text style={styles.label}>What's your name?</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your full name"
                            placeholderTextColor="#94A3B8"
                            autoComplete="name"
                            autoFocus
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What's your gender?</Text>
                        <View style={styles.genderContainer}>
                            {GENDERS.map((item) => {
                                const isSelected = gender === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.genderPill,
                                            isSelected && styles.genderPillSelected
                                        ]}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setGender(item);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.genderText,
                                            isSelected && styles.genderTextSelected
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>How old are you?</Text>
                        <TextInput
                            style={styles.input}
                            value={age}
                            onChangeText={(val) => setAge(val.replace(/[^0-9]/g, ''))}
                            placeholder="Age"
                            placeholderTextColor="#94A3B8"
                            keyboardType="number-pad"
                            maxLength={2}
                        />
                    </View>

                    <Text style={styles.helperText}>
                        This information helps us personalize your experience and connect you with the right orbit.
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
    input: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    genderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    genderPill: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    genderPillSelected: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0F172A',
    },
    genderText: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#64748B',
    },
    genderTextSelected: {
        fontFamily: Fonts.bold,
        color: '#0F172A',
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
