import { Colors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MapMarkerProps {
  emoji: string;
  userEmoji?: string;
  isActive?: boolean;
  hasProgress?: boolean;
  progressColor?: string;
  onPress?: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  emoji,
  userEmoji,
  isActive = false,
  hasProgress = false,
  progressColor = Colors.light.success,
  onPress,
}) => {
  const progress = useSharedValue(0);
  const radius = 22.5;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (hasProgress) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 120000,
        easing: Easing.linear,
      });
    }
  }, [hasProgress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.marker, isActive && styles.activeMarker]}>
        <View style={styles.mainEmojiWrapper}>
          {hasProgress && (
            <View style={styles.progressRingContainer}>
              <Svg width={48} height={48} viewBox="0 0 48 48">
                 <Circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="#E0E0E0"
                  strokeWidth="3"
                  fill="transparent"
                /> 
                <AnimatedCircle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke={progressColor}
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={`${circumference}`}
                  animatedProps={animatedProps}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="24, 24"
                />
              </Svg>
            </View>
          )}
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        </View>
        {userEmoji && (
          <View style={styles.userEmojiContainer}>
            <Text style={styles.userEmoji}>{userEmoji}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  marker: {
    backgroundColor: Colors.light.card,
    borderRadius: 25,
    padding: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  activeMarker: {
    transform: [{ scale: 1.1 }],
  },
  mainEmojiWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    zIndex: 1,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  emoji: {
    fontSize: 24,
  },
  userEmojiContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userEmoji: {
    fontSize: 20,
  },
});

export default MapMarker;