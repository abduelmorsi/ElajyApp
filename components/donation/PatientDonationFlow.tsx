
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { donationMedicines, participatingPharmacies } from './donationData';
import { calculateDonationTotal, getDemandColor } from './donationHelpers';
// TODO: Add correct imports for useLocalization and useRTL hooks if/when available

export default function PatientDonationFlow({ navigateTo }) {
  // TODO: Add localization and RTL support when hooks are available
  const language = 'ar'; // fallback for now
  const isRTL = false;
  const [currentStep, setCurrentStep] = useState('select-pharmacy');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [donationItems, setDonationItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

  // Handlers
  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setCurrentStep('select-medicines');
  };
  const handleAddToCart = (medicine) => {
    setDonationItems((prev) => [...prev, { ...medicine, quantity: 1 }]);
  };
  const handleUpdateQuantity = (id, quantity) => {
    setDonationItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };
  const handleConfirmDonation = () => {
    setCurrentStep('donation-complete');
  };

  // Filtered pharmacies
  const filteredPharmacies = participatingPharmacies.filter((pharmacy) =>
    (language === 'ar' ? pharmacy.name : pharmacy.nameEn)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Render functions
  const renderPharmacySelection = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Program Introduction */}
      <View style={styles.introCard}>
        <View style={styles.introContent}>
          <View style={styles.introIconBox}>
            <Text style={styles.introIcon}>❤️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>
              {language === 'ar' ? 'برنامج التبرع بالأدوية' : 'Medicine Donation Program'}
            </Text>
            <Text style={styles.introDesc}>
              {language === 'ar'
                ? 'ساعد المرضى المحتاجين من خلال التبرع بالأدوية. الصيدليات المشاركة ستقوم بتوزيع الأدوية على المرضى الأكثر حاجة.'
                : 'Help patients in need by donating medicines. Participating pharmacies will distribute medicines to the most needy patients.'}
            </Text>
            <View style={styles.introStatsRow}>
              <View style={styles.introStatBox}>
                <Text style={styles.introStatIcon}>👥</Text>
                <Text style={styles.introStatText}>{language === 'ar' ? '450+ مريض استفاد' : '450+ Patients Helped'}</Text>
              </View>
              <View style={styles.introStatBox}>
                <Text style={styles.introStatIcon}>📦</Text>
                <Text style={styles.introStatText}>{language === 'ar' ? '1,240 دواء تم التبرع به' : '1,240 Medicines Donated'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'ar' ? 'ابحث عن صيدلية...' : 'Search for pharmacy...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Participating Pharmacies */}
      <View>
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'الصيدليات المشاركة' : 'Participating Pharmacies'}
        </Text>
        <View>
          {filteredPharmacies.map((pharmacy) => (
            <TouchableOpacity
              key={pharmacy.id}
              style={styles.pharmacyCard}
              onPress={() => handlePharmacySelect(pharmacy)}
              activeOpacity={0.8}
            >
              <View style={styles.pharmacyCardContent}>
                <View style={styles.pharmacyImageBox}>
                  {/* No image property in pharmacy data, use a placeholder or skip */}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.pharmacyHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.pharmacyNameRow}>
                        <Text style={styles.pharmacyName}>
                          {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                        </Text>
                      </View>
                      <View style={styles.pharmacyLocationRow}>
                        <Text style={styles.pharmacyLocationIcon}>📍</Text>
                        <Text style={styles.pharmacyLocationText}>
                          {language === 'ar' ? pharmacy.address : pharmacy.addressEn}
                        </Text>
                      </View>
                      <View style={styles.pharmacyStatsRow}>
                        <View style={styles.pharmacyStatBox}>
                          <Text style={styles.pharmacyStatIcon}>⭐</Text>
                          <Text style={styles.pharmacyStatText}>{pharmacy.rating}</Text>
                        </View>
                        <Text style={styles.pharmacyStatText}>{pharmacy.donationsReceived} {language === 'ar' ? 'تبرع' : 'donations'}</Text>
                        <Text style={styles.pharmacyStatText}>{pharmacy.donationsDistributed} {language === 'ar' ? 'دواء وُزع' : 'medicines distributed'}</Text>
                      </View>
                      <View style={styles.pharmacyProgramsRow}>
                        {(language === 'ar' ? pharmacy.specialServices : pharmacy.specialServicesEn).map((program, index) => (
                          <Text key={index} style={styles.pharmacyProgramBadge}>{program}</Text>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.arrowIcon}>➡️</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
// ...existing code...

  const renderMedicineSelection = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Selected Pharmacy Info */}
      <View style={styles.selectedPharmacyCard}>
        <View style={styles.selectedPharmacyContent}>
          <View>
            <Text style={styles.selectedPharmacyLabel}>
              {language === 'ar' ? 'التبرع عبر:' : 'Donating through:'}
            </Text>
            <Text style={styles.selectedPharmacyName}>
              {language === 'ar' ? selectedPharmacy?.name : selectedPharmacy?.nameEn}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePharmacyBtn} onPress={() => setCurrentStep('select-pharmacy')}>
            <Text style={styles.changePharmacyBtnText}>{language === 'ar' ? 'تغيير' : 'Change'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medicine Selection */}
      <Text style={styles.sectionTitle}>{language === 'ar' ? 'الأدوية المطلوبة' : 'Needed Medicines'}</Text>
      {donationMedicines.map((medicine) => {
        const cartItem = donationItems.find(item => item.id === medicine.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        return (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineCardContent}>
              <ImageWithFallback
                src={medicine.image}
                alt={medicine.name}
                style={styles.medicineImage}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.medicineName}>{language === 'ar' ? medicine.name : medicine.nameEn}</Text>
                <Text style={styles.medicineDesc}>{language === 'ar' ? medicine.description : medicine.descriptionEn}</Text>
                <View style={styles.medicineInfoRow}>
                  <Text style={[styles.medicineBadge, { color: getDemandColor(language === 'ar' ? medicine.demand : medicine.demandEn) }]}> 
                    {language === 'ar' ? `الطلب: ${medicine.demand}` : `Demand: ${medicine.demandEn}`}
                  </Text>
                  <Text style={styles.medicinePrice}>
                    {medicine.estimatedValue} {language === 'ar' ? medicine.currency : medicine.currencyEn}
                  </Text>
                </View>
              </View>
              <View style={styles.medicineActions}>
                {quantity > 0 ? (
                  <View style={styles.qtyActions}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(medicine.id, quantity - 1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(medicine.id, quantity + 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.donateBtn} onPress={() => handleAddToCart(medicine)}>
                    <Text style={styles.donateBtnText}>{language === 'ar' ? 'تبرع' : 'Donate'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}

      {/* Donation Summary */}
      {donationItems.length > 0 && (
        <View style={styles.donationSummaryCard}>
          <Text style={styles.donationSummaryTitle}>{language === 'ar' ? 'ملخص التبرع' : 'Donation Summary'}</Text>
          {donationItems.map((item) => (
            <View key={item.id} style={styles.donationSummaryRow}>
              <Text style={styles.donationSummaryItem}>{language === 'ar' ? item.name : item.nameEn} × {item.quantity}</Text>
              <Text style={styles.donationSummaryAmount}>{item.price * item.quantity} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
            </View>
          ))}
          <View style={styles.donationSummaryTotalRow}>
            <Text style={styles.donationSummaryTotalLabel}>{language === 'ar' ? 'المجموع الكلي' : 'Total Amount'}</Text>
            <Text style={styles.donationSummaryTotalAmount}>{calculateDonationTotal(donationItems)} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          </View>
          <TouchableOpacity style={styles.continueBtn} onPress={() => setCurrentStep('confirm-donation')}>
            <Text style={styles.continueBtnText}>{language === 'ar' ? 'متابعة التبرع' : 'Continue Donation'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderConfirmDonation = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.confirmCard}>
        <Text style={styles.confirmTitle}>{language === 'ar' ? 'تأكيد التبرع' : 'Confirm Donation'}</Text>
        <View style={styles.confirmSection}>
          <Text style={styles.confirmSectionTitle}>{language === 'ar' ? 'الصيدلية' : 'Pharmacy'}</Text>
          <Text style={styles.confirmSectionText}>{language === 'ar' ? selectedPharmacy?.name : selectedPharmacy?.nameEn}</Text>
        </View>
        <View style={styles.confirmSection}>
          <Text style={styles.confirmSectionTitle}>{language === 'ar' ? 'الأدوية المتبرع بها' : 'Donated Medicines'}</Text>
          {donationItems.map((item) => (
            <View key={item.id} style={styles.confirmMedicineRow}>
              <Text style={styles.confirmMedicineName}>{language === 'ar' ? item.name : item.nameEn}</Text>
              <Text style={styles.confirmMedicineAmount}>{item.quantity} × {item.price} = {item.quantity * item.price} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
            </View>
          ))}
        </View>
        <View style={styles.confirmSection}>
          <Text style={styles.confirmSectionTitle}>{language === 'ar' ? 'رسالة للمرضى (اختيارية)' : 'Message to Patients (Optional)'}</Text>
          <TextInput
            style={styles.confirmMessageInput}
            value={donorMessage}
            onChangeText={setDonorMessage}
            placeholder={language === 'ar' 
              ? 'اكتب رسالة تشجيعية للمرضى المستفيدين...'
              : 'Write an encouraging message for the benefiting patients...'}
            multiline
            numberOfLines={3}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.confirmTotalRow}>
          <Text style={styles.confirmTotalLabel}>{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</Text>
          <Text style={styles.confirmTotalAmount}>{calculateDonationTotal(donationItems)} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmDonation}>
          <Text style={styles.confirmBtnText}>{language === 'ar' ? 'تأكيد التبرع' : 'Confirm Donation'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDonationComplete = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={styles.completeIconBox}>
        <Text style={styles.completeIcon}>✅</Text>
      </View>
      <View style={styles.completeTextBox}>
        <Text style={styles.completeTitle}>{language === 'ar' ? 'شكراً لك على تبرعك!' : 'Thank you for your donation!'}</Text>
        <Text style={styles.completeMessage}>
          {language === 'ar' 
            ? 'تم استلام تبرعك بنجاح. ستقوم الصيدلية بتقييم المرضى المحتاجين وتوزيع الأدوية عليهم.'
            : 'Your donation has been received successfully. The pharmacy will assess needy patients and distribute the medicines to them.'}
        </Text>
      </View>
      <View style={styles.completeDetailsCard}>
        <Text style={styles.completeDetailsTitle}>{language === 'ar' ? 'تفاصيل التبرع' : 'Donation Details'}</Text>
        <Text style={styles.completeDetailsText}>{donationItems.length} {language === 'ar' ? 'نوع دواء' : 'medicine types'}</Text>
        <Text style={styles.completeDetailsText}>{calculateDonationTotal(donationItems)} {language === 'ar' ? 'جنيه سوداني' : 'Sudanese Pounds'}</Text>
      </View>
      <TouchableOpacity style={styles.completeHomeBtn} onPress={() => navigateTo('home')}>
        <Text style={styles.completeHomeBtnText}>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.completeNewBtn}
        onPress={() => {
          setCurrentStep('select-pharmacy');
          setSelectedPharmacy(null);
          setDonationItems([]);
          setDonorMessage('');
        }}
      >
        <Text style={styles.completeNewBtnText}>{language === 'ar' ? 'تبرع جديد' : 'New Donation'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View>
      {currentStep === 'select-pharmacy' && renderPharmacySelection()}
      {currentStep === 'select-medicines' && renderMedicineSelection()}
      {currentStep === 'confirm-donation' && renderConfirmDonation()}
      {currentStep === 'donation-complete' && renderDonationComplete()}
    </View>
  );
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  introCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  introContent: { flexDirection: 'row', alignItems: 'center' },
  introIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  introIcon: { fontSize: 28 },
  introTitle: { fontWeight: 'bold', fontSize: 18, color: '#222', marginBottom: 4 },
  introDesc: { color: '#666', fontSize: 14, marginBottom: 8 },
  introStatsRow: { flexDirection: 'row', marginTop: 8 },
  introStatBox: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  introStatIcon: { fontSize: 18, marginRight: 4 },
  introStatText: { color: '#444', fontSize: 13 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, marginBottom: 16 },
  searchIcon: { fontSize: 18, color: '#888', marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#222', paddingVertical: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 10 },
  pharmacyCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 12, elevation: 1 },
  pharmacyCardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  pharmacyImageBox: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#f3f3f3', marginRight: 12, overflow: 'hidden' },
  pharmacyImage: { width: 56, height: 56, borderRadius: 8 },
  pharmacyHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  pharmacyNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  pharmacyName: { fontWeight: 'bold', fontSize: 15, color: '#222', marginRight: 6 },
  pharmacyBadge: { backgroundColor: '#e6f7ff', color: '#007bff', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, fontSize: 11, marginLeft: 4 },
  pharmacyLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  pharmacyLocationIcon: { fontSize: 13, color: '#888', marginRight: 2 },
  pharmacyLocationText: { color: '#666', fontSize: 13 },
  pharmacyStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  pharmacyStatBox: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  pharmacyStatIcon: { fontSize: 13, color: '#fbbf24', marginRight: 2 },
  pharmacyStatText: { color: '#888', fontSize: 12, marginRight: 8 },
  pharmacyProgramsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  pharmacyProgramBadge: { backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, fontSize: 11, marginRight: 4, marginBottom: 2 },
  arrowIcon: { fontSize: 18, color: '#bbb', marginLeft: 8 },
  selectedPharmacyCard: { backgroundColor: '#e6f7ff', borderRadius: 10, padding: 12, marginBottom: 16 },
  selectedPharmacyContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectedPharmacyLabel: { fontSize: 14, color: '#007bff', fontWeight: 'bold' },
  selectedPharmacyName: { fontSize: 15, color: '#222', fontWeight: 'bold', marginTop: 2 },
  changePharmacyBtn: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#007bff', paddingHorizontal: 12, paddingVertical: 6 },
  changePharmacyBtnText: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  medicineCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  medicineCardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  medicineImage: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  medicineName: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  medicineDesc: { color: '#666', fontSize: 13, marginBottom: 2 },
  medicineInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  medicineBadge: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, fontSize: 11, marginRight: 8 },
  medicinePrice: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  medicineActions: { alignItems: 'center', justifyContent: 'center' },
  qtyActions: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#eee', borderRadius: 6, padding: 6, marginHorizontal: 2 },
  qtyBtnText: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  qtyText: { width: 24, textAlign: 'center', fontWeight: 'bold', fontSize: 15 },
  donateBtn: { backgroundColor: '#007bff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  donateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  donationSummaryCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginTop: 16, padding: 16 },
  donationSummaryTitle: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 8 },
  donationSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  donationSummaryItem: { color: '#222', fontSize: 14 },
  donationSummaryAmount: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  donationSummaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#eee', paddingTop: 8, marginTop: 8 },
  donationSummaryTotalLabel: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  donationSummaryTotalAmount: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  continueBtn: { backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginTop: 16 },
  continueBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  confirmCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  confirmTitle: { fontWeight: 'bold', fontSize: 18, color: '#222', marginBottom: 12, textAlign: 'center' },
  confirmSection: { marginBottom: 12 },
  confirmSectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#222', marginBottom: 2 },
  confirmSectionText: { color: '#666', fontSize: 14 },
  confirmMedicineRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  confirmMedicineName: { color: '#222', fontSize: 14 },
  confirmMedicineAmount: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  confirmMessageInput: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, fontSize: 14, color: '#222', minHeight: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee' },
  confirmTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10, marginTop: 10 },
  confirmTotalLabel: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  confirmTotalAmount: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  confirmBtn: { backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginTop: 16 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  completeIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  completeIcon: { fontSize: 40, color: '#059669' },
  completeTextBox: { alignItems: 'center', marginBottom: 16 },
  completeTitle: { fontWeight: 'bold', fontSize: 20, color: '#222', marginBottom: 6 },
  completeMessage: { color: '#666', fontSize: 15, textAlign: 'center', marginBottom: 8 },
  completeDetailsCard: { backgroundColor: '#f0fdf4', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 16 },
  completeDetailsTitle: { fontWeight: 'bold', fontSize: 15, color: '#059669', marginBottom: 4 },
  completeDetailsText: { color: '#059669', fontSize: 14 },
  completeHomeBtn: { backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginBottom: 10, width: '100%' },
  completeHomeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  completeNewBtn: { backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', paddingVertical: 14, borderWidth: 1, borderColor: '#007bff', width: '100%' },
  completeNewBtnText: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
});