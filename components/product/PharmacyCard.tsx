import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization } from '../services/LocalizationService';

interface PharmacyCardProps {
  pharmacy: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onCall: (phone: string) => void;
  onNavigate?: (pharmacy: any) => void;
}

function PharmacyCard({ pharmacy, index, isSelected, onSelect, onCall, onNavigate }: PharmacyCardProps) {
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
              <Icon name="location-on" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="schedule" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="star" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{pharmacy.rating}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="local-shipping" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{pharmacy.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.priceText}>{pharmacy.price} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          {pharmacy.inStock && (
            <Text style={styles.stockText}>{pharmacy.stockCount} {language === 'ar' ? 'متوفر' : 'available'}</Text>
          )}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                onCall(pharmacy.phone);
              }}
              activeOpacity={0.7}
            >
              <Icon name="phone" size={16} color="#49C5B8" />
            </TouchableOpacity>
            {onNavigate && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  onNavigate(pharmacy);
                }}
                activeOpacity={0.7}
              >
                <Icon name="navigation" size={16} color="#49C5B8" />
              </TouchableOpacity>
            )}
          </View>
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
    borderColor: '#49C5B8', // primary
    backgroundColor: '#e6f7f5', // primary/5
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
    color: '#49C5B8',
    fontSize: 18,
    marginBottom: 2,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
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