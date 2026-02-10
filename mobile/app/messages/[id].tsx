import { MessageOverlay } from '@/components/MessageOverlay';
import { NotificationOverlay } from '@/components/NotificationOverlay';
import { ScreenHeader } from '@/components/ScreenHeader';
import { chatByConversationId, conversations } from '@/constants/messages-data';
import { Colors, Fonts } from '@/constants/theme';
import { MOCK_NOTIFICATIONS } from '@/data/mock-notifications';
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard';
import { AppNotification } from '@/types/notification-types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    SlideInDown,
    SlideOutDown,
    ZoomIn,
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function EventCard({ title, meta, confirmed }: { title: string; meta: string; confirmed: boolean }) {
  return (
    <Animated.View entering={FadeInDown.duration(200).easing(Easing.out(Easing.cubic))} style={styles.eventCard}>
      <View style={styles.eventCardTop}>
        <Text style={styles.eventTitle}>{title}</Text>
        {confirmed ? (
          <Animated.View
            entering={FadeInUp.duration(180).easing(Easing.out(Easing.cubic))}
            style={styles.confirmedBadge}
          >
            <Text style={styles.confirmedText}>Confirmed</Text>
          </Animated.View>
        ) : (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        )}
      </View>
      <Text style={styles.eventMeta}>{meta}</Text>
    </Animated.View>
  );
}

function SystemPill({ text, pending }: { text: string; pending: boolean }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(pending ? 260 : 180).easing(Easing.out(Easing.cubic))}
      style={[styles.systemPill, pending && styles.systemPillPending]}
    >
      <Text style={styles.systemPillText}>{text}</Text>
    </Animated.View>
  );
}

