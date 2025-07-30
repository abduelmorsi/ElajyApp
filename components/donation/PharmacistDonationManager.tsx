import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';

const ICONS = {
  heart: 'favorite',
  users: 'people',
  package: 'inventory',
  check: 'check-circle',
  phone: 'phone',
};

export default function PharmacistDonationManager({ navigateTo, userData }) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('pending');

  // Sample data
  const pendingDonations = [
    {
      id: 1,
      donor: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      medicines: [
        language === 'ar' ? 'باراسيتامول 500 مجم' : 'Paracetamol 500mg', 
        language === 'ar' ? 'أموكسيسيلين 250 مجم' : 'Amoxicillin 250mg'
      ],
      quantity: 5,
      date: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      donor: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      medicines: [
        language === 'ar' ? 'فيتامين سي 1000 مجم' : 'Vitamin C 1000mg'
      ],
      quantity: 3,
      date: '2024-01-14',
      status: 'pending'
    }
  ];

  const assignedDonations = [
    {
      id: 3,
      donor: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      medicines: [
        language === 'ar' ? 'أنسولين عادي' : 'Insulin Regular'
      ],
      quantity: 2,
      assignedTo: language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed',
      date: '2024-01-13',
      status: 'assigned'
    }
  ];

  const renderDonationCard = (donation) => (
    <View key={donation.id} style={styles.donationCard}>
      <View style={styles.donationHeader}>
        <View style={styles.donorInfo}>
          <Icon name="person" size={20} color="#6b7280" />
          <Text style={styles.donorName}>{donation.donor}</Text>
          </View>
        <View style={[styles.statusBadge, { backgroundColor: donation.status === 'pending' ? '#fef3c7' : '#dcfce7' }]}>
          <Icon name={ICONS.check} size={14} color={donation.status === 'pending' ? '#92400e' : '#166534'} />
          <Text style={[styles.statusText, { color: donation.status === 'pending' ? '#92400e' : '#166534' }]}>
            {t(`pharmacist.donation.${donation.status}`)}
          </Text>
        </View>
      </View>

      <View style={styles.medicinesList}>
        {donation.medicines.map((medicine, index) => (
          <Text key={index} style={styles.medicineItem}>• {medicine}</Text>
        ))}
      </View>

      <View style={styles.donationFooter}>
        <View style={styles.donationMeta}>
          <Icon name={ICONS.package} size={16} color="#6b7280" />
          <Text style={styles.quantityText}>{donation.quantity} {t('pharmacist.donation.quantity')}</Text>
        </View>
        <Text style={styles.dateText}>{donation.date}</Text>
      </View>
      
      {donation.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.assignButton]}>
            <Icon name="person-add" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{t('pharmacist.donation.approve')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.contactButton]}>
            <Icon name={ICONS.phone} size={16} color="#007bff" />
            <Text style={[styles.actionButtonText, { color: '#007bff' }]}>{t('action.call')}</Text>
          </TouchableOpacity>
                </View>
      )}
      
      {donation.status === 'assigned' && donation.assignedTo && (
        <View style={styles.assignedInfo}>
          <Text style={styles.assignedText}>
            {t('pharmacist.donation.assignedTo')}: {donation.assignedTo}
          </Text>
                    </View>
      )}
                </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.body}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
                  <TouchableOpacity
              style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
              onPress={() => setSelectedTab('pending')}
                  >
              <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
                {t('pharmacist.donation.pending')} ({pendingDonations.length})
              </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
              style={[styles.tab, selectedTab === 'assigned' && styles.activeTab]}
              onPress={() => setSelectedTab('assigned')}
                  >
              <Text style={[styles.tabText, selectedTab === 'assigned' && styles.activeTabText]}>
                {t('pharmacist.donation.assigned')} ({assignedDonations.length})
              </Text>
                  </TouchableOpacity>
                </View>

          {/* Donations List */}
          <View style={styles.donationsList}>
            {selectedTab === 'pending' && pendingDonations.map(renderDonationCard)}
            {selectedTab === 'assigned' && assignedDonations.map(renderDonationCard)}
          </View>
        </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  body: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  donationsList: {
    gap: 12,
  },
  donationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  medicinesList: {
    marginBottom: 12,
  },
  medicineItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  donationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  donationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  assignButton: {
    backgroundColor: '#007bff',
  },
  contactButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  assignedInfo: {
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  assignedText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
});