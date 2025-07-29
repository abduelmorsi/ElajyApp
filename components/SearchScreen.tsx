// SearchScreen.tsx (React Native)
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function SearchScreen({ navigateTo, addToCart, goBack }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('list');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      name: 'أموكسيسيلين 250 مجم',
      nameEn: 'Amoxicillin 250mg',
      brand: 'الخرطوم فارما',
      brandEn: 'Khartoum Pharma',
      price: 45,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150',
      rating: 4.7,
    }
  ];

  const filteredMedicines = medicines.filter((medicine) =>
    (language === 'ar' ? medicine.name : medicine.nameEn)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (medicine) => {
    if (!medicine.inStock) {
      Alert.alert(language === 'ar' ? 'غير متوفر' : 'Out of Stock');
      return;
    }
    addToCart && addToCart(medicine, 1);
  };

  // Render back button if goBack is provided
  const renderBackButton = () => goBack ? (
    <TouchableOpacity onPress={goBack} style={{ padding: 8, marginRight: 8 }}>
      <Text style={{ fontSize: 20 }}>{language === 'ar' ? '←' : '←'}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>
          {language === 'ar' ? 'البحث والاستكشاف' : 'Search & Explore'}
        </Text>
      </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8
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
  addButtonText: { color: '#fff', fontSize: 12 }
});