function Bubble({
  id,
  text,
  from,
  time,
  reaction,
  replyTo,
  index,
  senderName,
  readReceipt,
  onLongPress,
  onReply
}: {
  id: string;
  text: string;
  from: 'me' | 'them';
  time: string;
  reaction?: string;
  replyTo?: {
    id: string;
    text: string;
    from: 'me' | 'them';
  };
  index: number;
  senderName?: string;
  readReceipt?: string;
  onLongPress: (id: string, text: string, from: 'me' | 'them', time: string, x: number, y: number, width: number, height: number) => void;
  onReply: (message: any) => void;
}) {
  const isMe = from === 'me';
  const bubbleRef = useRef<View>(null);
  const translateX = useSharedValue(0);
  const replyIconScale = useSharedValue(0);
  const tintOpacity = useSharedValue(0);
  const THRESHOLD = 60;

  const handleLongPress = () => {
    bubbleRef.current?.measureInWindow((x, y, width, height) => {
      onLongPress(id, text, from, time, x, y, width, height);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
        // Sent messages (right side): Swipe LEFT (negative)
        // Received messages (left side): Swipe RIGHT (positive)
        let translation = e.translationX;
        
        if (isMe) {
            if (translation < 0) {
                translateX.value = Math.max(translation, -100);
                const progress = Math.min(Math.abs(translation) / THRESHOLD, 1);
                
                if (Math.abs(translation) > 30) {
                    replyIconScale.value = withTiming(1, { duration: 200 });
                } else {
                    replyIconScale.value = withTiming(0, { duration: 200 });
                }
                
                if (Math.abs(translation) > THRESHOLD) {
                    tintOpacity.value = withTiming(0.05, { duration: 200 });
                } else {
                    tintOpacity.value = withTiming(0, { duration: 200 });
                }
            }
        } else {
            if (translation > 0) {
                translateX.value = Math.min(translation, 100);
                const progress = Math.min(Math.abs(translation) / THRESHOLD, 1);
                
                if (translation > 30) {
                    replyIconScale.value = withTiming(1, { duration: 200 });
                } else {
                    replyIconScale.value = withTiming(0, { duration: 200 });
                }

                if (translation > THRESHOLD) {
                    tintOpacity.value = withTiming(0.05, { duration: 200 });
                } else {
                    tintOpacity.value = withTiming(0, { duration: 200 });
                }
            }
        }
        
        if (Math.abs(translation) > THRESHOLD) {
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
    })
    .onEnd((e) => {
        if (Math.abs(e.translationX) > THRESHOLD) {
             runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
             runOnJS(onReply)({ id, text, from });
        }
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        replyIconScale.value = withTiming(0);
        tintOpacity.value = withTiming(0);
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const tintStyle = useAnimatedStyle(() => ({
        opacity: tintOpacity.value
    }));

    const replyIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: replyIconScale.value }],
            opacity: replyIconScale.value
        };
    });

  return (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
        {/* Reply Icon Container */}
        <View style={[styles.replyIconContainer, isMe ? styles.replyIconRight : styles.replyIconLeft]}>
             <Animated.View style={replyIconStyle}>
                <Ionicons name="arrow-undo" size={20} color={Colors.light.primary} />
             </Animated.View>
        </View>

      <GestureDetector gesture={panGesture}>
        <Pressable onLongPress={handleLongPress} delayLongPress={200}>
            <Animated.View
            ref={bubbleRef}
            entering={FadeInUp.duration(180).delay(30 + index * 30).easing(Easing.out(Easing.cubic))}
            style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
                animatedStyle
            ]}
            >
            {/* Tint Overlay */}
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#0033FF', borderRadius: 18 }, tintStyle]} />

            {senderName && !isMe && (
                <Text style={styles.senderName}>{senderName}</Text>
            )}

            {replyTo && (
                <View style={styles.replyContext}>
                <View style={styles.replyBar} />
                <View style={styles.replyContent}>
                    <Text style={styles.replyName}>{replyTo.from === 'me' ? 'You' : 'Them'}</Text>
                    <Text style={styles.replyText} numberOfLines={1}>{replyTo.text}</Text>
                </View>
                </View>
            )}

            <View style={styles.bubbleContent}>
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                {text}
                </Text>
                <View style={styles.metaContainer}>
                    <Text
                        style={[styles.timestampInside, isMe ? styles.timestampInsideMe : styles.timestampInsideThem]}
                    >
                        {time}
                    </Text>
                    {isMe && readReceipt && (
                        <Text style={styles.readReceipt}>{readReceipt}</Text>
                    )}
                </View>
            </View>

            {reaction && (
                <Animated.View 
                    entering={ZoomIn.duration(200)}
                    style={[
                        styles.reactionContainer,
                        isMe ? styles.reactionLeft : styles.reactionRight
                    ]}
                >
                    <Text style={styles.reactionText}>{reaction}</Text>
                </Animated.View>
            )}
            </Animated.View>
        </Pressable>
      </GestureDetector>
    </View>
  );
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convo = useMemo(() => conversations.find((c) => c.id === id), [id]);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Scroll State
  const isNearBottom = useRef(true);
  const currentScrollY = useRef(0);
  const contentHeight = useRef(0);
  const layoutHeight = useRef(0);
  const inputHeight = useRef(0);
  
  const [selectedMessage, setSelectedMessage] = useState<{ id: string, text: string, from: 'me' | 'them', time: string } | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string, text: string, from: 'me' | 'them' } | null>(null);
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  // Mobile Keyboard Logic
  const { keyboardHeight } = useMobileKeyboard();
  const prevKeyboardHeight = useRef(0);
  const footerTranslateY = useSharedValue(0);
  
  // Send button animation values
  const sendRotation = useSharedValue(0); // Start Vertical (0deg)
  const sendOpacity = useSharedValue(1);

  // Send Button Animation Logic
  useEffect(() => {
    if (isSending) {
        // Spin from current angle
        sendRotation.value = withRepeat(withTiming(sendRotation.value + 360, { duration: 400, easing: Easing.linear }), -1);
    } else {
        cancelAnimation(sendRotation);
        // Empty: 0deg (Vertical Up), Has Text: 90deg (Horizontal Right)
        const targetRotation = draft.trim() ? 90 : 0;
        sendRotation.value = withTiming(targetRotation, { duration: 200, easing: Easing.inOut(Easing.ease) });
    }
  }, [draft, isSending]);

  useEffect(() => {
    // 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
    footerTranslateY.value = withTiming(-keyboardHeight, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94)
    });
    
    // CRITICAL: Instant Scroll Compensation
    const delta = keyboardHeight - prevKeyboardHeight.current;
    
    if (delta > 0) { // Keyboard opened or expanded
         // Instant scroll compensation
         scrollViewRef.current?.scrollTo({ 
             y: currentScrollY.current + delta, 
             animated: false 
         });
    }

    prevKeyboardHeight.current = keyboardHeight;
    
    // Scroll Compensation
    if (isNearBottom.current) {
        scrollToEnd();
    }
  }, [keyboardHeight]);

  const animatedFooterStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: footerTranslateY.value }]
  }));
  
  const sendButtonStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${sendRotation.value}deg` }, { scale: isSending ? 0.95 : 1 }],
      opacity: sendOpacity.value
  }));

  React.useEffect(() => {
    if (chatByConversationId[String(id)]) {
        setMessages(chatByConversationId[String(id)]);
    }
  }, [id]);

  const handleLongPress = (id: string, text: string, from: 'me' | 'them', time: string, x: number, y: number, width: number, height: number) => {
    setSelectedMessage({ id, text, from, time });
    setSelectedPosition({ x, y, width, height });
  };

  const handleReply = (message: any) => {
      setReplyingTo(message);
      inputRef.current?.focus();
      // Scroll up by 60px (Reply bar height)
      setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: currentScrollY.current + 60, animated: true });
      }, 50);
  };

  const handleReact = (emoji: string) => {
    if (selectedMessage) {
        setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, reaction: emoji } : m));
    }
  };

  const handleAction = (action: string) => {
    if (action === 'Reply' && selectedMessage) {
        handleReply(selectedMessage);
    }
  };

  const scrollToEnd = () => {
    // Scroll to end only if we were near bottom or explicitly requested
    // Added delay to ensure layout is calculated
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Removed separate useEffect for scrollToEnd on keyboardHeight, integrated above

  const handleImagePick = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted) {
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
          });
          
          if (!result.canceled) {
              // Mock sending image
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              const newMessage = {
                  id: Date.now().toString(),
                  text: `📷 Image sent`, // Placeholder for image logic
                  from: 'me',
                  time: 'Just now',
              };
              setMessages(prev => [...prev, newMessage]);
              scrollToEnd();
          }
      } else {
          Alert.alert('Permission needed', 'Please allow access to your photos to send images.');
      }
  };

  const handleLocation = () => {
      // Mock location functionality since expo-location might not be installed in this env
      Alert.alert(
          "Share Location",
          "Send current location?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Send", 
                  onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      const newMessage = {
                          id: Date.now().toString(),
                          text: `📍 Location: 40.7128° N, 74.0060° W`,
                          from: 'me',
                          time: 'Just now',
                      };
                      setMessages(prev => [...prev, newMessage]);
                      scrollToEnd();
                  }
              }
          ]
      );
  };
  
  const handleSend = () => {
    if (draft.trim()) {
        setIsSending(true);
        // Animation handled by useEffect

        // Simulate network delay
        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            const newMessage = {
                id: Date.now().toString(),
                text: draft,
                from: 'me',
                time: 'Just now',
                replyTo: replyingTo ? {
                    id: replyingTo.id,
                    text: replyingTo.text,
                    from: replyingTo.from
                } : undefined
            };

            setMessages(prev => [...prev, newMessage]);
            setDraft('');
            setReplyingTo(null);
            scrollToEnd();
            
            // Stop animation
            setIsSending(false);
            // Reset handled by useEffect
        }, 600);
    }
  };

  const status = convo?.status ?? 'pending';
  const confirmed = status === 'active';

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    currentScrollY.current = contentOffset.y;
    contentHeight.current = contentSize.height;
    layoutHeight.current = layoutMeasurement.height;
    
    // Check if near bottom (within 50px)
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    isNearBottom.current = distanceFromBottom < 50;
  };

  return (
    <View style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title={convo?.name ?? 'Conversation'}
        subtitle={confirmed ? 'Invite accepted' : 'Suggestion pending'}
        rightElement={
          <TouchableOpacity
            onPress={() => setNotificationVisible(true)}
            activeOpacity={0.7}
            style={styles.notificationBtn}
          >
            <View style={styles.notificationBlur}>
              <Ionicons name="notifications-outline" size={23} color="#1F2937" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>5</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
      />
      
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={[
              styles.scrollContent, 
              { paddingBottom: (Platform.OS === 'ios' ? 90 : 80) + keyboardHeight }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
             if (isNearBottom.current) scrollToEnd();
          }}
          onLayout={() => {
             if (isNearBottom.current) scrollToEnd();
          }}
        >
          {!!convo && <EventCard title={convo.planTitle} meta={convo.planMeta} confirmed={confirmed} />}

          {messages.map((m, idx) => {
            if (m.from === 'system') {
              return <SystemPill key={m.id} text={m.text} pending={!confirmed} />;
            }
            return (
              <Bubble
                key={m.id}
                id={m.id}
                text={m.text}
                from={m.from}
                time={m.time}
                reaction={m.reaction}
                replyTo={m.replyTo}
                index={idx}
                senderName={m.from === 'them' ? convo?.name : undefined}
                readReceipt={m.from === 'me' ? 'Read' : undefined}
                onLongPress={handleLongPress}
                onReply={handleReply}
              />
            );
          })}
        </ScrollView>
      </View>

        {confirmed ? (
          <Animated.View style={[
            styles.footerContainer, 
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
            animatedFooterStyle
          ]}>
            {replyingTo && (
                <Animated.View entering={SlideInDown.duration(200)} exiting={SlideOutDown.duration(200)} style={styles.replyBanner}>
                    <View style={styles.replyBannerContent}>
                        <Text style={styles.replyBannerTitle}>Replying to {replyingTo.from === 'me' ? 'You' : 'Them'}</Text>
                        <Text style={styles.replyBannerText} numberOfLines={1}>{replyingTo.text}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setReplyingTo(null);
                        scrollViewRef.current?.scrollTo({ y: Math.max(0, currentScrollY.current - 60), animated: true });
                    }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close" size={20} color={Colors.light.text} />
                    </TouchableOpacity>
                </Animated.View>
            )}
            <View style={styles.inputBar}>
                {/* Image Button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleImagePick}
                >
                    <Ionicons name="images-outline" size={22} color="#6B7280" />
                </TouchableOpacity>

                {/* Location Button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleLocation}
                    onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        Alert.alert("Location Picker", "Opening full map view...");
                    }}
                >
                    <Ionicons name="location-outline" size={22} color="#6B7280" />
                </TouchableOpacity>

                {/* Text Input */}
                <TextInput
                    ref={inputRef}
                    value={draft}
                    onChangeText={setDraft}
                    onFocus={() => {
                        scrollToEnd();
                    }}
                    placeholder="Message..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    blurOnSubmit={false}
                    multiline
                    onContentSizeChange={(e) => {
                        const newHeight = e.nativeEvent.contentSize.height;
                        const delta = newHeight - inputHeight.current;
                        if (inputHeight.current > 0 && delta > 0) {
                             scrollViewRef.current?.scrollTo({ y: currentScrollY.current + delta, animated: false });
                        }
                        inputHeight.current = newHeight;
                    }}
                />

                {/* Send Button */}
                <TouchableOpacity
                    onPress={handleSend}
                    style={[styles.sendButton, { backgroundColor: draft.trim() ? '#0033FF' : '#E5E7EB' }]}
                    disabled={!draft.trim() && !isSending}
                >
                    <Animated.View style={sendButtonStyle}>
                         <Ionicons name="paper-plane" size={20} color={draft.trim() ? '#FFFFFF' : '#9CA3AF'} style={{ transform: [{ translateX: 2 }, { translateY: -1 }] }} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <View style={[
            styles.lockedBar,
            { paddingBottom: insets.bottom + 10 }
          ]}>
            <Text style={styles.lockedText}>Accept the suggestion to unlock messaging.</Text>
          </View>
        )}

      <MessageOverlay
        isVisible={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
        position={selectedPosition}
        onReact={handleReact}
        onAction={handleAction}
      />

      <NotificationOverlay
        isVisible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        notifications={MOCK_NOTIFICATIONS}
        onNotificationPress={(notification: AppNotification) => {
          setNotificationVisible(false);
        }}
        onClearAll={() => {
          setNotificationVisible(false);
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  eventCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 14,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  eventTitle: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: Fonts.bold,
  },
  eventMeta: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.55,
    fontFamily: Fonts.regular,
  },
  confirmedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 204, 102, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 204, 102, 0.25)',
  },
  confirmedText: {
    fontSize: 12,
    color: Colors.light.success,
    fontFamily: Fonts.bold,
  },
  pendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(17, 24, 28, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  pendingText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.55,
    fontFamily: Fonts.bold,
  },
  systemPill: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 51, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 51, 255, 0.12)',
    marginVertical: 10,
  },
  systemPillPending: {
    backgroundColor: 'rgba(17, 24, 28, 0.05)',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  systemPillText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: Fonts.regular,
  },
  bubbleRow: {
    marginVertical: 4, // 4px spacing for same sender (default)
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  bubbleRowMe: {
    alignItems: 'flex-end',
  },
  bubbleRowThem: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%', // 75% max width
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden', // For tint overlay
  },
  bubbleMe: {
    backgroundColor: '#0033FF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 4,
  },
  bubbleContent: {
      flexDirection: 'column',
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  bubbleTextMe: { color: '#FFFFFF' },
  bubbleTextThem: { color: '#111827' },
  metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 4,
      gap: 4
  },
  timestampInside: {
    fontSize: 11,
    opacity: 0.6,
    fontFamily: Fonts.regular,
  },
  timestampInsideMe: { color: '#FFFFFF' },
  timestampInsideThem: { color: '#111827' },
  readReceipt: {
      fontSize: 11,
      color: '#FFFFFF',
      opacity: 0.8,
      fontFamily: Fonts.regular,
  },
  senderName: {
      fontSize: 13,
      fontWeight: '500',
      color: '#6B7280',
      marginBottom: 4,
      marginLeft: 4
  },
  
  // Footer Styles
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120, // Approx 5 lines
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      color: '#111827',
      textAlignVertical: 'center'
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0033FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Reply Banner
  replyBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
  },
  replyBannerContent: {
      flex: 1,
      borderLeftWidth: 3,
      borderLeftColor: '#0033FF',
      paddingLeft: 10,
  },
  replyBannerTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#0033FF',
      marginBottom: 2,
  },
  replyBannerText: {
      fontSize: 14,
      color: '#4B5563',
  },
  
  // Reply Context in Bubble
  replyContext: {
      flexDirection: 'row',
      marginBottom: 8,
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      padding: 8,
  },
  replyBar: {
      width: 3,
      backgroundColor: '#0033FF',
      borderRadius: 2,
      marginRight: 8,
  },
  replyContent: {
      flex: 1,
  },
  replyName: {
      fontSize: 12,
      fontWeight: '600',
      color: '#0033FF',
      marginBottom: 2,
  },
  replyText: {
      fontSize: 13,
      color: '#4B5563',
      opacity: 0.8
  },
  
  // Swipe Actions
  replyIconContainer: {
      position: 'absolute',
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
  },
  replyIconLeft: {
      left: 10,
  },
  replyIconRight: {
      right: 10,
  },
  
  // Reactions
  reactionContainer: {
      position: 'absolute',
      bottom: -10,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#F3F4F6',
  },
  reactionLeft: {
      left: 10,
  },
  reactionRight: {
      right: 10,
  },
  reactionText: {
      fontSize: 14,
  },
  
  // Lock State
  lockedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Fonts.regular,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.background,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
