import { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';

interface UseTabAnimationReturn {
  animatedItemStyle: any;
  animatedBlurStyle: any;
  triggerAnimation: () => void;
}

export const useTabAnimation = (initialPressed = 0, initialBlur = 0): UseTabAnimationReturn => {
  const pressed = useSharedValue(initialPressed);
  const blur = useSharedValue(initialBlur);

  const animatedItemStyle = useAnimatedStyle(() => {
    const scale = 1 - 0.03 * pressed.value;
    const scaleX = 1 - 0.035 * pressed.value;
    return {
      transform: [{ scale }, { scaleX }],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: blur.value,
    };
  });

  const triggerAnimation = () => {
    // Soft liquid compress/expand and a tiny "blur/snap" illusion.
    pressed.value = withSequence(
      withTiming(1, { duration: 120, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 140, easing: Easing.out(Easing.cubic) })
    );
    blur.value = withSequence(
      withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 130, easing: Easing.out(Easing.cubic) })
    );
  };

  return {
    animatedItemStyle,
    animatedBlurStyle,
    triggerAnimation,
  };
};