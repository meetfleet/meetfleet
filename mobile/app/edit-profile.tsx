import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bike, Camera, Camera as CameraIcon, Music, Palette, Plus, Star } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authService } from '@/services/auth';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

// --- Minimalist Toggle Switch (Matches Settings) ---
const MinimalToggle = ({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) => {
    const translateX = useSharedValue(value ? 20 : 0);

    useEffect(() => {
        translateX.value = withSpring(value ? 20 : 0, {
            damping: 15,
            stiffness: 200,
        });
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <TouchableOpacity
            style={[styles.toggleTrack, value && styles.toggleTrackActive]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onValueChange(!value);
            }}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.toggleThumb, animatedStyle]} />
        </TouchableOpacity>
    );
};

const getInterestIcon = (id: string) => {
    switch (id) {
        case 'art':
            return Palette;
        case 'sports':
            return Bike;
        case 'music':
            return Music;
        case 'pop':
            return Star;
        case 'photo':
            return CameraIcon;
        default:
            return Star;
    }
};

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const show = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 50);
            }
        );
        const hide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setIsKeyboardVisible(false)
        );
        return () => { show.remove(); hide.remove(); };
    }, []);

    // Profile Data State
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [job, setJob] = useState('');
    const [company, setCompany] = useState('');
    const [mainEmoji, setMainEmoji] = useState('🍺');
    const [interests, setInterests] = useState<string[]>([]);

    // Prime+ Status
    const [isPrime, setIsPrime] = useState(false);

    // Images State
    const [images, setImages] = useState([
        { id: '1', uri: null as string | null },
    ]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await authService.getMe();
            if (user) {
                setName(user.username || '');
                setAge(user.age || '');
                setBio(user.bio || '');
                setJob(user.job || '');
                setCompany(user.company || '');

                // Ensure interests is always an array
                let interestsData = user.interests;
                if (typeof interestsData === 'string') {
                    // Try to parse if it's a JSON string, otherwise split by comma
                    try {
                        interestsData = JSON.parse(interestsData);
                    } catch (e) {
                        interestsData = (interestsData as string).split(',').map(i => i.trim()).filter(i => i.length > 0);
                    }
                }

                if (!Array.isArray(interestsData)) {
                    interestsData = [];
                }
                setInterests(interestsData);

                setIsPrime(!!user.isPremium);
                if (user.avatarUrl) {
                    setImages([{ id: '1', uri: user.avatarUrl }]);
                }
            }
        } catch (error) {
            console.error('Failed to load user data', error);
        }
    };

    const hasUnsavedChanges = true; // In a real app, compare with initial state

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Simplified for now, can perform check against initial data
        router.back();
    };

    const pickImage = async (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImages([{ id: '1', uri: result.assets[0].uri }]);
        }
    };

    const handleSave = async () => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            await authService.updateProfile({
                username: name,
                bio,
                age,
                job,
                company,
                interests,
                avatarUrl: images[0].uri || undefined,
                isPremium: isPrime
            });

            router.back();
        } catch (error) {
            console.error('Failed to save profile', error);
            Alert.alert('Error', 'Failed to save changes. Please try again.');
        }
    };

    const addInterest = () => {
        Alert.prompt(
            "Add Interest",
            "Enter a new interest",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add",
                    onPress: (text?: string) => {
                        if (text && text.trim().length > 0) {
                            setInterests([...interests, text.trim()]);
                        }
                    }
                }
            ],
            "plain-text"
        );
    };

    const removeInterest = (interest: string) => {
        Alert.alert(
            "Remove Interest",
            `Remove '${interest}' from your interests?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: 'destructive',
                    onPress: () => {
                        setInterests(interests.filter(i => i !== interest));
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#F8FAFC']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header Area */}
                <View style={[styles.customHeaderContainer, { paddingTop: insets.top }]}>
                    {/* Custom Back Button */}
                    <TouchableOpacity
                        style={styles.customBackButton}
                        onPress={handleBack}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <BlurView intensity={35} tint="light" style={styles.backButtonBlur}>
                            <Ionicons name="chevron-back" size={24} color="#0F172A" />
                        </BlurView>
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                    </View>

                    {/* Spacer for alignment */}
                    <View style={{ width: 44 }} />
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* --- Image Grid (Single Centered Avatar) --- */}
                    <View style={styles.imageGrid}>
                        <TouchableOpacity
                            style={styles.mainImageContainer}
                            onPress={() => pickImage('1')}
                            activeOpacity={0.9}
                        >
                            {images[0].uri ? (
                                <Image source={{ uri: images[0].uri }} style={styles.mainImage} />
                            ) : (
                                <View style={[styles.mainImage, { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Camera size={40} color="#94A3B8" />
                                </View>
                            )}
                            <BlurView intensity={30} tint="dark" style={styles.editIconBadge}>
                                <Camera size={20} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>
                    </View>

                    {/* --- Main Emoji --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Main Emoji</Text>
                        <TouchableOpacity style={styles.emojiCard} activeOpacity={0.7} onPress={() => Alert.alert("Emoji Picker", "Coming soon!")}>
                            <View style={styles.emojiRow}>
                                <Text style={styles.mainEmoji}>{mainEmoji}</Text>
                                <Text style={styles.emojiLabel}>Tap to change</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>

                    {/* --- Basic Info --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
                                    <Text style={styles.label}>Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Your Name"
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Age</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="numeric"
                                        placeholder="24"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location</Text>
                                <TextInput
                                    style={styles.input}
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="City"
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.label}>Job Title</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={job}
                                        onChangeText={setJob}
                                        placeholder="What's your job..."
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Company</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={company}
                                        onChangeText={setCompany}
                                        placeholder="Where's your work..."
                                    />
                                </View>
                            </View>

                            {/* Moved Bio Here */}
                            <View style={[styles.inputGroup, { marginTop: 10 }]}>
                                <Text style={styles.label}>Bio</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Tell us about yourself..."
                                    textAlignVertical="top"
                                    maxLength={500}
                                />
                                <Text style={styles.charCount}>{bio.length}/500</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- Interests --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Interests</Text>
                        <View style={[styles.card, { padding: 16 }]}>
                            <View style={styles.interestsContainer}>
                                {interests.map((interest, index) => (
                                    <TouchableOpacity
                                        key={`${interest}-${index}`}
                                        style={styles.interestChip}
                                        onPress={() => removeInterest(interest)}
                                    >
                                        {/* Simplified icon logic or generic star */}
                                        <Star size={16} color="#111827" />
                                        <Text style={styles.interestText}>{interest}</Text>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={styles.addInterestChip}
                                    onPress={addInterest}
                                >
                                    <Plus size={16} color="#9CA3AF" />
                                    <Text style={styles.addInterestText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* --- Prime+ Zone (New White Rock Design) --- */}
                    <View style={styles.section}>
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            <View style={styles.primeCard}>
                                {/* Rock Decoration */}
                                <Image
                                    source={require('@/assets/images/rock_decoration.png')}
                                    style={styles.rockImage}
                                    resizeMode="contain"
                                />

                                <View style={styles.primeContentRow}>
                                    <View style={styles.primeTextContainer}>
                                        <Text style={styles.primeTitle}>Prime+ Zone</Text>
                                        <Text style={styles.primeSubtitle}>Outstand everyone by showing your privileged theme</Text>
                                    </View>
                                    <MinimalToggle
                                        value={isPrime}
                                        onValueChange={(newValue) => {
                                            if (newValue && !isPrime) {
                                                // Trigger Premium Overlay
                                                Alert.alert(
                                                    "Premium Required",
                                                    "Upgrade to Prime+ to unlock exclusive themes and features.",
                                                    [
                                                        { text: "Cancel", style: "cancel" },
                                                        { text: "Upgrade", style: "default", onPress: () => router.push('/plans/premium') } // Assuming route exists or just placeholder
                                                    ]
                                                );
                                            } else {
                                                setIsPrime(newValue);
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Footer / Save Button */}
                <Animated.View
                    entering={FadeInDown.delay(400).springify()}
                    style={[
                        styles.footerContainer,
                        { paddingBottom: isKeyboardVisible ? 12 : Math.max(insets.bottom, 20) }
                    ]}
                >
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    // Header
    customHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        justifyContent: 'space-between',
        zIndex: 100,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#0F172A',
        fontFamily: 'Aeonik-Bold',
    },
    customBackButton: {
        // Positioned in standard flow now
    },
    backButtonBlur: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    scrollContent: {
        paddingTop: 12,
        paddingBottom: 40,
    },
    imageGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        height: 180, // Reduced height
        marginBottom: 24,
        justifyContent: 'center', // Center content
        alignItems: 'center',
    },
    mainImageContainer: {
        width: 140,
        height: 140,
        borderRadius: 999, // Circle
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    // Removed small image styles
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        gap: 16,
    },
    row: {
        flexDirection: 'row',
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '500',
    },
    textArea: {
        minHeight: 80,
    },
    charCount: {
        fontSize: 11,
        color: '#94A3B8',
        alignSelf: 'flex-end',
        marginTop: 6,
    },
    emojiCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emojiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    mainEmoji: {
        fontSize: 32,
    },
    emojiLabel: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    interestChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: 'white',
        gap: 8,
    },
    interestText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    addInterestChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        gap: 6,
        borderStyle: 'dashed',
    },
    addInterestText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    // --- Prime Card (Updated) ---
    primeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        height: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 0,
    },
    rockImage: {
        position: 'absolute',
        left: -20,
        bottom: -20,
        width: 140,
        height: 140,
        zIndex: 5,
        transform: [{ rotate: '-10deg' }],
    },
    primeContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 100, // Make space for the rock
        paddingRight: 24,
    },
    primeTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    primeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    primeSubtitle: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    // Toggle
    toggleTrack: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
        padding: 2,
        justifyContent: 'center',
    },
    toggleTrackActive: {
        backgroundColor: '#0033FF',
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    saveButton: {
        backgroundColor: '#0F172A',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});
