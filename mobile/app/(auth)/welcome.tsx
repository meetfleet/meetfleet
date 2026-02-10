import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const videoSource = require('@/assets/welcome.mp4');

export default function WelcomeScreen() {
    const router = useRouter();
    const navigated = useRef(false);

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = false;
        player.muted = true;
    });

    useEffect(() => {
        // Play the video after component mounts
        player.play();

        const subscription = player.addListener('playToEnd', () => {
            if (!navigated.current) {
                navigated.current = true;
                router.replace('/(auth)/onboarding' as any);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [player]);

    return (
        <SafeAreaView style={styles.container}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0033FF',
    },
    video: {
        width,
        height,
    },
});