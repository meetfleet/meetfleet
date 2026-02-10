import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Bike,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Cigarette,
  Clock,
  Cpu,
  Dog,
  Dumbbell,
  Film,
  FlaskConical,
  Gamepad2,
  Hammer,
  Landmark,
  Leaf,
  MapPin,
  Music,
  Palette,
  Plane,
  Plus,
  Scroll,
  Search,
  Shirt,
  Star,
  Users,
  Utensils,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { AutoScrollRow } from '../components/AutoScrollRow';
import { INTERESTS, ROW_1_PLANS, ROW_2_PLANS, SUGGESTIONS, VIBES } from '../constants/constants';

const { width, height } = Dimensions.get('window');

// Mock location data - replace with actual API
const MOCK_LOCATIONS = [
  { id: '1', name: 'Central Park', city: 'New York', distance: '0.5 km' },
  { id: '2', name: 'Times Square', city: 'New York', distance: '1.2 km' },
  { id: '3', name: 'Brooklyn Bridge', city: 'New York', distance: '2.8 km' },
  { id: '4', name: 'Empire State Building', city: 'New York', distance: '1.5 km' },
  { id: '5', name: 'Statue of Liberty', city: 'New York', distance: '5.2 km' },
];

const DURATION_OPTIONS = ['15m', '30m', '1h', '2h', '+3h'];
const GROUP_SIZE_OPTIONS = ['Just me', '2 people', '3-5 people', '6-10 people', '10+ people'];
const EMOJI_OPTIONS = ['✨', '🎉', '🎮', '🍸', '🎧', '🏀', '🎬', '🍣', '🌃', '🏞️'];

// Helper component for Step 3 Options - All buttons same rounded style
const SelectableOption = ({ label, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.optionButton,
      isSelected ? styles.optionButtonSelected : styles.optionButtonUnselected,
    ]}
  >
    <Text style={[
      styles.optionText,
      isSelected ? styles.optionTextSelected : styles.optionTextUnselected
    ]}>{label}</Text>
  </TouchableOpacity>
);

const BrandIcon = () => (
  <View style={styles.brandIconWrapper}>
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Path
        d="M48 30.5934C44.1988 40.7874 34.8887 48 23.9991 48C13.1099 47.9998 3.80124 40.7871 0 30.5934L5.45513 28.2616C8.39567 36.1477 15.594 41.7121 23.9991 41.7123C32.4045 41.7123 39.6043 36.1478 42.5449 28.2616L48 30.5934ZM23.9991 0C34.9999 9.70241e-05 43.919 9.27595 43.9194 20.7189C43.9194 23.3786 43.4363 25.9217 42.5586 28.258L36.7066 25.8799C34.718 31.1723 29.7691 34.904 23.9991 34.9041C18.2295 34.9038 13.282 31.172 11.2934 25.8799L5.44139 28.258C4.56363 25.9217 4.08061 23.3787 4.08061 20.7189C4.08095 9.27614 12.9987 0.000407793 23.9991 0Z"
        fill="white"
      />
    </Svg>
  </View>
);

const getInterestIcon = (id: string) => {
  switch (id) {
    case 'art': return Palette;
    case 'sports': return Bike;
    case 'music': return Music;
    case 'pop': return Star;
    case 'photo': return Camera;
    case 'gaming': return Gamepad2;
    case 'travel': return Plane;
    case 'foodie': return Utensils;
    case 'tech': return Cpu;
    case 'fashion': return Shirt;
    case 'reading': return BookOpen;
    case 'nature': return Leaf;
    case 'movies': return Film;
    case 'fitness': return Dumbbell;
    case 'history': return Scroll;
    case 'science': return FlaskConical;
    case 'animals': return Dog;
    case 'politics': return Landmark;
    case 'diy': return Hammer;
    case 'business': return Briefcase;
    default: return Star;
  }
};

// Location Search Modal Component
const LocationSearchModal = ({ visible, onClose, onSelect, currentValue }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(MOCK_LOCATIONS);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(MOCK_LOCATIONS);
    } else {
      const filtered = MOCK_LOCATIONS.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        <FlatList
          data={filteredLocations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() => {
                onSelect(item.name);
                onClose();
              }}
            >
              <MapPin size={20} color="#0057FF" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationCity}>{item.city} • {item.distance}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

