import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';
import MedicineImage from '../ui/MedicineImage';

// Define the interface for PharmacistInventory's props
interface PharmacistInventoryProps {
  navigateTo: (screen: string, data?: any) => void;
  // Based on your App.tsx, userData is passed, so include it here.
  // Mark as optional if it's not strictly used in this specific component's logic right now
  userData?: {
    id?: string;
    name?: string;
    email?: string;
    pharmacy?: {
      name?: string;
    };
    // Add other relevant user data properties if this component will use them
  };
}

// Define the type for an Inventory Item for better type safety
interface InventoryItem {
  id: number;
  name: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  supplier: string;
  expiryDate: string; // ISO 8601 string or Date if parsed
  location: string;
  status: 'normal' | 'low' | 'critical'; // Specific literal types
}

// Sample inventory data - will be moved inside component

// Apply the interface to the component's function signature

export default function PharmacistInventory({ navigateTo, userData }: PharmacistInventoryProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'critical' | 'expiring'>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addStockModalVisible, setAddStockModalVisible] = useState(false);
  const [addNewMedicineModalVisible, setAddNewMedicineModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Sample inventory data with Arabic localization
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: language === 'ar' ? "باراسيتامول 500 مجم" : "Paracetamol 500mg",
      brand: language === 'ar' ? "عام" : "Generic",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      price: 12.99,
      supplier: language === 'ar' ? "شركة إمداد الأدوية" : "MedSupply Inc",
      expiryDate: "2025-06-15",
      location: "A1-B2",
      status: "normal"
    },
    {
      id: 2,
      name: language === 'ar' ? "فيتامين د3 1000 وحدة" : "Vitamin D3 1000IU",
      brand: language === 'ar' ? "هيلث بلس" : "HealthPlus",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      price: 24.99,
      supplier: language === 'ar' ? "فيتاكور" : "VitaCorr",
      expiryDate: "2025-12-30",
      location: "B2-C1",
      status: "low"
    },
    {
      id: 3,
      name: language === 'ar' ? "أموكسيسيلين 250 مجم" : "Amoxicillin 250mg",
      brand: language === 'ar' ? "أموكسيل" : "Amoxil",
      currentStock: 3,
      minStock: 10,
      maxStock: 30,
      price: 25.99,
      supplier: language === 'ar' ? "فارماكورب" : "PharmaCorp",
      expiryDate: "2024-08-20",
      location: "C1-D3",
      status: "critical"
    },
    {
      id: 4,
      name: language === 'ar' ? "إيبوبروفين 400 مجم" : "Ibuprofen 400mg",
      brand: language === 'ar' ? "أدفيل" : "Advil",
      currentStock: 67,
      minStock: 25,
      maxStock: 75,
      price: 18.99,
      supplier: language === 'ar' ? "شركة إمداد الأدوية" : "MedSupply Inc",
      expiryDate: "2025-03-10",
      location: "A2-B1",
      status: "normal"
    }
  ];
  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    price: '',
    minStock: '',
    maxStock: '',
    location: '',
    supplier: ''
  });
  const [addStockAmount, setAddStockAmount] = useState('');
  const [newMedicineForm, setNewMedicineForm] = useState({
    name: '',
    brand: '',
    price: '',
    minStock: '',
    maxStock: '',
    location: '',
    supplier: '',
    expiryDate: '',
    initialStock: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'low': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'critical': return { backgroundColor: '#fecaca', color: '#991b1b' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return 'check-circle';
      case 'low': return 'warning';
      case 'critical': return 'error';
      default: return 'help';
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    switch (selectedFilter) {
      case 'low': return item.status === 'low';
      case 'critical': return item.status === 'critical';
      case 'expiring': return new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      default: return true;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SD' : 'en-US', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      brand: item.brand,
      price: item.price.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      location: item.location,
      supplier: item.supplier
    });
    setEditModalVisible(true);
  };

  const handleAddStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setAddStockAmount('');
    setAddStockModalVisible(true);
  };

  const saveEditChanges = () => {
    if (!selectedItem) return;

    // Validate form
    if (!editForm.name || !editForm.brand || !editForm.price || !editForm.minStock || !editForm.maxStock || !editForm.location || !editForm.supplier) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
      );
      return;
    }

    // Update the item in the inventory
    const itemIndex = inventoryItems.findIndex(item => item.id === selectedItem.id);
    if (itemIndex !== -1) {
      inventoryItems[itemIndex] = {
        ...inventoryItems[itemIndex],
        name: editForm.name,
        brand: editForm.brand,
        price: parseFloat(editForm.price),
        minStock: parseInt(editForm.minStock),
        maxStock: parseInt(editForm.maxStock),
        location: editForm.location,
        supplier: editForm.supplier
      };
    }

    setEditModalVisible(false);
    setSelectedItem(null);
    Alert.alert(
      language === 'ar' ? 'تم التحديث' : 'Updated',
      language === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully'
    );
  };

  const saveAddStock = () => {
    if (!selectedItem || !addStockAmount) return;

    const amount = parseInt(addStockAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال كمية صحيحة' : 'Please enter a valid amount'
      );
      return;
    }

    // Update the stock in the inventory
    const itemIndex = inventoryItems.findIndex(item => item.id === selectedItem.id);
    if (itemIndex !== -1) {
      inventoryItems[itemIndex].currentStock += amount;
    }

    setAddStockModalVisible(false);
    setSelectedItem(null);
    setAddStockAmount('');
    Alert.alert(
      language === 'ar' ? 'تم الإضافة' : 'Added',
      language === 'ar' ? `تم إضافة ${amount} وحدة إلى المخزون` : `${amount} units added to stock`
    );
  };

  const handleAddNewMedicine = () => {
    setNewMedicineForm({
      name: '',
      brand: '',
      price: '',
      minStock: '',
      maxStock: '',
      location: '',
      supplier: '',
      expiryDate: '',
      initialStock: ''
    });
    setAddNewMedicineModalVisible(true);
  };

  const saveNewMedicine = () => {
    // Validate form
    if (!newMedicineForm.name || !newMedicineForm.brand || !newMedicineForm.price || 
        !newMedicineForm.minStock || !newMedicineForm.maxStock || !newMedicineForm.location || 
        !newMedicineForm.supplier || !newMedicineForm.expiryDate || !newMedicineForm.initialStock) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
      );
      return;
    }

    const initialStock = parseInt(newMedicineForm.initialStock);
    const minStock = parseInt(newMedicineForm.minStock);
    const maxStock = parseInt(newMedicineForm.maxStock);
    const price = parseFloat(newMedicineForm.price);

    if (isNaN(initialStock) || isNaN(minStock) || isNaN(maxStock) || isNaN(price) || 
        initialStock < 0 || minStock < 0 || maxStock < 0 || price < 0) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال قيم صحيحة للأرقام' : 'Please enter valid numeric values'
      );
      return;
    }

    if (minStock > maxStock) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'الحد الأدنى للمخزون يجب أن يكون أقل من الحد الأقصى' : 'Minimum stock must be less than maximum stock'
      );
      return;
    }

    // Determine status based on initial stock
    let status: 'normal' | 'low' | 'critical' = 'normal';
    if (initialStock <= minStock * 0.5) {
      status = 'critical';
    } else if (initialStock <= minStock) {
      status = 'low';
    }

    // Create new medicine item
    const newMedicine: InventoryItem = {
      id: Math.max(...inventoryItems.map(item => item.id)) + 1,
      name: newMedicineForm.name,
      brand: newMedicineForm.brand,
      currentStock: initialStock,
      minStock: minStock,
      maxStock: maxStock,
      price: price,
      supplier: newMedicineForm.supplier,
      expiryDate: newMedicineForm.expiryDate,
      location: newMedicineForm.location,
      status: status
    };

    // Add to inventory
    inventoryItems.push(newMedicine);

    setAddNewMedicineModalVisible(false);
    setNewMedicineForm({
      name: '',
      brand: '',
      price: '',
      minStock: '',
      maxStock: '',
      location: '',
      supplier: '',
      expiryDate: '',
      initialStock: ''
    });

    Alert.alert(
      language === 'ar' ? 'تم الإضافة' : 'Added',
      language === 'ar' ? 'تم إضافة الدواء الجديد بنجاح' : 'New medicine added successfully'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
             {/* Fixed Header */}
       <View style={[styles.header, { paddingTop: insets.top }]}>
         <TouchableOpacity onPress={() => navigateTo('pharmacist-dashboard')} style={styles.backButton}>
           <Icon name="arrow-back" size={24} color="#222" />
         </TouchableOpacity>
         <View style={styles.headerContent}>
           <Text style={styles.headerTitle}>
             {t('pharmacist.inventory.title')}
           </Text>
         </View>
         <TouchableOpacity onPress={handleAddNewMedicine} style={styles.addButton}>
           <Icon name="add" size={24} color="#49C5B8" />
         </TouchableOpacity>
       </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.body}>
          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>{t('pharmacist.inventory.quantity')}</Text>
                  <Text style={styles.summaryValue}>{inventoryItems.length}</Text>
                </View>
                <View style={styles.summaryIconBox}>
                  <Icon name="inventory" size={24} color="#49C5B8" />
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>{t('pharmacist.inventory.lowStock')}</Text>
                  <Text style={styles.summaryValue}>{inventoryItems.filter(item => item.status === 'low').length}</Text>
                </View>
                <View style={styles.summaryIconBox}>
                  <Icon name="warning" size={24} color="#49C5B8" />
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>{t('pharmacist.inventory.outOfStock')}</Text>
                  <Text style={styles.summaryValue}>{inventoryItems.filter(item => item.status === 'critical').length}</Text>
                </View>
                <View style={styles.summaryIconBox}>
                  <Icon name="error" size={24} color="#49C5B8" />
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>{t('pharmacist.inventory.expiryDate')}</Text>
                  <Text style={styles.summaryValue}>{inventoryItems.filter(item => new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}</Text>
                </View>
                <View style={styles.summaryIconBox}>
                  <Icon name="schedule" size={24} color="#49C5B8" />
                </View>
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.activeFilterTabText]}>
                {t('pharmacist.inventory.all')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'low' && styles.activeFilterTab]}
              onPress={() => setSelectedFilter('low')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'low' && styles.activeFilterTabText]}>
                {t('pharmacist.inventory.low')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'critical' && styles.activeFilterTab]}
              onPress={() => setSelectedFilter('critical')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'critical' && styles.activeFilterTabText]}>
                {t('pharmacist.inventory.critical')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'expiring' && styles.activeFilterTab]}
              onPress={() => setSelectedFilter('expiring')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'expiring' && styles.activeFilterTabText]}>
                {t('pharmacist.inventory.expiring')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inventory Items */}
          <View style={styles.inventoryList}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.inventoryCard}>
                <View style={styles.inventoryHeader}>
                  <View style={styles.itemImageContainer}>
                    <MedicineImage 
                      medicineId={item.id}
                      size={60}
                      borderRadius={8}
                      showBorder={true}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                  </View>
                  <View style={[styles.statusBadge, getStatusColor(item.status)]}>
                    <Icon name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status).color} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status).color }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.inventoryDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="inventory" size={16} color="#6b7280" />
                    <Text style={styles.detailLabel}>{t('pharmacist.inventory.currentStock')}:</Text>
                    <Text style={styles.detailValue}>{item.currentStock}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color="#6b7280" />
                    <Text style={styles.detailLabel}>{t('pharmacist.inventory.location')}:</Text>
                    <Text style={styles.detailValue}>{item.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="attach-money" size={16} color="#6b7280" />
                    <Text style={styles.detailLabel}>{t('pharmacist.inventory.price')}:</Text>
                    <Text style={styles.detailValue}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="event" size={16} color="#6b7280" />
                    <Text style={styles.detailLabel}>{t('pharmacist.inventory.expiry')}:</Text>
                    <Text style={styles.detailValue}>{new Date(item.expiryDate).toLocaleDateString()}</Text>
                  </View>
                </View>

                <View style={styles.inventoryActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEditItem(item)}>
                    <Icon name="edit" size={16} color="#49C5B8" />
                    <Text style={styles.actionButtonText}>{t('pharmacist.inventory.edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleAddStock(item)}>
                    <Icon name="add" size={16} color="#10b981" />
                    <Text style={styles.actionButtonText}>{t('pharmacist.inventory.addStock')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Item Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('pharmacist.inventory.editProduct')}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.productName')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({...editForm, name: text})}
                  placeholder={t('pharmacist.inventory.enterProductName')}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.category')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.brand}
                  onChangeText={(text) => setEditForm({...editForm, brand: text})}
                  placeholder={t('pharmacist.inventory.enterBrand')}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.price')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.price}
                  onChangeText={(text) => setEditForm({...editForm, price: text})}
                  placeholder={t('pharmacist.inventory.enterPrice')}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.minQuantity')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.minStock}
                  onChangeText={(text) => setEditForm({...editForm, minStock: text})}
                  placeholder={t('pharmacist.inventory.enterMinimum')}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.maximumStock')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.maxStock}
                  onChangeText={(text) => setEditForm({...editForm, maxStock: text})}
                  placeholder={t('pharmacist.inventory.enterMaximum')}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.location')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.location}
                  onChangeText={(text) => setEditForm({...editForm, location: text})}
                  placeholder={t('pharmacist.inventory.enterLocation')}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('pharmacist.inventory.manufacturer')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.supplier}
                  onChangeText={(text) => setEditForm({...editForm, supplier: text})}
                  placeholder={t('pharmacist.inventory.enterSupplier')}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('pharmacist.inventory.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveEditChanges}>
                <Text style={styles.saveButtonText}>{t('pharmacist.inventory.saveProduct')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Stock Modal */}
      <Modal
        visible={addStockModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddStockModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{language === 'ar' ? 'إضافة مخزون' : 'Add Stock'}</Text>
              <TouchableOpacity onPress={() => setAddStockModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedItem && (
                <View style={styles.stockInfo}>
                  <Text style={styles.stockInfoTitle}>{selectedItem.name}</Text>
                  <Text style={styles.stockInfoText}>
                    {language === 'ar' ? 'المخزون الحالي:' : 'Current Stock:'} {selectedItem.currentStock}
                  </Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{language === 'ar' ? 'الكمية المضافة' : 'Amount to Add'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={addStockAmount}
                  onChangeText={setAddStockAmount}
                  placeholder={language === 'ar' ? 'أدخل الكمية' : 'Enter amount'}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setAddStockModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveAddStock}>
                <Text style={styles.saveButtonText}>{language === 'ar' ? 'إضافة' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
                     </View>
         </View>
       </Modal>

       {/* Add New Medicine Modal */}
       <Modal
         visible={addNewMedicineModalVisible}
         animationType="slide"
         transparent={true}
         onRequestClose={() => setAddNewMedicineModalVisible(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>{language === 'ar' ? 'إضافة دواء جديد' : 'Add New Medicine'}</Text>
               <TouchableOpacity onPress={() => setAddNewMedicineModalVisible(false)}>
                 <Icon name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>

             <ScrollView style={styles.modalBody}>
               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'اسم الدواء' : 'Medicine Name'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.name}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, name: text})}
                   placeholder={language === 'ar' ? 'أدخل اسم الدواء' : 'Enter medicine name'}
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'العلامة التجارية' : 'Brand'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.brand}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, brand: text})}
                   placeholder={language === 'ar' ? 'أدخل العلامة التجارية' : 'Enter brand'}
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'السعر' : 'Price'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.price}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, price: text})}
                   placeholder={language === 'ar' ? 'أدخل السعر' : 'Enter price'}
                   keyboardType="numeric"
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'المخزون الأولي' : 'Initial Stock'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.initialStock}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, initialStock: text})}
                   placeholder={language === 'ar' ? 'أدخل المخزون الأولي' : 'Enter initial stock'}
                   keyboardType="numeric"
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'الحد الأدنى للمخزون' : 'Minimum Stock'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.minStock}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, minStock: text})}
                   placeholder={language === 'ar' ? 'أدخل الحد الأدنى' : 'Enter minimum stock'}
                   keyboardType="numeric"
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'الحد الأقصى للمخزون' : 'Maximum Stock'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.maxStock}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, maxStock: text})}
                   placeholder={language === 'ar' ? 'أدخل الحد الأقصى' : 'Enter maximum stock'}
                   keyboardType="numeric"
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'الموقع' : 'Location'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.location}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, location: text})}
                   placeholder={language === 'ar' ? 'أدخل الموقع' : 'Enter location'}
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'المورد' : 'Supplier'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.supplier}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, supplier: text})}
                   placeholder={language === 'ar' ? 'أدخل اسم المورد' : 'Enter supplier name'}
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>{language === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}</Text>
                 <TextInput
                   style={styles.textInput}
                   value={newMedicineForm.expiryDate}
                   onChangeText={(text) => setNewMedicineForm({...newMedicineForm, expiryDate: text})}
                   placeholder={language === 'ar' ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                 />
               </View>
             </ScrollView>

             <View style={styles.modalActions}>
               <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setAddNewMedicineModalVisible(false)}>
                 <Text style={styles.cancelButtonText}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveNewMedicine}>
                 <Text style={styles.saveButtonText}>{language === 'ar' ? 'إضافة' : 'Add'}</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
     </SafeAreaView>
   );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  body: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    minWidth: 160,
    elevation: 1,
  },
  summaryCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#555',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
            backgroundColor: '#e6f7f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeFilterTab: {
    backgroundColor: '#49C5B8',
  },
  filterTabText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inventoryList: {
    marginBottom: 18,
  },
  inventoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  itemBrand: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inventoryDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  inventoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#49C5B8',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  stockInfo: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  stockInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  stockInfoText: {
    fontSize: 14,
    color: '#666',
  },
});