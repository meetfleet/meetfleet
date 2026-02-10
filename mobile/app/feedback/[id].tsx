import { ScreenHeader } from '@/components/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const QUESTIONS = [
  { id: 'time', text: 'Did Imad arrive in time?' },
  { id: 'payment', text: 'Did Imad respect the payment agreement?' },
  { id: 'interests', text: 'Did Imad’s interests match?' },
  { id: 'substances', text: 'Did Imad appear to be under the influence of substances?' },
  { id: 'upset', text: 'Did Imad do anything out of the ordinary that upset you?' },
  { id: 'safe', text: 'Was Imad protective/reliable?' },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleRate = (stars: number) => {
    setRating(stars);
    // Add a small delay before moving to next step for better UX
    setTimeout(() => {
      setStep(2);
    }, 500);
  };

  const toggleAnswer = (questionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = () => {
    setStep(3);
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  // Step 1: Rating Screen
  const renderRatingStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?u=imad' }}
          style={styles.avatarLarge}
        />
      </View>
      <Text style={styles.questionTitle}>How was Imad?</Text>
      
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRate(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rating >= star ? 'star' : 'star'}
              size={48}
              color={rating >= star ? '#CBD5E1' : '#F1F5F9'} // Use filled star but change color. Wait, design shows grey stars. Selected should be colored? Usually Gold/Yellow.
              // Let's assume unselected is light gray, selected is darker gray or gold. 
              // Design shows grey stars. Let's make selected stars Gold or Dark.
              style={{ marginHorizontal: 4 }}
            />
             {/* Overlay for filled star if needed, or just change color */}
             <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
                 <Ionicons 
                    name="star" 
                    size={48} 
                    color={rating >= star ? '#94A3B8' : '#F1F5F9'} // Darker gray for selected, Light for unselected
                 />
             </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Step 2: Feedback Questions
  const renderQuestionsStep = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Your Feedback Matters</Text>
      
      <View style={styles.questionsList}>
        {QUESTIONS.map((q) => (
          <TouchableOpacity 
            key={q.id} 
            style={styles.questionItem}
            onPress={() => toggleAnswer(q.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, answers[q.id] && styles.checkboxChecked]}>
              {answers[q.id] && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.questionText}>{q.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>Show us somethign? <Text style={styles.optionalText}>optional</Text></Text>
      
      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="image-outline" size={32} color="#0F172A" />
        <Text style={styles.uploadText}>Upload Image</Text>
        <Text style={styles.uploadSubtext}>Accepted formats: PNG, JPG, JPEG, GIF.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  // Step 3: Thank You
  const renderThankYouStep = () => (
    <View style={styles.stepContainer}>
       <Image
          source={require('@/assets/fingers_crossed.png')} // Reusing consistent asset
          style={styles.successImage}
        />
      <Text style={styles.successTitle}>Thank You!</Text>
      <Text style={styles.successSubtitle}>
        Your feedback helps us keep the community safe and fun.
      </Text>
      
      <TouchableOpacity style={styles.homeButton} onPress={handleFinish}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader 
        showBackButton={step !== 3} 
        title={step === 2 ? '' : ''}
        rightElement={step === 1 ? (
             <TouchableOpacity onPress={() => router.back()}>
                 <Text style={styles.closeText}>Close</Text>
             </TouchableOpacity>
        ) : step === 2 ? (
            <TouchableOpacity onPress={() => router.back()}>
                 <Text style={styles.closeText}>Close</Text>
             </TouchableOpacity>
        ) : null}
      />

      {step === 1 && renderRatingStep()}
      {step === 2 && renderQuestionsStep()}
      {step === 3 && renderThankYouStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeText: {
      fontSize: 16,
      color: '#0F172A',
      fontWeight: '500',
  },
  // Rating Styles
  avatarContainer: {
    marginBottom: 24,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  // Questions Styles
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 32,
    letterSpacing: -1,
    lineHeight: 36,
  },
  questionsList: {
    gap: 24,
    marginBottom: 40,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center', // Align top if text is long, but center usually fine
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12, // Circle as per design
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB', // Blue
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 22,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  optionalText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#94A3B8',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  submitButton: {
    backgroundColor: '#0F172A',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Success Styles
  successImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  homeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
  },
  homeButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
});
