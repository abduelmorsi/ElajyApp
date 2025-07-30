import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Settings, Bell, Shield, HelpCircle, Star, Edit, Camera, Languages, LogOut, ChevronRight, Clock, Package, Heart, Award, CreditCard, Users, FileText, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLocalization, sudanesePharmaceuticalData, useRTL } from './services/LocalizationService';

export default function ProfileScreen({ navigateTo, onSignOut, onLanguageToggle, currentLanguage, userData, updateUserProfile }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({});

  // Use userData from props or fallback
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

  const profileStats = [
    {
      icon: Package,
      label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: profileData.orderCount || 0,
      color: 'text-primary'
    },
    {
      icon: Clock,
      label: language === 'ar' ? 'عضو منذ' : 'Member Since',
      value: profileData.joinDate || '2023',
      color: 'text-success'
    },
    {
      icon: Heart,
      label: language === 'ar' ? 'المفضلة' : 'Favorites',
      value: 12,
      color: 'text-destructive'
    },
    {
      icon: Award,
      label: language === 'ar' ? 'النقاط' : 'Points',
      value: profileData.points || 0,
      color: 'text-warning'
    }
  ];

  const handleEditStart = (field) => {
    setEditingField(field);
    setTempData({ [field]: profileData[field] });
  };

  const handleEditSave = (field) => {
    if (updateUserProfile) {
      updateUserProfile({ [field]: tempData[field] });
    }
    setEditingField(null);
    setTempData({});
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempData({});
  };

  const menuSections = [
    {
      title: language === 'ar' ? 'الحساب والملف الشخصي' : 'Account & Profile',
      items: [
        {
          id: 'edit-profile',
          icon: Edit,
          title: language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile',
          description: language === 'ar' ? 'تحديث معلوماتك الشخصية' : 'Update your personal information',
          action: 'modal',
          component: 'editProfile'
        },
        {
          id: 'change-password',
          icon: Shield,
          title: language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
          description: language === 'ar' ? 'تحديث كلمة المرور لحسابك' : 'Update your account password',
          action: 'modal',
          component: 'changePassword'
        },
        {
          id: 'two-factor',
          icon: Shield,
          title: language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication',
          description: language === 'ar' ? 'أضف طبقة حماية إضافية' : 'Add extra security layer',
          action: 'modal',
          component: 'twoFactor',
          badge: language === 'ar' ? 'غير مفعل' : 'Inactive'
        }
      ]
    },
    {
      title: language === 'ar' ? 'الطلبات والتاريخ' : 'Orders & History',
      items: [
        {
          id: 'order-history',
          icon: Package,
          title: language === 'ar' ? 'سجل الطلبات' : 'Order History',
          description: language === 'ar' ? 'عرض جميع طلباتك السابقة' : 'View all your previous orders',
          action: () => navigateTo('order-history'),
          badge: profileData.orderCount
        },
        {
          id: 'prescriptions-history',
          icon: FileText,
          title: language === 'ar' ? 'سجل الوصفات' : 'Prescription History',
          description: language === 'ar' ? 'عرض جميع الوصفات المرفوعة' : 'View all uploaded prescriptions',
          action: () => navigateTo('prescription-history'),
          badge: 5
        },
        {
          id: 'favorites',
          icon: Heart,
          title: language === 'ar' ? 'قائمة المفضلة' : 'Favorites',
          description: language === 'ar' ? 'الأدوية والمنتجات المحفوظة' : 'Saved medicines and products',
          action: () => navigateTo('favorites'),
          badge: 12
        }
      ]
    },
    {
      title: language === 'ar' ? 'الدفع والتوصيل' : 'Payment & Delivery',
      items: [
        {
          id: 'payment-methods',
          icon: CreditCard,
          title: language === 'ar' ? 'طرق الدفع' : 'Payment Methods',
          description: language === 'ar' ? 'إدارة بطاقاتك وطرق الدفع' : 'Manage your cards and payment methods',
          action: 'modal',
          component: 'paymentMethods'
        },
        {
          id: 'addresses',
          icon: MapPin,
          title: language === 'ar' ? 'عناوين التوصيل' : 'Delivery Addresses',
          description: language === 'ar' ? 'إدارة عناوينك المحفوظة' : 'Manage your saved addresses',
          action: 'modal',
          component: 'addresses',
          badge: 2
        },
        {
          id: 'preferred-pharmacies',
          icon: Users,
          title: language === 'ar' ? 'الصيدليات المفضلة' : 'Preferred Pharmacies',
          description: language === 'ar' ? 'اختر صيدلياتك المفضلة' : 'Choose your preferred pharmacies',
          action: 'modal',
          component: 'preferredPharmacies',
          badge: 3
        }
      ]
    },
    {
      title: language === 'ar' ? 'الإعدادات والتفضيلات' : 'Settings & Preferences',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          title: language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings',
          description: language === 'ar' ? 'تخصيص التنبيهات والإشعارات' : 'Customize alerts and notifications',
          action: 'modal',
          component: 'notifications'
        },
        {
          id: 'privacy',
          icon: Shield,
          title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
          description: language === 'ar' ? 'إعدادات الخصوصية والحماية' : 'Privacy and security settings',
          action: 'modal',
          component: 'privacy'
        }
      ]
    },
    {
      title: language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
      items: [
        {
          id: 'help',
          icon: HelpCircle,
          title: language === 'ar' ? 'مركز المساعدة' : 'Help Center',
          description: language === 'ar' ? 'الأسئلة الشائعة والمساعدة' : 'FAQ and help articles',
          action: () => navigateTo('help')
        },
        {
          id: 'contact',
          icon: Phone,
          title: language === 'ar' ? 'اتصل بنا' : 'Contact Us',
          description: language === 'ar' ? 'تواصل مع فريق الدعم' : 'Contact our support team',
          action: 'modal',
          component: 'contact'
        },
        {
          id: 'feedback',
          icon: Star,
          title: language === 'ar' ? 'التقييم والملاحظات' : 'Feedback & Rating',
          description: language === 'ar' ? 'قيم التطبيق واترك ملاحظاتك' : 'Rate the app and leave feedback',
          action: 'modal',
          component: 'feedback'
        }
      ]
    }
  ];

  const renderModal = (component) => {
    switch (component) {
      case 'editProfile':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                <Input 
                  value={tempData.name || profileData.name} 
                  onChange={(e) => setTempData({...tempData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input 
                  type="email"
                  value={tempData.email || profileData.email} 
                  onChange={(e) => setTempData({...tempData, email: e.target.value})}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                <Input 
                  value={tempData.phone || profileData.phone} 
                  onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'المدينة' : 'City'}</Label>
                <Select value={tempData.location || profileData.location} onValueChange={(value) => setTempData({...tempData, location: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الخرطوم">{language === 'ar' ? 'الخرطوم' : 'Khartoum'}</SelectItem>
                    <SelectItem value="أم درمان">{language === 'ar' ? 'أم درمان' : 'Omdurman'}</SelectItem>
                    <SelectItem value="بحري">{language === 'ar' ? 'بحري' : 'Bahri'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  if (updateUserProfile) updateUserProfile(tempData);
                  setTempData({});
                }}
                className="flex-1"
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setTempData({})}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        );

      case 'changePassword':
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</Label>
              <Input type="password" />
            </div>
            <div>
              <Label>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
              <Input type="password" />
            </div>
            <div>
              <Label>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
              <Input type="password" />
            </div>
            <Button className="w-full">
              {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </Button>
          </div>
        );

      case 'paymentMethods':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد طرق دفع محفوظة' : 'No saved payment methods'}
              </p>
            </div>
            <Button className="w-full">
              <CreditCard size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'إضافة طريقة دفع' : 'Add Payment Method'}
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'order_updates', titleAr: 'تحديثات الطلبات', titleEn: 'Order Updates' },
              { key: 'prescription_reminders', titleAr: 'تذكيرات الوصفات', titleEn: 'Prescription Reminders' },
              { key: 'offers', titleAr: 'العروض والخصومات', titleEn: 'Offers & Discounts' },
              { key: 'health_tips', titleAr: 'النصائح الصحية', titleEn: 'Health Tips' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? item.titleAr : item.titleEn}
                </span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'هذه الميزة قيد التطوير' : 'This feature is under development'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Compact Profile Header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-4 pb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-4 border-primary/20 shadow-md">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format" />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {language === 'ar' ? 'أم' : 'AM'}
              </AvatarFallback>
            </Avatar>
            <Button size="sm" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-md">
              <Camera size={12} />
            </Button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-primary mb-1">
              {language === 'ar' ? profileData.name : profileData.nameEn}
            </h2>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin size={12} className={getMargin('0', '1')} />
              <span>{language === 'ar' ? profileData.location : profileData.locationEn}</span>
            </div>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
              🏆 {language === 'ar' ? `عضو ${profileData.membershipLevel}` : `${profileData.membershipLevelEn} Member`}
            </Badge>
          </div>
        </div>

        {/* Compact Profile Stats */}
        <div className="grid grid-cols-2 gap-2">
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-3 bg-background/60 backdrop-blur-sm border-primary/10">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg bg-primary/10 ${stat.color}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold text-sm arabic-numbers">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* App Settings */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Settings size={16} className="text-primary" />
            {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
          </h3>

          <Card className="divide-y border-primary/10">
            {/* Language Settings */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Languages size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{language === 'ar' ? 'اللغة' : 'Language'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLanguageToggle}
                  className="hover:bg-primary/5 hover:border-primary/30 text-xs px-3 h-8"
                >
                  <Languages size={12} className={getMargin('0', '1')} />
                  {language === 'ar' ? 'EN' : 'عربي'}
                </Button>
              </div>
            </div>

            {/* Notifications Settings */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Bell size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'تنبيهات الطلبات والعروض' : 'Order alerts and offers'}
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
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Settings size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</p>
                    <p className="text-xs text-muted-foreground">
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

        {/* Interactive Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <User size={16} className="text-primary" />
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Dialog key={item.id}>
                    <DialogTrigger asChild>
                      <Card 
                        className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 border-primary/10 hover:border-primary/20 hover:bg-primary/5"
                        onClick={item.action === 'modal' ? undefined : item.action}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                              <Icon size={14} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge variant="outline" className="text-xs arabic-numbers">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight size={14} className="text-muted-foreground" />
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    {item.action === 'modal' && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.title}</DialogTitle>
                          <DialogDescription>
                            {item.description}
                          </DialogDescription>
                        </DialogHeader>
                        {renderModal(item.component)}
                      </DialogContent>
                    )}
                  </Dialog>
                );
              })}
            </div>
          </div>
        ))}

        {/* Centered Sign Out Button */}
        <div className="pt-4 pb-6">
          <div className="flex justify-center">
            <Button 
              variant="destructive" 
              size="lg"
              onClick={onSignOut}
              className="w-full max-w-xs bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 shadow-lg rounded-xl"
            >
              <LogOut size={16} className={getMargin('0', '2')} />
              <span className="font-semibold">{t('action.signOut')}</span>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {language === 'ar' ? 
              'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك' : 
              'You will need to sign in again to access your account'
            }
          </p>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p>{language === 'ar' ? 'صيدلية السودان' : 'Sudan Pharmacy'}</p>
          <p>{language === 'ar' ? 'إصدار 1.0.0' : 'Version 1.0.0'}</p>
        </div>
      </div>
    </div>
  );
}