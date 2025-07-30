import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const onboardingSlides = [
  {
    icon: '💊',
    title: 'Find Your Medicines',
    description: 'Search and discover medicines from verified pharmacies with detailed information and reviews.',
    color: '#2563eb', // blue-500
  },
  {
    icon: '🩺',
    title: 'Consult Pharmacists',
    description: 'Get expert advice from licensed pharmacists through our secure consultation platform.',
    color: '#22c55e', // green-500
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description: 'Order medicines for home delivery or schedule pickup from nearby pharmacies at your convenience.',
    color: '#a21caf', // purple-700
  },
];

export default function OnboardingScreen({ onNext, onSkip }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const slide = onboardingSlides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#fff', borderColor: slide.color, borderWidth: 2 }]}> 
              <Text style={{ fontSize: 48 }}>{slide.icon}</Text>
            </View>
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>

          {/* Slide Indicators */}
          <View style={styles.indicatorContainer}>
            {onboardingSlides.map((_, index) => (
              <View
                key={index}
                style={[styles.indicator, index === currentSlide ? styles.indicatorActive : styles.indicatorInactive]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}{' '}
              <Text style={{ fontSize: 16 }}>➡️</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brand */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>PharmaCare</Text>
        <Text style={styles.brandSubtitle}>Your trusted pharmacy companion</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff', // blue-50
    justifyContent: 'space-between',
  },
  skipContainer: {
    alignItems: 'flex-end',
    padding: 16,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  skipText: {
    color: '#888',
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    padding: 16,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#2563eb', // blue-500
  },
  indicatorInactive: {
    backgroundColor: '#e5e7eb', // muted
  },
  nextButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandContainer: {
    padding: 32,
    alignItems: 'center',
  },
  brandTitle: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandSubtitle: {
    color: '#888',
    fontSize: 14,
  },
});