import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';

const prescriptions = [
  {
    id: 'RX-001',
    patient: 'احمد محمد',
    doctor: 'د. خوجلي عبدالله',
    date: '2024-01-15',
    uploadTime: '2024-01-15T10:30:00',
    status: 'قيد الانتظار',
    medications: [
      { name: 'باراسيتامول 50 مل', dosage: 'حبة مرتين يوميا', duration: '5 ايام' },
      { name: 'اموكسيسلين 30 مل', dosage: 'حبة كل يوم', duration: 'اسبوع' }
    ],
    notes: 'المريض يعاني من حساسية تجاه الأسبرين'
  },
  {
    id: 'RX-002',
    patient: 'محاسن علي',
    doctor: 'د. يوسف حسن',
    date: '2024-01-14',
    uploadTime: '2024-01-14T16:45:00',
    status: 'تم التحقق',
    medications: [
      { name: 'فيتامين سي 100 مل', dosage: 'حبة يوميا', duration: '30 يوم' }
    ]
  },
  {
    id: 'RX-003',
    patient: 'محمد علي',
    doctor: 'د. سارة محمد',
    date: '2024-01-13',
    uploadTime: '2024-01-13T09:15:00',
    status: 'مرفوض',
    medications: [
      { name: 'انسولين', dosage: 'حبة قبل الفطور و حبة قبل الغداء', duration: 'اسبوع' }
    ],
    notes: 'الجرعة غير صحيحة، يرجى مراجعة الطبيب'
  }
];

type PharmacistPrescriptionsProps = {
  navigateTo: (screen: string, data?: any) => void;
};

