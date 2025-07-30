import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PatientDonationFlow from './donation/PatientDonationFlow';
import PharmacistDonationManager from './donation/PharmacistDonationManager';
import { useLocalization } from './services/LocalizationService';

interface DonationScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  userType: 'patient' | 'pharmacist';
  userData: any;
}

export default function DonationScreen({ navigateTo, userType, userData }: DonationScreenProps) {
  const { language } = useLocalization();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftRow}>
          <View style={styles.headerIconBox}>
            <Text style={styles.headerIcon}>💚</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{language === 'ar' ? 'التبرعات' : 'Donations'}</Text>
            <Text style={styles.headerSubtitle}>
              {userType === 'patient'
                ? (language === 'ar' ? 'ساعد المرضى المحتاجين' : 'Help patients in need')
                : (language === 'ar' ? 'إدارة التبرعات والتوزيع' : 'Manage donations and distribution')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigateTo(userType === 'patient' ? 'home' : 'pharmacist-dashboard')}
        >
          <Text style={styles.closeBtnText}>{language === 'ar' ? 'إغلاق' : 'Close'}</Text>
        </TouchableOpacity>
      </View>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', paddingHorizontal: 24, paddingVertical: 16 },
  headerLeftRow: { flexDirection: 'row', alignItems: 'center' },
  headerIconBox: { width: 40, height: 40, backgroundColor: '#d1fae5', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerIcon: { fontSize: 20, color: '#22c55e' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  headerSubtitle: { fontSize: 13, color: '#666' },
  closeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f3f3f3' },
  closeBtnText: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  bodyContent: { padding: 24 },
});