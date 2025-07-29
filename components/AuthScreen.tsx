import React, { useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization, useRTL } from './services/LocalizationService';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1000,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  langBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  userTypeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  userTypeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  userTypeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userTypeBtnActive: {
    borderColor: '#007bff',
    backgroundColor: '#f8fbff',
    shadowOpacity: 0.1,
  },
  userTypeIcon: {
    fontSize: 20,
    marginBottom: 6,
    color: '#6c757d',
  },
  userTypeIconActive: {
    color: '#007bff',
  },
  userTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  userTypeLabelActive: {
    color: '#007bff',
  },
  authFormSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  authTabRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  authTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  authTabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  authTabTextActive: {
    color: '#007bff',
  },
  form: {
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  inputFocused: {
    borderColor: '#007bff',
    backgroundColor: '#ffffff',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  eyeBtn: {
    padding: 10,
    marginRight: 4,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#6c757d',
  },
  submitBtn: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 6,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  socialLoginSection: {
    marginTop: 16,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 8,
  },
});

export default function AuthScreen({ onAuth, onLanguageToggle, currentLanguage }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
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

  const handleInputFocus = (field) => {
    setFocusedInput(field);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const getInputStyle = (field) => {
    return focusedInput === field ? [styles.input, styles.inputFocused] : styles.input;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
          {/* Fixed Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity style={styles.langBtn} onPress={onLanguageToggle}>
              <Icon name="language" size={16} color="#007bff" />
              <Text style={styles.langBtnText}>
                {currentLanguage === 'ar' ? 'EN' : 'ع'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: insets.bottom + 20
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Content */}
            <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                {language === 'ar' ? 'مرحباً بك في علاجي' : 'Welcome to Elajy'}
              </Text>
              <Text style={styles.welcomeDesc}>
                {isLogin 
                  ? (language === 'ar' ? 'اعثر على دواءك وأنقذ حياة أحبائك' : 'Find your medicine and save the life of loved ones')
                  : (language === 'ar' ? 'ابدأ في العثور على دواءك وأنقذ حياة أحبائك' : 'Start finding your medicine and save the life of loved ones')}
              </Text>
            </View>

            {/* User Type Selection */}
            <View style={styles.userTypeSection}>
              <Text style={styles.sectionTitle}>
                {language === 'ar' ? 'اختر نوع الحساب' : 'Choose Account Type'}
              </Text>
              <View style={styles.userTypeRow}>
                <TouchableOpacity
                  style={[styles.userTypeBtn, userType === 'patient' && styles.userTypeBtnActive]}
                  onPress={() => setUserType('patient')}
                >
                  <Icon 
                    name="person" 
                    size={24} 
                    style={[styles.userTypeIcon, userType === 'patient' && styles.userTypeIconActive]} 
                  />
                  <Text style={[styles.userTypeLabel, userType === 'patient' && styles.userTypeLabelActive]}>
                    {language === 'ar' ? 'مريض' : 'Patient'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.userTypeBtn, userType === 'pharmacist' && styles.userTypeBtnActive]}
                  onPress={() => setUserType('pharmacist')}
                >
                  <Icon 
                    name="local-pharmacy" 
                    size={24} 
                    style={[styles.userTypeIcon, userType === 'pharmacist' && styles.userTypeIconActive]} 
                  />
                  <Text style={[styles.userTypeLabel, userType === 'pharmacist' && styles.userTypeLabelActive]}>
                    {language === 'ar' ? 'صيدلي' : 'Pharmacist'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auth Form */}
            <View style={styles.authFormSection}>
              <View style={styles.authTabRow}>
                <TouchableOpacity
                  style={[styles.authTabBtn, isLogin && styles.authTabBtnActive]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.authTabText, isLogin && styles.authTabTextActive]}>
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authTabBtn, !isLogin && styles.authTabBtnActive]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.authTabText, !isLogin && styles.authTabTextActive]}>
                    {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                {!isLogin && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </Text>
                    <TextInput
                      style={getInputStyle('name')}
                      value={formData.name}
                      onChangeText={text => handleInputChange('name', text)}
                      placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      onFocus={() => handleInputFocus('name')}
                      onBlur={handleInputBlur}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </Text>
                  <TextInput
                    style={getInputStyle('email')}
                    value={formData.email}
                    onChangeText={text => handleInputChange('email', text)}
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={handleInputBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {!isLogin && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Text>
                    <TextInput
                      style={getInputStyle('phone')}
                      value={formData.phone}
                      onChangeText={text => handleInputChange('phone', text)}
                      placeholder="+249 123 456 789"
                      onFocus={() => handleInputFocus('phone')}
                      onBlur={handleInputBlur}
                      keyboardType="phone-pad"
                    />
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </Text>
                  <View style={[
                    styles.passwordRow,
                    focusedInput === 'password' && styles.inputFocused
                  ]}>
                    <TextInput
                      style={styles.passwordInput}
                      value={formData.password}
                      onChangeText={text => handleInputChange('password', text)}
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                      onFocus={() => handleInputFocus('password')}
                      onBlur={handleInputBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      style={styles.eyeBtn} 
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MCIcon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6c757d"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {!isLogin && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </Text>
                    <View style={[
                      styles.passwordRow,
                      focusedInput === 'confirmPassword' && styles.inputFocused
                    ]}>
                      <TextInput
                        style={styles.passwordInput}
                        value={formData.confirmPassword}
                        onChangeText={text => handleInputChange('confirmPassword', text)}
                        placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                        onFocus={() => handleInputFocus('confirmPassword')}
                        onBlur={handleInputBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity 
                        style={styles.eyeBtn} 
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <MCIcon
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#6c757d"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>
                    {isLogin 
                      ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                      : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
                  </Text>
                </TouchableOpacity>

                {isLogin && (
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}