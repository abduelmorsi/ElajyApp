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

export default function SearchScreen({ navigateTo, addToCart, goBack }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('map');
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    }
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

  const filteredMedicines = medicines.filter((medicine) =>
    (language === 'ar' ? medicine.name : medicine.nameEn)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
                <View style={styles.header}>
          {renderBackButton()}
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'البحث والاستكشاف' : 'Search & Explore'}
          </Text>
        </View>

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
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('product-detail', item)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? item.name : item.nameEn}
                </Text>
                <Text style={styles.cardBrand}>
                  {language === 'ar' ? item.brand : item.brandEn}
                </Text>
                <Text style={styles.cardPrice}>
                  {item.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                </Text>
                <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
                  {item.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                </Text>
                {item.inStock && (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>
                      {language === 'ar' ? 'أضف' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : viewMode === 'grid' ? (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigateTo('product-detail', item)}
            >
              <Image source={{ uri: item.image }} style={styles.gridCardImage} />
              <View style={styles.gridCardContent}>
                <Text style={styles.gridCardTitle}>
                  {language === 'ar' ? item.name : item.nameEn}
                </Text>
                <Text style={styles.gridCardBrand}>
                  {language === 'ar' ? item.brand : item.brandEn}
                </Text>
                <Text style={styles.gridCardPrice}>
                  {item.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                </Text>
                <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
                  {item.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                </Text>
                {item.inStock && (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={styles.gridAddButton}
                  >
                    <Text style={styles.gridAddButtonText}>
                      {language === 'ar' ? 'أضف' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
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
          )}
        />
      )}
        </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
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
  cardImage: { width: 60, height: 60, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontWeight: 'bold' },
  cardBrand: { fontSize: 12, color: '#777' },
  cardPrice: { marginTop: 4, color: '#1e90ff' },
  inStock: { color: 'green', marginTop: 2 },
  outOfStock: { color: 'red', marginTop: 2 },
  addButton: {
    marginTop: 6,
    backgroundColor: '#1e90ff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  addButtonText: { color: '#fff', fontSize: 12 },
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
  gridCardTitle: { 
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gridCardBrand: { 
    fontSize: 10, 
    color: '#777',
    marginBottom: 4,
  },
  gridCardPrice: { 
    fontSize: 11,
    color: '#1e90ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  gridAddButton: {
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
});
