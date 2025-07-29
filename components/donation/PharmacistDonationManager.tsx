import React, { useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalization, useRTL } from '../services/LocalizationService';
import { eligiblePatients, pendingDonations } from './donationData';
import { formatDonationDate, getStatusText, getUrgencyColor, getUrgencyText } from './donationHelpers';
import PatientCard from './PatientCard';


// Emoji icon map for replacements
const ICONS = {
  heart: '❤️',
  users: '👥',
  package: '📦',
  eye: '👁️',
  check: '✅',
  x: '❌',
  file: '📄',
  phone: '📞',
  chevron: '›',
};


interface PharmacistDonationManagerProps {
  navigateTo: (screen: string, params?: any) => void;
  userData?: any;
}

export default function PharmacistDonationManager({ navigateTo, userData }: PharmacistDonationManagerProps) {
  const { language } = useLocalization();
  const { isRTL } = useRTL();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDialog, setShowPatientDialog] = useState(false);

  const handleAssignDonation = (donationId, patientId) => {
    setSelectedPatient(null);
    setShowPatientDialog(false);
    // Handle assignment logic here
  };

  const handleViewPatientProfile = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };

  const handleDonationAssignment = (donationId) => {
    navigateTo('donations', { donationId });
  };

  // Map urgency string to style object
  const getUrgencyBadgeStyle = (urgency: string) => {
    switch (getUrgencyColor(urgency)) {
      case 'bg-red-100 text-red-700':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      case 'bg-yellow-100 text-yellow-700':
        return { backgroundColor: '#fef9c3', color: '#b45309' };
      case 'bg-green-100 text-green-700':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'bg-gray-100 text-gray-700':
        return { backgroundColor: '#f3f4f6', color: '#374151' };
      default:
        return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Compact Header */}
      <View style={styles.headerBox}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}> 
          <View style={styles.headerIconBox}>
            <Text style={styles.headerIcon}>{ICONS.heart}</Text>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}</Text>
            <Text style={styles.headerDesc}>
              {language === 'ar' 
                ? 'قم بمراجعة الأدوية المتبرع بها وتوزيعها على المرضى المستحقين بناءً على حالتهم الطبية والمالية.'
                : 'Review donated medicines and distribute them to eligible patients based on their medical and financial conditions.'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>{ICONS.package}</Text>
                <View>
                  <Text style={styles.statNumber}>{pendingDonations.length}</Text>
                  <Text style={styles.statLabel}>{language === 'ar' ? 'تبرع في الانتظار' : 'Pending Donations'}</Text>
                </View>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>{ICONS.users}</Text>
                <View>
                  <Text style={styles.statNumber}>{eligiblePatients.length}</Text>
                  <Text style={styles.statLabel}>{language === 'ar' ? 'مريض مؤهل' : 'Eligible Patients'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Pending Donations */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>{language === 'ar' ? 'التبرعات في الانتظار' : 'Pending Donations'}</Text>
        {pendingDonations.map((donation) => (
          <View key={donation.id} style={styles.donationCard}>
            <View style={styles.donationHeaderRow}>
              <Text style={styles.donationTitle}>{language === 'ar' ? donation.medicine : donation.medicineEn}</Text>
              <Text style={[styles.badge, getUrgencyBadgeStyle(donation.urgency)]}>{getUrgencyText(donation.urgency, language)}</Text>
            </View>
            <View style={styles.donationDetailsRow}>
              <View style={styles.donationDetailCol}>
                <Text style={styles.detailLabel}>{language === 'ar' ? 'الكمية:' : 'Quantity:'}</Text>
                <Text style={styles.detailValue}>{donation.quantity}</Text>
                <Text style={styles.detailLabel}>{language === 'ar' ? 'المتبرع:' : 'Donor:'}</Text>
                <Text style={styles.detailValue}>{language === 'ar' ? donation.donor : donation.donorEn}</Text>
              </View>
              <View style={styles.donationDetailCol}>
                <Text style={styles.detailLabel}>{language === 'ar' ? 'التاريخ:' : 'Date:'}</Text>
                <Text style={styles.detailValue}>{formatDonationDate(donation.donatedAt)}</Text>
                <Text style={styles.detailLabel}>{language === 'ar' ? 'المؤهلين:' : 'Eligible:'}</Text>
                <Text style={styles.detailValue}>{donation.eligiblePatients}</Text>
              </View>
            </View>
            {donation.donorMessage ? (
              <View style={styles.donorMsgBox}>
                <Text style={styles.donorMsgIcon}>{ICONS.file}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.donorMsgTitle}>{language === 'ar' ? 'رسالة من المتبرع:' : 'Message from Donor:'}</Text>
                  <Text style={styles.donorMsgText}>{donation.donorMessage}</Text>
                </View>
              </View>
            ) : null}
            {donation.status === 'pending_assignment' && (
              <View style={styles.eligibleBox}>
                <Text style={styles.eligibleTitle}>{language === 'ar' ? 'المرضى المؤهلين:' : 'Eligible Patients:'}</Text>
                {eligiblePatients.slice(0, donation.eligiblePatients).map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onView={handleViewPatientProfile}
                    onAssign={(patientId) => handleAssignDonation(donation.id, patientId)}
                    showActions={true}
                    compact={false}
                  />
                ))}
              </View>
            )}
            {donation.status === 'assigned' && donation.assignedTo && (
              <View style={styles.assignedBox}>
                <Text style={styles.assignedIcon}>{ICONS.check}</Text>
                <Text style={styles.assignedLabel}>{language === 'ar' ? 'تم التوزيع على:' : 'Assigned to:'}</Text>
                <Text style={styles.assignedValue}>{language === 'ar' ? donation.assignedTo : donation.assignedToEn}</Text>
                <Text style={styles.badge}>{getStatusText(donation.status, language)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Patient Profile Modal */}
      <Modal
        visible={showPatientDialog}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPatientDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isRTL && { alignItems: 'flex-end' }]}> 
            {selectedPatient && (
              <View>
                <Text style={styles.modalTitle}>{language === 'ar' ? 'ملف المريض' : 'Patient Profile'}</Text>
                <View style={styles.modalHeaderBox}>
                  <Text style={styles.modalHeaderName}>{language === 'ar' ? selectedPatient.name : selectedPatient.nameEn}</Text>
                  <Text style={styles.modalHeaderAge}>{language === 'ar' ? 'العمر:' : 'Age:'} {selectedPatient.age} {language === 'ar' ? 'سنة' : 'years'}</Text>
                </View>
                <View style={styles.modalDetailsBox}>
                  <Text style={styles.modalDetailLabel}>{language === 'ar' ? 'الحالة الطبية:' : 'Medical Condition:'}</Text>
                  <Text style={styles.modalDetailValue}>{language === 'ar' ? selectedPatient.condition : selectedPatient.conditionEn}</Text>
                  <Text style={styles.modalDetailLabel}>{language === 'ar' ? 'الوضع المالي:' : 'Financial Status:'}</Text>
                  <Text style={styles.modalDetailValue}>{language === 'ar' ? selectedPatient.financialStatus : selectedPatient.financialStatusEn}</Text>
                  <Text style={styles.modalDetailLabel}>{language === 'ar' ? 'الأولوية الطبية:' : 'Medical Priority:'}</Text>
                  <Text style={styles.badge}>{language === 'ar' ? selectedPatient.medicalPriority : selectedPatient.medicalPriorityEn}</Text>
                  <Text style={styles.modalDetailLabel}>{language === 'ar' ? 'آخر زيارة:' : 'Last Visit:'}</Text>
                  <Text style={styles.modalDetailValue}>{formatDonationDate(selectedPatient.lastVisit)}</Text>
                  {selectedPatient.notes ? (
                    <View style={styles.modalNotesBox}>
                      <Text style={styles.modalNotesLabel}>{language === 'ar' ? 'ملاحظات:' : 'Notes:'}</Text>
                      <Text style={styles.modalNotesText}>{selectedPatient.notes}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: '#eee' }]}
                    onPress={() => Linking.openURL(`tel:${selectedPatient.phone}`)}
                  >
                    <Text style={styles.modalActionBtnText}>{ICONS.phone} {language === 'ar' ? 'اتصال' : 'Call'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: '#007bff' }]}
                    onPress={() => setShowPatientDialog(false)}
                  >
                    <Text style={[styles.modalActionBtnText, { color: '#fff' }]}>{language === 'ar' ? 'إغلاق' : 'Close'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  headerBox: { backgroundColor: '#e6f4ea', borderRadius: 12, padding: 16, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headerIconBox: { width: 48, height: 48, backgroundColor: '#22c55e', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerIcon: { fontSize: 28, color: '#fff' },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  headerDesc: { fontSize: 13, color: '#555', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 8, marginRight: 8, flex: 1 },
  statIcon: { fontSize: 18, marginRight: 8 },
  statNumber: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  statLabel: { fontSize: 12, color: '#555' },
  sectionBox: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 10 },
  donationCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  donationHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  donationTitle: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  badge: { fontSize: 12, backgroundColor: '#fef08a', color: '#b45309', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden', marginLeft: 6 },
  donationDetailsRow: { flexDirection: 'row', marginBottom: 8 },
  donationDetailCol: { flex: 1, marginRight: 8 },
  detailLabel: { fontSize: 12, color: '#555' },
  detailValue: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  donorMsgBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#e0e7ff', borderRadius: 8, padding: 10, marginBottom: 8 },
  donorMsgIcon: { fontSize: 16, marginRight: 8 },
  donorMsgTitle: { fontSize: 13, fontWeight: 'bold', color: '#3730a3', marginBottom: 2 },
  donorMsgText: { fontSize: 12, color: '#3730a3' },
  eligibleBox: { marginTop: 8, marginBottom: 8 },
  eligibleTitle: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  assignedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', borderRadius: 8, padding: 10, marginTop: 8 },
  assignedIcon: { fontSize: 16, marginRight: 6 },
  assignedLabel: { fontSize: 12, color: '#15803d', marginRight: 4 },
  assignedValue: { fontSize: 12, fontWeight: 'bold', color: '#166534', marginRight: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%' },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 10, alignSelf: 'center' },
  modalHeaderBox: { alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  modalHeaderName: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  modalHeaderAge: { fontSize: 12, color: '#555' },
  modalDetailsBox: { marginBottom: 10 },
  modalDetailLabel: { fontSize: 12, color: '#555', marginTop: 6 },
  modalDetailValue: { fontSize: 13, color: '#222', fontWeight: 'bold' },
  modalNotesBox: { marginTop: 8, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 8 },
  modalNotesLabel: { fontSize: 12, color: '#555', marginBottom: 2 },
  modalNotesText: { fontSize: 12, color: '#222' },
  modalActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalActionBtn: { flex: 1, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  modalActionBtnText: { fontSize: 13, fontWeight: 'bold' },
});