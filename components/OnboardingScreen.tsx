import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization } from './services/LocalizationService';

const onboardingSlides = [
  {
    icon: 'medication',
    titleKey: 'onboarding.title1',
    descKey: 'onboarding.desc1',
    color: '#49C5B8', // primary color
  },
  {
    icon: 'medical-services',
    titleKey: 'onboarding.title2',
    descKey: 'onboarding.desc2',
    color: '#49C5B8', // primary color
  },
  {
    icon: 'local-shipping',
    titleKey: 'onboarding.title3',
    descKey: 'onboarding.desc3',
    color: '#49C5B8', // primary color
  },
];

export default function OnboardingScreen({ onNext, onSkip }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, t, toggleLanguage } = useLocalization();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const slide = onboardingSlides[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f0f9f8', flex: 1 }]}>
      {/* Top Bar: Language Switcher & Skip Button */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}> 
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Icon name="language" size={16} color="#49C5B8" style={{ marginRight: 4 }} />
          <Text style={styles.langBtnText}>{language === 'ar' ? 'EN' : 'ع'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('action.skip')}</Text>
        </TouchableOpacity>
      </View>
      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#fff', borderColor: slide.color, borderWidth: 2 }]}> 
              <Icon name={slide.icon} size={48} color={slide.color} />
            </View>
          </View>
          <Text style={styles.title}>{t(slide.titleKey)}</Text>
          <Text style={styles.description}>{t(slide.descKey)}</Text>
          {/* Slide Indicators */}
          <View style={styles.indicatorContainer}>
            {onboardingSlides.map((_, idx2) => (
              <View
                key={idx2}
                style={[styles.indicator, idx2 === currentSlide ? styles.indicatorActive : styles.indicatorInactive]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentSlide === onboardingSlides.length - 1 ? t('action.getStarted') : t('action.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brand */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>{language === 'ar' ? t('app.name') : t('app.name')}</Text>
        <Text style={styles.brandSubtitle}>{language === 'ar' ? 'دواءك دائما قريب منك' : 'YOUR MEDICINE ALWAYS NEARBY'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f8', // primary-50 equivalent
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 340, // ensure consistent height
    maxWidth: 340,
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
    backgroundColor: '#49C5B8', // primary color
  },
  indicatorInactive: {
    backgroundColor: '#e5e7eb', // muted
  },
  nextButton: {
    backgroundColor: '#49C5B8',
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
    textAlign: 'center',
  },
  brandContainer: {
    padding: 32,
    alignItems: 'center',
  },
  brandTitle: {
    color: '#49C5B8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f3f3',
  },
  langBtnIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  langBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#49C5B8',
  },
});
