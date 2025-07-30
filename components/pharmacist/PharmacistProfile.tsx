import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Settings, Bell, Shield, HelpCircle, Star, Edit, Camera, Languages, LogOut, ChevronRight, Clock, Package, Award, BarChart3, Users, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { useLocalization, sudanesePharmaceuticalData, useRTL } from '../services/LocalizationService';

export default function PharmacistProfile({ navigateTo, onSignOut, onLanguageToggle, currentLanguage }) {
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

  const pharmacistStats = [
    {
      icon: Package,
      label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: pharmacistData.totalOrders,
      color: 'text-primary'
    },
    {
      icon: Users,
      label: language === 'ar' ? 'العملاء' : 'Customers',
      value: pharmacistData.totalCustomers,
      color: 'text-success'
    },
    {
      icon: Star,
      label: language === 'ar' ? 'التقييم' : 'Rating',
      value: pharmacistData.rating,
      color: 'text-warning'
    },
    {
      icon: BarChart3,
      label: language === 'ar' ? 'الخبرة' : 'Experience',
      value: language === 'ar' ? pharmacistData.experience : pharmacistData.experienceEn,
      color: 'text-info'
    }
  ];

  const menuItems = [
    {
      icon: BarChart3,
      title: language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Analytics',
      description: language === 'ar' ? 'عرض أداء الصيدلية والإحصائيات' : 'View pharmacy performance and statistics',
      action: () => navigateTo('pharmacist-analytics')
    },
    {
      icon: Package,
      title: language === 'ar' ? 'إدارة المخزون' : 'Inventory Management',
      description: language === 'ar' ? 'مراقبة والتحكم في المخزون' : 'Monitor and control inventory',
      action: () => navigateTo('pharmacist-inventory')
    },
    {
      icon: FileText,
      title: language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions',
      description: language === 'ar' ? 'مراجعة والموافقة على الوصفات' : 'Review and approve prescriptions',
      action: () => navigateTo('pharmacist-prescriptions')
    },
    {
      icon: Bell,
      title: language === 'ar' ? 'الإشعارات' : 'Notifications',
      description: language === 'ar' ? 'إدارة التنبيهات والإشعارات' : 'Manage alerts and notifications',
      action: () => setNotifications(!notifications)
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
      description: language === 'ar' ? 'إعدادات الحساب والخصوصية' : 'Account and privacy settings',
      action: () => navigateTo('privacy')
    },
    {
      icon: HelpCircle,
      title: language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
      description: language === 'ar' ? 'اتصل بفريق الدعم أو تصفح الأسئلة الشائعة' : 'Contact support or browse FAQ',
      action: () => navigateTo('help')
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-6 pb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&auto=format" />
              <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                {language === 'ar' ? 'فأ' : 'FA'}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm" 
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Camera size={14} />
            </Button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-primary mb-1">
              {language === 'ar' ? pharmacistData.name : pharmacistData.nameEn}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'ar' ? pharmacistData.specialization : pharmacistData.specializationEn}
            </p>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin size={14} className={getMargin('0', '1')} />
              <span>{language === 'ar' ? pharmacistData.pharmacyName : pharmacistData.pharmacyNameEn}</span>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              ⚕️ {language === 'ar' ? 'صيدلي مرخص' : 'Licensed Pharmacist'}
            </Badge>
          </div>
        </div>

        {/* Professional Stats */}
        <div className="grid grid-cols-2 gap-3">
          {pharmacistStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 bg-background/60 backdrop-blur-sm border-primary/10">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold arabic-numbers">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} className="text-primary" />
            {language === 'ar' ? 'المعلومات المهنية' : 'Professional Information'}
          </h3>

          <Card className="p-4 border-primary/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{language === 'ar' ? 'رقم الترخيص' : 'License Number'}</p>
                    <p className="text-sm text-muted-foreground arabic-numbers">{pharmacistData.licenseNumber}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-success border-success/30">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</p>
                    <p className="text-sm text-muted-foreground arabic-numbers">{pharmacistData.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit size={14} />
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</p>
                    <p className="text-sm text-muted-foreground">{pharmacistData.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
          </h3>

          <Card className="divide-y border-primary/10">
            {/* Language Settings */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Languages size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'ar' ? 'اللغة' : 'Language'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLanguageToggle}
                  className="hover:bg-primary/5 hover:border-primary/30"
                >
                  <Languages size={14} className={getMargin('0', '1')} />
                  {language === 'ar' ? 'EN' : 'عربي'}
                </Button>
              </div>
            </div>

            {/* Notifications Settings */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تنبيهات الطلبات والوصفات' : 'Order and prescription alerts'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>

            {/* Dark Mode Settings */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تغيير مظهر التطبيق' : 'Change app appearance'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Management Tools */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            {language === 'ar' ? 'أدوات الإدارة' : 'Management Tools'}
          </h3>

          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index} 
                  className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/10 hover:border-primary/20 hover:bg-primary/5"
                  onClick={item.action}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Centered Sign Out Button */}
        <div className="pt-6 pb-8">
          <div className="flex justify-center">
            <Button 
              variant="destructive" 
              size="lg"
              onClick={onSignOut}
              className="w-full max-w-xs bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 shadow-lg rounded-xl"
            >
              <LogOut size={18} className={getMargin('0', '2')} />
              <span className="font-semibold">{t('action.signOut')}</span>
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {language === 'ar' ? 
              'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حساب الصيدلي' : 
              'You will need to sign in again to access your pharmacist account'
            }
          </p>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p>{language === 'ar' ? 'نظام إدارة الصيدليات - السودان' : 'Pharmacy Management System - Sudan'}</p>
          <p>{language === 'ar' ? 'إصدار صيدلي 1.0.0' : 'Pharmacist Version 1.0.0'}</p>
        </div>
      </div>
    </div>
  );
}