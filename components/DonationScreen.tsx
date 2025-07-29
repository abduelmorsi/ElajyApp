import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PatientDonationFlow from './donation/PatientDonationFlow';
import PharmacistDonationManager from './donation/PharmacistDonationManager';
import { useLocalization } from './services/LocalizationService';

interface DonationScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
  userType: 'patient' | 'pharmacist';
  userData: any;
}

export default function DonationScreen({ navigateTo, goBack, userType, userData }: DonationScreenProps) {
  const { t, language } = useLocalization();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (goBack) {
      goBack();
    } else {
      navigateTo(userType === 'patient' ? 'home' : 'pharmacist-dashboard');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('pharmacist.donation.title')}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.bodyContent}>
          {userType === 'patient' ? (
            <PatientDonationFlow navigateTo={navigateTo} />
          ) : (
            <PharmacistDonationManager
              navigateTo={navigateTo}
              userData={userData}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  bodyContent: {
    padding: 16,
  },
});