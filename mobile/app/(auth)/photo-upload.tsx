import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Fonts, Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Camera, Plus, Trash2, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { authService } from '@/services/auth';

const { width } = Dimensions.get('window');

export default function PhotoUploadScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleFinish = async () => {
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // Prepare user data from accumulated params
            const userData = {
                phone: params.phone as string,
                username: params.name as string, // Using 'name' from identity screen as 'username'
                emoji: params.emoji as string,
                gender: params.gender as string,
                age: params.age as string,
                bio: params.bio as string,
                interests: params.interests as string | undefined,
                avatarUrl: image || undefined // In a real app, we'd upload the image first and get a URL
            };

            await authService.register(userData);
            router.push('/(auth)/success?mode=signup');
        } catch (error) {
            console.error('Registration failed:', error);
            // Optional: Show error to user
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Profile Photo"
                rightElement={
                    <TouchableOpacity
                        onPress={handleFinish}
                        style={[styles.nextButton, (!image || isSubmitting) && styles.nextButtonDisabled]}
                        disabled={!image || isSubmitting}
                    >
                        <Text style={[styles.nextText, (!image || isSubmitting) && styles.nextTextDisabled]}>
                            {isSubmitting ? '...' : 'Finish'}
                        </Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                <Text style={styles.description}>
                    Add a photo so others can recognize you. You can always change this later.
                </Text>

                <TouchableOpacity
                    style={[styles.uploadContainer, image && styles.uploadContainerHasImage]}
                    onPress={pickImage}
                    activeOpacity={0.8}
                >
                    {image ? (
                        <>
                            <Image source={{ uri: image }} style={styles.image} />
                            <View style={styles.editBadge}>
                                <Camera size={16} color="#FFF" />
                            </View>
                        </>
                    ) : (
                        <View style={styles.placeholder}>
                            <View style={styles.iconCircle}>
                                <Plus size={32} color="#0033FF" strokeWidth={2.5} />
                            </View>
                            <Text style={styles.placeholderText}>Tap to upload</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.guidelines}>
                    <Text style={styles.guidelineTitle}>Quick Guidelines</Text>
                    <View style={styles.guidelineItem}>
                        <View style={styles.dot} />
                        <Text style={styles.guidelineText}>Show your face clearly</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                        <View style={styles.dot} />
                        <Text style={styles.guidelineText}>Good lighting makes a difference</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                        <View style={styles.dot} />
                        <Text style={styles.guidelineText}>Keep it authentic and premium</Text>
                    </View>
                </View>

                {image && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setImage(null);
                        }}
                    >
                        <Trash2 size={18} color="#FF3B30" />
                        <Text style={styles.removeText}>Remove Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingTop: 20,
    },
    description: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
        paddingHorizontal: 10,
    },
    uploadContainer: {
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: (width * 0.65) / 2,
        backgroundColor: '#F8F9FA',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadContainerHasImage: {
        borderStyle: 'solid',
        borderColor: '#0F172A',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0, 51, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 15,
        fontFamily: Fonts.bold,
        color: '#0033FF',
    },
    editBadge: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    guidelines: {
        marginTop: 48,
        width: '100%',
        backgroundColor: '#F1F5F9',
        padding: 24,
        borderRadius: 24,
    },
    guidelineTitle: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#0F172A',
        marginBottom: 12,
    },
    guidelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#94A3B8',
        marginRight: 10,
    },
    guidelineText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#64748B',
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
    },
    removeText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#FF3B30',
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
