import React, { useState } from 'react';
import { User, Users, Eye, EyeOff, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function AuthScreen({ onAuth, onLanguageToggle, currentLanguage }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(userType);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full overflow-y-auto bg-background sudanese-pattern">
      {/* Clean header with language switcher */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'صيدلية السودان' : 'Sudan Pharmacy'}
            </h1>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'خدمات صيدلانية متكاملة' : 'Comprehensive pharmacy services'}
            </p>
          </div>
          
          {/* Language switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLanguageToggle}
            className="flex items-center space-x-2 border-gray-200"
          >
            <Globe size={16} />
            <span className="text-sm">
              {currentLanguage === 'ar' ? 'EN' : 'ع'}
            </span>
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'مرحبا' : 'Welcome'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? (language === 'ar' ? 'سجل دخولك للمتابعة' : 'Sign in to continue')
              : (language === 'ar' ? 'إنشاء حساب جديد' : 'Create a new account')
            }
          </p>
        </div>

        {/* User Type Selection */}
        <Card className="bg-white border border-gray-100">
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'ar' ? 'اختر نوع الحساب' : 'Choose Account Type'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={userType === 'patient' ? 'default' : 'outline'}
                onClick={() => setUserType('patient')}
                className={`h-20 flex flex-col items-center space-y-2 ${
                  userType === 'patient' ? 'bg-primary text-white' : 'border-gray-200'
                }`}
              >
                <User size={24} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'مريض' : 'Patient'}
                </span>
              </Button>
              
              <Button
                variant={userType === 'pharmacist' ? 'default' : 'outline'}
                onClick={() => setUserType('pharmacist')}
                className={`h-20 flex flex-col items-center space-y-2 ${
                  userType === 'pharmacist' ? 'bg-primary text-white' : 'border-gray-200'
                }`}
              >
                <Users size={24} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'صيدلي' : 'Pharmacist'}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Form */}
        <Card className="bg-white border border-gray-100">
          <CardHeader>
            <div className="flex items-center justify-center space-x-1">
              <Button
                variant={isLogin ? 'default' : 'ghost'}
                onClick={() => setIsLogin(true)}
                className="flex-1"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
              <Button
                variant={!isLogin ? 'default' : 'ghost'}
                onClick={() => setIsLogin(false)}
                className="flex-1"
              >
                {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                  className="mt-1"
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+249 123 456 789"
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="password">{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              )}

              <Button type="submit" className="w-full bg-primary text-white h-12">
                {isLogin 
                  ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                  : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}