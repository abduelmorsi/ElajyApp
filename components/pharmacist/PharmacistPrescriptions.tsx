import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization, useRTL } from '../services/LocalizationService';

const prescriptions = [
  {
    id: "RX-001",
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2024-01-15",
    medications: [
      { name: "Amoxicillin 250mg", dosage: "1 tablet 3x daily", duration: "7 days" },
      { name: "Paracetamol 500mg", dosage: "1-2 tablets as needed", duration: "As needed" }
    ],
    status: "pending",
    uploadTime: "2024-01-15T10:30:00",
    notes: "Patient allergic to penicillin - verify amoxicillin allergy status"
  },
  {
    id: "RX-002",
    patient: "Sarah Smith", 
    doctor: "Dr. Johnson",
    date: "2024-01-14",
    medications: [
      { name: "Vitamin D3 1000IU", dosage: "1 tablet daily", duration: "3 months" }
    ],
    status: "verified",
    uploadTime: "2024-01-14T16:20:00",
    verifiedBy: "Dr. Sarah Wilson",
    verifiedTime: "2024-01-14T16:45:00"
  },
  {
    id: "RX-003",
    patient: "Mike Johnson",
    doctor: "Dr. Brown", 
    date: "2024-01-13",
    medications: [
      { name: "Ibuprofen 400mg", dosage: "1 tablet 2x daily", duration: "5 days" }
    ],
    status: "rejected",
    uploadTime: "2024-01-13T14:15:00",
    rejectionReason: "Prescription expired - dated more than 6 months ago"
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
      case 'pending': return '⏳';
      case 'verified': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
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
            <Text style={styles.statusIcon}>{getStatusIcon(prescription.status)}</Text>
            <Text style={styles.orderId}>Prescription #{prescription.id}</Text>
          </View>
          <Text style={styles.customer}>{prescription.patient}</Text>
          <Text style={styles.doctor}>Dr. {prescription.doctor}</Text>
        </View>
        <Text style={[styles.badge, getStatusColor(prescription.status)]}>{prescription.status}</Text>
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
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(prescription.id, 'Review required')}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {prescription.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesIcon}>⚠️</Text>
          <Text style={styles.notesText}>{prescription.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedPrescription) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedPrescription(null)}>
            <Text style={styles.headerIcon}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prescription Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Prescription Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Prescription #{selectedPrescription.id}</Text>
                <Text style={styles.uploadedText}>{new Date(selectedPrescription.uploadTime).toLocaleString()}</Text>
              </View>
              <Text style={[styles.badge, getStatusColor(selectedPrescription.status)]}>{selectedPrescription.status}</Text>
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
            <Text style={styles.sectionTitle}>Prescription Image</Text>
            <View style={styles.imageBox}>
              <Text style={styles.imageIcon}>📄</Text>
              <Text style={styles.imageLabel}>Prescription Document</Text>
              <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                <Text style={styles.buttonText}>👁️ View Full Size</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Medications */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Prescribed Medications</Text>
            {selectedPrescription.medications.map((med, index) => (
              <View key={index} style={styles.medBox}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDetail}>Dosage: {med.dosage}</Text>
                <Text style={styles.medDetail}>Duration: {med.duration}</Text>
              </View>
            ))}
          </View>
          {/* Notes */}
          {selectedPrescription.notes && (
            <View style={[styles.card, styles.notesCard]}>
              <Text style={styles.notesTitle}>Important Notes</Text>
              <Text style={styles.notesText}>{selectedPrescription.notes}</Text>
            </View>
          )}
          {/* Verification Info */}
          {selectedPrescription.status === 'verified' && (
            <View style={[styles.card, styles.verifiedCard]}>
              <Text style={styles.verifiedTitle}>Verification Details</Text>
              <Text style={styles.verifiedText}>
                Verified by {selectedPrescription.verifiedBy} on {new Date(selectedPrescription.verifiedTime).toLocaleString()}
              </Text>
            </View>
          )}
          {/* Rejection Info */}
          {selectedPrescription.status === 'rejected' && (
            <View style={[styles.card, styles.rejectedCard]}>
              <Text style={styles.rejectedTitle}>Rejection Reason</Text>
              <Text style={styles.rejectedText}>{selectedPrescription.rejectionReason}</Text>
            </View>
          )}
          {/* Actions */}
          {selectedPrescription.status === 'pending' && (
            <View style={styles.actionColumn}>
              <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => verifyPrescription(selectedPrescription.id)}>
                <Text style={styles.buttonText}>Verify Prescription</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(selectedPrescription.id, 'Review required')}>
                <Text style={styles.buttonText}>Reject Prescription</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Tab navigation and content for React Native
  const renderTabContent = () => {
    let data = [];
    let emptyText = '';
    let emptyIcon = '';
    switch (tab) {
      case 'pending':
        data = pendingPrescriptions;
        emptyText = 'No Pending Prescriptions\nNew prescriptions requiring verification will appear here';
        emptyIcon = '📄';
        break;
      case 'verified':
        data = verifiedPrescriptions;
        emptyText = '';
        emptyIcon = '';
        break;
      case 'rejected':
        data = rejectedPrescriptions;
        emptyText = '';
        emptyIcon = '';
        break;
    }
    if (data.length === 0 && tab === 'pending') {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{emptyIcon}</Text>
          <Text style={styles.emptyTitle}>{emptyText.split('\n')[0]}</Text>
          <Text style={styles.emptyDesc}>{emptyText.split('\n')[1]}</Text>
        </View>
      );
    }
    return (
      <View>
        {data.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} showActions={tab === 'pending'} />
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigateTo('pharmacist-dashboard')}>
            <Text style={styles.headerIcon}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'إدارة الوصفات الطبية' : 'Prescription Management'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tab, tab === 'pending' && styles.tabActive]} onPress={() => setTab('pending')}>
            <Text style={styles.tabText}>Pending ({pendingPrescriptions.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'verified' && styles.tabActive]} onPress={() => setTab('verified')}>
            <Text style={styles.tabText}>Verified ({verifiedPrescriptions.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'rejected' && styles.tabActive]} onPress={() => setTab('rejected')}>
            <Text style={styles.tabText}>Rejected ({rejectedPrescriptions.length})</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderTabContent()}
        </ScrollView>
      </View>
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
  badge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden', textTransform: 'capitalize' },
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
});