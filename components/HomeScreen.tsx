import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, ShoppingBag, Calendar, Heart, Upload, MessageCircle, Star, TrendingUp, Package, Users, Clock, Navigation, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useLocalization, useRTL } from './services/LocalizationService';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function HomeScreen({ navigateTo, userData }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Set dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    const now = new Date();
    
    let greetingText = '';
    if (hour < 12) {
      greetingText = language === 'ar' ? 'صباح الخير' : 'Good Morning';
    } else if (hour < 17) {
      greetingText = language === 'ar' ? 'مساء الخير' : 'Good Afternoon';
    } else {
      greetingText = language === 'ar' ? 'مساء الخير' : 'Good Evening';
    }
    
    setGreeting(greetingText);
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }));
  }, [language]);

  // Compact quick actions with proper text boundaries and black titles
  const quickActions = [
    {
      id: 'prescription',
      title: language === 'ar' ? 'رفع وصفة' : 'Upload Prescription',
      subtitle: language === 'ar' ? 'ارفع صورة الوصفة' : 'Upload prescription image',
      icon: Upload,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'donations',
      title: language === 'ar' ? 'تبرعات' : 'Donations',
      subtitle: language === 'ar' ? 'ساعد المحتاجين' : 'Help those in need',
      icon: Heart,
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'consult',
      title: language === 'ar' ? 'استشارة فورية' : 'Quick Consultation',
      subtitle: language === 'ar' ? 'تحدث مع صيدلي' : 'Chat with pharmacist',
      icon: MessageCircle,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'order-history',
      title: language === 'ar' ? 'الطلبات السابقة' : 'Order History',
      subtitle: language === 'ar' ? 'تصفح طلباتك' : 'Browse your orders',
      icon: Package,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  // Featured medicines with compact design
  const featuredMedicines = [
    {
      id: 1,
      name: 'باراسيتامول 500 مجم',
      nameEn: 'Paracetamol 500mg',
      brand: 'سودانية للأدوية',
      brandEn: 'Sudanese Pharmaceutical',
      price: 15,
      originalPrice: 18,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
      rating: 4.5,
      discount: 17,
      isPopular: true
    },
    {
      id: 2,
      name: 'فيتامين د للأطفال',
      nameEn: 'Children Vitamin D',
      brand: 'النيل الأزرق',
      brandEn: 'Blue Nile',
      price: 35,
      originalPrice: 40,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
      rating: 4.8,
      discount: 12,
      isPopular: false
    },
    {
      id: 3,
      name: 'أنسولين سريع المفعول',
      nameEn: 'Fast-Acting Insulin',
      brand: 'دلتا فارما',
      brandEn: 'Delta Pharma',
      price: 120,
      originalPrice: 135,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=200&h=200&fit=crop',
      rating: 4.9,
      discount: 11,
      isPopular: true
    }
  ];

  // Nearby pharmacies
  const nearbyPharmacies = [
    {
      id: 1,
      name: 'صيدلية النيل الأزرق',
      nameEn: 'Blue Nile Pharmacy',
      distance: '0.8 كم',
      distanceEn: '0.8 km',
      rating: 4.8,
      deliveryTime: '25-35 دقيقة',
      deliveryTimeEn: '25-35 min',
      isOpen: true,
      specialOffer: language === 'ar' ? 'توصيل مجاني' : 'Free Delivery'
    },
    {
      id: 2,
      name: 'صيدلية الصحة المتكاملة',
      nameEn: 'Integrated Health Pharmacy',
      distance: '1.2 كم',
      distanceEn: '1.2 km',
      rating: 4.9,
      deliveryTime: '30-40 دقيقة',
      deliveryTimeEn: '30-40 min',
      isOpen: true,
      specialOffer: language === 'ar' ? 'خصم 15%' : '15% Off'
    }
  ];

  const handleQuickAction = (actionId) => {
    navigateTo(actionId);
  };

  const handleMedicineClick = (medicine) => {
    navigateTo('product-detail', medicine);
  };

  const handlePharmacyClick = (pharmacy) => {
    navigateTo('search');
  };

  return (
    <div className="h-full overflow-y-auto bg-background clean-pattern">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-base font-semibold text-gray-900 mb-1">
                {greeting}, {userData?.name || (language === 'ar' ? 'أحمد' : 'Ahmed')}
              </h1>
              <p className="text-xs text-gray-600 flex items-center">
                <MapPin size={12} className={`${getMargin('0', '1')} text-gray-400`} />
                {userData?.location || (language === 'ar' ? 'الخرطوم' : 'Khartoum')}
                <span className="mx-2 text-gray-400">•</span>
                <Clock size={12} className="text-gray-400 mr-1" />
                {currentTime}
              </p>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => navigateTo('profile')}
              >
                <Bell size={16} className="text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>

          {/* Compact Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن دواء أو صيدلية...' : 'Search for medicine or pharmacy...'}
              className="pl-9 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white rounded-lg text-sm"
              onClick={() => navigateTo('search')}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Compact Quick Actions with fixed text boundaries and black titles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'الخدمات السريعة' : 'Quick Actions'}
            </h2>
            <Sparkles size={14} className="text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
                  onClick={() => handleQuickAction(action.id)}
                >
                  <CardContent className="p-3">
                    {/* Compact layout with proper text boundaries */}
                    <div className="text-center space-y-2">
                      {/* Icon container - compact size */}
                      <div className="flex justify-center mb-2">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon size={20} className={action.iconColor} />
                        </div>
                      </div>
                      
                      {/* Text with proper boundaries - BLACK titles as requested */}
                      <div className="space-y-1 px-1">
                        <h3 className="text-gray-900 font-semibold text-xs leading-tight">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-tight">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Compact Statistics Cards */}
        {userData && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white border border-gray-100">
              <CardContent className="p-3 text-center">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag size={14} className="text-blue-600" />
                </div>
                <div className="font-bold text-sm text-gray-900 arabic-numbers mb-0.5">
                  {userData.orderCount || 23}
                </div>
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'طلب' : 'Orders'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100">
              <CardContent className="p-3 text-center">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={14} className="text-green-600" />
                </div>
                <div className="font-bold text-sm text-gray-900 arabic-numbers mb-0.5">
                  {userData.savedMoney || 145}
                </div>
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'ج.س موفرة' : 'SDG Saved'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100">
              <CardContent className="p-3 text-center">
                <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star size={14} className="text-yellow-600" />
                </div>
                <div className="font-bold text-sm text-gray-900 arabic-numbers mb-0.5">
                  {userData.points || 1250}
                </div>
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'نقطة' : 'Points'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compact Featured Medicines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'أدوية مميزة' : 'Featured Medicines'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('search')}
              className="text-primary hover:text-primary/80 text-xs px-2"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {featuredMedicines.map((medicine) => (
              <Card
                key={medicine.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                onClick={() => handleMedicineClick(medicine)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={medicine.image}
                        alt={medicine.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {medicine.isPopular && (
                              <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0.5">
                                {language === 'ar' ? 'الأكثر طلباً' : 'Popular'}
                              </Badge>
                            )}
                            {medicine.discount > 0 && (
                              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                                {medicine.discount}% {language === 'ar' ? 'خصم' : 'OFF'}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {language === 'ar' ? medicine.name : medicine.nameEn}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {language === 'ar' ? medicine.brand : medicine.brandEn}
                          </p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <span className="font-bold text-primary arabic-numbers text-xs">
                                {medicine.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                              </span>
                              {medicine.originalPrice > medicine.price && (
                                <span className="text-xs text-gray-500 line-through arabic-numbers">
                                  {medicine.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-0.5">
                              <Star size={10} className="text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 arabic-numbers">{medicine.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-primary text-white px-2 py-1 flex-shrink-0 ml-3">
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compact Nearby Pharmacies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'الصيدليات القريبة' : 'Nearby Pharmacies'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('search')}
              className="text-primary hover:text-primary/80 text-xs px-2"
            >
              {language === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
              <Navigation size={12} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {nearbyPharmacies.map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                onClick={() => handlePharmacyClick(pharmacy)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 text-xs">
                          {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                        </h3>
                        <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                          {pharmacy.specialOffer}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <MapPin size={10} className="text-gray-400 mr-1" />
                          <span className="arabic-numbers">
                            {language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={10} className="text-gray-400 mr-1" />
                          <span>
                            {language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star size={10} className="text-yellow-400 fill-current mr-1" />
                          <span className="arabic-numbers">{pharmacy.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        pharmacy.isOpen ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <ChevronRight size={12} className="text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}