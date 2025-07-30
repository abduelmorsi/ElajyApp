import React, { useState } from 'react';
import { Switch, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

type ProfileScreenProps = {
  navigateTo: (screen: string, data?: any) => void;
  onSignOut: () => void;
  onLanguageToggle: () => void;
  currentLanguage: string;
  userData: any;
  updateUserProfile: (updates: any) => void;
};

export default function ProfileScreen({ navigateTo, onSignOut, onLanguageToggle, currentLanguage, userData, updateUserProfile }: ProfileScreenProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const profileData = userData || {
    name: 'أحمد محمد علي',
    nameEn: 'Ahmed Mohammed Ali',
    phone: '+249 123 456 789',
    email: 'ahmed.mohammed@email.com',
    location: 'الخرطوم',
    locationEn: 'Khartoum',
    joinDate: '2023',
    membershipLevel: 'ذهبي',
    membershipLevelEn: 'Gold',
    orderCount: 23,
    savedMoney: 145,
    points: 1250,
    prescriptions: 8,
    consultations: 5
  };

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
    setEditModalVisible(false);
    setEditValue('');
    Alert.alert(
      language === 'ar' ? 'تم التحديث' : 'Updated',
      language === 'ar' ? 'تم تحديث المعلومات بنجاح' : 'Information updated successfully'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Profile Header */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150' }}
              style={styles.avatarImg}
            />
            <TouchableOpacity style={styles.avatarBadge}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>
              {language === 'ar' ? profileData.name : profileData.nameEn}
            </Text>
            <Text style={styles.headerLocation}>
              <Icon name="location-on" size={16} color="#6c757d" style={{ marginRight: 4 }} />
              {language === 'ar' ? profileData.location : profileData.locationEn}
            </Text>
            <View style={styles.headerBadge}>
              <Icon name="emoji-events" size={14} color="#f59e0b" />
              <Text style={styles.headerBadgeText}>
                {language === 'ar' ? `عضو ${profileData.membershipLevel}` : `${profileData.membershipLevelEn} Member`}
              </Text>
            </View>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'shopping-cart', label: language === 'ar' ? 'الطلبات' : 'Orders', value: profileData.orderCount, color: '#1976d2' },
            { icon: 'savings', label: language === 'ar' ? 'المدخرات' : 'Saved', value: `$${profileData.savedMoney}`, color: '#388e3c' },
            { icon: 'star', label: language === 'ar' ? 'النقاط' : 'Points', value: profileData.points, color: '#fbc02d' },
            { icon: 'description', label: language === 'ar' ? 'الوصفات' : 'Prescriptions', value: profileData.prescriptions, color: '#0288d1' },
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

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={18} color="#6c757d" style={styles.infoIcon} />
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Text>
                <Text style={styles.infoValue}>{profileData.phone}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEditField('phone', profileData.phone)}>
                <Icon name="edit" size={16} color="#6c757d" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Icon name="email" size={18} color="#6c757d" style={styles.infoIcon} />
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEditField('email', profileData.email)}>
                <Icon name="edit" size={16} color="#6c757d" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Icon name="calendar-today" size={18} color="#6c757d" style={styles.infoIcon} />
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</Text>
                <Text style={styles.infoValue}>{profileData.joinDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}</Text>
          <View style={styles.card}>
            {/* Language */}
            <View style={styles.settingRow}>
              <Icon name="language" size={18} color="#6c757d" style={styles.settingIcon} />
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
              <Icon name="notifications" size={18} color="#6c757d" style={styles.settingIcon} />
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</Text>
                <Text style={styles.settingValue}>{language === 'ar' ? 'تنبيهات الطلبات والوصفات' : 'Order and prescription alerts'}</Text>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>
            <View style={styles.separator} />
            {/* Dark Mode */}
            <View style={styles.settingRow}>
              <Icon name="dark-mode" size={18} color="#6c757d" style={styles.settingIcon} />
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</Text>
                <Text style={styles.settingValue}>{language === 'ar' ? 'تغيير مظهر التطبيق' : 'Change app appearance'}</Text>
              </View>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </View>
        </View>

        {/* Patient Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{language === 'ar' ? 'خدمات المريض' : 'Patient Services'}</Text>
          {[
            {
              title: language === 'ar' ? 'سجل الطلبات' : 'Order History',
              description: language === 'ar' ? 'عرض جميع الطلبات السابقة' : 'View all previous orders',
              action: () => navigateTo('order-history'),
              icon: 'history',
            },
            {
              title: language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions',
              description: language === 'ar' ? 'إدارة الوصفات الطبية' : 'Manage medical prescriptions',
              action: () => navigateTo('prescriptions'),
              icon: 'description',
            },
            {
              title: language === 'ar' ? 'الاستشارات' : 'Consultations',
              description: language === 'ar' ? 'حجز استشارات مع الصيادلة' : 'Book consultations with pharmacists',
              action: () => navigateTo('consult'),
              icon: 'chat',
            },
            {
              title: language === 'ar' ? 'المفضلة' : 'Favorites',
              description: language === 'ar' ? 'الأدوية والصيدليات المفضلة' : 'Favorite medicines and pharmacies',
              action: () => navigateTo('favorites'),
              icon: 'favorite',
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
                <Icon name={item.icon} size={20} color="#6c757d" style={styles.menuIcon} />
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
              ? 'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك'
              : 'You will need to sign in again to access your account'}
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>{language === 'ar' ? 'علاجي' : 'Elajy'}</Text>
          <Text style={styles.appInfoText}>{language === 'ar' ? 'إصدار 1.0.0' : 'Version 1.0.0'}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  headerLocation: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
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
  settingIcon: {
    fontSize: 18,
    marginRight: 24,
    width: 24,
    textAlign: 'center',
    marginTop: 2,
  },
  menuIcon: {
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
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
});
