import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LogBox } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ErrorBoundary from '../components/ErrorBoundary';
import { DeliveryProvider } from '../components/services/DeliveryService';
import { InventoryProvider } from '../components/services/InventoryService';
import { LocalizationProvider, useLocalization, useRTL } from '../components/services/LocalizationService';
import { NotificationProvider } from '../components/services/NotificationService';

// Import patient portal components
import AddressManagement from '../components/AddressManagement';
import AuthScreen from '../components/AuthScreen';
import CartScreen from '../components/CartScreen';
import ConsultScreen from '../components/ConsultScreen';
import DeliveryTracking from '../components/DeliveryTracking';
import DonationScreen from '../components/DonationScreen';
import HomeScreen from '../components/HomeScreen';
import OnboardingScreen from '../components/OnboardingScreen';
import OrderHistoryScreen from '../components/OrderHistoryScreen';
import PrescriptionScreen from '../components/PrescriptionScreen';
import ProductDetailScreen from '../components/ProductDetailScreen';
import ProfileScreen from '../components/ProfileScreen';
import SearchScreen from '../components/SearchScreen';
import SplashScreen from '../components/SplashScreen';

// Import pharmacist portal components
import PharmacistAnalytics from '../components/pharmacist/PharmacistAnalytics';
import PharmacistConsultations from '../components/pharmacist/PharmacistConsultations';
import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';
import PharmacistDrugUpload from '../components/pharmacist/PharmacistDrugUpload';
import PharmacistInventory from '../components/pharmacist/PharmacistInventory';
import PharmacistOrders from '../components/pharmacist/PharmacistOrders';
import PharmacistPrescriptions from '../components/pharmacist/PharmacistPrescriptions';
import PharmacistProfile from '../components/pharmacist/PharmacistProfile';

// Suppress specific React Native warnings that are false positives
if (__DEV__) {
  LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);
}

// Enhanced user data management with pharmacy assignments
const createUserData = (userType: string, userName = null) => {
  const basePatientData = {
    id: 'user_001',
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
    type: 'patient'
  };

  const basePharmacistData = {
    id: 'pharm_001',
    name: 'د. فاطمة أحمد علي',
    nameEn: 'Dr. Fatima Ahmed Ali',
    phone: '+249 987 654 321',
    email: 'dr.fatima@pharmacy.sd',
    location: 'أم درمان',
    locationEn: 'Omdurman',

    // Enhanced pharmacy assignment
    pharmacy: {
      id: 'pharmacy_001',
      name: 'صيدلية النيل الأزرق',
      nameEn: 'Blue Nile Pharmacy',
      address: 'أم درمان - شارع الثورة',
      addressEn: 'Omdurman - Al-Thawra Street',
      licenseNumber: 'PHM-OMD-2019-0543',
      establishedYear: '2019',
      phone: '+249 155 123 456',
      coordinates: { lat: 15.6440, lng: 32.4772 },
      operatingHours: {
        weekday: '8:00 AM - 10:00 PM',
        weekend: '9:00 AM - 9:00 PM'
      },
      services: ['أدوية عامة', 'أدوية مزمنة', 'مستلزمات طبية', 'استشارات'],
      servicesEn: ['General Medicine', 'Chronic Disease Medicine', 'Medical Supplies', 'Consultations']
    },

    // Pharmacist personal info
    licenseNumber: 'PH-2019-0543',
    experience: '8 سنوات',
    experienceEn: '8 Years',
    specialization: 'الصيدلة السريرية',
    specializationEn: 'Clinical Pharmacy',
    joinDate: '2019',

    // Performance metrics (pharmacy-scoped)
    totalOrders: 1847,
    totalCustomers: 423,
    rating: 4.9,
    monthlyRevenue: 125000,
    inventoryValue: 450000,

    // Role and permissions
    role: 'senior_pharmacist',
    permissions: ['inventory_management', 'order_processing', 'consultation', 'donation_management', 'analytics'],

    type: 'pharmacist'
  };

  const userData = userType === 'patient' ? basePatientData : basePharmacistData;

  // If a custom name is provided, update both Arabic and English names
  if (userName) {
    userData.name = userName;
    userData.nameEn = userName;
  }

  return userData;
};

type UserType = 'patient' | 'pharmacist' | null;
type PatientData = ReturnType<typeof createUserData>;
type PharmacistData = ReturnType<typeof createUserData>;
type UserData = PatientData | PharmacistData | null;