// Duration Dropdown Component
const DurationDropdown = ({ visible, onClose, onSelect, currentValue }: any) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          {DURATION_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dropdownOption,
                index === 0 && styles.dropdownOptionFirst,
                index === DURATION_OPTIONS.length - 1 && styles.dropdownOptionLast,
                currentValue === option && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={[
                styles.dropdownOptionText,
                currentValue === option && styles.dropdownOptionTextSelected,
              ]}>
                {option}
              </Text>
              {currentValue === option && (
                <Check size={18} color="#0057FF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Group Size Dropdown Component
const GroupSizeDropdown = ({ visible, onClose, onSelect, currentValue }: any) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          {GROUP_SIZE_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dropdownOption,
                index === 0 && styles.dropdownOptionFirst,
                index === GROUP_SIZE_OPTIONS.length - 1 && styles.dropdownOptionLast,
                currentValue === option && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={[
                styles.dropdownOptionText,
                currentValue === option && styles.dropdownOptionTextSelected,
              ]}>
                {option}
              </Text>
              {currentValue === option && (
                <Check size={18} color="#0057FF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function App() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Shared state for both scroll rows - when user interacts with ANY row, both stop
  const [hasUserInteractedWithRows, setHasUserInteractedWithRows] = useState(false);

  // Modal states
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [durationDropdownVisible, setDurationDropdownVisible] = useState(false);
  const [groupSizeDropdownVisible, setGroupSizeDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Step 1 State
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [customText, setCustomText] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const stepRef = useRef(step);
  const isCustomPlanRef = useRef(isCustomPlan);

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);

        if (scrollViewRef.current) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 50);
        }
      }
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    isCustomPlanRef.current = isCustomPlan;
  }, [isCustomPlan]);

  // Step 2 State
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('22:02');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [whenText, setWhenText] = useState('Today');
  const [duration, setDuration] = useState('2h');
  const [groupSize, setGroupSize] = useState('2-3 people');

  // Step 3 State
  const [gender, setGender] = useState('Male');
  const [relationship, setRelationship] = useState('All');
  const [payment, setPayment] = useState('Split 50/50');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['haha', 'party']);
  const [selectedInterests, setSelectedInterests] = useState(['art']);
  const [smokingEnabled, setSmokingEnabled] = useState(true);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const miniCardScaleAnim = useRef(new Animated.Value(0.96)).current;
  const miniCardTranslateYAnim = useRef(new Animated.Value(0)).current;

  // Success Flow Animations
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const successBadgeScale = useRef(new Animated.Value(0)).current;
  const successBadgeRotate = useRef(new Animated.Value(0)).current;
  const successCheckProgress = useRef(new Animated.Value(0)).current;
  const successTextOpacity = useRef(new Animated.Value(0)).current;
  const successButtonsTranslateY = useRef(new Animated.Value(20)).current;

  const handlePlanSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHasUserInteractedWithRows(true); // Stop both rows
    if (selectedPlanId === id) {
      setSelectedPlanId(null);
    } else {
      setSelectedPlanId(id);
    }
  };

  const toggleVibe = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedVibes.includes(id)) {
      setSelectedVibes(selectedVibes.filter(v => v !== id));
    } else {
      setSelectedVibes([...selectedVibes, id]);
    }
  };

  const toggleInterest = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Time input formatting
  const handleTimeChange = (text: string) => {
    // Remove non-digits
    const digits = text.replace(/\D/g, '');
    
    if (digits.length === 0) {
      setTime('');
      return;
    }
    
    // Format as XX:XX
    let formatted = digits;
    if (digits.length >= 2) {
      const hours = Math.min(parseInt(digits.substring(0, 2)), 23);
      const hoursStr = hours.toString().padStart(2, '0');
      
      if (digits.length >= 3) {
        const minutes = Math.min(parseInt(digits.substring(2, 4)), 59);
        const minutesStr = minutes.toString().padStart(2, '0');
        formatted = `${hoursStr}:${minutesStr}`;
      } else {
        formatted = hoursStr;
      }
    }
    
    setTime(formatted);
  };

  // Date picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (selectedDate.toDateString() === today.toDateString()) {
        setWhenText('Today');
      } else if (selectedDate.toDateString() === tomorrow.toDateString()) {
        setWhenText('Tomorrow');
      } else {
        setWhenText(selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    
    if (Platform.OS === 'ios') {
      // Keep picker open on iOS
    }
  };

  const handleTimePickerChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (date) {
      setSelectedTime(date);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  };

  const performTransition = (nextStep: number, direction: 'next' | 'back') => {
    const isNext = direction === 'next';
    const slideOutTo = isNext ? -20 : 20;
    const slideInFrom = isNext ? 20 : -20;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: slideOutTo,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(miniCardScaleAnim, {
            toValue: 0.92,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(miniCardTranslateYAnim, {
            toValue: 4,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(miniCardScaleAnim, {
            toValue: 0.96,
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(miniCardTranslateYAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      ])
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(slideInFrom);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step === 1) {
      const hasPresetSelection = selectedPlanId !== null;
      const hasCustomText = customText.trim().length > 0;

      if (!hasPresetSelection && !hasCustomText) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }

    if (step < 3) {
      performTransition(step + 1, 'next');
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      performTransition(step - 1, 'back');
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(cardTranslateY, {
        toValue: height,
        duration: 800,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsSuccess(true);
      startSuccessAnimation();
    });
  };

  const startSuccessAnimation = () => {
    successBadgeRotate.setValue(1);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(successBadgeScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(successBadgeRotate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]),
      Animated.timing(successCheckProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(successTextOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(successButtonsTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ])
    ]).start();
  };

  // --- Render Functions ---

  const renderStep1 = () => (
    <>
      <View style={styles.textSection}>
        <Text style={styles.mainHeading}>What's the plan?</Text>
        <Text style={styles.subText}>
          {isCustomPlan ? 'Give your activity a name and an emoji' : 'Pick an activity type or create your own'}
        </Text>

        <View style={styles.stepContainer}>
          <View style={[styles.stepDot, styles.activeStep]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>
      </View>

      {!isCustomPlan ? (
        <Animated.View style={{ flex: 1 }}>
          <View style={styles.rowsContainer}>
            <AutoScrollRow
              items={ROW_1_PLANS}
              direction="left"
              selectedId={selectedPlanId}
              onSelect={(id: string) => {
                handlePlanSelect(id);
                setCustomText('');
              }}
              isPaused={selectedPlanId !== null}
              hasUserInteracted={hasUserInteractedWithRows}
              onUserInteraction={() => setHasUserInteractedWithRows(true)}
            />
            <AutoScrollRow
              items={ROW_2_PLANS}
              direction="right"
              selectedId={selectedPlanId}
              onSelect={(id: string) => {
                handlePlanSelect(id);
                setCustomText('');
              }}
              isPaused={selectedPlanId !== null}
              hasUserInteracted={hasUserInteractedWithRows}
              onUserInteraction={() => setHasUserInteractedWithRows(true)}
            />
          </View>

          <TouchableOpacity
            style={styles.createOwnButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setIsCustomPlan(true);
              setSelectedPlanId(null);
              setCustomText('');
            }}
          >
            <View style={styles.createOwnContent}>
              <Plus size={18} color="#0057FF" strokeWidth={3} />
              <Text style={styles.createOwnText}>Create your own activity</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={styles.customInputContainer}>
          <View style={styles.previewCardContainer}>
            <View style={styles.previewCard}>
              <Text style={styles.previewEmoji}>{customEmoji}</Text>
              <Text style={styles.previewLabel} numberOfLines={1}>
                {customText || 'Activity Name'}
              </Text>
            </View>
            <Text style={styles.previewHint}>Live Preview</Text>
          </View>

          <View style={styles.customInputRow}>
            <TouchableOpacity
              style={styles.emojiPickerButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEmojiPickerVisible(!isEmojiPickerVisible);
              }}
            >
              <Text style={styles.currentEmojiText}>{customEmoji}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.customTextInput}
              placeholder="What are you up to?"
              placeholderTextColor="#9CA3AF"
              value={customText}
              onChangeText={setCustomText}
              autoFocus
              onFocus={() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }
              }}
              maxLength={20}
            />
          </View>

          {isEmojiPickerVisible && (
            <View style={styles.emojiPickerRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOptionButton,
                    customEmoji === emoji && styles.emojiOptionButtonSelected,
                  ]}
                  onPress={() => {
                    setCustomEmoji(emoji);
                    setIsEmojiPickerVisible(false);
                  }}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.cancelCustomButton}
            onPress={() => {
              setIsCustomPlan(false);
              setCustomText('');
            }}
          >
            <Text style={styles.cancelCustomText}>Back to suggestions</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.textSection}>
        <Text style={styles.mainHeading}>Where and When</Text>
        <Text style={styles.subText}>Choose location of your liking and the time</Text>

        <View style={styles.stepContainer}>
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.activeStep]} />
          <View style={styles.stepDot} />
        </View>
      </View>

      <View style={styles.formSection}>
        {/* Location - Now searchable */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <MapPin size={18} color="#111827" style={styles.labelIcon} />
            <Text style={styles.inputLabel}>Location</Text>
          </View>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => setLocationModalVisible(true)}
          >
            <Text style={location ? styles.inputValueText : styles.inputPlaceholderText}>
              {location || 'Search locations...'}
            </Text>
            <Search size={20} color="#9CA3AF" style={styles.inputIcon} />
          </TouchableOpacity>
        </View>

        {/* Suggestions */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={[styles.inputLabel, styles.suggestionsLabel]}>Nearby Suggestions</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {SUGGESTIONS.map((item) => (
              <View key={item.id} style={styles.suggestionCard}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.suggestionImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.suggestionGradient}
                  >
                    <Text style={styles.suggestionTitle}>{item.title}</Text>
                    <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Time & When Grid */}
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <View style={styles.inputLabelContainer}>
              <Clock size={18} color="#111827" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>Time</Text>
            </View>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={time ? styles.inputValueText : styles.inputPlaceholderText}>
                {time || '00:00'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.inputLabelContainer}>
              <Calendar size={18} color="#111827" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>When</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dropdownText}>{whenText}</Text>
              <ChevronDown size={20} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration & Group Size Grid */}
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <View style={styles.inputLabelContainer}>
              <Clock size={18} color="#111827" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>Duration</Text>
            </View>
            <TouchableOpacity
              style={[styles.textInput, styles.centerInput]}
              onPress={() => setDurationDropdownVisible(true)}
            >
              <Text style={styles.inputValueText}>{duration}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.inputLabelContainer}>
              <Users size={18} color="#111827" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>Group Size</Text>
            </View>
            <TouchableOpacity
              style={[styles.textInput, styles.centerInput]}
              onPress={() => setGroupSizeDropdownVisible(true)}
            >
              <Text style={styles.inputValueText}>{groupSize}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
          >
            <TouchableOpacity
              style={styles.datePickerOverlay}
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  textColor="#111827"
                />
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )
      )}

      {/* Time Picker */}
      {showTimePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
          >
            <TouchableOpacity
              style={styles.datePickerOverlay}
              activeOpacity={1}
              onPress={() => setShowTimePicker(false)}
            >
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimePickerChange}
                  textColor="#111827"
                />
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimePickerChange}
          />
        )
      )}
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.textSection}>
        <Text style={styles.mainHeading}>Who and How</Text>
        <Text style={styles.subText}>Customize your crowd and preferences</Text>

        <View style={styles.stepContainer}>
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.activeStep]} />
        </View>
      </View>

      <View style={styles.formSection}>
        {/* Age Slider */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Age</Text>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrackBg} />
            <View style={styles.sliderTrackActive} />
            <View style={[styles.sliderHandle, { left: '10%' }]}>
              <Text style={styles.sliderHandleText}>20</Text>
            </View>
            <View style={[styles.sliderHandle, { left: '40%' }]}>
              <Text style={styles.sliderHandleText}>29</Text>
            </View>
          </View>
        </View>

        {/* Gender with gaps */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
          </View>
          <View style={styles.selectionRowWithGaps}>
            {['All', 'Female', 'Male'].map((opt) => (
              <SelectableOption
                key={opt}
                label={opt}
                isSelected={gender === opt}
                onPress={() => setGender(opt)}
              />
            ))}
          </View>
        </View>

        {/* Relationship with gaps */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Relationship</Text>
          </View>
          <View style={styles.selectionRowWithGaps}>
            {['All', 'Single', 'Taken'].map((opt) => (
              <SelectableOption
                key={opt}
                label={opt}
                isSelected={relationship === opt}
                onPress={() => setRelationship(opt)}
              />
            ))}
          </View>
        </View>

        {/* Payment */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Payment</Text>
          </View>
          <View style={styles.paymentGrid}>
            {['All', 'Split 50/50', 'Split for everyone', "We'll figure it out"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.paymentCard, payment === opt && styles.paymentCardSelected]}
                onPress={() => setPayment(opt)}
              >
                <Text style={[styles.paymentText, payment === opt && styles.paymentTextSelected]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vibes */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Vibes</Text>
          </View>
          <View style={styles.gridRowWrap}>
            {(VIBES || []).map((v) => {
              const isSelected = selectedVibes.includes(v.id);
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.vibeCard, isSelected && styles.vibeCardSelected]}
                  onPress={() => toggleVibe(v.id)}
                >
                  <Text style={styles.vibeEmoji}>{v.emoji}</Text>
                  <Text style={[styles.vibeText, isSelected && styles.vibeTextSelected]}>
                    {v.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Interests</Text>
          </View>
          <View style={styles.chipsContainer}>
            {(INTERESTS || []).map((int) => {
              const isSelected = selectedInterests.includes(int.id);
              const IconComp = getInterestIcon(int.id);

              return (
                <TouchableOpacity
                  key={int.id}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(int.id)}
                >
                  <IconComp size={16} color={isSelected ? '#0033FF' : '#111827'} />
                  <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                    {int.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Smoking Toggle */}
        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSmokingEnabled(!smokingEnabled)}
            style={styles.toggleCard}
          >
            <View style={styles.toggleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.iconContainer}>
                  <Cigarette size={20} color="#0033FF" />
                </View>
                <View>
                  <Text style={styles.toggleTitle}>Smoking</Text>
                  <Text style={styles.toggleSubtitle}>Smoking Friendly</Text>
                </View>
              </View>

              <View style={[styles.toggleTrack, smokingEnabled && styles.toggleTrackActive]}>
                <View style={[
                  styles.toggleThumb,
                  smokingEnabled && { alignSelf: 'flex-end' }
                ]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderSuccess = () => {
    const rotate = successBadgeRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-15deg']
    });

    const widthInterpolate = successCheckProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });

    return (
      <View style={[styles.successContainer, { width, height }]}>
        <View style={styles.successContent}>
          <Animated.View style={{
            transform: [{ scale: successBadgeScale }, { rotate }],
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32
          }}>
            <View style={styles.sealContainer}>
              <View style={[styles.sealLayer, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.sealLayer, { transform: [{ rotate: '30deg' }] }]} />
              <View style={[styles.sealLayer, { transform: [{ rotate: '60deg' }] }]} />

              <View style={styles.checkWrapper}>
                <Animated.View style={[styles.checkMask, { width: widthInterpolate }]}>
                  <View style={styles.checkInner}>
                    <Check size={64} color="#0057FF" strokeWidth={4} />
                  </View>
                </Animated.View>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: successTextOpacity }}>
            <Text style={styles.successTitle}>Bravo, Lamiae!</Text>
            <Text style={styles.successSubtitle}>
              Your plan has been successfully created,{'\n'}and we’re sure you’ll get too many{'\n'}requests ;)
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[
          styles.successButtonsContainer,
          { opacity: successTextOpacity, transform: [{ translateY: successButtonsTranslateY }] }
        ]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace('/(tabs)');
            }}
          >
            <Text style={styles.navButtonText}>Navigation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plansButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace('/(tabs)/events');
            }}
          >
            <Text style={styles.plansButtonText}>Your Plans</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0057FF" />

      {/* Header with safe area */}
      <Animated.View style={[
        styles.headerSafeArea,
        { paddingTop: insets.top, opacity: headerOpacity }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <BrandIcon />
            <Text style={styles.headerTitle}>Create Your Plan</Text>
          </View>
        </View>
      </Animated.View>

      {/* Main Form Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <Animated.View style={{ flex: 1, transform: [{ translateY: cardTranslateY }] }}>
          <View style={styles.stackedCard} />

          <Animated.View
            style={[
              styles.miniDecorationCard,
              {
                transform: [
                  { scale: miniCardScaleAnim },
                  { translateY: miniCardTranslateYAnim }
                ]
              }
            ]}
          />

          <View style={styles.contentCard}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: 140 + (isKeyboardVisible ? keyboardHeight / 2 : 0) }
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </Animated.View>
            </ScrollView>

            {/* Bottom Bar */}
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)', '#FFFFFF']}
              locations={[0, 0.2, 0.4]}
              style={[
                styles.bottomBar,
                {
                  paddingBottom: isKeyboardVisible
                    ? 12
                    : (Platform.OS === 'ios' ? Math.max(insets.bottom, 24) : 24)
                }
              ]}
            >
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {step === 3 ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Success View */}
      {isSuccess && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {renderSuccess()}
        </View>
      )}

      {/* Modals */}
      <LocationSearchModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onSelect={setLocation}
        currentValue={location}
      />

      <DurationDropdown
        visible={durationDropdownVisible}
        onClose={() => setDurationDropdownVisible(false)}
        onSelect={setDuration}
        currentValue={duration}
      />

      <GroupSizeDropdown
        visible={groupSizeDropdownVisible}
        onClose={() => setGroupSizeDropdownVisible(false)}
        onSelect={setGroupSize}
        currentValue={groupSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0057FF',
  },
  headerSafeArea: {
    zIndex: 10,
    backgroundColor: '#0057FF',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingTop: 12,
    opacity: 0.9,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  brandIconWrapper: {
    width: 48,
    height: 48,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
  stackedCard: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    transform: [{ scale: 0.95 }],
    zIndex: 0,
  },
  miniDecorationCard: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 5,
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 50,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  textSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DBEAFE',
  },
  activeStep: {
    backgroundColor: '#2563EB',
  },
  rowsContainer: {
    marginTop: 5,
    gap: 0,
  },
  createOwnButton: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
  },
  createOwnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createOwnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0057FF',
  },
  customInputContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  previewCardContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  previewCard: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#0057FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  previewEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  previewHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emojiPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  emojiPickerButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  currentEmojiText: {
    fontSize: 24,
  },
  emojiOptionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  emojiOptionButtonSelected: {
    backgroundColor: '#DBEAFE',
  },
  emojiOptionText: {
    fontSize: 20,
  },
  customTextInput: {
    flex: 1,
    fontSize: 17,
    color: '#111827',
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  cancelCustomButton: {
    marginTop: 20,
    padding: 10,
  },
  cancelCustomText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  inputSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  labelIcon: {
    marginRight: 2,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111827',
    paddingRight: 48,
  },
  smileIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  inputValueText: {
    fontSize: 16,
    color: '#111827',
  },
  inputPlaceholderText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(243, 244, 246, 0.5)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#0057FF',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Step 2 Styles
  formSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 24,
  },
  fieldGroup: {
    gap: 0,
  },
  suggestionsLabel: {
    marginBottom: 0,
  },
  suggestionsScroll: {
    paddingRight: 24,
    paddingTop: 4,
    paddingBottom: 4,
  },
  suggestionCard: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  suggestionImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  suggestionGradient: {
    padding: 12,
    paddingTop: 40,
  },
  suggestionTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  suggestionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  centerInput: {
    paddingRight: 20,
    textAlign: 'center',
  },
  dropdownInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },

  // Step 3 Styles
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    marginTop: 8,
  },
  sliderTrackBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    width: '100%',
    position: 'absolute',
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: '#0057FF',
    borderRadius: 3,
    position: 'absolute',
    left: '10%',
    width: '30%',
  },
  sliderHandle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0057FF',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderHandleText: {
    color: '#0057FF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectionRowWithGaps: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 2,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  optionButtonSelected: {
    borderColor: '#0057FF',
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  optionButtonUnselected: {},
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },
  optionTextUnselected: {
    color: '#4B5563',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  paymentCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCardSelected: {
    borderColor: '#0057FF',
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  paymentText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    textAlign: 'center',
  },
  paymentTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },
  gridRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  vibeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  vibeCardSelected: {
    borderColor: '#0057FF',
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  vibeEmoji: {
    fontSize: 18,
  },
  vibeText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  vibeTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
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
  interestChipSelected: {
    borderColor: '#0057FF',
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  interestText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },

  // Toggle Styles
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
  },
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
    alignSelf: 'flex-start',
  },

  // Success Styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successContent: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sealContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sealLayer: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 24,
  },
  checkWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkMask: {
    height: 64,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  checkInner: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  successButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  plansButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plansButtonText: {
    color: '#0057FF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Location Search Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalClose: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  locationCity: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 56,
  },

  // Dropdown Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    minWidth: 200,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(0, 87, 255, 0.05)',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  dropdownOptionTextSelected: {
    color: '#0057FF',
    fontWeight: '600',
  },

  // Date Picker Styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  datePickerDone: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0057FF',
  },
});
