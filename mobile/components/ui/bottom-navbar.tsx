import { Colors, Fonts } from '@/constants/theme';
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { Diamond, Home, MessageCircle, UserRound } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface BottomNavBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

// Create an animated version of Pressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const getIcon = (iconName: string, isActive: boolean) => {
  const iconColor = isActive ? Colors.light.primary : Colors.light.navbarInactive;
  const iconSize = 24;

  switch (iconName) {
    case 'message-circle':
      return <MessageCircle size={iconSize} color={iconColor} strokeWidth={2} />;
    case 'diamond':
      return <Diamond size={iconSize} color={iconColor} strokeWidth={2} />;
    case 'home':
      return <Home size={iconSize} color={iconColor} strokeWidth={2} />;
    case 'user-round':
      return <UserRound size={iconSize} color={iconColor} strokeWidth={2} />;
    default:
      return null;
  }
};

// Hexagon SVG component with premium animations
const HexagonSvg: React.FC<{ color: string; scale?: number }> = ({ color, scale = 1 }) => {
  return (
    <Svg 
      width={49 * scale} 
      height={57 * scale} 
      viewBox="0 0 49 57" 
      style={StyleSheet.absoluteFill}
    >
      <Path 
        d="M27.0828 55.7149C25.4382 56.7693 23.3302 56.7693 21.6856 55.7149L2.30143 43.2877C0.867324 42.3683 0 40.782 0 39.0784V17.4266C0 15.723 0.867372 14.1367 2.30154 13.2173L21.6857 0.790685C23.3302 -0.263578 25.4382 -0.26356 27.0827 0.790731L46.4661 13.2172C47.9002 14.1367 48.7675 15.723 48.7675 17.4265V39.0785C48.7675 40.782 47.9002 42.3683 46.4662 43.2877L27.0828 55.7149Z" 
        fill={color}
      />
      <Path 
        d="M23.9091 33.2111V23.2957H24.8647V33.2111H23.9091ZM19.4332 28.7353V27.7715H29.3405V28.7353H19.4332Z" 
        fill="white"
      />
    </Svg>
  );
};

const TabButton: React.FC<{
  item: any;
  isActive: boolean;
  onPress: () => void;
  onOtherTabPress: () => void;
}> = ({ item, isActive, onPress, onOtherTabPress }) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  
  const handlePressIn = () => {
    // Ultra-premium light haptic on press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    scale.value = withTiming(0.92, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
    iconScale.value = withTiming(0.88, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    iconScale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePress = () => {
    // Delicious medium haptic on actual press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Trigger hexagon jiggle
    onOtherTabPress();
    
    // Quick bounce animation
    iconScale.value = withSequence(
      withTiming(1.15, { duration: 80, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) })
    );
    
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.navItemWrapper, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.navItem}>
        <Animated.View style={[styles.iconRow, iconAnimatedStyle]}>
          {getIcon(item.icon, isActive)}
        </Animated.View>
        {item.showLabel && (
          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {item.label}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
};

const CreateButton: React.FC<{
  onPress: () => void;
  jiggleTrigger: SharedValue<number>;
}> = ({ onPress, jiggleTrigger }) => {
  const scale = useSharedValue(0.7);
  const brightness = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Entry animation on mount
  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  // Watch for jiggle trigger - this is the Reanimated way to observe shared values
  useAnimatedReaction(
    () => jiggleTrigger.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue > 0) {
        // Quick single jiggle animation
        rotation.value = withSequence(
          withTiming(3, { duration: 80, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 120, easing: Easing.out(Easing.ease) })
        );
        
        scale.value = withSequence(
          withTiming(1.05, { duration: 80, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) })
        );
      }
    }
  );

  const handlePressIn = () => {
    // Premium haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Quick shrink animation
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
    brightness.value = withTiming(1.15, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    brightness.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePress = () => {
    // Heavy haptic for the main action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Quick pop animation
    scale.value = withSequence(
      withTiming(1.15, { duration: 80, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) })
    );
    
    setTimeout(() => {
      // Success haptic before navigation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPress();
    }, 150);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: brightness.value > 1 ? 0.92 : 1,
  }));

  return (
    <AnimatedPressable
      style={styles.createButtonWrapper}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.hexagonContainer, animatedStyle]}>
        <View style={styles.hexagonShadow}>
          <HexagonSvg color="rgba(0, 51, 255, 0.15)" scale={1.02} />
        </View>
        <HexagonSvg color={Colors.light.primary} scale={1} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const BottomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { keyboardHeight } = useMobileKeyboard();
  const translateY = useSharedValue(0);
  const jiggleTrigger = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(-keyboardHeight, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [keyboardHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Trigger hexagon jiggle
  const triggerHexagonJiggle = () => {
    jiggleTrigger.value = Math.random(); // Change value to trigger animation
  };

  // Map route names to nav item IDs
  const getActiveTabId = () => {
    const routeName = state.routes[state.index].name;
    switch (routeName) {
      case 'index': return 'home';
      case 'events': return 'plans';
      case 'messages': return 'messages';
      case 'profile': return 'profile';
      default: return '';
    }
  };

  const activeTabId = getActiveTabId();

  const hideOnRoutes = [
    '/(tabs)/request',
    '/request',
    '/edit-profile',
    '/(tabs)/edit-profile',
  ];

  const shouldHideNav = hideOnRoutes.includes(pathname);

  if (shouldHideNav) {
    return null;
  }

  // Define nav items inline
  const navItemsConfig = [
    { id: 'home', icon: 'home', label: 'Home', showLabel: false },
    { id: 'plans', icon: 'diamond', label: 'Plans', showLabel: false },
    { id: 'create', icon: 'plus', label: '', showLabel: false }, // Placeholder for create button
    { id: 'messages', icon: 'message-circle', label: 'Messages', showLabel: false },
    { id: 'profile', icon: 'user-round', label: 'Profile', showLabel: false },
  ];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {navItemsConfig.map((item) => {
        if (item.id === 'create') {
          return (
            <CreateButton
              key={item.id}
              onPress={() => router.push('/create-plan')}
              jiggleTrigger={jiggleTrigger}
            />
          );
        }

        const isActive = activeTabId === item.id;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: item.id,
            canPreventDefault: true,
          });

          if (!isActive) {
            // Map item.id back to route name
            let routeName = 'index';
            if (item.id === 'plans') routeName = 'events';
            if (item.id === 'messages') routeName = 'messages';
            if (item.id === 'home') routeName = 'index';
            if (item.id === 'profile') routeName = 'profile';

            navigation.navigate(routeName);
          }
        };

        return (
          <TabButton
            key={item.id}
            item={item}
            isActive={isActive}
            onPress={onPress}
            onOtherTabPress={triggerHexagonJiggle}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  navItemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconRow: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: Colors.light.navbarInactive,
    fontFamily: Fonts.regular,
  },
  activeLabel: {
    color: Colors.light.primary,
    fontFamily: Fonts.bold,
  },
  createButtonWrapper: {
     paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  hexagonContainer: {
    
    width: 49,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonShadow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    bottom: -3,
  },
});

export default BottomNavBar;
