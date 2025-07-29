import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ErrorBoundary from '../components/ErrorBoundary';
import { DeliveryProvider } from '../components/services/DeliveryService';
import { InventoryProvider } from '../components/services/InventoryService';
import LocalizationProvider, { useLocalization, useRTL } from '../components/services/LocalizationService';
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

// Import pharmacist portal components
import PharmacistAnalytics from '../components/pharmacist/PharmacistAnalytics';
import PharmacistConsultations from '../components/pharmacist/PharmacistConsultations';
import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';
import PharmacistDrugUpload from '../components/pharmacist/PharmacistDrugUpload';
import PharmacistInventory from '../components/pharmacist/PharmacistInventory';
import PharmacistOrders from '../components/pharmacist/PharmacistOrders';
import PharmacistPrescriptions from '../components/pharmacist/PharmacistPrescriptions';
import PharmacistProfile from '../components/pharmacist/PharmacistProfile';

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
  const { t, language, toggleLanguage } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<string>('onboarding');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Handle authentication
  const handleAuth = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserData(createUserData(type || 'patient'));
    setCurrentScreen(type === 'patient' ? 'home' : 'pharmacist-dashboard');
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
    setHistory(prev => [...prev, currentScreen]);
    if (screen === 'product-detail') {
      setSelectedProduct(data);
    } else if (screen === 'delivery-tracking') {
      setTrackingOrderId(data);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const lastScreen = newHistory.pop();
      if (lastScreen) setCurrentScreen(lastScreen);
      return newHistory;
    });
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
    { id: 'search', icon: 'search', label: language === 'ar' ? 'البحث' : 'Search' },
    { id: 'pharmacist-orders', icon: 'package', label: language === 'ar' ? 'الطلبات' : 'Orders' },
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
          return <SearchScreen navigateTo={navigateTo} addToCart={addToCart} goBack={goBack} />;
        case 'product-detail':
          return <ProductDetailScreen product={selectedProduct} addToCart={addToCart} navigateTo={navigateTo} goBack={goBack} />;
        case 'prescription':
          return <PrescriptionScreen navigateTo={navigateTo} goBack={goBack} />;
        case 'cart':
          return <CartScreen cartItems={cartItems} setCartItems={setCartItems} navigateTo={navigateTo} />;
        case 'consult':
          return <ConsultScreen navigateTo={navigateTo} goBack={goBack} />;
        case 'donations':
          return <DonationScreen navigateTo={navigateTo} userType={userType} userData={userData || {}} />;
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
      switch (currentScreen) {
        case 'pharmacist-dashboard':
          return <PharmacistDashboard navigateTo={navigateTo} userData={userData || {}} />;
        case 'search':
          return <SearchScreen navigateTo={navigateTo} addToCart={addToCart} goBack={goBack} />;
        case 'pharmacist-orders':
          return <PharmacistOrders navigateTo={navigateTo} userData={userData || {}} />;
        case 'pharmacist-inventory':
          return <PharmacistInventory navigateTo={navigateTo} userData={userData || {}} />;
        case 'pharmacist-drug-upload':
          return <PharmacistDrugUpload navigateTo={navigateTo} />;
        case 'pharmacist-prescriptions':
          return <PharmacistPrescriptions navigateTo={navigateTo} />;
        case 'pharmacist-consultations':
          return <PharmacistConsultations navigateTo={navigateTo} />;
        case 'pharmacist-analytics':
          return <PharmacistAnalytics navigateTo={navigateTo} userData={userData || {}} />;
        case 'donations':
          return <DonationScreen navigateTo={navigateTo} userType={userType} userData={userData || {}} />;
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
          return <PharmacistDashboard navigateTo={navigateTo} userData={userData || {}} />;
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
                            color={isActive ? '#007bff' : '#6b7280'} 
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
          <InventoryProvider>
            <DeliveryProvider>
        <AppContent />
            </DeliveryProvider>
          </InventoryProvider>
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
    color: '#007bff',
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