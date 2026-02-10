import { Colors } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FiltersBackdropProps {
  visible: boolean;
  onClose: () => void;
}

const THUMB_SIZE = 32;

const RangeSlider = ({
  min,
  max,
  initialMin,
  initialMax,
  onValuesChange,
}: {
  min: number;
  max: number;
  initialMin: number;
  initialMax: number;
  onValuesChange: (min: number, max: number) => void;
}) => {
  const [width, setWidth] = useState(0);
  const [currentMin, setCurrentMin] = useState(initialMin);
  const [currentMax, setCurrentMax] = useState(initialMax);
  const minRef = useRef(initialMin);
  const maxRef = useRef(initialMax);
  const widthRef = useRef(0);
  const propsRef = useRef({ min, max });
  useEffect(() => { minRef.current = currentMin; }, [currentMin]);
  useEffect(() => { maxRef.current = currentMax; }, [currentMax]);
  useEffect(() => { widthRef.current = width; }, [width]);
  useEffect(() => { propsRef.current = { min, max }; }, [min, max]);
  useEffect(() => {
    setCurrentMin(initialMin);
    setCurrentMax(initialMax);
  }, [initialMin, initialMax]);

  const getPosition = (value: number) => {
    if (width === 0) return 0;
    return ((value - min) / (max - min)) * (width - THUMB_SIZE);
  };
  const getPositionInternal = (value: number, containerWidth: number, minVal: number, maxVal: number) => {
    if (containerWidth === 0) return 0;
    return ((value - minVal) / (maxVal - minVal)) * (containerWidth - THUMB_SIZE);
  };

  const getValueInternal = (position: number, containerWidth: number, minVal: number, maxVal: number) => {
    if (containerWidth === 0) return minVal;
    const value = (position / (containerWidth - THUMB_SIZE)) * (maxVal - minVal) + minVal;
    return Math.round(Math.max(minVal, Math.min(maxVal, value)));
  };

  const startMinPos = useRef(0);
  const startMaxPos = useRef(0);

  const panResponderMin = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const { min, max } = propsRef.current;
        startMinPos.current = getPositionInternal(minRef.current, widthRef.current, min, max);
      },
      onPanResponderMove: (_, gestureState) => {
        const { min, max } = propsRef.current;
        const containerWidth = widthRef.current;
        
        const currentPos = startMinPos.current + gestureState.dx;
        const newValue = getValueInternal(currentPos, containerWidth, min, max);
        
        if (newValue < maxRef.current && newValue >= min) {
          setCurrentMin(newValue);
          onValuesChange(newValue, maxRef.current);
        }
      },
    })
  ).current;

  const panResponderMax = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const { min, max } = propsRef.current;
        startMaxPos.current = getPositionInternal(maxRef.current, widthRef.current, min, max);
      },
      onPanResponderMove: (_, gestureState) => {
        const { min, max } = propsRef.current;
        const containerWidth = widthRef.current;
        
        const currentPos = startMaxPos.current + gestureState.dx;
        const newValue = getValueInternal(currentPos, containerWidth, min, max);
        
        if (newValue > minRef.current && newValue <= max) {
          setCurrentMax(newValue);
          onValuesChange(minRef.current, newValue);
        }
      },
    })
  ).current;

  return (
    <View 
      style={styles.sliderContainer} 
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.sliderTrackBackground} />
      <View
        style={[
          styles.sliderTrackActive,
          {
            left: getPosition(currentMin) + THUMB_SIZE / 2,
            width: Math.max(0, getPosition(currentMax) - getPosition(currentMin)),
          },
        ]}
      />
      <View
        style={[
          styles.thumbContainer,
          { left: getPosition(currentMin) },
        ]}
        {...panResponderMin.panHandlers}
      >
        <View style={styles.thumb}>
          <Text style={styles.thumbLabelText}>{currentMin}</Text>
        </View>
      </View>
      <View
        style={[
          styles.thumbContainer,
          { left: getPosition(currentMax) },
        ]}
        {...panResponderMax.panHandlers}
      >
        <View style={styles.thumb}>
          <Text style={styles.thumbLabelText}>{currentMax}</Text>
        </View>
      </View>
    </View>
  );
};

const FiltersBackdrop: React.FC<FiltersBackdropProps> = ({ visible, onClose }) => {
  const [ageRange, setAgeRange] = useState({ min: 20, max: 29 });
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | 'all'>('all');
  const [selectedSituation, setSelectedSituation] = useState<'single' | 'taken' | 'all'>('all');
  const [selectedMoneywise, setSelectedMoneywise] = useState<string[]>([]);
  const [sameInterests, setSameInterests] = useState(false);

  const handleReset = () => {
    setAgeRange({ min: 20, max: 29 });
    setSelectedGender('all');
    setSelectedSituation('all');
    setSelectedMoneywise([]);
    setSameInterests(false);
  };

  const renderCheckbox = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelBlue]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.filtersCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetButton}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Age</Text>
              <View style={styles.sliderWrapper}>
                <RangeSlider
                  min={18}
                  max={60}
                  initialMin={ageRange.min}
                  initialMax={ageRange.max}
                  onValuesChange={(min, max) => setAgeRange({ min, max })}
                />
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.optionsRow}>
                {renderCheckbox('Female', selectedGender === 'female', () =>
                  setSelectedGender('female')
                )}
                {renderCheckbox(
                  'Male',
                  selectedGender === 'male',
                  () => setSelectedGender('male')
                )}
                {renderCheckbox('All', selectedGender === 'all', () =>
                  setSelectedGender('all')
                )}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Situation</Text>
              <View style={styles.optionsRow}>
                {renderCheckbox('Single', selectedSituation === 'single', () =>
                  setSelectedSituation('single')
                )}
                {renderCheckbox('Taken', selectedSituation === 'taken', () =>
                  setSelectedSituation('taken')
                )}
                {renderCheckbox(
                  'All',
                  selectedSituation === 'all',
                  () => setSelectedSituation('all')
                )}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Moneywise</Text>
              <View style={styles.optionsRow}>
                {renderCheckbox(
                  'On them',
                  selectedMoneywise.includes('on-them'),
                  () => {
                    setSelectedMoneywise((prev) =>
                      prev.includes('on-them')
                        ? prev.filter((item) => item !== 'on-them')
                        : [...prev, 'on-them']
                    );
                  }
                )}
                {renderCheckbox(
                  '50%',
                  selectedMoneywise.includes('50%'),
                  () => {
                    setSelectedMoneywise((prev) =>
                      prev.includes('50%')
                        ? prev.filter((item) => item !== '50%')
                        : [...prev, '50%']
                    );
                  }
                )}
                {renderCheckbox(
                  'All',
                  selectedMoneywise.includes('all'),
                  () => {
                    setSelectedMoneywise((prev) =>
                      prev.includes('all')
                        ? prev.filter((item) => item !== 'all')
                        : [...prev, 'all']
                    );
                  }
                )}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              {renderCheckbox(
                'Same as yours',
                sameInterests,
                () => setSameInterests(!sameInterests)
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter:'blur(10px)',
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  filtersCard: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  resetButton: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 20,
  },
  sliderWrapper: {
    height: 20,
    justifyContent: 'center',
    paddingTop: 0,
    paddingHorizontal: 16,
  },
  sliderContainer: {
    height: 20,
    justifyContent: 'center',
  },
  sliderTrackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  sliderTrackActive: {
    position: 'absolute',
    height: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  thumbContainer: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -THUMB_SIZE / 2,
    zIndex: 1,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.light.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
  checkboxLabelBlue: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
});

export default FiltersBackdrop;