import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useLocalization } from './services/LocalizationService';
import ProductInfo from './product/ProductInfo';
import PharmacyCard from './product/PharmacyCard';
import { createAvailablePharmacies, createProductSpecifications } from './product/productDetailData';
import { validateAddToCart, createEnhancedProduct, calculateTotal, handlePhoneCall } from './product/productDetailHelpers';

export default function ProductDetailScreen({ product, addToCart, navigateTo }) {
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
      alert(validation.error);
      return;
    }

    setIsAddingToCart(true);

    try {
      const productWithDetails = createEnhancedProduct(product, selectedPharmacyData, quantity);
      await addToCart(productWithDetails, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء إضافة المنتج للسلة' : 'Error adding product to cart');
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
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {language === 'ar' ? 'لم يتم العثور على المنتج' : 'Product not found'}
          </p>
          <Button onClick={() => navigateTo('search')}>
            {language === 'ar' ? 'العودة للبحث' : 'Back to Search'}
          </Button>
        </div>
      </div>
    );
  }

  const selectedPharmacyData = availablePharmacies[selectedPharmacy];
  const totalAmount = calculateTotal(selectedPharmacyData.price, quantity, selectedPharmacyData.deliveryFee);

  return (
    <div className="h-full overflow-y-auto bg-background clean-pattern">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('search')}
            className="px-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="font-semibold text-gray-900 text-center flex-1 mx-3 truncate">
            {language === 'ar' ? product.name : product.nameEn}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="px-2">
              <Heart size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="px-2">
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Product Image and Basic Info */}
        <ProductInfo product={product} />

        {/* Available Pharmacies */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <MapPin size={16} className="mr-2 text-primary" />
              {language === 'ar' ? 'متوفر في الصيدليات' : 'Available at Pharmacies'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
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
          </CardContent>
        </Card>

        {/* Product Specifications */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {language === 'ar' ? 'المواصفات' : 'Specifications'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{spec.label}</span>
                <span className="text-sm font-medium text-gray-900">{spec.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Add to Cart Section */}
        <Card className="border border-gray-100 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {language === 'ar' ? 'الكمية' : 'Quantity'}
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 p-0"
                  >
                    <Minus size={16} />
                  </Button>
                  <div className="w-16 h-10 border border-gray-200 rounded-lg flex items-center justify-center">
                    <span className="font-semibold text-gray-900 arabic-numbers">{quantity}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 p-0"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{language === 'ar' ? 'سعر الوحدة:' : 'Unit Price:'}</span>
                  <span className="font-medium arabic-numbers">
                    {selectedPharmacyData.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{language === 'ar' ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span>
                  <span className="font-medium arabic-numbers">
                    {selectedPharmacyData.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                  <span className="font-bold text-lg text-primary arabic-numbers">
                    {totalAmount} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedPharmacyData.inStock || isAddingToCart}
                className="w-full bg-primary text-white h-12 text-base font-semibold"
              >
                <ShoppingCart size={20} className="mr-2" />
                {isAddingToCart 
                  ? (language === 'ar' ? 'جارٍ الإضافة...' : 'Adding...')
                  : (language === 'ar' ? 'أضف للسلة' : 'Add to Cart')
                }
              </Button>

              {!selectedPharmacyData.inStock && (
                <p className="text-center text-sm text-red-600 mt-2">
                  {language === 'ar' ? 'غير متوفر في الصيدلية المختارة' : 'Not available at selected pharmacy'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}