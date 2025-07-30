import React, { useState } from 'react';
import { Plus, Minus, Trash2, MapPin, Clock, CreditCard, Banknote, ArrowRight, Shield, Truck, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLocalization, useRTL } from './services/LocalizationService';
import { useDelivery } from './services/DeliveryService';
import { toast } from 'sonner';

export default function CartScreen({ cartItems, setCartItems, navigateTo }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const { 
    addresses, 
    deliveryOptions, 
    selectedAddress, 
    selectedDeliveryOption, 
    selectedTimeSlot,
    selectAddress,
    selectDeliveryOption,
    selectTimeSlot,
    getTimeSlots,
    createOrder,
    estimateDeliveryFee
  } = useDelivery();

  const [currentStep, setCurrentStep] = useState('cart'); // cart, delivery, payment, confirmation
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success(language === 'ar' ? 'تم حذف المنتج' : 'Item removed');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    if (!selectedDeliveryOption || !selectedAddress) return 0;
    return estimateDeliveryFee(selectedAddress, selectedDeliveryOption);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(language === 'ar' ? 'السلة فارغة' : 'Cart is empty');
      return;
    }
    setCurrentStep('delivery');
  };

  const handleDeliveryNext = () => {
    if (!selectedAddress) {
      toast.error(language === 'ar' ? 'يرجى اختيار عنوان التوصيل' : 'Please select delivery address');
      return;
    }
    if (!selectedDeliveryOption) {
      toast.error(language === 'ar' ? 'يرجى اختيار طريقة التوصيل' : 'Please select delivery method');
      return;
    }
    if (selectedDeliveryOption.id === 'scheduled' && !selectedTimeSlot) {
      toast.error(language === 'ar' ? 'يرجى اختيار وقت التوصيل' : 'Please select delivery time');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePlaceOrder = () => {
    const orderData = {
      customerId: 'user_001',
      pharmacyId: 'pharmacy_001',
      items: cartItems,
      deliveryAddress: selectedAddress,
      deliveryOption: selectedDeliveryOption,
      timeSlot: selectedTimeSlot,
      paymentMethod,
      total: calculateTotal(),
      deliveryFee: calculateDeliveryFee(),
      contactless: contactlessDelivery,
      notes: specialInstructions
    };

    const order = createOrder(orderData);
    setCartItems([]);
    setCurrentStep('confirmation');
    
    // Navigate to tracking after a short delay
    setTimeout(() => {
      navigateTo('delivery-tracking', order.id);
    }, 2000);
  };

  const timeSlots = selectedDeliveryOption?.id === 'scheduled' ? getTimeSlots(selectedDate) : [];

  // Cart Step
  if (currentStep === 'cart') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          {cartItems.length > 0 && (
            <p className="text-sm text-gray-500">
              {cartItems.length} {language === 'ar' ? 'منتجات' : 'items'}
            </p>
          )}
        </div>

        <div className="p-6">
          {cartItems.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-gray-100">
              <div className="text-gray-400 mb-4">
                <Truck size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ar' ? 'السلة فارغة' : 'Cart is Empty'}
              </h3>
              <p className="text-gray-500 mb-4">
                {language === 'ar' ? 'ابدأ بإضافة منتجات لسلة التسوق' : 'Start adding items to your cart'}
              </p>
              <Button onClick={() => navigateTo('search')} className="bg-primary text-white">
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <Card key={item.id} className="bg-white border border-gray-100">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 leading-tight">
                            {language === 'ar' ? item.name : item.nameEn}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? item.brand : item.brandEn}
                          </p>
                          <p className="font-bold text-primary arabic-numbers">
                            {item.price} {t('unit.sdg')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 p-0 border-gray-200"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center font-medium arabic-numbers">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 p-0 border-gray-200"
                          >
                            <Plus size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 ml-2"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="bg-white border border-gray-100">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="font-semibold arabic-numbers">
                        {calculateSubtotal()} {t('unit.sdg')}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                        <span className="text-primary arabic-numbers">
                          {calculateSubtotal()} {t('unit.sdg')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary text-white h-12"
              >
                {language === 'ar' ? 'متابعة للدفع' : 'Proceed to Checkout'}
                <ArrowRight size={18} className={getMargin('2', '0')} />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Delivery Step
  if (currentStep === 'delivery') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'اختيار التوصيل' : 'Delivery Options'}
            </h1>
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('cart')}
              className="text-gray-500"
            >
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
            </h3>
            {addresses.length === 0 ? (
              <Card className="p-4 text-center border-dashed border-gray-300">
                <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-3">
                  {language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
                </p>
                <Button
                  onClick={() => navigateTo('address-management')}
                  variant="outline"
                  size="sm"
                >
                  {language === 'ar' ? 'إضافة عنوان' : 'Add Address'}
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`cursor-pointer transition-all border ${
                      selectedAddress?.id === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                    onClick={() => selectAddress(address)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin size={18} className="text-gray-400 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {language === 'ar' ? address.title : address.titleEn}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {language === 'ar' ? address.street : address.streetEn}
                            </p>
                            <p className="text-sm text-gray-500">
                              {address.phone}
                            </p>
                          </div>
                        </div>
                        {address.isDefault && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                            {language === 'ar' ? 'افتراضي' : 'Default'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => navigateTo('address-management')}
                  className="w-full border-dashed"
                >
                  {language === 'ar' ? 'إدارة العناوين' : 'Manage Addresses'}
                </Button>
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'طريقة التوصيل' : 'Delivery Method'}
            </h3>
            <div className="space-y-3">
              {deliveryOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all border ${
                    selectedDeliveryOption?.id === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                  } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => option.available && selectDeliveryOption(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{option.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {language === 'ar' ? option.name : option.nameEn}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === 'ar' ? option.description : option.descriptionEn}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? option.estimatedTime : option.estimatedTimeEn}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 arabic-numbers">
                          {option.price === 0 
                            ? (language === 'ar' ? 'مجاني' : 'Free')
                            : `${option.price} ${t('unit.sdg')}`
                          }
                        </p>
                        {!option.available && (
                          <Badge variant="secondary" className="text-xs">
                            {language === 'ar' ? 'غير متاح' : 'Unavailable'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Slot Selection (for scheduled delivery) */}
          {selectedDeliveryOption?.id === 'scheduled' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'اختيار الوقت' : 'Select Time'}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>{language === 'ar' ? 'التاريخ' : 'Date'}</Label>
                  <Input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'الوقت' : 'Time Slot'}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => selectTimeSlot(slot)}
                        className={`h-12 ${!slot.available ? 'opacity-50' : ''}`}
                      >
                        {language === 'ar' ? slot.time : slot.timeEn}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Options */}
          <Card className="bg-white border border-gray-100">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield size={18} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language === 'ar' ? 'توصيل بدون تلامس' : 'Contactless Delivery'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'ترك الطلب عند الباب' : 'Leave order at the door'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={contactlessDelivery}
                  onCheckedChange={setContactlessDelivery}
                />
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleDeliveryNext}
            className="w-full bg-primary text-white h-12"
            disabled={!selectedAddress || !selectedDeliveryOption}
          >
            {language === 'ar' ? 'متابعة للدفع' : 'Continue to Payment'}
            <ArrowRight size={18} className={getMargin('2', '0')} />
          </Button>
        </div>
      </div>
    );
  }

  // Payment Step
  if (currentStep === 'payment') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </h1>
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('delivery')}
              className="text-gray-500"
            >
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
            </h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <Card className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cash" id="cash" />
                      <div className="flex items-center space-x-3 flex-1">
                        <Banknote size={24} className="text-gray-600" />
                        <div>
                          <Label htmlFor="cash" className="font-medium cursor-pointer">
                            {language === 'ar' ? 'الدفع عند التوصيل' : 'Cash on Delivery'}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? 'ادفع نقداً عند وصول الطلب' : 'Pay cash when order arrives'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-100 opacity-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="card" id="card" disabled />
                      <div className="flex items-center space-x-3 flex-1">
                        <CreditCard size={24} className="text-gray-400" />
                        <div>
                          <Label htmlFor="card" className="font-medium text-gray-400">
                            {language === 'ar' ? 'بطاقة الائتمان' : 'Credit Card'}
                          </Label>
                          <p className="text-sm text-gray-400">
                            {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="instructions" className="font-medium">
              {language === 'ar' ? 'تعليمات خاصة' : 'Special Instructions'}
            </Label>
            <textarea
              id="instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={language === 'ar' ? 'أي تعليمات إضافية للصيدلي أو السائق' : 'Any additional instructions for pharmacist or driver'}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg resize-none"
              rows={3}
            />
          </div>

          {/* Order Summary */}
          <Card className="bg-white border border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{language === 'ar' ? 'المنتجات' : 'Items'}</span>
                <span className="arabic-numbers">{calculateSubtotal()} {t('unit.sdg')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{language === 'ar' ? 'التوصيل' : 'Delivery'}</span>
                <span className="arabic-numbers">
                  {calculateDeliveryFee() === 0 
                    ? (language === 'ar' ? 'مجاني' : 'Free')
                    : `${calculateDeliveryFee()} ${t('unit.sdg')}`
                  }
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-primary arabic-numbers">
                    {calculateTotal()} {t('unit.sdg')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-primary text-white h-12"
          >
            {language === 'ar' ? 'تأكيد الطلب' : 'Place Order'}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (currentStep === 'confirmation') {
    return (
      <div className="h-full flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm text-center bg-white border border-gray-100">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'سيتم توصيل طلبك قريباً. يمكنك تتبع الطلب من خلال صفحة الطلبات.'
                : 'Your order will be delivered soon. You can track your order from the orders page.'
              }
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigateTo('order-history')}
                className="w-full bg-primary text-white"
              >
                {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateTo('home')}
                className="w-full"
              >
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}