import { ScreenHeader } from '@/components/ScreenHeader';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function SubscriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Design requested back button and style same as settings, 
          ScreenHeader typically handles this. Assuming it has a back button. */}
            <ScreenHeader title="Subscription" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContainer}>
                    {/* Header Content Area with assets */}
                    <View style={styles.headerZone}>
                        <Image
                            source={require('../../assets/premium/stamp.svg')}
                            style={styles.stampImage}
                            contentFit="contain"
                        />
                    </View>

                    {/* White Main Container from create-plan style */}
                    <View style={styles.contentCard}>
                        <View style={styles.aboveTitleContainer}>
                            <Image
                                source={require('../../assets/premium/abovetitle.svg')}
                                style={styles.aboveTitleImage}
                                contentFit="contain"
                            />
                        </View>

                        <Text style={styles.title}>You are in the fleet,{"\n"}one of us!</Text>
                        <Text style={styles.dateText}>Since Tue 10 Feb 02:20</Text>

                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../../assets/premium/premium_style_subscription_page.png')}
                                style={styles.mainImage}
                                contentFit="contain"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => { }}
                        >
                            <Text style={styles.cancelText}>Cancel Membership</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Settings pages background color
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContainer: {
        flex: 1,
    },
    headerZone: {
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
    },
    stampImage: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,

        width: 280,
        height: 212,
        opacity: 0.9,
    },
    aboveTitleContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    aboveTitleImage: {
        width: 100,
        height: 100,
    },
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 40,
        flex: 1,
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -20 },
        shadowOpacity: 0.08,
        shadowRadius: 25,
        elevation: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    dateText: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 0,
        fontWeight: '400',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    mainImage: {

        width: width * 0.9,
        height: height * 0.30,
    },
    cancelButton: {
        marginTop: 0,
        alignSelf: 'center',
        paddingVertical: 12,
    },
    cancelText: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: '500',
    },
});
