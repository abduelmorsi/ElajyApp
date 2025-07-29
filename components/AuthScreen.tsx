import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9fafb', padding: 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  headerSubtitle: { fontSize: 13, color: '#666' },
  langBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f3f3f3' },
  langBtnIcon: { fontSize: 16, marginRight: 4 },
  langBtnText: { fontSize: 14, fontWeight: 'bold', color: '#007bff' },
  welcomeSection: { alignItems: 'center', marginTop: 24, marginBottom: 8 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  welcomeDesc: { color: '#666', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', padding: 20, marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 12 },
  userTypeRow: { flexDirection: 'row', gap: 12 },
  userTypeBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', backgroundColor: '#f3f3f3', marginHorizontal: 2 },
  userTypeBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  userTypeIcon: { fontSize: 24, marginBottom: 4, color: '#007bff' },
  userTypeLabel: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  authTabRow: { flexDirection: 'row', marginBottom: 12 },
  authTabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, backgroundColor: '#f3f3f3', marginHorizontal: 2 },
  authTabBtnActive: { backgroundColor: '#007bff' },
  authTabText: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  authTabTextActive: { color: '#fff' },
  form: { marginTop: 4 },
  formGroup: { marginBottom: 12 },
  label: { fontSize: 13, color: '#444', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: '#fff' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { marginLeft: 8, padding: 4 },
  eyeIcon: { fontSize: 18 },
  submitBtn: { backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default function AuthScreen({ onAuth, onLanguageToggle, currentLanguage }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    onAuth(userType);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
          keyboardShouldPersistTaps="handled"
        >
      {/* Header with language switcher */}
      <View style={styles.header}>
        <View>
              <Text style={styles.headerTitle}>{t('app.name')}</Text>
              <Text style={styles.headerSubtitle}>{t('auth.subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.langBtn} onPress={onLanguageToggle}>
          <Icon name="language" size={16} color="#007bff" style={{ marginRight: 4 }} />
          <Text style={styles.langBtnText}>{currentLanguage === 'ar' ? 'EN' : 'ع'}</Text>
        </TouchableOpacity>
      </View>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>{language === 'ar' ? 'مرحبا' : 'Welcome'}</Text>
        <Text style={styles.welcomeDesc}>
          {isLogin 
            ? (language === 'ar' ? 'سجل دخولك للمتابعة' : 'Sign in to continue')
            : (language === 'ar' ? 'إنشاء حساب جديد' : 'Create a new account')}
        </Text>
      </View>
      {/* User Type Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{language === 'ar' ? 'اختر نوع الحساب' : 'Choose Account Type'}</Text>
        <View style={styles.userTypeRow}>
          <TouchableOpacity
            style={[styles.userTypeBtn, userType === 'patient' && styles.userTypeBtnActive]}
            onPress={() => setUserType('patient')}
          >
            <Text style={styles.userTypeLabel}>{language === 'ar' ? 'مريض' : 'Patient'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userTypeBtn, userType === 'pharmacist' && styles.userTypeBtnActive]}
            onPress={() => setUserType('pharmacist')}
          >
            <Text style={styles.userTypeLabel}>{language === 'ar' ? 'صيدلي' : 'Pharmacist'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Auth Form */}
      <View style={styles.card}>
        <View style={styles.authTabRow}>
          <TouchableOpacity
            style={[styles.authTabBtn, isLogin && styles.authTabBtnActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.authTabText, isLogin && styles.authTabTextActive]}>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authTabBtn, !isLogin && styles.authTabBtnActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.authTabText, !isLogin && styles.authTabTextActive]}>{language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => handleInputChange('name', text)}
                placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
            </View>
          )}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {!isLogin && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={text => handleInputChange('phone', text)}
                placeholder="+249 123 456 789"
                keyboardType="phone-pad"
              />
            </View>
          )}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{language === 'ar' ? 'كلمة المرور' : 'Password'}</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
                placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#888"
                      style={styles.eyeIcon}
                    />
              </TouchableOpacity>
            </View>
          </View>
          {!isLogin && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={text => handleInputChange('confirmPassword', text)}
                placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                secureTextEntry
              />
            </View>
          )}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>
              {isLogin 
                ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}