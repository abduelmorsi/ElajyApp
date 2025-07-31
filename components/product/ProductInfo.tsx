import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLocalization } from '../services/LocalizationService';

interface ProductInfoProps {
  product: any;
}

function ProductInfo({ product }: ProductInfoProps) {
  const { language } = useLocalization();

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.imageBox}>
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            style={styles.image}
          />
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={2}>
            {language === 'ar' ? product.name : product.nameEn}
          </Text>
          <Text style={styles.brand} numberOfLines={1}>
            {language === 'ar' ? product.brand : product.brandEn}
          </Text>
          <View style={styles.row}>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color="#fbbf24" style={styles.icon} />
              <Text style={styles.ratingText}>{product.rating || 4.5}</Text>
            </View>
            <View style={styles.authenticRow}>
              <Icon name="verified" size={14} color="#15803d" style={styles.icon} />
              <Text style={styles.authenticText}>{language === 'ar' ? 'أصلي' : 'Authentic'}</Text>
            </View>
          </View>
          {product.description && (
            <Text style={styles.description} numberOfLines={3}>
              {language === 'ar' ? product.description : product.descriptionEn}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default ProductInfo;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  imageBox: {
    width: 96,
    height: 96,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
    marginBottom: 2,
  },
  brand: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 2,
  },
  authenticRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authenticText: {
    fontSize: 13,
    color: '#15803d',
    marginLeft: 2,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 14,
    marginRight: 2,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
  },
});