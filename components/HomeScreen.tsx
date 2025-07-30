
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

// Emoji icon replacements for lucide-react icons
type HomeScreenProps = { navigateTo: (screen: string, data?: any) => void; userData?: any; goBack?: () => void; isMain?: boolean; addToCart?: (product: any, quantity?: number) => void };
export default function HomeScreen({ navigateTo, userData, goBack, isMain, addToCart }: HomeScreenProps) {
  // Helper function to render icons
  const renderIcon = (iconName: string, size: number = 16, color: string = '#6b7280') => {
    return <Icon name={icons[iconName]} size={size} color={color} />;
  };

  const icons = {
    Search: 'search',
    Bell: 'notifications',
    MapPin: 'location-on',
    ShoppingBag: 'shopping-bag',
    Calendar: 'calendar-today',
    Heart: 'favorite',
    Upload: 'cloud-upload',
    MessageCircle: 'chat',
    Star: 'star',
    TrendingUp: 'trending-up',
    Package: 'inventory',
    Users: 'people',
    Clock: 'schedule',
    Navigation: 'navigation',
    ChevronRight: 'chevron-right',
    Plus: 'add',
    Sparkles: 'auto-awesome',
  };

  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

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

  const quickActions = [
    {
      id: 'prescription',
      title: language === 'ar' ? 'رفع وصفة' : 'Upload Prescription',
      subtitle: language === 'ar' ? 'ارفع صورة الوصفة' : 'Upload prescription image',
      icon: 'Upload',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'donations',
      title: language === 'ar' ? 'تبرعات' : 'Donations',
      subtitle: language === 'ar' ? 'ساعد المحتاجين' : 'Help those in need',
      icon: 'Heart',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'consult',
      title: language === 'ar' ? 'استشارة فورية' : 'Quick Consultation',
      subtitle: language === 'ar' ? 'تحدث مع صيدلي' : 'Chat with pharmacist',
      icon: 'MessageCircle',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'order-history',
      title: language === 'ar' ? 'الطلبات السابقة' : 'Order History',
      subtitle: language === 'ar' ? 'تصفح طلباتك' : 'Browse your orders',
      icon: 'Package',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

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

  const handleQuickAction = (actionId: string) => {
    navigateTo(actionId);
  };

  const handleMedicineClick = (medicine: any) => {
    navigateTo('product-detail', medicine);
  };

  const handlePharmacyClick = (pharmacy: any) => {
    navigateTo('search');
  };

  const handleAddToCart = (medicine: any, event?: any) => {
    // Prevent event propagation to avoid triggering the card's onPress
    if (event) {
      event.stopPropagation();
    }
    
    if (addToCart) {
      addToCart(medicine, 1);
      Alert.alert(
        language === 'ar' ? 'تمت الإضافة' : 'Added to Cart',
        language === 'ar' ? `تم إضافة ${medicine.name} إلى السلة` : `${medicine.nameEn} has been added to cart`,
        [{ text: language === 'ar' ? 'حسناً' : 'OK' }]
      );
    } else {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'لا يمكن إضافة الدواء إلى السلة' : 'Cannot add medicine to cart'
      );
    }
  };

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginHorizontal: 2,
  },
  dot: {
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  bellButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginLeft: 8,
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 18,
    color: '#9ca3af',
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  sectionAction: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionsGridRtl: {
    flexDirection: 'row-reverse',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionIcon: {
    fontSize: 22,
  },
  quickActionTextContainer: {
    alignItems: 'center',
  },
  quickActionTitle: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    color: '#6b7280',
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    padding: 12,
    elevation: 1,
  },
  statsIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statsIconText: {
    fontSize: 16,
  },
  statsValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  featuredGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  featuredCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },
  featuredInfo: {
    flex: 1,
    minWidth: 0,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  featuredBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badgePopular: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  badgeDiscount: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
    fontSize: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featuredTitle: {
    fontWeight: '500',
    color: '#111827',
    fontSize: 12,
    marginBottom: 2,
  },
  featuredBrand: {
    color: '#6b7280',
    fontSize: 11,
    marginBottom: 2,
  },
  featuredPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredPrice: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 12,
    marginRight: 4,
  },
  featuredOriginalPrice: {
    color: '#9ca3af',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  featuredRating: {
    color: '#facc15',
    fontSize: 11,
    marginLeft: 4,
  },
  featuredAddButton: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  featuredAddButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  nearbyList: {
    flexDirection: 'column',
    gap: 12,
  },
  nearbyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  nearbyCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nearbyInfo: {
    flex: 1,
    minWidth: 0,
  },
  nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  nearbyTitle: {
    fontWeight: '500',
    color: '#111827',
    fontSize: 12,
    marginRight: 4,
  },
  badgeNearby: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
    fontSize: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  nearbyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  nearbyDetailText: {
    color: '#6b7280',
    fontSize: 11,
    marginRight: 4,
  },
  nearbyStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  icon: {
    fontSize: 13,
    marginRight: 2,
  },
  });

  // Render back button if goBack is provided and not the main home page
  const renderBackButton = () => (goBack && !isMain) ? (
    <TouchableOpacity onPress={goBack} style={{ padding: 8, marginRight: 8 }}>
      <Text style={{ fontSize: 20 }}>{language === 'ar' ? '←' : '←'}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {renderBackButton()}
        <View style={styles.headerInner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {greeting}, {userData?.name || (language === 'ar' ? 'أحمد' : 'Ahmed')}
            </Text>
            <View style={styles.locationRow}>
              {renderIcon('MapPin')}
              <Text style={styles.locationText}>{userData?.location || (language === 'ar' ? 'الخرطوم' : 'Khartoum')}</Text>
              <Text style={styles.dot}>•</Text>
              {renderIcon('Clock')}
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => navigateTo('profile')}>
            {renderIcon('Bell', 20)}
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
        {/* Compact Search Bar */}
        <View style={styles.searchBarContainer}>
          {renderIcon('Search', 20)}
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'ar' ? 'ابحث عن دواء أو صيدلية...' : 'Search for medicine or pharmacy...'}
            placeholderTextColor="#9ca3af"
            onFocus={() => navigateTo('search')}
            editable={false}
          />
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>

      <View style={styles.body}>
        {/* Compact Quick Actions with fixed text boundaries and black titles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'الخدمات السريعة' : 'Quick Actions'}</Text>
            {renderIcon('Sparkles')}
          </View>
          <View style={[styles.quickActionsGrid, isRTL && styles.quickActionsGridRtl]}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={styles.quickActionIconContainer}>
                  {renderIcon(action.icon, 24, '#007bff')}
                </View>
                <View style={styles.quickActionTextContainer}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Compact Statistics Cards */}
        {userData && (
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
              <View style={[styles.statsIcon, { backgroundColor: '#dbeafe' }]}> 
                {renderIcon('ShoppingBag', 20, '#1e40af')}
              </View>
              <Text style={styles.statsValue}>{userData.orderCount || 23}</Text>
              <Text style={styles.statsLabel}>{language === 'ar' ? 'طلب' : 'Orders'}</Text>
            </View>
            <View style={styles.statsCard}>
              <View style={[styles.statsIcon, { backgroundColor: '#bbf7d0' }]}> 
                {renderIcon('TrendingUp', 20, '#166534')}
              </View>
              <Text style={styles.statsValue}>{userData.savedMoney || 145}</Text>
              <Text style={styles.statsLabel}>{language === 'ar' ? 'ج.س موفرة' : 'SDG Saved'}</Text>
            </View>
            <View style={styles.statsCard}>
              <View style={[styles.statsIcon, { backgroundColor: '#fef9c3' }]}> 
                {renderIcon('Star', 20, '#ca8a04')}
              </View>
              <Text style={styles.statsValue}>{userData.points || 1250}</Text>
              <Text style={styles.statsLabel}>{language === 'ar' ? 'نقطة' : 'Points'}</Text>
            </View>
          </View>
        )}

        {/* Compact Featured Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'أدوية مميزة' : 'Featured Medicines'}</Text>
            <TouchableOpacity onPress={() => navigateTo('search', { viewMode: 'list', showAllMedicines: true })}>
              <Text style={styles.sectionAction}>{language === 'ar' ? 'عرض الكل' : 'View All'} {renderIcon('ChevronRight', 16)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredGrid}>
            {featuredMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                style={styles.featuredCard}
                onPress={() => handleMedicineClick(medicine)}
              >
                <View style={styles.featuredCardInner}>
                  <Image source={{ uri: medicine.image }} style={styles.featuredImage} />
                  <View style={styles.featuredInfo}>
                    <View style={styles.featuredHeader}>
                      <View style={styles.featuredBadges}>
                        {medicine.isPopular && (
                          <Text style={styles.badgePopular}>{language === 'ar' ? 'الأكثر طلباً' : 'Popular'}</Text>
                        )}
                        {medicine.discount > 0 && (
                          <Text style={styles.badgeDiscount}>{medicine.discount}% {language === 'ar' ? 'خصم' : 'OFF'}</Text>
                        )}
                      </View>
                      <TouchableOpacity 
                        style={styles.featuredAddButton}
                        onPress={(event) => handleAddToCart(medicine, event)}
                      >
                        {renderIcon('Plus', 16, '#fff')}
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.featuredTitle}>{language === 'ar' ? medicine.name : medicine.nameEn}</Text>
                    <Text style={styles.featuredBrand}>{language === 'ar' ? medicine.brand : medicine.brandEn}</Text>
                    <View style={styles.featuredPriceRow}>
                      <Text style={styles.featuredPrice}>{medicine.price} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
                      {medicine.originalPrice > medicine.price && (
                        <Text style={styles.featuredOriginalPrice}>{medicine.originalPrice}</Text>
                      )}
                      <Text style={styles.featuredRating}>{renderIcon('Star', 14, '#fbbf24')} {medicine.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Compact Nearby Pharmacies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'الصيدليات القريبة' : 'Nearby Pharmacies'}</Text>
            <TouchableOpacity onPress={() => navigateTo('search')}>
              <Text style={styles.sectionAction}>{language === 'ar' ? 'عرض على الخريطة' : 'View on Map'} {renderIcon('Navigation', 16)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.nearbyList}>
            {nearbyPharmacies.map((pharmacy) => (
              <TouchableOpacity
                key={pharmacy.id}
                style={styles.nearbyCard}
                onPress={() => handlePharmacyClick(pharmacy)}
              >
                <View style={styles.nearbyCardInner}>
                  <View style={styles.nearbyInfo}>
                    <View style={styles.nearbyHeader}>
                      <Text style={styles.nearbyTitle}>{language === 'ar' ? pharmacy.name : pharmacy.nameEn}</Text>
                      <Text style={styles.badgeNearby}>{pharmacy.specialOffer}</Text>
                    </View>
                    <View style={styles.nearbyDetails}>
                      {renderIcon('MapPin')}
                      <Text style={styles.nearbyDetailText}>{language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}</Text>
                      {renderIcon('Clock')}
                      <Text style={styles.nearbyDetailText}>{language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}</Text>
                      {renderIcon('Star')}
                      <Text style={styles.nearbyDetailText}>{pharmacy.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.nearbyStatusRow}>
                    <View style={[styles.nearbyStatusDot, { backgroundColor: pharmacy.isOpen ? '#22c55e' : '#ef4444' }]} />
                    {renderIcon('ChevronRight')}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}