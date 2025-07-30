// SearchScreen.tsx (React Native)
import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function SearchScreen({ navigateTo, addToCart, goBack, navigationData }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>(
    navigationData?.viewMode || 'map'
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllMedicines, setShowAllMedicines] = useState(navigationData?.showAllMedicines || false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [region, setRegion] = useState({
    latitude: 15.5007, // Khartoum coordinates
    longitude: 32.5599,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);

  const medicines = [
    {
      id: 1,
      name: 'باراسيتامول 500 مجم',
      nameEn: 'Paracetamol 500mg',
      brand: 'سودانية للأدوية',
      brandEn: 'Sudanese Pharmaceutical',
      price: 15,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150',
      rating: 4.5,
      category: 'pain-relief',
      description: 'مسكن للألم وخافض للحرارة',
      descriptionEn: 'Pain reliever and fever reducer',
      dosage: '1-2 حبة كل 4-6 ساعات',
      dosageEn: '1-2 tablets every 4-6 hours',
      sideEffects: 'قد يسبب اضطراب في المعدة',
      sideEffectsEn: 'May cause stomach upset',
    },
    {
      id: 2,
      name: 'أنسولين',
      nameEn: 'Insulin',
      brand: 'نوفو نورديسك',
      brandEn: 'Novo Nordisk',
      price: 120,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.8,
      category: 'diabetes',
      description: 'علاج السكري',
      descriptionEn: 'Diabetes treatment',
      dosage: 'حسب وصفة الطبيب',
      dosageEn: 'As prescribed by doctor',
      sideEffects: 'قد يسبب انخفاض السكر',
      sideEffectsEn: 'May cause low blood sugar',
    },
    {
      id: 3,
      name: 'أموكسيسيلين 250 مجم',
      nameEn: 'Amoxicillin 250mg',
      brand: 'الخرطوم فارما',
      brandEn: 'Khartoum Pharma',
      price: 45,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.7,
      category: 'antibiotics',
      description: 'مضاد حيوي للالتهابات البكتيرية',
      descriptionEn: 'Antibiotic for bacterial infections',
      dosage: 'حسب وصفة الطبيب',
      dosageEn: 'As prescribed by doctor',
      sideEffects: 'قد يسبب اضطراب في المعدة',
      sideEffectsEn: 'May cause stomach upset',
    },
    {
      id: 4,
      name: 'إيبوبروفين 400 مجم',
      nameEn: 'Ibuprofen 400mg',
      brand: 'بروفين',
      brandEn: 'Brufen',
      price: 25,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.3,
      category: 'pain-relief',
      description: 'مسكن للألم ومضاد للالتهاب',
      descriptionEn: 'Pain reliever and anti-inflammatory',
      dosage: '1 حبة كل 6-8 ساعات',
      dosageEn: '1 tablet every 6-8 hours',
      sideEffects: 'قد يسبب اضطراب في المعدة',
      sideEffectsEn: 'May cause stomach upset',
    },
    {
      id: 5,
      name: 'فيتامين د 1000 وحدة',
      nameEn: 'Vitamin D 1000 IU',
      brand: 'فيتامينات سودان',
      brandEn: 'Sudan Vitamins',
      price: 35,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.6,
      category: 'vitamins',
      description: 'مكمل غذائي للعظام',
      descriptionEn: 'Nutritional supplement for bones',
      dosage: '1 حبة يومياً',
      dosageEn: '1 tablet daily',
      sideEffects: 'آمن عند الاستخدام الموصى',
      sideEffectsEn: 'Safe when used as recommended',
    },
    {
      id: 6,
      name: 'أوميغا 3',
      nameEn: 'Omega 3',
      brand: 'صحة القلب',
      brandEn: 'Heart Health',
      price: 55,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.4,
      category: 'vitamins',
      description: 'مكمل غذائي لصحة القلب',
      descriptionEn: 'Nutritional supplement for heart health',
      dosage: '1-2 كبسولة يومياً',
      dosageEn: '1-2 capsules daily',
      sideEffects: 'آمن عند الاستخدام الموصى',
      sideEffectsEn: 'Safe when used as recommended',
    },
    {
      id: 7,
      name: 'بروبيوتيك',
      nameEn: 'Probiotic',
      brand: 'صحة الأمعاء',
      brandEn: 'Gut Health',
      price: 40,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.2,
      category: 'supplements',
      description: 'بكتيريا مفيدة للأمعاء',
      descriptionEn: 'Beneficial bacteria for gut health',
      dosage: '1 كبسولة يومياً',
      dosageEn: '1 capsule daily',
      sideEffects: 'آمن عند الاستخدام الموصى',
      sideEffectsEn: 'Safe when used as recommended',
    },
    {
      id: 8,
      name: 'كالسيوم 500 مجم',
      nameEn: 'Calcium 500mg',
      brand: 'عظام قوية',
      brandEn: 'Strong Bones',
      price: 30,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.1,
      category: 'vitamins',
      description: 'مكمل غذائي للعظام',
      descriptionEn: 'Nutritional supplement for bones',
      dosage: '1-2 حبة يومياً',
      dosageEn: '1-2 tablets daily',
      sideEffects: 'آمن عند الاستخدام الموصى',
      sideEffectsEn: 'Safe when used as recommended',
    }
  ];

  const categories = [
    { id: 'all', name: 'الكل', nameEn: 'All', icon: 'apps' },
    { id: 'pain-relief', name: 'مسكنات الألم', nameEn: 'Pain Relief', icon: 'healing' },
    { id: 'diabetes', name: 'السكري', nameEn: 'Diabetes', icon: 'monitor-heart' },
    { id: 'antibiotics', name: 'المضادات الحيوية', nameEn: 'Antibiotics', icon: 'medical-services' },
    { id: 'vitamins', name: 'الفيتامينات', nameEn: 'Vitamins', icon: 'eco' },
    { id: 'supplements', name: 'المكملات الغذائية', nameEn: 'Supplements', icon: 'restaurant' },
  ];

  const filters = [
    { id: 'all', name: 'الكل', nameEn: 'All' },
    { id: 'in-stock', name: 'متوفر', nameEn: 'In Stock' },
    { id: 'out-of-stock', name: 'غير متوفر', nameEn: 'Out of Stock' },
    { id: 'price-low', name: 'السعر: منخفض إلى عالي', nameEn: 'Price: Low to High' },
    { id: 'price-high', name: 'السعر: عالي إلى منخفض', nameEn: 'Price: High to Low' },
    { id: 'rating', name: 'التقييم', nameEn: 'Rating' },
  ];

  const pharmacies = [
    {
      id: 1,
      name: 'صيدلية النيل الأزرق',
      nameEn: 'Blue Nile Pharmacy',
      location: 'الخرطوم',
      locationEn: 'Khartoum',
      address: 'شارع الجامعة، الخرطوم',
      addressEn: 'University Street, Khartoum',
      coordinate: {
        latitude: 15.5007,
        longitude: 32.5599,
      },
      rating: 4.8,
      isOpen: true,
      distance: '0.2 km',
      phone: '0123-456-789',
      whatsapp: '0123-456-789',
      medicines: medicines.slice(0, 2),
    },
    {
      id: 2,
      name: 'صيدلية أم درمان',
      nameEn: 'Omdurman Pharmacy',
      location: 'أم درمان',
      locationEn: 'Omdurman',
      address: 'شارع النيل، أم درمان',
      addressEn: 'Nile Street, Omdurman',
      coordinate: {
        latitude: 15.6500,
        longitude: 32.4800,
      },
      rating: 4.6,
      isOpen: true,
      distance: '1.5 km',
      phone: '0987-654-321',
      whatsapp: '0987-654-321',
      medicines: medicines.slice(1, 2),
    },
    {
      id: 3,
      name: 'صيدلية الخرطوم بحري',
      nameEn: 'Khartoum North Pharmacy',
      location: 'الخرطوم بحري',
      locationEn: 'Khartoum North',
      address: 'شارع الشجرة، الخرطوم بحري',
      addressEn: 'Tree Street, Khartoum North',
      coordinate: {
        latitude: 15.6333,
        longitude: 32.5500,
      },
      rating: 4.4,
      isOpen: false,
      distance: '2.1 km',
      phone: '0555-123-456',
      whatsapp: '0555-123-456',
      medicines: medicines.slice(0, 1),
    },
  ];

  const filteredMedicines = medicines.filter((medicine) => {
    // Filter by category
    if (selectedCategory !== 'all' && medicine.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = (language === 'ar' ? medicine.name : medicine.nameEn)
        .toLowerCase()
        .includes(searchLower);
      const brandMatch = (language === 'ar' ? medicine.brand : medicine.brandEn)
        .toLowerCase()
        .includes(searchLower);
      const descriptionMatch = (language === 'ar' ? medicine.description : medicine.descriptionEn)
        .toLowerCase()
        .includes(searchLower);
      
      if (!nameMatch && !brandMatch && !descriptionMatch) {
        return false;
      }
    }
    
    // Filter by stock status
    if (selectedFilter === 'in-stock' && !medicine.inStock) {
      return false;
    }
    if (selectedFilter === 'out-of-stock' && medicine.inStock) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by filter
    switch (selectedFilter) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const searchSuggestions = medicines
    .filter(medicine => 
      (language === 'ar' ? medicine.name : medicine.nameEn)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleAddToCart = (medicine) => {
    if (!medicine.inStock) {
      Alert.alert(
        language === 'ar' ? 'غير متوفر' : 'Out of Stock',
        language === 'ar' ? 'هذا الدواء غير متوفر حالياً' : 'This medicine is currently out of stock'
      );
      return;
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

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'ar' ? 'إذن مطلوب' : 'Permission Required',
          language === 'ar' ? 'نحتاج إذن للوصول إلى موقعك لعرض الصيدليات القريبة' : 'We need permission to access your location to show nearby pharmacies'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  useEffect(() => {
    if (viewMode === 'map') {
      getUserLocation();
    }
  }, [viewMode]);

  // Render back button if goBack is provided
  const renderBackButton = () => goBack ? (
    <TouchableOpacity onPress={goBack} style={{ marginRight: 12 }}>
      <Text style={{ fontSize: 24 }}>{language === 'ar' ? '←' : '←'}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {renderBackButton()}
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'البحث والاستكشاف' : 'Search & Explore'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Empty space to balance the layout */}
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          placeholder={language === 'ar' ? 'ابحث عن دواء...' : 'Search medicine...'}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
        />
      </View>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery && searchSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {searchSuggestions.map((medicine) => (
            <TouchableOpacity
              key={medicine.id}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchQuery(language === 'ar' ? medicine.name : medicine.nameEn);
                setShowSuggestions(false);
              }}
            >
              <Icon name="search" size={16} color="#666" />
              <Text style={styles.suggestionText}>
                {language === 'ar' ? medicine.name : medicine.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'الفئات' : 'Categories'}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {language === 'ar' ? category.name : category.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'الفلترة' : 'Filters'}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {language === 'ar' ? filter.name : filter.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Icon name="list" size={20} color={viewMode === 'list' ? '#007bff' : '#666'} />
          <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
            {language === 'ar' ? 'قائمة' : 'List'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('grid')}
        >
          <Icon name="grid-view" size={20} color={viewMode === 'grid' ? '#007bff' : '#666'} />
          <Text style={[styles.viewModeText, viewMode === 'grid' && styles.viewModeTextActive]}>
            {language === 'ar' ? 'شبكة' : 'Grid'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'map' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Icon name="map" size={20} color={viewMode === 'map' ? '#007bff' : '#666'} />
          <Text style={[styles.viewModeText, viewMode === 'map' && styles.viewModeTextActive]}>
            {language === 'ar' ? 'خريطة' : 'Map'}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'map' ? (
        <View style={[styles.mapContainer, { paddingBottom: 8 }]}>
          <MapView
            style={{ flex: 1, borderRadius: 8 }}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title={language === 'ar' ? 'موقعك' : 'Your Location'}
                description={language === 'ar' ? 'أنت هنا' : 'You are here'}
              >
                <View style={{
                  backgroundColor: '#007bff',
                  borderRadius: 15,
                  padding: 8,
                  borderWidth: 2,
                  borderColor: '#fff',
                }}>
                  <Icon name="my-location" size={16} color="#fff" />
                </View>
              </Marker>
            )}
            
            {/* Pharmacy Markers */}
            {pharmacies.map((pharmacy) => (
              <Marker
                key={pharmacy.id}
                coordinate={pharmacy.coordinate}
                title={language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                description={language === 'ar' ? pharmacy.address : pharmacy.addressEn}
                onPress={() => navigateTo('pharmacy-detail', pharmacy)}
              >
                <View style={{
                  backgroundColor: pharmacy.isOpen ? '#22c55e' : '#ef4444',
                  borderRadius: 20,
                  padding: 8,
                  borderWidth: 2,
                  borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                  <Icon name="local-pharmacy" size={16} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>
          
          {/* Pharmacy List Overlay */}
          <View style={[styles.mapPharmaciesList, { marginTop: 16 }]}>
            <Text style={styles.mapPharmaciesTitle}>
              {language === 'ar' ? 'الصيدليات القريبة' : 'Nearby Pharmacies'}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {pharmacies.map((pharmacy) => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={styles.mapPharmacyCard}
                  onPress={() => navigateTo('pharmacy-detail', pharmacy)}
                >
                  <View style={styles.mapPharmacyCardHeader}>
                    <Icon 
                      name="local-pharmacy" 
                      size={16} 
                      color={pharmacy.isOpen ? '#22c55e' : '#ef4444'} 
                    />
                    <Text style={[
                      styles.mapPharmacyCardStatus,
                      pharmacy.isOpen ? styles.mapPharmacyStatusOpen : styles.mapPharmacyStatusClosed
                    ]}>
                      {pharmacy.isOpen ? (language === 'ar' ? 'مفتوح' : 'Open') : (language === 'ar' ? 'مغلق' : 'Closed')}
                    </Text>
                  </View>
                  <Text style={styles.mapPharmacyCardName}>
                    {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                  </Text>
                  <Text style={styles.mapPharmacyCardDistance}>
                    {pharmacy.distance}
                  </Text>
                  <Text style={styles.mapPharmacyCardContact}>
                    📞 {pharmacy.phone}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : viewMode === 'list' ? (
        <View style={styles.listContainer}>
          {filteredMedicines.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigateTo('product-detail', item)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {language === 'ar' ? item.name : item.nameEn}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.cardBrand}>
                  {language === 'ar' ? item.brand : item.brandEn}
                </Text>
                <Text style={styles.cardDescription}>
                  {language === 'ar' ? item.description : item.descriptionEn}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>
                    {item.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </Text>
                  <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
                    {item.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                  </Text>
                </View>
                {item.inStock && (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={styles.addButton}
                  >
                    <Icon name="add-shopping-cart" size={16} color="#fff" />
                    <Text style={styles.addButtonText}>
                      {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {filteredMedicines.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>
                {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {language === 'ar' ? 'جرب البحث بكلمات مختلفة أو تغيير الفلترة' : 'Try searching with different words or change filters'}
              </Text>
            </View>
          )}
        </View>
      ) : viewMode === 'grid' ? (
        <View style={styles.gridContainer}>
          {filteredMedicines.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              onPress={() => navigateTo('product-detail', item)}
            >
              <Image source={{ uri: item.image }} style={styles.gridCardImage} />
              <View style={styles.gridCardContent}>
                <View style={styles.gridCardHeader}>
                  <Text style={styles.gridCardTitle}>
                    {language === 'ar' ? item.name : item.nameEn}
                  </Text>
                  <View style={styles.gridRatingContainer}>
                    <Icon name="star" size={12} color="#fbbf24" />
                    <Text style={styles.gridRatingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.gridCardBrand}>
                  {language === 'ar' ? item.brand : item.brandEn}
                </Text>
                <Text style={styles.gridCardDescription}>
                  {language === 'ar' ? item.description : item.descriptionEn}
                </Text>
                <View style={styles.gridCardFooter}>
                  <Text style={styles.gridCardPrice}>
                    {item.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </Text>
                  <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
                    {item.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                  </Text>
                </View>
                {item.inStock && (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={styles.gridAddButton}
                  >
                    <Icon name="add-shopping-cart" size={14} color="#fff" />
                    <Text style={styles.gridAddButtonText}>
                      {language === 'ar' ? 'أضف' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {filteredMedicines.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>
                {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {language === 'ar' ? 'جرب البحث بكلمات مختلفة أو تغيير الفلترة' : 'Try searching with different words or change filters'}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.pharmacyContainer}>
          {pharmacies.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.pharmacyCard}
              onPress={() => navigateTo('pharmacy-detail', item)}
            >
              <View style={styles.pharmacyHeader}>
                <Text style={styles.pharmacyName}>
                  {language === 'ar' ? item.name : item.nameEn}
                </Text>
                <Text style={[
                  styles.pharmacyStatus,
                  item.isOpen ? styles.pharmacyStatusOpen : styles.pharmacyStatusClosed
                ]}>
                  {item.isOpen ? (language === 'ar' ? 'مفتوح' : 'Open') : (language === 'ar' ? 'مغلق' : 'Closed')}
                </Text>
              </View>
              <View style={styles.pharmacyInfo}>
                <Icon name="location-on" size={12} color="#666" />
                <Text style={styles.pharmacyInfoText}>
                  {language === 'ar' ? item.address : item.addressEn}
                </Text>
              </View>
              <View style={styles.pharmacyInfo}>
                <Icon name="star" size={12} color="#fbbf24" />
                <Text style={styles.pharmacyInfoText}>
                  {item.rating} • {item.distance}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
        </View>
      </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: {
    flexGrow: 1,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 4,
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  viewModeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  viewModeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  viewModeTextActive: {
    color: '#007bff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: { 
    fontWeight: 'bold', 
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 2,
    fontSize: 12,
    color: '#666',
  },
  cardBrand: { 
    fontSize: 12, 
    color: '#777',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardPrice: { 
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inStock: { color: 'green', marginTop: 2 },
  outOfStock: { color: 'red', marginTop: 2 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gridCardImage: { 
    width: '100%', 
    height: 80, 
    borderRadius: 6,
    marginBottom: 8,
  },
  gridCardContent: { 
    flex: 1,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  gridCardTitle: { 
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 4,
  },
  gridRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridRatingText: {
    marginLeft: 2,
    fontSize: 10,
    color: '#666',
  },
  gridCardBrand: { 
    fontSize: 10, 
    color: '#777',
    marginBottom: 2,
  },
  gridCardDescription: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
    lineHeight: 12,
  },
  gridCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridCardPrice: { 
    fontSize: 11,
    color: '#1e90ff',
    fontWeight: '600',
  },
  gridAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  gridAddButtonText: { 
    color: '#fff', 
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  mapContainer: {
    height: Dimensions.get('window').height - 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pharmacyCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pharmacyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  pharmacyStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pharmacyStatusOpen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  pharmacyStatusClosed: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  pharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  mapPharmaciesList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  mapPharmaciesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    marginTop: 4,
  },
  mapPharmacyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapPharmacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mapPharmacyInfo: {
    flex: 1,
  },
  mapPharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  mapPharmacyAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  mapPharmacyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapPharmacyRating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  mapPharmacyDistance: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mapPharmacyStatus: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  mapPharmacyStatusOpen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  mapPharmacyStatusClosed: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  mapPharmacyCard: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapPharmacyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mapPharmacyCardStatus: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '600',
  },
  mapPharmacyCardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 3,
  },
  mapPharmacyCardDistance: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  mapPharmacyCardContact: {
    fontSize: 10,
    color: '#888',
  },
  listContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pharmacyContainer: {
    flex: 1,
  },
});
