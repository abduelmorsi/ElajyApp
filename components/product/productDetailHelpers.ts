// Helper functions for ProductDetailScreen
import { Linking, Alert } from 'react-native';

export const validateAddToCart = (product: any, quantity: number, pharmacy: any, language: string) => {
  if (!product || !product.id) {
    console.error('Invalid product data:', product);
    return { isValid: false, error: 'Invalid product data' };
  }

  if (!pharmacy.inStock) {
    const message = language === 'ar' 
      ? 'هذا المنتج غير متوفر في الصيدلية المختارة' 
      : 'This product is not available at the selected pharmacy';
    return { isValid: false, error: message };
  }

  if (quantity <= 0) {
    const message = language === 'ar' 
      ? 'يرجى اختيار كمية صحيحة' 
      : 'Please select a valid quantity';
    return { isValid: false, error: message };
  }

  return { isValid: true };
};

export const createEnhancedProduct = (product: any, pharmacy: any, quantity: number, deliveryOption: string = 'delivery') => ({
  ...product,
  price: pharmacy.price,
  pharmacy: pharmacy,
  selectedQuantity: quantity,
  deliveryOption: deliveryOption,
  deliveryFee: deliveryOption === 'delivery' ? pharmacy.deliveryFee : 0
});

export const calculateTotal = (price: number, quantity: number, deliveryFee: number) => {
  return (price * quantity) + deliveryFee;
};

export const handlePhoneCall = (phone: string) => {
  const phoneNumber = phone.replace(/\s+/g, '');
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch(err => {
    console.error('Error opening phone app:', err);
    Alert.alert(
      'Error',
      'Cannot open phone app'
    );
  });
};