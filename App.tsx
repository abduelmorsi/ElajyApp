import './styles/globals.css';
import React, { useState } from 'react';

import { Home, Search, ShoppingCart, MessageCircle, User, Upload, History, Settings, Package, Users, BarChart3, FileText, Clock, Languages, LogOut, MapPin, Heart } from 'lucide-react';

import { Button } from './components/ui/button';

import { Badge } from './components/ui/badge';

import { Toaster } from './components/ui/sonner';

import { NotificationProvider } from './components/services/NotificationService';

import { InventoryProvider } from './components/services/InventoryService';

import { DeliveryProvider } from './components/services/DeliveryService';

import { LocalizationProvider, useLocalization, useRTL } from './components/services/LocalizationService';

import ErrorBoundary from './components/ErrorBoundary';

import { toast } from 'sonner';



// Import patient portal components

import OnboardingScreen from './components/OnboardingScreen';

import AuthScreen from './components/AuthScreen';

import HomeScreen from './components/HomeScreen';

import SearchScreen from './components/SearchScreen';

import ProductDetailScreen from './components/ProductDetailScreen';

import PrescriptionScreen from './components/PrescriptionScreen';

import CartScreen from './components/CartScreen';

import ConsultScreen from './components/ConsultScreen';

import ProfileScreen from './components/ProfileScreen';

import OrderHistoryScreen from './components/OrderHistoryScreen';

import AddressManagement from './components/AddressManagement';

import DeliveryTracking from './components/DeliveryTracking';

import DonationScreen from './components/DonationScreen';



// Import pharmacist portal components

import PharmacistDashboard from './components/pharmacist/PharmacistDashboard';

import PharmacistInventory from './components/pharmacist/PharmacistInventory';

import PharmacistOrders from './components/pharmacist/PharmacistOrders';

import PharmacistPrescriptions from './components/pharmacist/PharmacistPrescriptions';

import PharmacistConsultations from './components/pharmacist/PharmacistConsultations';

import PharmacistAnalytics from './components/pharmacist/PharmacistAnalytics';

import PharmacistProfile from './components/pharmacist/PharmacistProfile';

import PharmacistDrugUpload from './components/pharmacist/PharmacistDrugUpload';



// Enhanced user data management with pharmacy assignments