export default function PharmacistPrescriptions({ navigateTo }: PharmacistPrescriptionsProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [tab, setTab] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'verified': return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'rejected': return { backgroundColor: '#FECACA', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'verified': return 'check-circle';
      case 'rejected': return 'cancel';
      default: return 'description';
    }
  };

  const verifyPrescription = (prescriptionId) => {
    Alert.alert('Verify', `Verifying prescription ${prescriptionId}`);
  };

  const rejectPrescription = (prescriptionId, reason) => {
    Alert.alert('Reject', `Rejecting prescription ${prescriptionId}: ${reason}`);
  };

  const pendingPrescriptions = prescriptions.filter(rx => rx.status === 'pending');
  const verifiedPrescriptions = prescriptions.filter(rx => rx.status === 'verified');
  const rejectedPrescriptions = prescriptions.filter(rx => rx.status === 'rejected');

  const PrescriptionCard = ({ prescription, showActions = true }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedPrescription(prescription)}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.cardHeaderRow}>
            <Icon name={getStatusIcon(prescription.status)} size={18} color={getStatusColor(prescription.status).color} />
            <Text style={styles.orderId}>Prescription #{prescription.id}</Text>
          </View>
          <Text style={styles.customer}>{prescription.patient}</Text>
          <Text style={styles.doctor}>Dr. {prescription.doctor}</Text>
        </View>
        <View style={[styles.badge, getStatusColor(prescription.status)]}>
          <Icon name={getStatusIcon(prescription.status)} size={14} color={getStatusColor(prescription.status).color} />
          <Text style={[styles.badgeText, { color: getStatusColor(prescription.status).color }]}>
            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.itemsCount}>Medications:</Text>
        {prescription.medications.slice(0, 2).map((med, index) => (
          <Text key={index} style={styles.itemText}>{med.name}</Text>
        ))}
        {prescription.medications.length > 2 && (
          <Text style={styles.moreItems}>+{prescription.medications.length - 2} more</Text>
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Date: {new Date(prescription.date).toLocaleDateString()}</Text>
          <Text style={styles.uploadedText}>Uploaded: {new Date(prescription.uploadTime).toLocaleString()}</Text>
        </View>
      </View>
      {showActions && prescription.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => verifyPrescription(prescription.id)}>
            <Icon name="check" size={16} color="#fff" />
            <Text style={styles.buttonText}> Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(prescription.id, 'Review required')}>
            <Icon name="close" size={16} color="#fff" />
            <Text style={styles.buttonText}> Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {prescription.notes && (
        <View style={styles.notesBox}>
          <Icon name="warning" size={16} color="#f59e0b" />
          <Text style={styles.notesText}>{prescription.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedPrescription) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => setSelectedPrescription(null)} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{language === 'ar' ? 'تفاصيل الوصفة' : 'Prescription Details'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
          <View style={styles.body}>
            {/* Prescription Info */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>Prescription #{selectedPrescription.id}</Text>
                  <Text style={styles.uploadedText}>{new Date(selectedPrescription.uploadTime).toLocaleString()}</Text>
                </View>
                <View style={[styles.badge, getStatusColor(selectedPrescription.status)]}>
                  <Icon name={getStatusIcon(selectedPrescription.status)} size={14} color={getStatusColor(selectedPrescription.status).color} />
                  <Text style={[styles.badgeText, { color: getStatusColor(selectedPrescription.status).color }]}>
                    {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Patient:</Text>
                <Text style={styles.infoValue}>{selectedPrescription.patient}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Doctor:</Text>
                <Text style={styles.infoValue}>Dr. {selectedPrescription.doctor}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date Issued:</Text>
                <Text style={styles.infoValue}>{new Date(selectedPrescription.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{selectedPrescription.status}</Text>
              </View>
            </View>
            {/* Prescription Image */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{language === 'ar' ? 'صورة الوصفة' : 'Prescription Image'}</Text>
              <View style={styles.imageBox}>
                <Icon name="description" size={48} color="#6b7280" />
                <Text style={styles.imageLabel}>Prescription Document</Text>
                <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                  <Icon name="visibility" size={16} color="#007bff" />
                  <Text style={[styles.buttonText, { color: '#007bff' }]}> View Full Size</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Medications */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{language === 'ar' ? 'الأدوية' : 'Medications'}</Text>
              {selectedPrescription.medications.map((med, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDosage}>{med.dosage}</Text>
                  <Text style={styles.medicationDuration}>Duration: {med.duration}</Text>
                </View>
              ))}
            </View>
            {/* Actions */}
            {selectedPrescription.status === 'pending' && (
              <View style={styles.actionColumn}>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => verifyPrescription(selectedPrescription.id)}>
                  <Icon name="check" size={16} color="#fff" />
                  <Text style={styles.buttonText}> Verify Prescription</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(selectedPrescription.id, 'Review required')}>
                  <Icon name="close" size={16} color="#fff" />
                  <Text style={styles.buttonText}> Reject Prescription</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    let data = [];
    let emptyText = '';
    let emptyIcon = '';
    switch (tab) {
      case 'pending':
        data = pendingPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات في الانتظار' : 'No pending prescriptions';
        emptyIcon = 'schedule';
        break;
      case 'verified':
        data = verifiedPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات موثقة' : 'No verified prescriptions';
        emptyIcon = 'check-circle';
        break;
      case 'rejected':
        data = rejectedPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات مرفوضة' : 'No rejected prescriptions';
        emptyIcon = 'cancel';
        break;
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name={emptyIcon} size={64} color="#bbb" />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }

    return data.map((prescription) => (
      <PrescriptionCard key={prescription.id} prescription={prescription} />
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>{language === 'ar' ? 'إدارة الوصفات الطبية' : 'Prescription Management'}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.body}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, tab === 'pending' && styles.activeTab]}
              onPress={() => setTab('pending')}
            >
              <Text style={[styles.tabText, tab === 'pending' && styles.activeTabText]}>
                {language === 'ar' ? 'في الانتظار' : 'Pending'} ({pendingPrescriptions.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'verified' && styles.activeTab]}
              onPress={() => setTab('verified')}
            >
              <Text style={[styles.tabText, tab === 'verified' && styles.activeTabText]}>
                {language === 'ar' ? 'موثق' : 'Verified'} ({verifiedPrescriptions.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'rejected' && styles.activeTab]}
              onPress={() => setTab('rejected')}
            >
              <Text style={[styles.tabText, tab === 'rejected' && styles.activeTabText]}>
                {language === 'ar' ? 'مرفوض' : 'Rejected'} ({rejectedPrescriptions.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Prescriptions List */}
          <View style={styles.prescriptionsList}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  headerIcon: { fontSize: 22, color: '#2563eb', fontWeight: 'bold', width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 10, backgroundColor: '#f3f4f6', marginHorizontal: 2, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 14, color: '#1e293b', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  statusIcon: { fontSize: 18, marginRight: 6 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  customer: { fontSize: 14, color: '#334155' },
  doctor: { fontSize: 13, color: '#64748b' },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    overflow: 'hidden' 
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  cardBody: { marginTop: 4 },
  itemsCount: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  itemText: { fontSize: 14, color: '#334155' },
  moreItems: { fontSize: 13, color: '#64748b' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  dateText: { fontSize: 12, color: '#64748b' },
  uploadedText: { fontSize: 12, color: '#64748b' },
  actionRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  actionColumn: { flexDirection: 'column', gap: 8, marginTop: 12 },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8, backgroundColor: '#2563eb' },
  acceptButton: { backgroundColor: '#22c55e' },
  declineButton: { backgroundColor: '#ef4444' },
  outlineButton: { backgroundColor: '#f3f4f6' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  notesBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, marginTop: 8 },
  notesIcon: { fontSize: 16, marginRight: 6 },
  notesText: { fontSize: 13, color: '#92400E' },
  notesCard: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 },
  notesTitle: { fontSize: 15, fontWeight: 'bold', color: '#92400E', marginBottom: 4 },
  verifiedCard: { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0', borderWidth: 1 },
  verifiedTitle: { fontSize: 15, fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  verifiedText: { fontSize: 13, color: '#166534' },
  rejectedCard: { backgroundColor: '#FECACA', borderColor: '#FCA5A5', borderWidth: 1 },
  rejectedTitle: { fontSize: 15, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 },
  rejectedText: { fontSize: 13, color: '#991B1B' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoLabel: { fontSize: 13, color: '#64748b', width: 100 },
  infoValue: { fontSize: 13, color: '#334155', flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' },
  imageBox: { alignItems: 'center', justifyContent: 'center', height: 120, backgroundColor: '#f3f4f6', borderRadius: 8, marginBottom: 8 },
  imageIcon: { fontSize: 32, marginBottom: 4, color: '#64748b' },
  imageLabel: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  medBox: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginBottom: 8 },
  medName: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' },
  medDetail: { fontSize: 12, color: '#64748b' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 8, color: '#64748b' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#2563eb' },
  emptyDesc: { fontSize: 13, color: '#64748b' },
  backButton: { padding: 8 },
  body: { flex: 1, paddingTop: 0 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 },
  activeTab: { backgroundColor: '#2563eb', borderRadius: 8 },
  activeTabText: { color: '#fff' },
  emptyText: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#2563eb' },
  prescriptionsList: { paddingBottom: 32 },
  medicationItem: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginBottom: 8 },
  medicationName: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' },
  medicationDosage: { fontSize: 12, color: '#64748b' },
  medicationDuration: { fontSize: 12, color: '#64748b' },
});