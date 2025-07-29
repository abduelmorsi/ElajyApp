import React, { useState } from 'react';
import { Switch, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pharmacyModalVisible, setPharmacyModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('');

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

  // Available pharmacies for selection
  const availablePharmacies = [
    { id: '1', name: 'صيدلية النيل الأزرق', nameEn: 'Blue Nile Pharmacy', location: 'أم درمان', locationEn: 'Omdurman' },
    { id: '2', name: 'صيدلية الخرطوم', nameEn: 'Khartoum Pharmacy', location: 'الخرطوم', locationEn: 'Khartoum' },
    { id: '3', name: 'صيدلية الشفاء', nameEn: 'Al Shifa Pharmacy', location: 'أم درمان', locationEn: 'Omdurman' },
    { id: '4', name: 'صيدلية السلام', nameEn: 'Al Salam Pharmacy', location: 'الخرطوم', locationEn: 'Khartoum' },
    { id: '5', name: 'صيدلية النور', nameEn: 'Al Nour Pharmacy', location: 'أم درمان', locationEn: 'Omdurman' },
  ];

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const saveEditChanges = () => {
    if (!editValue.trim()) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال قيمة صحيحة' : 'Please enter a valid value'
      );
      return;
    }

    // Here you would typically update the user profile
    // For now, we'll just show a success message
    setEditModalVisible(false);
    setEditValue('');
    Alert.alert(
      language === 'ar' ? 'تم التحديث' : 'Updated',
      language === 'ar' ? 'تم تحديث المعلومات بنجاح' : 'Information updated successfully'
    );
  };

  const handlePharmacySelection = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy.id);
    setPharmacyModalVisible(false);
    Alert.alert(
      language === 'ar' ? 'تم التحديث' : 'Updated',
      language === 'ar' ? `تم تعيين الصيدلية: ${pharmacy.name}` : `Pharmacy assigned: ${pharmacy.nameEn}`
    );
  };

  // No longer need pharmacistStats or menuItems with icon references

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Profile Header */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&auto=format' }}
              style={styles.avatarImg}
            />
            <TouchableOpacity style={styles.avatarBadge}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>
              {language === 'ar' ? pharmacistData.name : pharmacistData.nameEn}
            </Text>
            <Text style={styles.headerSpecialization}>
              {language === 'ar' ? pharmacistData.specialization : pharmacistData.specializationEn}
            </Text>
            <TouchableOpacity style={styles.headerPharmacyRow} onPress={() => setPharmacyModalVisible(true)}>
              <Icon name="location-on" size={16} color="#6c757d" />
              <Text style={styles.headerPharmacyName}>{language === 'ar' ? pharmacistData.pharmacyName : pharmacistData.pharmacyNameEn}</Text>
              <Icon name="edit" size={14} color="#6c757d" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <View style={styles.headerBadge}>
              <Icon name="verified" size={14} color="#388e3c" />
              <Text style={styles.headerBadgeText}>{language === 'ar' ? 'صيدلي مرخص' : 'Licensed Pharmacist'}</Text>
            </View>
          </View>
        </View>

        {/* Professional Stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'inventory', label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: pharmacistData.totalOrders, color: '#1976d2' },
            { icon: 'people', label: language === 'ar' ? 'العملاء' : 'Customers', value: pharmacistData.totalCustomers, color: '#388e3c' },
            { icon: 'star', label: language === 'ar' ? 'التقييم' : 'Rating', value: pharmacistData.rating, color: '#fbc02d' },
            { icon: 'trending-up', label: language === 'ar' ? 'الخبرة' : 'Experience', value: language === 'ar' ? pharmacistData.experience : pharmacistData.experienceEn, color: '#0288d1' },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '22' }]}> 
                <Icon name={stat.icon} size={20} color={stat.color} />
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
        <Text style={styles.sectionTitleText}>{language === 'ar' ? 'المعلومات المهنية' : 'Professional Information'}</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Icon name="description" size={18} color="#6c757d" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'رقم الترخيص' : 'License Number'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.licenseNumber}</Text>
            </View>
            <Text style={styles.activeBadge}>{language === 'ar' ? 'نشط' : 'Active'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Icon name="phone" size={18} color="#6c757d" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEditField('phone', pharmacistData.phone)}>
              <Icon name="edit" size={16} color="#6c757d" />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Icon name="email" size={18} color="#6c757d" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Text>
              <Text style={styles.infoValue}>{pharmacistData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEditField('email', pharmacistData.email)}>
              <Icon name="edit" size={16} color="#6c757d" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleText}>{language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}</Text>
        <View style={styles.card}>
          {/* Language */}
          <View style={styles.settingRow}>
            <Icon name="language" size={18} color="#6c757d" />
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
            <Icon name="notifications" size={18} color="#6c757d" />
            <View style={styles.settingTextBox}>
              <Text style={styles.settingLabel}>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</Text>
              <Text style={styles.settingValue}>{language === 'ar' ? 'تنبيهات الطلبات والوصفات' : 'Order and prescription alerts'}</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.separator} />
          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <Icon name="dark-mode" size={18} color="#6c757d" />
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
        <Text style={styles.sectionTitleText}>{language === 'ar' ? 'أدوات الإدارة' : 'Management Tools'}</Text>
        {[
          {
            title: language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Analytics',
            description: language === 'ar' ? 'عرض أداء الصيدلية والإحصائيات' : 'View pharmacy performance and statistics',
            action: () => navigateTo('pharmacist-analytics'),
            icon: 'analytics',
          },
          {
            title: language === 'ar' ? 'إدارة المخزون' : 'Inventory Management',
            description: language === 'ar' ? 'مراقبة والتحكم في المخزون' : 'Monitor and control inventory',
            action: () => navigateTo('pharmacist-inventory'),
            icon: 'inventory',
          },
          {
            title: language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions',
            description: language === 'ar' ? 'مراجعة والموافقة على الوصفات' : 'Review and approve prescriptions',
            action: () => navigateTo('pharmacist-prescriptions'),
            icon: 'description',
          },
          {
            title: language === 'ar' ? 'الإشعارات' : 'Notifications',
            description: language === 'ar' ? 'إدارة التنبيهات والإشعارات' : 'Manage alerts and notifications',
            action: () => setNotifications(!notifications),
            icon: 'notifications',
          },
          {
            title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
            description: language === 'ar' ? 'إعدادات الحساب والخصوصية' : 'Account and privacy settings',
            action: () => navigateTo('privacy'),
            icon: 'security',
          },
          {
            title: language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
            description: language === 'ar' ? 'اتصل بفريق الدعم أو تصفح الأسئلة الشائعة' : 'Contact support or browse FAQ',
            action: () => navigateTo('help'),
            icon: 'help',
          },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuCard} onPress={item.action}>
            <View style={styles.menuRow}>
              <Icon name={item.icon} size={20} color="#6c757d" />
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
          <Icon name="logout" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.signOutBtnText}>{t('action.signOut')}</Text>
        </TouchableOpacity>
        <Text style={styles.signOutNote}>
          {language === 'ar'
            ? 'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حساب الصيدلي'
            : 'You will need to sign in again to access your pharmacist account'}
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={styles.appInfoText}>{language === 'ar' ? 'علاجي' : 'Elajy'}</Text>
        <Text style={styles.appInfoText}>{language === 'ar' ? 'إصدار صيدلي 1.0.0' : 'Pharmacist Version 1.0.0'}</Text>
      </View>

      {/* Edit Field Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'ar' ? 'تعديل المعلومات' : 'Edit Information'}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {editField === 'phone' 
                    ? (language === 'ar' ? 'رقم الهاتف' : 'Phone Number')
                    : (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')
                  }
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={
                    editField === 'phone' 
                      ? (language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number')
                      : (language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address')
                  }
                  keyboardType={editField === 'phone' ? 'phone-pad' : 'email-address'}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveEditChanges}>
                <Text style={styles.saveButtonText}>{language === 'ar' ? 'حفظ' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pharmacy Selection Modal */}
      <Modal
        visible={pharmacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPharmacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'ar' ? 'اختر الصيدلية' : 'Select Pharmacy'}
              </Text>
              <TouchableOpacity onPress={() => setPharmacyModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {availablePharmacies.map((pharmacy) => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={[
                    styles.pharmacyOption,
                    selectedPharmacy === pharmacy.id && styles.selectedPharmacyOption
                  ]}
                  onPress={() => handlePharmacySelection(pharmacy)}
                >
                  <View style={styles.pharmacyOptionContent}>
                    <Icon name="local-pharmacy" size={24} color="#1976d2" />
                    <View style={styles.pharmacyOptionText}>
                      <Text style={styles.pharmacyOptionName}>
                        {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                      </Text>
                      <Text style={styles.pharmacyOptionLocation}>
                        {language === 'ar' ? pharmacy.location : pharmacy.locationEn}
                      </Text>
                    </View>
                    {selectedPharmacy === pharmacy.id && (
                      <Icon name="check-circle" size={20} color="#1976d2" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setPharmacyModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#388e3c',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // --- new styles for converted sections ---
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 24,
    width: 24,
    textAlign: 'center',
    marginTop: 2,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
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
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  editBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 24,
    width: 24,
    textAlign: 'center',
    marginTop: 2,
  },
  settingTextBox: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
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
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 24,
    width: 24,
    textAlign: 'center',
    marginTop: 2,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 13,
    color: '#6c757d',
  },
  signOutSection: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutBtn: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
    marginTop: 8,
  },
  appInfoText: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Pharmacy Selection Styles
  pharmacyOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedPharmacyOption: {
    borderColor: '#1976d2',
    backgroundColor: '#f0f8ff',
  },
  pharmacyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  pharmacyOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  pharmacyOptionLocation: {
    fontSize: 14,
    color: '#666',
  },
});