const createUserData = (userType, userName = null) => {

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



function AppContent() {

  const { t, language, toggleLanguage } = useLocalization();

  const { isRTL, getMargin } = useRTL();

  const [currentScreen, setCurrentScreen] = useState('onboarding');

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userType, setUserType] = useState(null); // 'patient' or 'pharmacist'

  const [userData, setUserData] = useState(null);

  const [cartItems, setCartItems] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [trackingOrderId, setTrackingOrderId] = useState(null);



  // Handle authentication

  const handleAuth = (type) => {

    setIsAuthenticated(true);

    setUserType(type);

    setUserData(createUserData(type));

    setCurrentScreen(type === 'patient' ? 'home' : 'pharmacist-dashboard');

  };



  // Handle profile updates

  const updateUserProfile = (updates) => {

    setUserData(prev => ({ ...prev, ...updates }));

  };



  // Enhanced add to cart functionality with better feedback

  const addToCart = (product, quantity = 1) => {

    if (!product || !product.id) {

      console.error('Invalid product for cart:', product);

      return;

    }



    setCartItems(prev => {

      const existing = prev.find(item => item.id === product.id);

      if (existing) {

        return prev.map(item => 

          item.id === product.id 

            ? { ...item, quantity: item.quantity + quantity }

            : item

        );

      }

      return [...prev, { ...product, quantity }];

    });

    

    // Enhanced toast with better feedback

    toast.success(

      language === 'ar' ? `تم إضافة ${product.name || product.nameEn} للسلة` : `${product.nameEn || product.name} added to cart`,

      {

        description: language === 'ar' ? `الكمية: ${quantity}` : `Quantity: ${quantity}`,

        action: {

          label: language === 'ar' ? 'إخفاء' : 'Dismiss',

          onClick: () => toast.dismiss(),

        },

        duration: 3000,

      }

    );

  };



  // Handle sign out (will be called from Profile pages)

  const handleSignOut = () => {

    setIsAuthenticated(false);

    setUserType(null);

    setUserData(null);

    setCurrentScreen('auth');

    setCartItems([]);

    setSelectedProduct(null);

    setTrackingOrderId(null);

    toast.success(

      language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Signed out successfully',

      {

        action: {

          label: language === 'ar' ? 'إخفاء' : 'Dismiss',

          onClick: () => toast.dismiss(),

        },

        duration: 3000,

      }

    );

  };



  // Handle language toggle (will be called from Profile pages)

  const handleLanguageToggle = () => {

    toggleLanguage();

    toast.success(

      language === 'ar' ? 'تم تغيير اللغة' : 'Language changed',

      {

        action: {

          label: language === 'ar' ? 'إخفاء' : 'Dismiss',

          onClick: () => toast.dismiss(),

        },

        duration: 2000,

      }

    );

  };



  // Navigation for different screens

  const navigateTo = (screen, data = null) => {

    if (screen === 'product-detail') {

      setSelectedProduct(data);

    } else if (screen === 'delivery-tracking') {

      setTrackingOrderId(data);

    }

    setCurrentScreen(screen);

  };



  // Skip onboarding

  const skipOnboarding = () => {

    setCurrentScreen('auth');

  };



  // Updated patient navigation tabs - Search centered as primary feature

  const patientTabs = [

    { 

      id: 'home', 

      icon: Home, 

      label: language === 'ar' ? 'الرئيسية' : 'Home'

    },

    { 

      id: 'consult', 

      icon: MessageCircle, 

      label: language === 'ar' ? 'استشارة' : 'Consult'

    },

    { 

      id: 'search', 

      icon: Search, 

      label: language === 'ar' ? 'البحث' : 'Search'

    },

    { 

      id: 'cart', 

      icon: ShoppingCart, 

      label: language === 'ar' ? 'السلة' : 'Cart',

      badge: cartItems.length 

    },

    { 

      id: 'profile', 

      icon: User, 

      label: language === 'ar' ? 'الملف' : 'Profile'

    },

  ];



  // Updated pharmacist navigation tabs - Search centered as primary feature

  const pharmacistTabs = [

    { 

      id: 'pharmacist-dashboard', 

      icon: Home, 

      label: language === 'ar' ? 'الرئيسية' : 'Dashboard'

    },

    { 

      id: 'pharmacist-consultations', 

      icon: MessageCircle, 

      label: language === 'ar' ? 'استشارات' : 'Consult'

    },

    { 

      id: 'search', 

      icon: Search, 

      label: language === 'ar' ? 'البحث' : 'Search'

    },

    { 

      id: 'pharmacist-orders', 

      icon: Package, 

      label: language === 'ar' ? 'الطلبات' : 'Orders'

    },

    { 

      id: 'pharmacist-profile', 

      icon: User, 

      label: language === 'ar' ? 'الملف' : 'Profile'

    },

  ];



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

          return <HomeScreen navigateTo={navigateTo} userData={userData} />;

        case 'search':

          return <SearchScreen navigateTo={navigateTo} addToCart={addToCart} />;

        case 'product-detail':

          return <ProductDetailScreen product={selectedProduct} addToCart={addToCart} navigateTo={navigateTo} />;

        case 'prescription':

          return <PrescriptionScreen navigateTo={navigateTo} />;

        case 'cart':

          return <CartScreen cartItems={cartItems} setCartItems={setCartItems} navigateTo={navigateTo} />;

        case 'consult':

          return <ConsultScreen navigateTo={navigateTo} />;

        case 'donations':

          return <DonationScreen navigateTo={navigateTo} userType={userType} userData={userData} />;

        case 'profile':

          return <ProfileScreen 

            navigateTo={navigateTo} 

            onSignOut={handleSignOut}

            onLanguageToggle={handleLanguageToggle}

            currentLanguage={language}

            userData={userData}

            updateUserProfile={updateUserProfile}

          />;

        case 'order-history':

          return <OrderHistoryScreen navigateTo={navigateTo} />;

        case 'address-management':

          return <AddressManagement navigateTo={navigateTo} />;

        case 'delivery-tracking':

          return <DeliveryTracking orderId={trackingOrderId} navigateTo={navigateTo} />;

        default:

          return <HomeScreen navigateTo={navigateTo} userData={userData} />;

      }

    }



    // Pharmacist portal screens

    if (userType === 'pharmacist') {

      switch (currentScreen) {

        case 'pharmacist-dashboard':

          return <PharmacistDashboard navigateTo={navigateTo} userData={userData} />;

        case 'search':

          return <SearchScreen navigateTo={navigateTo} addToCart={addToCart} />;

        case 'pharmacist-orders':

          return <PharmacistOrders navigateTo={navigateTo} userData={userData} />;

        case 'pharmacist-inventory':

          return <PharmacistInventory navigateTo={navigateTo} userData={userData} />;

        case 'pharmacist-drug-upload':

          return <PharmacistDrugUpload navigateTo={navigateTo} userData={userData} />;

        case 'pharmacist-prescriptions':

          return <PharmacistPrescriptions navigateTo={navigateTo} userData={userData} />;

        case 'pharmacist-consultations':

          return <PharmacistConsultations navigateTo={navigateTo} userData={userData} />;

        case 'pharmacist-analytics':

          return <PharmacistAnalytics navigateTo={navigateTo} userData={userData} />;

        case 'donations':

          return <DonationScreen navigateTo={navigateTo} userType={userType} userData={userData} />;

        case 'pharmacist-profile':

          return <PharmacistProfile 

            navigateTo={navigateTo}

            onSignOut={handleSignOut}

            onLanguageToggle={handleLanguageToggle}

            currentLanguage={language}

            userData={userData}

            updateUserProfile={updateUserProfile}

          />;

        case 'address-management':

          return <AddressManagement navigateTo={navigateTo} />;

        default:

          return <PharmacistDashboard navigateTo={navigateTo} userData={userData} />;

      }

    }



    return <HomeScreen navigateTo={navigateTo} userData={userData} />;

  };



  const currentTabs = userType === 'patient' ? patientTabs : pharmacistTabs;



  return (

    <NotificationProvider userType={userType}>

      <InventoryProvider>

        <DeliveryProvider>

          <div className={`h-screen bg-background flex flex-col max-w-md mx-auto sudanese-pattern ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Main Content with enhanced background pattern */}

            <div className="flex-1 overflow-hidden relative">

              {renderScreen()}

            </div>



            {/* Enhanced Bottom Navigation with centered search */}

            {isAuthenticated && (

              <div className="bg-white border-t border-gray-100 shadow-sm">

                <div className="px-2 py-2">

                  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-around items-center gap-1`}>

                    {currentTabs.map((tab, index) => {

                      const Icon = tab.icon;

                      const isActive = currentScreen === tab.id;

                      const isCenter = index === Math.floor(currentTabs.length / 2); // Index 2 is center for 5 tabs

                      

                      return (

                        <Button

                          key={tab.id}

                          variant="ghost"

                          className={`

                            flex flex-col items-center justify-center space-y-1 relative 

                            transition-all duration-200 min-w-0 flex-1 rounded-lg px-1 py-2

                            ${isActive 

                              ? 'text-white bg-primary shadow-sm' 

                              : 'text-gray-500 hover:text-primary hover:bg-gray-50'

                            }

                            ${isCenter ? 'h-16 mx-1' : 'h-14'}

                          `}

                          onClick={() => setCurrentScreen(tab.id)}

                        >

                          <div className="relative mb-1">

                            <Icon 

                              size={isCenter ? 26 : 20} 

                              className="transition-all duration-200" 

                            />

                            {tab.badge !== undefined && tab.badge > 0 && (

                              <Badge className={`absolute -top-1.5 ${isRTL ? '-left-1.5' : '-right-1.5'} h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white arabic-numbers border border-white`}>

                                {tab.badge}

                              </Badge>

                            )}

                          </div>

                          {/* Enhanced label with emphasis on center */}

                          <span className={`text-xs font-medium max-w-full leading-tight text-center whitespace-nowrap ${

                            isActive ? 'font-semibold' : ''

                          } ${isCenter ? 'font-semibold' : ''}`} 

                          style={{ fontSize: isCenter ? '11px' : '10px' }}>

                            {tab.label}

                          </span>

                        </Button>

                      );

                    })}

                  </div>

                </div>

              </div>

            )}

            

            {/* Enhanced Toast Notifications */}

            <Toaster 

              position={isRTL ? "top-left" : "top-right"}

              dir={isRTL ? "rtl" : "ltr"}

              className="rounded-lg"

              closeButton={true}

              richColors={true}

              gap={12}

            />

          </div>

        </DeliveryProvider>

      </InventoryProvider>

    </NotificationProvider>

  );

}



export default function App() {

  return (

    <ErrorBoundary>

      <LocalizationProvider defaultLanguage="ar">

        <AppContent />

      </LocalizationProvider>

    </ErrorBoundary>

  );

}