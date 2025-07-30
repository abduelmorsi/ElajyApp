import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDelivery } from './services/DeliveryService';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function CartScreen({ cartItems, setCartItems, navigateTo, goBack }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
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

  const [currentStep, setCurrentStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specialInstructions, setSpecialInstructions] = useState('');

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
    // Add toast here if you use a toast library
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Helper functions for payment step
  const calculateDeliveryFee = () => {
    if (!selectedDeliveryOption) return 0;
    return selectedDeliveryOption.price || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const handlePlaceOrder = () => {
    // You can add order creation logic here
    setCurrentStep('confirmation');
  };

  // Render back button if goBack is provided
  const renderBackButton = () => goBack ? (
    <TouchableOpacity onPress={goBack} style={{ marginRight: 12 }}>
      <Text style={{ fontSize: 24 }}>{language === 'ar' ? '←' : '←'}</Text>
    </TouchableOpacity>
  ) : null;

  // Cart Step
  if (currentStep === 'cart') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            {renderBackButton()}
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            </Text>
            {cartItems.length > 0 && (
              <Text style={styles.headerSubtitle}>
                {cartItems.length} {language === 'ar' ? 'منتجات' : 'items'}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            {/* Empty space to balance the layout */}
          </View>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="shopping-cart" size={48} color="#bbb" style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>
                  {language === 'ar' ? 'السلة فارغة' : 'Cart is Empty'}
                </Text>
                <Text style={styles.emptyDesc}>
                  {language === 'ar' ? 'ابدأ بإضافة منتجات لسلة التسوق' : 'Start adding items to your cart'}
                </Text>
                <TouchableOpacity style={styles.shopBtn} onPress={() => navigateTo('search')}>
                  <Text style={styles.shopBtnText}>
                    {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Cart Items */}
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItemCard}>
                    <View style={styles.cartItemRow}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.cartItemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>
                          {language === 'ar' ? item.name : item.nameEn}
                        </Text>
                        <Text style={styles.cartItemBrand}>
                          {language === 'ar' ? item.brand : item.brandEn}
                        </Text>
                        <Text style={styles.cartItemPrice}>
                          {item.price} {t('unit.sdg')}
                        </Text>
                      </View>
                      <View style={styles.cartItemActions}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                          <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                          <Icon name="delete" size={20} color="#e00" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
                {/* Order Summary */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</Text>
                    <Text style={styles.summaryValue}>
                      {calculateSubtotal()} {t('unit.sdg')}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{language === 'ar' ? 'الإجمالي' : 'Total'}</Text>
                    <Text style={styles.summaryTotalValue}>
                      {calculateSubtotal()} {t('unit.sdg')}
                    </Text>
                  </View>
                </View>
                {/* Checkout Button */}
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCurrentStep('delivery')}>
                  <Text style={styles.checkoutBtnText}>
                    {language === 'ar' ? 'متابعة للدفع' : 'Proceed to Checkout'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
      </SafeAreaView>
    );
  }

  // Delivery Step
  if (currentStep === 'delivery') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setCurrentStep('cart')} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 24 }}>{language === 'ar' ? '←' : '←'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {language === 'ar' ? 'اختيار التوصيل' : 'Delivery Options'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* Empty space to balance the layout */}
          </View>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* Delivery Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
            </Text>
            {addresses.length === 0 ? (
              <View style={styles.emptyAddress}>
                <Icon name="location-on" size={48} color="#bbb" style={styles.emptyAddressIcon} />
                <Text style={styles.emptyAddressText}>
                  {language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
                </Text>
                <TouchableOpacity
                  style={styles.addAddressBtn}
                  onPress={() => navigateTo('address-management')}
                >
                  <Text style={styles.addAddressBtnText}>
                    {language === 'ar' ? 'إضافة عنوان' : 'Add Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressCard,
                      selectedAddress?.id === address.id && styles.selectedAddressCard
                    ]}
                    onPress={() => selectAddress(address)}
                  >
                    <Text style={styles.addressTitle}>
                      {language === 'ar' ? address.title : address.titleEn}
                    </Text>
                    <Text style={styles.addressDetails}>
                      {language === 'ar' ? address.street : address.streetEn}
                    </Text>
                    <Text style={styles.addressPhone}>{address.phone}</Text>
                    {address.isDefault && (
                      <Text style={styles.defaultBadge}>
                        {language === 'ar' ? 'افتراضي' : 'Default'}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.manageAddressesBtn}
                  onPress={() => navigateTo('address-management')}
                >
                  <Text style={styles.manageAddressesBtnText}>
                    {language === 'ar' ? 'إدارة العناوين' : 'Manage Addresses'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Delivery Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'طريقة التوصيل' : 'Delivery Method'}
            </Text>
            {deliveryOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.deliveryOptionCard,
                  selectedDeliveryOption?.id === option.id && styles.selectedDeliveryOptionCard,
                  !option.available && styles.disabledDeliveryOption
                ]}
                onPress={() => option.available && selectDeliveryOption(option)}
                disabled={!option.available}
              >
                <View style={styles.deliveryOptionContent}>
                  <Text style={styles.deliveryOptionName}>
                    {language === 'ar' ? option.name : option.nameEn}
                  </Text>
                  <Text style={styles.deliveryOptionDescription}>
                    {language === 'ar' ? option.description : option.descriptionEn}
                  </Text>
                  <Text style={styles.deliveryOptionTime}>
                    {language === 'ar' ? option.estimatedTime : option.estimatedTimeEn}
                  </Text>
                </View>
                <View style={styles.deliveryOptionPriceContainer}>
                  <Text style={styles.deliveryOptionPrice}>
                    {option.price === 0 
                      ? (language === 'ar' ? 'مجاني' : 'Free')
                      : `${option.price} ${t('unit.sdg')}`
                    }
                  </Text>
                  {!option.available && (
                    <Text style={styles.unavailableBadge}>
                      {language === 'ar' ? 'غير متاح' : 'Unavailable'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Slot Selection (for scheduled delivery) */}
          {selectedDeliveryOption?.id === 'scheduled' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'ar' ? 'اختيار الوقت' : 'Select Time'}
              </Text>
              <View style={styles.timeSlotContainer}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerLabel}>{language === 'ar' ? 'التاريخ' : 'Date'}</Text>
                  <TouchableOpacity style={styles.datePicker} onPress={() => {}}>
                    <Text style={styles.datePickerText}>
                      {selectedDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeSlots}>
                  {getTimeSlots(selectedDate).map((slot) => (
                    <TouchableOpacity
                      key={slot.id}
                      style={[
                        styles.timeSlotButton,
                        selectedTimeSlot?.id === slot.id && styles.selectedTimeSlotButton,
                        !slot.available && styles.disabledTimeSlotButton
                      ]}
                      onPress={() => slot.available && selectTimeSlot(slot)}
                      disabled={!slot.available}
                    >
                      <Text style={styles.timeSlotText}>
                        {language === 'ar' ? slot.time : slot.timeEn}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Special Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'خيارات خاصة' : 'Special Options'}
            </Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>
                {language === 'ar' ? 'توصيل بدون تلامس' : 'Contactless Delivery'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  contactlessDelivery && styles.switchButtonActive
                ]}
                onPress={() => setContactlessDelivery(!contactlessDelivery)}
              >
                <View style={[
                  styles.switchIndicator,
                  contactlessDelivery && styles.switchIndicatorActive
                ]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => setCurrentStep('payment')}
            disabled={!selectedAddress || !selectedDeliveryOption}
          >
            <Text style={styles.checkoutBtnText}>
              {language === 'ar' ? 'متابعة للدفع' : 'Continue to Payment'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Payment Step
  if (currentStep === 'payment') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setCurrentStep('delivery')} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 24 }}>{language === 'ar' ? '←' : '←'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* Empty space to balance the layout */}
          </View>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
              styles.radioOption,
              paymentMethod === 'cash' && styles.selectedRadioOption
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <View style={styles.radioIndicator}>
                  {paymentMethod === 'cash' && <View style={styles.radioInnerIndicator} />}
                </View>
                <Text style={styles.radioLabel}>
                  {language === 'ar' ? 'الدفع عند التوصيل' : 'Cash on Delivery'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
              styles.radioOption,
              paymentMethod === 'card' && styles.selectedRadioOption,
              styles.disabledRadioOption
                ]}
                onPress={() => {}}
                disabled
              >
                <View style={styles.radioIndicator}>
                  {paymentMethod === 'card' && <View style={styles.radioInnerIndicator} />}
                </View>
                <Text style={styles.radioLabelDisabled}>
                  {language === 'ar' ? 'بطاقة الائتمان' : 'Credit Card'}
                </Text>
                <Text style={styles.comingSoonLabel}>
                  {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.instructionsLabel}>
              {language === 'ar' ? 'تعليمات خاصة' : 'Special Instructions'}
            </Text>
            <TextInput
              style={styles.instructionsInput}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder={language === 'ar' ? 'أي تعليمات إضافية للصيدلي أو السائق' : 'Any additional instructions for pharmacist or driver'}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'ar' ? 'المنتجات' : 'Items'}</Text>
              <Text style={styles.summaryValue}>
                {calculateSubtotal()} {t('unit.sdg')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'ar' ? 'التوصيل' : 'Delivery'}</Text>
              <Text style={styles.summaryValue}>
                {calculateDeliveryFee() === 0 
                  ? (language === 'ar' ? 'مجاني' : 'Free')
                  : `${calculateDeliveryFee()} ${t('unit.sdg')}`
                }
              </Text>
            </View>
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>{language === 'ar' ? 'الإجمالي' : 'Total'}</Text>
              <Text style={styles.summaryTotalValue}>
                {calculateTotal()} {t('unit.sdg')}
              </Text>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderButtonText}>
              {language === 'ar' ? 'تأكيد الطلب' : 'Place Order'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Confirmation Step
  if (currentStep === 'confirmation') {
    return (
      <View style={styles.container}>
        <View style={styles.confirmationCard}>
          <Icon name="check-circle" size={64} color="#22c55e" style={styles.confirmationIcon} />
          <Text style={styles.confirmationTitle}>
            {language === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
          </Text>
          <Text style={styles.confirmationMessage}>
            {language === 'ar' 
              ? 'سيتم توصيل طلبك قريباً. يمكنك تتبع الطلب من خلال صفحة الطلبات.'
              : 'Your order will be delivered soon. You can track your order from the orders page.'
            }
          </Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={styles.trackOrderButton}
              onPress={() => navigateTo('order-history')}
            >
              <Text style={styles.trackOrderButtonText}>
                {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => navigateTo('home')}
            >
              <Text style={styles.backToHomeButtonText}>
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Payment step styles
  radioGroup: { flexDirection: 'column', gap: 12, marginTop: 8 },
  radioOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: '#fff' },
  selectedRadioOption: { borderColor: '#49C5B8', backgroundColor: '#e6f7ff' },
  disabledRadioOption: { opacity: 0.5 },
  radioIndicator: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#49C5B8', alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: '#fff' },
  radioInnerIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#49C5B8' },
  radioLabel: { fontSize: 15, color: '#222', fontWeight: 'bold' },
  radioLabelDisabled: { fontSize: 15, color: '#bbb', fontWeight: 'bold' },
  comingSoonLabel: { fontSize: 12, color: '#888', marginLeft: 8 },
  instructionsLabel: { fontSize: 15, color: '#222', fontWeight: 'bold', marginBottom: 6 },
  instructionsInput: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, fontSize: 14, color: '#222', minHeight: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee' },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    paddingHorizontal: 24, 
    paddingVertical: 16,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center' },
  headerSubtitle: { fontSize: 13, color: '#666', textAlign: 'center' },
  content: { padding: 24 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center', padding: 32, marginBottom: 16 },
  emptyIcon: { marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  emptyDesc: { color: '#666', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  shopBtn: { backgroundColor: '#49C5B8', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8 },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cartItemCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 12, padding: 12 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center' },
  cartItemImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f3f3f3', marginRight: 12 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  cartItemBrand: { color: '#888', fontSize: 12 },
  cartItemPrice: { color: '#49C5B8', fontWeight: 'bold', fontSize: 14 },
  cartItemActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  qtyBtn: { backgroundColor: '#eee', borderRadius: 6, padding: 6, marginHorizontal: 2 },
  qtyBtnText: { fontSize: 16, color: '#49C5B8', fontWeight: 'bold' },
  qtyText: { width: 24, textAlign: 'center', fontWeight: 'bold', fontSize: 15 },
  removeBtn: { marginLeft: 8, padding: 4 },
  removeBtnText: { fontSize: 16, color: '#e00' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginTop: 16, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryValue: { fontWeight: 'bold', fontSize: 14 },
  summaryTotalRow: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 8 },
  summaryTotalLabel: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  summaryTotalValue: { color: '#49C5B8', fontWeight: 'bold', fontSize: 16 },
  checkoutBtn: { backgroundColor: '#49C5B8', borderRadius: 8, alignItems: 'center', paddingVertical: 16, marginTop: 16 },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { color: '#49C5B8', fontWeight: 'bold', fontSize: 15 },
  section: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', padding: 16, marginBottom: 16 },
  sectionTitle: { fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 12 },
  emptyAddress: { alignItems: 'center', padding: 32 },
  emptyAddressIcon: { marginBottom: 12 },
  emptyAddressText: { color: '#666', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  addAddressBtn: { backgroundColor: '#49C5B8', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12 },
  addAddressBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  addressCard: { padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  selectedAddressCard: { borderColor: '#49C5B8', backgroundColor: '#e6f7ff' },
  addressTitle: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  addressDetails: { color: '#666', fontSize: 14 },
  addressPhone: { color: '#49C5B8', fontWeight: 'bold', fontSize: 14 },
  defaultBadge: { backgroundColor: '#49C5B8', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, color: '#fff', fontSize: 12, fontWeight: 'bold' },
  manageAddressesBtn: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 12 },
  manageAddressesBtnText: { color: '#49C5B8', fontWeight: 'bold', fontSize: 15 },
  deliveryOptionCard: { padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  selectedDeliveryOptionCard: { borderColor: '#49C5B8', backgroundColor: '#e6f7f5' },
  disabledDeliveryOption: { opacity: 0.6 },
  deliveryOptionContent: { marginBottom: 8 },
  deliveryOptionName: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  deliveryOptionDescription: { color: '#666', fontSize: 14 },
  deliveryOptionTime: { color: '#888', fontSize: 13 },
  deliveryOptionPriceContainer: { alignItems: 'flex-end' },
  deliveryOptionPrice: { color: '#49C5B8', fontWeight: 'bold', fontSize: 16 },
  unavailableBadge: { backgroundColor: '#f44336', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, color: '#fff', fontSize: 12, fontWeight: 'bold' },
  timeSlotContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  datePickerContainer: { flex: 1, marginRight: 8 },
  datePickerLabel: { color: '#666', fontSize: 14, marginBottom: 4 },
  datePicker: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  datePickerText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  timeSlots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeSlotButton: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8 },
  selectedTimeSlotButton: { backgroundColor: '#49C5B8' },
  disabledTimeSlotButton: { opacity: 0.6 },
  timeSlotText: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  optionLabel: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  switchButton: { width: 50, height: 28, borderRadius: 14, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  switchButtonActive: { backgroundColor: '#49C5B8' },
  switchIndicator: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  switchIndicatorActive: { transform: [{ translateX: 0 }] },
  placeOrderButton: { backgroundColor: '#49C5B8', borderRadius: 8, paddingVertical: 16, marginTop: 16 },
  placeOrderButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  confirmationCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', padding: 24, alignItems: 'center' },
  confirmationIcon: { marginBottom: 16 },
  confirmationTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  confirmationMessage: { color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  confirmationButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  trackOrderButton: { flex: 1, backgroundColor: '#49C5B8', borderRadius: 8, paddingVertical: 16, marginRight: 8 },
  trackOrderButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  backToHomeButton: { flex: 1, borderRadius: 8, paddingVertical: 16, borderWidth: 1, borderColor: '#49C5B8' },
  backToHomeButtonText: { color: '#49C5B8', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});