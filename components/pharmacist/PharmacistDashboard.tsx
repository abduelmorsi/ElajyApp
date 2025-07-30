import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';

// Define the interface for PharmacistDashboard's props
interface PharmacistDashboardProps {
  navigateTo: (screen: string, data?: any) => void; // `data` type could be more specific if known
  userData: {
    name?: string; // Add properties you expect from userData
    pharmacy?: {
      name?: string;
    };
    // Add other properties of userData if you know them, e.g.,
    // id: string;
    // email: string;
    // userType: string;
  };
}

// Update the function signature to use the defined interface
export default function PharmacistDashboard({ navigateTo, userData }: PharmacistDashboardProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Set dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    const now = new Date();

    let greetingText = '';
    if (hour < 12) {
      greetingText = language === 'ar' ? 'صباح الخير' : 'Good Morning';
    } else if (hour < 17) {
      greetingText = language === 'ar' ? 'مساء الخير' : 'Good Afternoon';
    } else {
      greetingText = language === 'ar' ? 'مساء الخير' : 'Good Evening';
    }

    setGreeting(greetingText);
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }));
  }, [language]);

  // Compact quick actions with proper text boundaries and black titles
  const quickActions = [
    {
      id: 'pharmacist-orders',
      title: language === 'ar' ? 'الطلبات الجديدة' : 'New Orders',
      subtitle: language === 'ar' ? 'مراجعة الطلبات' : 'Review orders',
      icon: 'inventory',
      color: '#e0e7ff',
      iconColor: '#2563eb',
      count: 12
    },
    {
      id: 'donations',
      title: language === 'ar' ? 'إدارة التبرعات' : 'Donation Management',
      subtitle: language === 'ar' ? 'توزيع الأدوية' : 'Distribute medicines',
      icon: 'favorite',
      color: '#dcfce7',
      iconColor: '#22c55e',
      count: 5
    },
    {
      id: 'pharmacist-consultations',
      title: language === 'ar' ? 'الاستشارات' : 'Consultations',
      subtitle: language === 'ar' ? 'استفسارات المرضى' : 'Patient inquiries',
      icon: 'chat',
      color: '#ede9fe',
      iconColor: '#a21caf',
      count: 8
    },
    {
      id: 'pharmacist-inventory',
      title: language === 'ar' ? 'المخزون' : 'Inventory',
      subtitle: language === 'ar' ? 'إدارة الأدوية' : 'Manage medicines',
      icon: 'local-pharmacy',
      color: '#fef3c7',
      iconColor: '#ea580c',
      count: 0
    }
  ];

  // Today's metrics with proper styling
  const todayMetrics = [
    {
      title: language === 'ar' ? 'الطلبات' : 'Orders',
      value: '24',
      change: 12,
      icon: 'shopping-cart',
      bgColor: '#e0e7ff',
      color: '#2563eb'
    },
    {
      title: language === 'ar' ? 'الإيرادات' : 'Revenue',
      value: language === 'ar' ? '12,500 ج.س' : '12,500 SDG',
      change: 8,
      icon: 'attach-money',
      bgColor: '#dcfce7',
      color: '#22c55e'
    },
    {
      title: language === 'ar' ? 'المرضى' : 'Patients',
      value: '156',
      change: 15,
      icon: 'people',
      bgColor: '#ede9fe',
      color: '#a21caf'
    },
    {
      title: language === 'ar' ? 'التقييم' : 'Rating',
      value: '4.8',
      change: 2,
      icon: 'star',
      bgColor: '#fef3c7',
      color: '#ea580c'
    }
  ];

  // Sample donation data
  const pendingDonations = [
    {
      id: 1,
      medicine: language === 'ar' ? 'باراسيتامول' : 'Paracetamol',
      medicineEn: 'Paracetamol',
      quantity: '50 tablets',
      patient: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      urgency: 'high',
      timeAgo: language === 'ar' ? 'منذ 2 ساعة' : '2 hours ago'
    },
    {
      id: 2,
      medicine: language === 'ar' ? 'أموكسيسيلين' : 'Amoxicillin',
      medicineEn: 'Amoxicillin',
      quantity: '30 capsules',
      patient: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      urgency: 'medium',
      timeAgo: language === 'ar' ? 'منذ 4 ساعات' : '4 hours ago'
    },
    {
      id: 3,
      medicine: language === 'ar' ? 'إنسولين' : 'Insulin',
      medicineEn: 'Insulin',
      quantity: '2 vials',
      patient: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      urgency: 'high',
      timeAgo: language === 'ar' ? 'منذ 1 ساعة' : '1 hour ago'
    }
  ];

  const handleQuickAction = (actionId) => {
    navigateTo(actionId);
  };

  const handleDonationAssignment = (donationId) => {
    navigateTo('donations', { donationId });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#fef9c3', color: '#b45309' };
      case 'processing':
        return { backgroundColor: '#e0e7ff', color: '#2563eb' };
      case 'completed':
        return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'cancelled':
        return { backgroundColor: '#fef3c7', color: '#ea580c' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      case 'medium':
        return { backgroundColor: '#fef9c3', color: '#b45309' };
      case 'low':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerGreeting}>
                {greeting}, {userData?.name?.split(' ')[1] || (language === 'ar' ? 'د. فاطمة' : 'Dr. Fatima')}
              </Text>
              <View style={styles.headerMetaRow}>
                <View style={styles.headerMetaItem}>
                  <Icon name="location-on" size={16} color="#6b7280" />
                  <Text style={styles.headerMetaText}>{userData?.pharmacy?.name || (language === 'ar' ? 'صيدلية النيل الأزرق' : 'Blue Nile Pharmacy')}</Text>
                </View>
                <Text style={styles.headerMetaDot}>•</Text>
                <View style={styles.headerMetaItem}>
                  <Icon name="schedule" size={16} color="#6b7280" />
                  <Text style={styles.headerMetaText}>{currentTime}</Text>
                </View>
              </View>
            </View>
            <View style={styles.headerStatusBox}>
              <View style={styles.headerStatusDot} />
              <Text style={styles.headerStatusText}>{language === 'ar' ? 'مفتوح' : 'Open'}</Text>
              <Text style={styles.headerStatusSub}>{language === 'ar' ? 'يغلق الساعة 22:00' : 'Closes at 10:00 PM'}</Text>
            </View>
          </View>
        </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 120 }}>
        <View style={styles.body}>
        {/* Quick Actions */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</Text>
            <Icon name="auto-awesome" size={20} color="#6b7280" />
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionCard} onPress={() => handleQuickAction(action.id)}>
                <View style={styles.quickActionIconBox}>
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Icon name={action.icon} size={24} color={action.iconColor} />
                  </View>
                </View>
                {action.count ? (
                  <View style={styles.quickActionBadge}><Text style={styles.quickActionBadgeText}>{action.count}</Text></View>
                ) : null}
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Metrics */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'مقاييس اليوم' : "Today's Metrics"}</Text>
            <TouchableOpacity onPress={() => navigateTo('pharmacist-analytics')}>
                <Text style={styles.sectionLink}>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metricsGrid}>
            {todayMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricCardRow}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.bgColor }]}>
                    <Icon name={metric.icon} size={20} color={metric.color} />
                  </View>
                  <View style={[styles.metricChangeBox, { backgroundColor: '#dcfce7' }]}> {/* Always green for increase */}
                    <Icon name="trending-up" size={12} color="#22c55e" />
                    <Text style={styles.metricChangeText}>+{metric.change}%</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Donation Management */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}</Text>
            <TouchableOpacity onPress={() => navigateTo('donations')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.sectionLink}>{language === 'ar' ? 'عرض الكل' : 'View All'}</Text>
              <Icon name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {pendingDonations.slice(0, 3).map((donation) => (
            <TouchableOpacity key={donation.id} style={styles.donationCard} onPress={() => handleDonationAssignment(donation.id)}>
              <View style={styles.donationHeaderRow}>
                <Text style={styles.donationTitle}>{language === 'ar' ? donation.medicine : donation.medicineEn}</Text>
                <View style={[styles.donationBadge, getUrgencyColor(donation.urgency)]}>
                  <Text style={styles.donationBadgeText}>
                    {donation.urgency === 'high' ? (language === 'ar' ? 'عاجل' : 'Urgent') :
                      donation.urgency === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                      (language === 'ar' ? 'عادي' : 'Normal')}
                  </Text>
                </View>
              </View>
              <View style={styles.donationDetailsRow}>
                <View style={styles.donationDetailItem}>
                  <Icon name="inventory" size={14} color="#6b7280" />
                  <Text style={styles.donationDetailText}>{donation.quantity}</Text>
                </View>
                <View style={styles.donationDetailItem}>
                  <Icon name="person" size={14} color="#6b7280" />
                  <Text style={styles.donationDetailText}>{donation.patient}</Text>
                </View>
                <View style={styles.donationDetailItem}>
                  <Icon name="schedule" size={14} color="#6b7280" />
                  <Text style={styles.donationDetailText}>{donation.timeAgo}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerMetaIcon: {
    fontSize: 13,
    color: '#888',
    marginRight: 2,
  },
  headerMetaText: {
    fontSize: 12,
    color: '#555',
  },
  headerMetaDot: {
    color: '#bbb',
    fontSize: 14,
    marginHorizontal: 4,
  },
  headerStatusBox: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  headerStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginBottom: 2,
  },
  headerStatusText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerStatusSub: {
    fontSize: 11,
    color: '#888',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  body: {
    padding: 16,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  sectionIcon: {
    fontSize: 16,
    color: '#007bff',
  },
  sectionLink: {
    color: '#007bff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    position: 'relative',
  },
  quickActionIconBox: {
    marginBottom: 8,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: '#e11d48',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  metricCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricChangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  metricChangeIcon: {
    fontSize: 13,
    color: '#22c55e',
    marginRight: 2,
  },
  metricChangeText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#555',
  },
  donationCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  donationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  donationTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  donationBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  donationDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  donationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  donationDetailText: {
    fontSize: 12,
    color: '#555',
  },
  donationStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 12,
    color: '#888',
  },
  donationAssignedBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  donationAssignedText: {
    fontSize: 12,
    color: '#166534',
  },
  orderCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  orderBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 'auto',
  },
  orderDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  orderDetailLabel: {
    fontSize: 12,
    color: '#555',
    marginRight: 2,
  },
  orderDetailValue: {
    fontSize: 12,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 8,
  },
  quickSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  quickSearchIcon: {
    fontSize: 22,
    color: '#2563eb',
    marginRight: 10,
  },
  quickSearchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  quickSearchDesc: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },
  quickSearchBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  quickSearchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});