import React, { useState } from 'react';
import { Alert as RNAlert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PharmacyCard from './product/PharmacyCard';
import { createAvailablePharmacies, createProductSpecifications } from './product/productDetailData';
import { calculateTotal, createEnhancedProduct, handlePhoneCall, validateAddToCart } from './product/productDetailHelpers';
import ProductInfo from './product/ProductInfo';
import { useLocalization } from './services/LocalizationService';

export default function ProductDetailScreen({ product, addToCart, navigateTo, goBack }) {
  const { language } = useLocalization();
  const [quantity, setQuantity] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const availablePharmacies = createAvailablePharmacies(product?.price || 15);
  const specifications = createProductSpecifications(product, language);

  // Enhanced add to cart handler with validation and feedback
  const handleAddToCart = async () => {
    if (!addToCart) {
      console.error('addToCart function not provided');
      return;
    }

    const selectedPharmacyData = availablePharmacies[selectedPharmacy];
    const validation = validateAddToCart(product, quantity, selectedPharmacyData, language);

    if (!validation.isValid) {
      RNAlert.alert(language === 'ar' ? 'خطأ' : 'Error', validation.error);
      return;
    }

    setIsAddingToCart(true);

    try {
      const productWithDetails = createEnhancedProduct(product, selectedPharmacyData, quantity);
      await addToCart(productWithDetails, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      RNAlert.alert(language === 'ar' ? 'خطأ' : 'Error', language === 'ar' ? 'حدث خطأ أثناء إضافة المنتج للسلة' : 'Error adding product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <View style={[styles.full, styles.center, { backgroundColor: '#f9fafb' }]}> 
        <View style={styles.center}>
          <Text style={styles.notFoundText}>
            {language === 'ar' ? 'لم يتم العثور على المنتج' : 'Product not found'}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigateTo('search')}>
            <Text style={styles.primaryButtonText}>{language === 'ar' ? 'العودة للبحث' : 'Back to Search'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const selectedPharmacyData = availablePharmacies[selectedPharmacy];
  const totalAmount = calculateTotal(selectedPharmacyData.price, quantity, selectedPharmacyData.deliveryFee);

  return (
    <ScrollView style={styles.full} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack ? goBack : () => navigateTo('search')}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {language === 'ar' ? product.name : product.nameEn}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Text style={styles.headerActionIcon}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Text style={styles.headerActionIcon}>🔗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Image and Basic Info */}
      <ProductInfo product={product} />

      {/* Available Pharmacies */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Icon name="location-on" size={16} color="#6b7280" style={{ marginRight: 4 }} />
          {language === 'ar' ? 'متوفر في الصيدليات' : 'Available at Pharmacies'}
        </Text>
        {availablePharmacies.map((pharmacy, index) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            index={index}
            isSelected={selectedPharmacy === index}
            onSelect={() => setSelectedPharmacy(index)}
            onCall={handlePhoneCall}
          />
        ))}
      </View>

      {/* Product Specifications */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{language === 'ar' ? 'المواصفات' : 'Specifications'}</Text>
        {specifications.map((spec, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>

      {/* Add to Cart Section */}
      <View style={[styles.card, { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }]}> 
        {/* Quantity Selector */}
        <Text style={styles.sectionLabel}>{language === 'ar' ? 'الكمية' : 'Quantity'}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonDisabled]}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.qtyValueBox}>
            <Text style={styles.qtyValue}>{quantity}</Text>
          </View>
          <TouchableOpacity
            style={[styles.qtyButton, quantity >= 10 && styles.qtyButtonDisabled]}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{language === 'ar' ? 'سعر الوحدة:' : 'Unit Price:'}</Text>
            <Text style={styles.priceValue}>{selectedPharmacyData.price} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{language === 'ar' ? 'رسوم التوصيل:' : 'Delivery Fee:'}</Text>
            <Text style={styles.priceValue}>{selectedPharmacyData.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>{language === 'ar' ? 'المجموع:' : 'Total:'}</Text>
            <Text style={styles.priceTotalValue}>{totalAmount} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[styles.addToCartButton, (!selectedPharmacyData.inStock || isAddingToCart) && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!selectedPharmacyData.inStock || isAddingToCart}
        >
          <Text style={styles.addToCartButtonText}>
            🛒 {isAddingToCart 
              ? (language === 'ar' ? 'جارٍ الإضافة...' : 'Adding...')
              : (language === 'ar' ? 'أضف للسلة' : 'Add to Cart')}
          </Text>
        </TouchableOpacity>
        {!selectedPharmacyData.inStock && (
          <Text style={styles.outOfStockText}>
            {language === 'ar' ? 'غير متوفر في الصيدلية المختارة' : 'Not available at selected pharmacy'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#222',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    marginLeft: 8,
    padding: 4,
  },
  headerActionIcon: {
    fontSize: 18,
    color: '#2563eb',
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  qtyButtonText: {
    fontSize: 22,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  qtyValueBox: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  priceSummary: {
    marginTop: 8,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  priceTotalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  priceTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  addToCartButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outOfStockText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});