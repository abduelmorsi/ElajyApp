import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeliveryAddress, useDelivery } from './services/DeliveryService';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function AddressManagement({ navigateTo, onSelectAddress = null, selectionMode = false }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, selectAddress } = useDelivery();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    street: '',
    streetEn: '',
    district: '',
    districtEn: '',
    city: '',
    cityEn: '',
    phone: '+249 ',
    isDefault: false,
    instructions: '',
    instructionsEn: ''
  });

  const handleSubmit = () => {
    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      setEditingAddress(null);
    } else {
      addAddress(formData);
    }
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      street: '',
      streetEn: '',
      district: '',
      districtEn: '',
      city: '',
      cityEn: '',
      phone: '+249 ',
      isDefault: false,
      instructions: '',
      instructionsEn: ''
    });
  };

  const handleEdit = (address: DeliveryAddress) => {
    setFormData({
      title: address.title,
      titleEn: address.titleEn,
      street: address.street,
      streetEn: address.streetEn,
      district: address.district,
      districtEn: address.districtEn,
      city: address.city,
      cityEn: address.cityEn,
      phone: address.phone,
      isDefault: address.isDefault,
      instructions: address.instructions || '',
      instructionsEn: address.instructionsEn || ''
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleAddressSelect = (address: DeliveryAddress) => {
    if (selectionMode && onSelectAddress) {
      selectAddress(address);
      onSelectAddress(address);
    }
  };

  // Replace with your icon logic for React Native
  const getAddressIcon = (title: string) => {
    // You can use a string or icon name for your RN icon library
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('منزل') || lowerTitle.includes('home')) return 'home';
    if (lowerTitle.includes('مكتب') || lowerTitle.includes('office') || lowerTitle.includes('عمل')) return 'briefcase';
    return 'map-pin';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectionMode ? (language === 'ar' ? 'اختر عنوان التوصيل' : 'Select Delivery Address') : (language === 'ar' ? 'إدارة العناوين' : 'Manage Addresses')}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
          {/* Replace below with your icon */}
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>{language === 'ar' ? 'إضافة عنوان' : 'Add Address'}</Text>
        </TouchableOpacity>
      </View>
      {/* Add/Edit Address Modal */}
      <Modal visible={showAddForm} animationType="slide" onRequestClose={() => setShowAddForm(false)}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingAddress 
              ? (language === 'ar' ? 'تعديل العنوان' : 'Edit Address')
              : (language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address')
            }
          </Text>
          {/* Form fields */}
          <View style={styles.formRow2Col}>
            <View style={styles.formCol}>
              <Text style={styles.label}>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={text => setFormData({ ...formData, title: text })}
                placeholder={language === 'ar' ? 'مثل: المنزل، المكتب' : 'e.g: Home, Office'}
              />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Text>
              <TextInput
                style={styles.input}
                value={formData.titleEn}
                onChangeText={text => setFormData({ ...formData, titleEn: text })}
                placeholder="e.g: Home, Office"
              />
            </View>
          </View>
          <Text style={styles.label}>{language === 'ar' ? 'الشارع والمنطقة' : 'Street & Area'}</Text>
          <TextInput
            style={styles.input}
            value={formData.street}
            onChangeText={text => setFormData({ ...formData, street: text })}
            placeholder={language === 'ar' ? 'شارع النيل، الخرطوم' : 'Nile Street, Khartoum'}
          />
          <Text style={styles.label}>{language === 'ar' ? 'الشارع والمنطقة (إنجليزي)' : 'Street & Area (English)'}</Text>
          <TextInput
            style={styles.input}
            value={formData.streetEn}
            onChangeText={text => setFormData({ ...formData, streetEn: text })}
            placeholder="Nile Street, Khartoum"
          />
          <View style={styles.formRow2Col}>
            <View style={styles.formCol}>
              <Text style={styles.label}>{language === 'ar' ? 'المحلية' : 'District'}</Text>
              <TextInput
                style={styles.input}
                value={formData.district}
                onChangeText={text => setFormData({ ...formData, district: text })}
                placeholder={language === 'ar' ? 'الخرطوم' : 'Khartoum'}
              />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>{language === 'ar' ? 'المدينة' : 'City'}</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={text => setFormData({ ...formData, city: text })}
                placeholder={language === 'ar' ? 'الخرطوم' : 'Khartoum'}
              />
            </View>
          </View>
          <Text style={styles.label}>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={text => setFormData({ ...formData, phone: text })}
            placeholder="+249 123 456 789"
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>{language === 'ar' ? 'تعليمات إضافية' : 'Additional Instructions'}</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={formData.instructions}
            onChangeText={text => setFormData({ ...formData, instructions: text })}
            placeholder={language === 'ar' ? 'الشقة رقم 5، الطابق الثاني' : 'Apartment 5, Second Floor'}
            multiline
          />
          <View style={styles.switchRow}>
            <Switch
              value={formData.isDefault}
              onValueChange={checked => setFormData({ ...formData, isDefault: checked })}
            />
            <Text style={styles.switchLabel}>{language === 'ar' ? 'جعل هذا العنوان افتراضي' : 'Make this default address'}</Text>
          </View>
          <View style={styles.formButtonRow}>
            <TouchableOpacity style={[styles.formButton, styles.formButtonPrimary]} onPress={handleSubmit}>
              <Text style={styles.formButtonText}>{editingAddress ? (language === 'ar' ? 'تحديث' : 'Update') : (language === 'ar' ? 'إضافة' : 'Add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.formButtonOutline]}
              onPress={() => {
                setShowAddForm(false);
                setEditingAddress(null);
                resetForm();
              }}
            >
              <Text style={styles.formButtonText}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      {/* Addresses List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {addresses.length === 0 ? (
          <View style={styles.emptyCard}>
            {/* Replace below with your icon */}
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>{language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No Saved Addresses'}</Text>
            <Text style={styles.emptyDesc}>{language === 'ar' ? 'أضف عنوان توصيل لتسهيل عملية الطلب' : 'Add a delivery address to streamline your ordering'}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>{language === 'ar' ? 'إضافة عنوان' : 'Add Address'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((address) => {
            const iconName = getAddressIcon(address.title);
            return (
              <TouchableOpacity
                key={address.id}
                style={[styles.addressCard, address.isDefault && styles.addressCardDefault]}
                onPress={() => handleAddressSelect(address)}
                activeOpacity={selectionMode ? 0.7 : 1}
              >
                <View style={styles.addressRow}>
                  <View style={styles.addressIconBox}>
                    {/* Replace below with your icon */}
                    <Text style={styles.addressIcon}>{iconName === 'home' ? '🏠' : iconName === 'briefcase' ? '💼' : '📍'}</Text>
                  </View>
                  <View style={styles.addressInfo}>
                    <View style={styles.addressTitleRow}>
                      <Text style={styles.addressTitle}>{language === 'ar' ? address.title : address.titleEn}</Text>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>{language === 'ar' ? 'افتراضي' : 'Default'}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addressStreet}>{language === 'ar' ? address.street : address.streetEn}</Text>
                    <Text style={styles.addressCity}>{language === 'ar' ? `${address.district}, ${address.city}` : `${address.districtEn}, ${address.cityEn}`}</Text>
                    <Text style={styles.addressPhone}>{address.phone}</Text>
                    {address.instructions ? (
                      <Text style={styles.addressInstructions}>{language === 'ar' ? address.instructions : address.instructionsEn}</Text>
                    ) : null}
                  </View>
                  {!selectionMode && (
                    <View style={styles.addressActions}>
                      {!address.isDefault && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setDefaultAddress(address.id)}>
                          <Text style={styles.actionBtnIcon}>★</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(address)}>
                        <Text style={styles.actionBtnIcon}>✎</Text>
                      </TouchableOpacity>
                      {addresses.length > 1 && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => deleteAddress(address.id)}>
                          <Text style={styles.actionBtnIcon}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addButtonIcon: { color: '#fff', fontSize: 18, marginRight: 4 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  modalContent: { padding: 24, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#222' },
  formRow2Col: { flexDirection: 'row', gap: 12 },
  formCol: { flex: 1 },
  label: { fontSize: 13, color: '#444', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, fontSize: 14, backgroundColor: '#fff', marginBottom: 4 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  switchLabel: { marginLeft: 8, fontSize: 13, color: '#444' },
  formButtonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  formButton: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 8 },
  formButtonPrimary: { backgroundColor: '#007bff' },
  formButtonOutline: { backgroundColor: '#eee' },
  formButtonText: { color: '#fff', fontWeight: 'bold' },
  listContent: { padding: 24, gap: 16 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center', padding: 32, marginBottom: 16 },
  emptyIcon: { fontSize: 40, color: '#bbb', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  emptyDesc: { color: '#666', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  addressCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 12, padding: 16 },
  addressCardDefault: { borderColor: '#007bff', borderWidth: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  addressIconBox: { width: 40, height: 40, backgroundColor: '#f3f3f3', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addressIcon: { fontSize: 18, color: '#666' },
  addressInfo: { flex: 1 },
  addressTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  addressTitle: { fontWeight: 'bold', color: '#222', fontSize: 15, marginRight: 6 },
  defaultBadge: { backgroundColor: '#e6f0ff', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 4 },
  defaultBadgeText: { color: '#007bff', fontSize: 11, fontWeight: 'bold' },
  addressStreet: { color: '#444', fontSize: 13, marginBottom: 2 },
  addressCity: { color: '#888', fontSize: 12 },
  addressPhone: { color: '#888', fontSize: 12 },
  addressInstructions: { color: '#bbb', fontSize: 11, marginTop: 2 },
  addressActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  actionBtn: { marginLeft: 6, padding: 4 },
  actionBtnIcon: { fontSize: 16, color: '#888' },
});