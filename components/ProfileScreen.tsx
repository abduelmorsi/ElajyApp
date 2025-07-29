import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
    points: 1250
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>
            {language === 'ar' ? profileData.name : profileData.nameEn}
          </Text>
          <Text style={styles.location}>
            📍 {language === 'ar' ? profileData.location : profileData.locationEn}
          </Text>
          <Text style={styles.badge}>
            🏆 {language === 'ar' ? `عضو ${profileData.membershipLevel}` : `${profileData.membershipLevelEn} Member`}
          </Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}</Text>

        {/* Language Switch */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{language === 'ar' ? 'اللغة' : 'Language'}</Text>
          <Button
            title={language === 'ar' ? 'EN' : 'عربي'}
            onPress={onLanguageToggle}
          />
        </View>

        {/* Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>


        {/* Dark Mode */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutContainer}>
        <Button
          title={t('action.signOut')}
          color="red"
          onPress={onSignOut}
        />
        <Text style={styles.signOutNote}>
          {language === 'ar'
            ? 'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك'
            : 'You will need to sign in again to access your account'}
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{language === 'ar' ? 'صيدلية السودان' : 'Sudan Pharmacy'}</Text>
        <Text style={styles.footerText}>{language === 'ar' ? 'إصدار 1.0.0' : 'Version 1.0.0'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  location: {
    color: 'gray',
    fontSize: 12
  },
  badge: {
    color: 'orange',
    fontSize: 12
  },
  section: {
    marginVertical: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  settingLabel: {
    fontSize: 14
  },
  signOutContainer: {
    marginTop: 24,
    alignItems: 'center'
  },
  signOutNote: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
    textAlign: 'center'
  },
  footer: {
    marginTop: 24,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: 'gray'
  }
});
