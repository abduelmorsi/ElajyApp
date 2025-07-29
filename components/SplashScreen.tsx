import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from './services/LocalizationService';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { t, language } = useLocalization();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 1000,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Start animations after a short delay
    const timer = setTimeout(() => {
      startAnimations();
    }, 100);

    // Navigate to next screen after splash duration
    const splashTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(splashTimer);
    };
  }, [fadeAnim, scaleAnim, logoScaleAnim, onFinish]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScaleAnim }]
            }
          ]}
        >
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>{t('app.name')}</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          {language === 'ar' ? 'دواءك دائما قريب منك' : 'Your Medicine Always Nearby'}
        </Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 48,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    opacity: 0.6,
  },
}); 