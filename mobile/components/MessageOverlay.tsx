import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts } from '@/constants/theme';
import { Copy, Reply, Forward, Trash2 } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MessageOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  message: {
    id: string;
    text: string;
    from: 'me' | 'them';
    time: string;
  } | null;
  position: { x: number; y: number; width: number; height: number } | null;
  onReact: (emoji: string) => void;
  onAction: (action: string) => void;
}

const REACTIONS = ['🔥', '🙏', '😭', '🙈', '😖', '👍', '❤️', '😂', '😢'];

export function MessageOverlay({
  isVisible,
  onClose,
  message,
  position,
  onReact,
  onAction,
}: MessageOverlayProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 0.6,
      });
      opacity.value = withTiming(1, { duration: 150 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!message || !isVisible) return null;

  const handleReact = (emoji: string) => {
    onReact(emoji);
    onClose();
  };

  const handleAction = (action: string) => {
    onAction(action);
    onClose();
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose} animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <View style={styles.centeredContainer} pointerEvents="box-none">
        <Animated.View style={[styles.container, animatedStyle]}>
            {/* Preview Section */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewText} numberOfLines={2}>
                {message.text}
              </Text>
            </View>

            {/* Reaction Section */}
            <View style={styles.reactionSection}>
              <Text style={styles.reactionHeader}>React</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.reactionScroll}
              >
                {REACTIONS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleReact(emoji)}
                    style={styles.emojiButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Actions Section */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionRow} onPress={() => handleAction('Copy')}>
                <Text style={styles.actionText}>Copy</Text>
                <Copy size={20} color={Colors.light.text} />
              </TouchableOpacity>
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.actionRow} onPress={() => handleAction('Reply')}>
                <Text style={styles.actionText}>Reply</Text>
                <Reply size={20} color={Colors.light.text} />
              </TouchableOpacity>
              <View style={styles.divider} />

              <TouchableOpacity style={styles.actionRow} onPress={() => handleAction('Forward')}>
                <Text style={styles.actionText}>Forward</Text>
                <Forward size={20} color={Colors.light.text} />
              </TouchableOpacity>
              <View style={styles.divider} />

              <TouchableOpacity style={styles.actionRow} onPress={() => handleAction('Delete')}>
                <Text style={styles.actionText}>Delete</Text>
                <Trash2 size={20} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF', // Soft white
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  previewContainer: {
    backgroundColor: '#F1F5F9', // Light gray
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  previewText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: Fonts.regular,
    opacity: 0.7,
  },
  reactionSection: {
    marginBottom: 16,
  },
  reactionHeader: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
    marginBottom: 10,
    marginLeft: 4,
  },
  reactionScroll: {
    gap: 12,
    paddingRight: 20,
  },
  emojiButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
  },
  emojiText: {
    fontSize: 28,
  },
  actionsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: Fonts.regular,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginLeft: 8,
  },
});