function AppContent() {
  const { language, toggleLanguage } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [navigationData, setNavigationData] = useState<any>(null);

  // Handle authentication
  const handleAuth = (type: UserType) => {
    try {
      console.log('handleAuth called with type:', type);
      setIsAuthenticated(true);
      setUserType(type);
      setUserData(createUserData(type || 'patient'));
      const targetScreen = type === 'patient' ? 'home' : 'pharmacist-dashboard';
      console.log('Setting screen to:', targetScreen);
      setCurrentScreen(targetScreen);
    } catch (error) {
      console.error('Error in handleAuth:', error);
    }
  };

  // Handle profile updates
  const updateUserProfile = (updates: Partial<UserData>) => {
    setUserData(prev => (prev ? { ...prev, ...updates } : prev));
  };

  // Enhanced add to cart functionality with better feedback
  const addToCart = (product: any, quantity: number = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product for cart:', product);
      return;
    }
    
    setCartItems(prev => {
      const existing = prev.find((item: any) => item.id === product.id);
      if (existing) {
        return prev.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Handle sign out (will be called from Profile pages)
  const handleSignOut = (): void => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
    setCurrentScreen('auth');
    setCartItems([]);
    setSelectedProduct(null);
    setTrackingOrderId(null);
  };

  // Handle language toggle (will be called from Profile pages)
  const handleLanguageToggle = (): void => {
    toggleLanguage();
  };

  // Navigation for different screens
  const navigateTo = (screen: string, data: any = null): void => {
    setNavigationData(data);
    if (screen === 'product-detail') {
      setSelectedProduct(data);
    } else if (screen === 'delivery-tracking') {
      setTrackingOrderId(data);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    // Simple back navigation - could be enhanced with proper history stack
    if (userType === 'patient') {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('pharmacist-dashboard');
    }
  };

  // Skip onboarding
  const skipOnboarding = (): void => {
    setCurrentScreen('auth');
  };

  // Updated patient navigation tabs - Search centered as primary feature
  type TabType = {
    id: string;
    icon: string;
    label: string;
    badge?: number;
  };
  const patientTabs: TabType[] = [
    { id: 'home', icon: 'home', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { id: 'consult', icon: 'message-circle', label: language === 'ar' ? 'استشارة' : 'Consult' },
    { id: 'search', icon: 'search', label: language === 'ar' ? 'البحث' : 'Search' },
    { id: 'cart', icon: 'shopping-cart', label: language === 'ar' ? 'السلة' : 'Cart', badge: cartItems.length },
    { id: 'profile', icon: 'user', label: language === 'ar' ? 'الملف' : 'Profile' },
  ];
  const pharmacistTabs: TabType[] = [
    { id: 'pharmacist-dashboard', icon: 'home', label: language === 'ar' ? 'الرئيسية' : 'Dashboard' },
    { id: 'pharmacist-consultations', icon: 'message-circle', label: language === 'ar' ? 'استشارات' : 'Consult' },
    { id: 'pharmacist-inventory', icon: 'package', label: language === 'ar' ? 'المخزون' : 'Inventory' },
    { id: 'pharmacist-orders', icon: 'shopping-cart', label: language === 'ar' ? 'الطلبات' : 'Orders' },
    { id: 'pharmacist-profile', icon: 'user', label: language === 'ar' ? 'الملف' : 'Profile' },
  ];

  const currentTabs: TabType[] = userType === 'patient' ? patientTabs : pharmacistTabs;

  // Function to map emoji names to Material Icons
  const getIconName = (emojiName: string): string => {
    const iconMap: { [key: string]: string } = {
      'home': 'home',
      'message-circle': 'chat',
      'search': 'search',
      'shopping-cart': 'shopping-cart',
      'user': 'person',
      'package': 'inventory',
      'pharmacy': 'local-pharmacy',
    };
    return iconMap[emojiName] || 'help-outline';
  };

  // Render current screen
  const renderScreen = () => {
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'splash':
          return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
        case 'onboarding':
          return <OnboardingScreen onNext={() => setCurrentScreen('auth')} onSkip={skipOnboarding} />;
        case 'auth':
          return <AuthScreen onAuth={handleAuth} onLanguageToggle={handleLanguageToggle} currentLanguage={language} />;
        default:
          return <AuthScreen onAuth={handleAuth} onLanguageToggle={handleLanguageToggle} currentLanguage={language} />;
      }
    }

    // Patient portal screens
    if (userType === 'patient') {
      switch (currentScreen) {
        case 'home':
          return <HomeScreen navigateTo={navigateTo} userData={userData || {}} goBack={goBack} isMain={true} addToCart={addToCart} />;
        case 'search':
          return <SearchScreen navigateTo={navigateTo} addToCart={addToCart} goBack={goBack} navigationData={navigationData} />;
        case 'product-detail':
          return <ProductDetailScreen product={selectedProduct} addToCart={addToCart} navigateTo={navigateTo} goBack={goBack} />;
        case 'prescription':
          return <PrescriptionScreen navigateTo={navigateTo} goBack={goBack} />;
        case 'cart':
          return <CartScreen cartItems={cartItems} setCartItems={setCartItems} navigateTo={navigateTo} goBack={goBack} />;
        case 'consult':
          return <ConsultScreen navigateTo={navigateTo} goBack={goBack} />;
        case 'donations':
          return <DonationScreen navigateTo={navigateTo} goBack={goBack} userType={userType} userData={userData || {}} />;
        case 'profile':
          return <ProfileScreen 
            navigateTo={navigateTo} 
            onSignOut={handleSignOut}
            onLanguageToggle={handleLanguageToggle}
            currentLanguage={language}
            userData={userData || {}}
            updateUserProfile={updateUserProfile}
          />;
        case 'order-history':
          return <OrderHistoryScreen navigateTo={navigateTo} />;
        case 'address-management':
          return <AddressManagement navigateTo={navigateTo} />;
        case 'delivery-tracking':
          return <DeliveryTracking orderId={trackingOrderId || ''} navigateTo={navigateTo} />;
        default:
          return <HomeScreen navigateTo={navigateTo} userData={userData || {}} addToCart={addToCart} />;
      }
    }

    // Pharmacist portal screens
    if (userType === 'pharmacist') {
      try {
        console.log('Rendering pharmacist screen:', currentScreen);
        switch (currentScreen) {
          case 'pharmacist-dashboard':
            return <PharmacistDashboard navigateTo={navigateTo} userData={userData || {}} />;
          case 'pharmacist-inventory':
            return <PharmacistInventory navigateTo={navigateTo} userData={userData || {}} />;
          case 'pharmacist-orders':
            return <PharmacistOrders navigateTo={navigateTo} userData={userData || {}} />;
          case 'pharmacist-drug-upload':
            return <PharmacistDrugUpload navigateTo={navigateTo} />;
          case 'pharmacist-prescriptions':
            return <PharmacistPrescriptions navigateTo={navigateTo} goBack={goBack} />;
          case 'pharmacist-consultations':
            return <PharmacistConsultations navigateTo={navigateTo} goBack={goBack} />;
          case 'pharmacist-analytics':
            return <PharmacistAnalytics navigateTo={navigateTo} goBack={goBack} userData={userData || {}} />;
          case 'donations':
            return <DonationScreen navigateTo={navigateTo} goBack={goBack} userType={userType} userData={userData || {}} />;
          case 'pharmacist-profile':
            return <PharmacistProfile 
              navigateTo={navigateTo}
              onSignOut={handleSignOut}
              onLanguageToggle={handleLanguageToggle}
              currentLanguage={language}
              userData={userData || {}}
              updateUserProfile={updateUserProfile}
            />;
          case 'address-management':
            return <AddressManagement navigateTo={navigateTo} />;
          default:
            console.log('Default pharmacist screen, redirecting to dashboard');
            return <PharmacistDashboard navigateTo={navigateTo} userData={userData || {}} />;
        }
      } catch (error) {
        console.error('Error rendering pharmacist screen:', error);
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
              حدث خطأ في تحميل الشاشة. يرجى المحاولة مرة أخرى.
            </Text>
            <TouchableOpacity 
              style={{ marginTop: 20, padding: 10, backgroundColor: '#49C5B8', borderRadius: 8 }}
              onPress={() => setCurrentScreen('pharmacist-dashboard')}
            >
              <Text style={{ color: 'white' }}>العودة للرئيسية</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    return <HomeScreen navigateTo={navigateTo} userData={userData} addToCart={addToCart} />;
  };

  return (
    <NotificationProvider userType={userType}>
      <InventoryProvider>
        <DeliveryProvider>
          <View style={[styles.container, isRTL && styles.rtl]}>
            <View style={styles.content}>
              {renderScreen()}
            </View>
            {isAuthenticated && (
              <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}> 
                <View style={[styles.tabRow, isRTL && styles.tabRowRtl]}>
                  {currentTabs.map((tab, index) => {
                    const isActive = currentScreen === tab.id;
                    return (
                      <TouchableOpacity
                        key={tab.id}
                        style={[
                          styles.tabButton,
                          isActive && styles.tabButtonActive,
                        ]}
                        onPress={() => navigateTo(tab.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.tabIconContainer}>
                          <Icon 
                            name={getIconName(tab.icon)} 
                            size={22} 
                            color={isActive ? '#49C5B8' : '#6b7280'} 
                          />
                        {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{tab.badge}</Text>
                          </View>
                        )}
                        </View>
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                          {tab.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
            {/* Toast notifications: use a React Native toast library here if needed */}
          </View>
        </DeliveryProvider>
      </InventoryProvider>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <LocalizationProvider defaultLanguage="ar">
          <AppContent />
        </LocalizationProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  rtl: {
    // Don't reverse the main container direction
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabRowRtl: {
    flexDirection: 'row-reverse',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
    minHeight: 56,
  },
  tabButtonActive: {
    backgroundColor: '#f0f9ff',
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#49C5B8',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});