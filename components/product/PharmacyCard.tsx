import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalization } from '../services/LocalizationService';

interface PharmacyCardProps {
  pharmacy: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onCall: (phone: string) => void;
}

function PharmacyCard({ pharmacy, index, isSelected, onSelect, onCall }: PharmacyCardProps) {
  const { language } = useLocalization();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected ? styles.selectedCard : styles.unselectedCard
      ]}
      onPress={onSelect}
      activeOpacity={0.85}
    >
      <View style={styles.rowBetween}>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
            </Text>
            <Text style={[styles.badge, pharmacy.inStock ? styles.inStockBadge : styles.outOfStockBadge]}>
              {pharmacy.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
            </Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.infoText}>{language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>⏰</Text>
              <Text style={styles.infoText}>{language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>⭐</Text>
              <Text style={styles.infoText}>{pharmacy.rating}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>🚚</Text>
              <Text style={styles.infoText}>{pharmacy.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.priceText}>{pharmacy.price} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          {pharmacy.inStock && (
            <Text style={styles.stockText}>{pharmacy.stockCount} {language === 'ar' ? 'متوفر' : 'available'}</Text>
          )}
          <TouchableOpacity
            style={styles.callButton}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onCall(pharmacy.phone);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>📞</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default PharmacyCard;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedCard: {
    borderColor: '#2563eb', // primary
    backgroundColor: '#eff6ff', // primary/5
  },
  unselectedCard: {
    borderColor: '#e5e7eb', // gray-200
    backgroundColor: '#fff',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    marginRight: 8,
    flexShrink: 1,
  },
  badge: {
    fontSize: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  inStockBadge: {
    backgroundColor: '#bbf7d0',
    color: '#15803d',
  },
  outOfStockBadge: {
    backgroundColor: '#fecaca',
    color: '#b91c1c',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
    minWidth: 90,
  },
  icon: {
    fontSize: 13,
    marginRight: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
  },
  priceCol: {
    alignItems: 'flex-end',
    marginLeft: 12,
    minWidth: 70,
  },
  priceText: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 18,
    marginBottom: 2,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  callButton: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});