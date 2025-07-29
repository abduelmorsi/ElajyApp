// ...existing code...
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// ...existing code...
// ...existing code...
// ...existing code...
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { sudanesePharmaceuticalData, useLocalization, useRTL } from '../services/LocalizationService';

type PharmacistProfileProps = {
  navigateTo: (screen: string, data?: any) => void;
  onSignOut: () => void;
  onLanguageToggle: () => void;
  currentLanguage: string;
  userData: any;
  updateUserProfile: (updates: any) => void;
};

export default function PharmacistProfile({ navigateTo, onSignOut, onLanguageToggle, currentLanguage, userData, updateUserProfile }: PharmacistProfileProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Pharmacist user data
  const pharmacistData = {
    name: 'د. فاطمة أحمد علي',
    nameEn: 'Dr. Fatima Ahmed Ali',
    phone: '+249 987 654 321',
    email: 'dr.fatima@pharmacy.sd',
    location: sudanesePharmaceuticalData?.cities?.[1]?.name || 'أم درمان',
    locationEn: 'Omdurman',
    pharmacyName: 'صيدلية النيل الأزرق',
    pharmacyNameEn: 'Blue Nile Pharmacy',
    licenseNumber: 'PH-2019-0543',
    experience: '8 سنوات',
    experienceEn: '8 Years',
    specialization: 'الصيدلة السريرية',
    specializationEn: 'Clinical Pharmacy',
    joinDate: '2019',
    totalOrders: 1847,
    totalCustomers: 423,
    rating: 4.9
  };

  // No longer need pharmacistStats or menuItems with icon references

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      {/* ...convert the rest of the profile screen to React Native below... */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&auto=format' }}
              style={styles.avatarImg}
            />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>📷</Text>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>
              {language === 'ar' ? pharmacistData.name : pharmacistData.nameEn}
            </Text>
            <Text style={styles.headerSpecialization}>
              {language === 'ar' ? pharmacistData.specialization : pharmacistData.specializationEn}
            </Text>
            <View style={styles.headerPharmacyRow}>
              <Text style={styles.headerPharmacyIcon}>📍</Text>
              <Text style={styles.headerPharmacyName}>{language === 'ar' ? pharmacistData.pharmacyName : pharmacistData.pharmacyNameEn}</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>⚕️ {language === 'ar' ? 'صيدلي مرخص' : 'Licensed Pharmacist'}</Text>
            </View>
          </View>
        </View>

        {/* Professional Stats */}
        <View style={styles.statsGrid}>
          {/* Use emoji for icons */}
          {[
            { icon: '📦', label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: pharmacistData.totalOrders, color: '#1976d2' },
            { icon: '👥', label: language === 'ar' ? 'العملاء' : 'Customers', value: pharmacistData.totalCustomers, color: '#388e3c' },
            { icon: '⭐', label: language === 'ar' ? 'التقييم' : 'Rating', value: pharmacistData.rating, color: '#fbc02d' },
            { icon: '📊', label: language === 'ar' ? 'الخبرة' : 'Experience', value: language === 'ar' ? pharmacistData.experience : pharmacistData.experienceEn, color: '#0288d1' },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '22' }]}> 
                <Text style={[styles.statIcon, { color: stat.color }]}>{stat.icon}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>
      {/* End of headerBg section */}

      {/* Professional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧑‍⚕️ {language === 'ar' ? 'المعلومات المهنية' : 'Professional Information'}</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📄</Text>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'رقم الترخيص' : 'License Number'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.licenseNumber}</Text>
            </View>
            <Text style={styles.activeBadge}>{language === 'ar' ? 'نشط' : 'Active'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>✏️</Text></TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>✏️</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}</Text>
        <View style={styles.card}>
          {/* Language */}
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🌐</Text>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingLabel}>{language === 'ar' ? 'اللغة' : 'Language'}</Text>
              <Text style={styles.settingValue}>{language === 'ar' ? 'العربية' : 'English'}</Text>
            </View>
            <TouchableOpacity style={styles.langBtn} onPress={onLanguageToggle}>
              <Text style={styles.langBtnText}>{language === 'ar' ? 'EN' : 'عربي'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          {/* Notifications */}
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔔</Text>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingLabel}>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</Text>
              <Text style={styles.settingValue}>{language === 'ar' ? 'تنبيهات الطلبات والوصفات' : 'Order and prescription alerts'}</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.separator} />
          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🌙</Text>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingLabel}>{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</Text>
              <Text style={styles.settingValue}>{language === 'ar' ? 'تغيير مظهر التطبيق' : 'Change app appearance'}</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>
      </View>

      {/* Management Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ {language === 'ar' ? 'أدوات الإدارة' : 'Management Tools'}</Text>
        {[
          {
            title: language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Analytics',
            description: language === 'ar' ? 'عرض أداء الصيدلية والإحصائيات' : 'View pharmacy performance and statistics',
            action: () => navigateTo('pharmacist-analytics'),
            icon: '📊',
          },
          {
            title: language === 'ar' ? 'إدارة المخزون' : 'Inventory Management',
            description: language === 'ar' ? 'مراقبة والتحكم في المخزون' : 'Monitor and control inventory',
            action: () => navigateTo('pharmacist-inventory'),
            icon: '📦',
          },
          {
            title: language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions',
            description: language === 'ar' ? 'مراجعة والموافقة على الوصفات' : 'Review and approve prescriptions',
            action: () => navigateTo('pharmacist-prescriptions'),
            icon: '📄',
          },
          {
            title: language === 'ar' ? 'الإشعارات' : 'Notifications',
            description: language === 'ar' ? 'إدارة التنبيهات والإشعارات' : 'Manage alerts and notifications',
            action: () => setNotifications(!notifications),
            icon: '🔔',
          },
          {
            title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
            description: language === 'ar' ? 'إعدادات الحساب والخصوصية' : 'Account and privacy settings',
            action: () => navigateTo('privacy'),
            icon: '🛡️',
          },
          {
            title: language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
            description: language === 'ar' ? 'اتصل بفريق الدعم أو تصفح الأسئلة الشائعة' : 'Contact support or browse FAQ',
            action: () => navigateTo('help'),
            icon: '❓',
          },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuCard} onPress={item.action}>
            <View style={styles.menuRow}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextBox}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
          <Text style={styles.signOutBtnText}>🚪 {t('action.signOut')}</Text>
        </TouchableOpacity>
        <Text style={styles.signOutNote}>
          {language === 'ar'
            ? 'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حساب الصيدلي'
            : 'You will need to sign in again to access your pharmacist account'}
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={styles.appInfoText}>{language === 'ar' ? 'نظام إدارة الصيدليات - السودان' : 'Pharmacy Management System - Sudan'}</Text>
        <Text style={styles.appInfoText}>{language === 'ar' ? 'إصدار صيدلي 1.0.0' : 'Pharmacist Version 1.0.0'}</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBg: {
    padding: 24,
    paddingBottom: 32,
    backgroundColor: '#e6f0fa',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#b3d4fc',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976d2',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarBadgeText: {
    color: '#fff',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  headerSpecialization: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  headerPharmacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerPharmacyIcon: {
    fontSize: 14,
    marginRight: 4,
    color: '#6c757d',
  },
  headerPharmacyName: {
    fontSize: 14,
    color: '#6c757d',
  },
  headerBadge: {
    backgroundColor: '#e0f7e9',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    color: '#388e3c',
    fontSize: 13,
    fontWeight: 'bold',
  },
  // --- new styles for converted sections ---
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  section: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: '#e0f7e9',
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 6,
  },
  editBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  editBtnText: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  settingTextBox: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#6c757d',
  },
  settingValue: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  langBtn: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  langBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  menuDesc: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  signOutSection: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  signOutBtn: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  signOutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutNote: {
    color: '#6c757d',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  appInfoSection: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  appInfoText: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 2,
  },
});