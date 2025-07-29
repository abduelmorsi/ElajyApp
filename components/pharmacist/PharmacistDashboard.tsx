import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization, useRTL } from '../services/LocalizationService';
const ICONS = {
  package: '📦',
  users: '👥',
  trendingUp: '📈',
  alert: '⚠️',
  clock: '⏰',
  star: '⭐',
  heart: '❤️',
  message: '💬',
  upload: '⬆️',
  barChart: '📊',
  search: '🔍',
  plus: '➕',
  chevronRight: '›',
  sparkles: '✨',
  mapPin: '📍',
  calendar: '📅',
  dollar: '💵',
};

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
      icon: ICONS.package,
      color: '#e0e7ff',
      iconColor: '#2563eb',
      count: 12
    },
    {
      id: 'donations',
      title: language === 'ar' ? 'إدارة التبرعات' : 'Donation Management',
      subtitle: language === 'ar' ? 'توزيع الأدوية' : 'Distribute medicines',
      icon: ICONS.heart,
      color: '#dcfce7',
      iconColor: '#22c55e',
      count: 5
    },
    {
      id: 'pharmacist-consultations',
      title: language === 'ar' ? 'الاستشارات' : 'Consultations',
      subtitle: language === 'ar' ? 'استفسارات المرضى' : 'Patient inquiries',
      icon: ICONS.message,
      color: '#ede9fe',
      iconColor: '#a21caf',
      count: 8
    },
    {
      id: 'pharmacist-inventory',
      title: language === 'ar' ? 'المخزون' : 'Inventory',
      subtitle: language === 'ar' ? 'إدارة المنتجات' : 'Manage products',
      icon: ICONS.upload,
      color: '#fef3c7',
      iconColor: '#ea580c',
      count: 3
    }
  ];

  // Today's metrics with compact design
  const todayMetrics = [
    {
      title: language === 'ar' ? 'الطلبات اليوم' : "Today's Orders",
      value: 24,
      change: +12,
      changeType: 'increase',
      icon: ICONS.package,
      color: '#2563eb',
      bgColor: '#e0e7ff'
    },
    {
      title: language === 'ar' ? 'الإيرادات' : 'Revenue',
      value: `${language === 'ar' ? '12,450 ج.س' : '12,450 SDG'}`,
      change: +8.5,
      changeType: 'increase',
      icon: ICONS.dollar,
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    {
      title: language === 'ar' ? 'العملاء الجدد' : 'New Customers',
      value: 7,
      change: +3,
      changeType: 'increase',
      icon: ICONS.users,
      color: '#a21caf',
      bgColor: '#ede9fe'
    },
    {
      title: language === 'ar' ? 'التبرعات' : 'Donations',
      value: 5,
      change: +2,
      changeType: 'increase',
      icon: ICONS.heart,
      color: '#e11d48',
      bgColor: '#fee2e2'
    }
  ];

  // Compact pending donations
  const pendingDonations = [
    {
      id: 1,
      medicine: 'باراسيتامول 500 مجم',
      medicineEn: 'Paracetamol 500mg',
      quantity: 2,
      donor: 'أحمد محمد',
      donorEn: 'Ahmed Mohammed',
      donatedAt: '2024-01-15',
      status: 'pending_assignment',
      eligiblePatients: 3,
      urgency: 'medium'
    },
    {
      id: 2,
      medicine: 'أنسولين سريع المفعول',
      medicineEn: 'Fast-Acting Insulin',
      quantity: 1,
      donor: 'فاطمة علي',
      donorEn: 'Fatima Ali',
      donatedAt: '2024-01-14',
      status: 'pending_assignment',
      eligiblePatients: 1,
      urgency: 'high'
    },
    {
      id: 3,
      medicine: 'فيتامين د للأطفال',
      medicineEn: 'Children Vitamin D',
      quantity: 3,
      donor: 'محمد أحمد',
      donorEn: 'Mohammed Ahmed',
      donatedAt: '2024-01-13',
      status: 'assigned',
      assignedTo: 'مريم إبراهيم',
      assignedToEn: 'Mariam Ibrahim',
      urgency: 'low'
    }
  ];

  // Compact recent orders
  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'سارة محمد',
      customerEn: 'Sara Mohammed',
      items: 3,
      total: 125,
      status: 'pending',
      time: '10:30',
      priority: 'normal'
    },
    {
      id: 'ORD-2024-002',
      customer: 'أحمد علي',
      customerEn: 'Ahmed Ali',
      items: 1,
      total: 85,
      status: 'preparing',
      time: '09:45',
      priority: 'urgent'
    },
    {
      id: 'ORD-2024-003',
      customer: 'فاطمة أحمد',
      customerEn: 'Fatima Ahmed',
      items: 2,
      total: 67,
      status: 'ready',
      time: '09:15',
      priority: 'normal'
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
      case 'preparing':
        return { backgroundColor: '#e0e7ff', color: '#2563eb' };
      case 'ready':
      case 'assigned':
        return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'pending_assignment':
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
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={[styles.headerBox, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerGreeting}>
                {greeting}, {userData?.name?.split(' ')[1] || (language === 'ar' ? 'د. فاطمة' : 'Dr. Fatima')}
              </Text>
              <View style={styles.headerMetaRow}>
                <View style={styles.headerMetaItem}>
                  <Text style={styles.headerMetaIcon}>{ICONS.mapPin}</Text>
                  <Text style={styles.headerMetaText}>{userData?.pharmacy?.name || (language === 'ar' ? 'صيدلية النيل الأزرق' : 'Blue Nile Pharmacy')}</Text>
                </View>
                <Text style={styles.headerMetaDot}>•</Text>
                <View style={styles.headerMetaItem}>
                  <Text style={styles.headerMetaIcon}>{ICONS.clock}</Text>
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

        {/* Quick Actions */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</Text>
            <Text style={styles.sectionIcon}>{ICONS.sparkles}</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionCard} onPress={() => handleQuickAction(action.id)}>
                <View style={styles.quickActionIconBox}>
                  <Text style={[styles.quickActionIcon, { backgroundColor: action.color, color: action.iconColor }]}>{action.icon}</Text>
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
              <Text style={styles.sectionLink}>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'} {ICONS.barChart}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metricsGrid}>
            {todayMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricCardRow}>
                  <Text style={[styles.metricIcon, { backgroundColor: metric.bgColor, color: metric.color }]}>{metric.icon}</Text>
                  <View style={[styles.metricChangeBox, { backgroundColor: '#dcfce7' }]}> {/* Always green for increase */}
                    <Text style={styles.metricChangeIcon}>{ICONS.trendingUp}</Text>
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
            <Text style={styles.sectionTitle}>{ICONS.heart} {language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}</Text>
            <TouchableOpacity onPress={() => navigateTo('donations')}>
              <Text style={styles.sectionLink}>{language === 'ar' ? 'عرض الكل' : 'View All'} {ICONS.chevronRight}</Text>
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
                <Text style={styles.donationDetailLabel}>{language === 'ar' ? 'الكمية:' : 'Quantity:'}</Text>
                <Text style={styles.donationDetailValue}>{donation.quantity}</Text>
                <Text style={styles.donationDetailLabel}>{language === 'ar' ? 'المتبرع:' : 'Donor:'}</Text>
                <Text style={styles.donationDetailValue}>{language === 'ar' ? donation.donor : donation.donorEn}</Text>
              </View>
              <View style={styles.donationStatusRow}>
                <View style={[styles.donationBadge, getStatusColor(donation.status)]}>
                  <Text style={styles.donationBadgeText}>
                    {donation.status === 'pending_assignment'
                      ? (language === 'ar' ? 'في انتظار التوزيع' : 'Pending Assignment')
                      : (language === 'ar' ? 'تم التوزيع' : 'Assigned')}
                  </Text>
                </View>
                <Text style={styles.donationDate}>{new Date(donation.donatedAt).toLocaleDateString()}</Text>
              </View>
              {donation.status === 'assigned' && donation.assignedTo && (
                <View style={styles.donationAssignedBox}>
                  <Text style={styles.donationAssignedText}>
                    {language === 'ar' ? 'تم التوزيع على:' : 'Assigned to:'} {language === 'ar' ? donation.assignedTo : donation.assignedToEn}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'ar' ? 'الطلبات الحديثة' : 'Recent Orders'}</Text>
            <TouchableOpacity onPress={() => navigateTo('pharmacist-orders')}>
              <Text style={styles.sectionLink}>{language === 'ar' ? 'عرض الكل' : 'View All'} {ICONS.chevronRight}</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => navigateTo('pharmacist-orders', { orderId: order.id })}>
              <View style={styles.orderHeaderRow}>
                <Text style={styles.orderTitle}>#{order.id}</Text>
                <View style={[styles.orderBadge, getStatusColor(order.status)]}>
                  <Text style={styles.orderBadgeText}>
                    {order.status === 'pending' ? (language === 'ar' ? 'في الانتظار' : 'Pending') :
                      order.status === 'preparing' ? (language === 'ar' ? 'قيد التحضير' : 'Preparing') :
                      (language === 'ar' ? 'جاهز' : 'Ready')}
                  </Text>
                </View>
                {order.priority === 'urgent' && (
                  <View style={[styles.orderBadge, { backgroundColor: '#fee2e2' }]}> 
                    <Text style={[styles.orderBadgeText, { color: '#b91c1c' }]}>{language === 'ar' ? 'عاجل' : 'Urgent'}</Text>
                  </View>
                )}
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <View style={styles.orderDetailsRow}>
                <Text style={styles.orderDetailLabel}>{language === 'ar' ? 'العميل:' : 'Customer:'}</Text>
                <Text style={styles.orderDetailValue}>{language === 'ar' ? order.customer : order.customerEn}</Text>
                <Text style={styles.orderDetailLabel}>{language === 'ar' ? 'المبلغ:' : 'Total:'}</Text>
                <Text style={styles.orderDetailValue}>{order.total} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Search */}
        <View style={styles.sectionBox}>
          <View style={styles.quickSearchRow}>
            <Text style={styles.quickSearchIcon}>{ICONS.search}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickSearchTitle}>{language === 'ar' ? 'البحث السريع' : 'Quick Search'}</Text>
              <Text style={styles.quickSearchDesc}>{language === 'ar' ? 'ابحث عن الأدوية والمنتجات' : 'Search for medicines and products'}</Text>
              <TouchableOpacity style={styles.quickSearchBtn} onPress={() => navigateTo('search')}>
                <Text style={styles.quickSearchBtnText}>{language === 'ar' ? 'البحث الآن' : 'Search Now'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  contentContainer: { padding: 0, paddingBottom: 32 },
  headerBox: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerGreeting: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  headerMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  headerMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  headerMetaIcon: { fontSize: 13, color: '#888', marginRight: 2 },
  headerMetaText: { fontSize: 12, color: '#555' },
  headerMetaDot: { color: '#bbb', fontSize: 14, marginHorizontal: 4 },
  headerStatusBox: { alignItems: 'flex-end', minWidth: 70 },
  headerStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginBottom: 2 },
  headerStatusText: { fontSize: 12, color: '#22c55e', fontWeight: 'bold', marginBottom: 2 },
  headerStatusSub: { fontSize: 11, color: '#888' },
  sectionBox: { backgroundColor: '#fff', borderRadius: 12, margin: 12, marginBottom: 0, padding: 14, elevation: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  sectionIcon: { fontSize: 16, color: '#007bff' },
  sectionLink: { color: '#007bff', fontSize: 13, fontWeight: 'bold' },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickActionCard: { width: '48%', backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 12, alignItems: 'center', elevation: 1 },
  quickActionIconBox: { marginBottom: 6 },
  quickActionIcon: { fontSize: 24, borderRadius: 8, padding: 8, overflow: 'hidden', textAlign: 'center' },
  quickActionBadge: { position: 'absolute', top: 8, right: 12, backgroundColor: '#e11d48', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  quickActionBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  quickActionTitle: { fontSize: 13, fontWeight: 'bold', color: '#222', marginTop: 2 },
  quickActionSubtitle: { fontSize: 12, color: '#555', marginTop: 1 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 12, elevation: 1 },
  metricCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  metricIcon: { fontSize: 18, borderRadius: 8, padding: 8, overflow: 'hidden', textAlign: 'center' },
  metricChangeBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  metricChangeIcon: { fontSize: 13, color: '#22c55e', marginRight: 2 },
  metricChangeText: { fontSize: 12, color: '#22c55e', fontWeight: 'bold' },
  metricValue: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  metricLabel: { fontSize: 12, color: '#555' },
  donationCard: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1 },
  donationHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  donationTitle: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  donationBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4, alignItems: 'center', justifyContent: 'center' },
  donationBadgeText: { fontSize: 12, fontWeight: 'bold' },
  donationDetailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  donationDetailLabel: { fontSize: 12, color: '#555', marginRight: 2 },
  donationDetailValue: { fontSize: 12, color: '#222', fontWeight: 'bold', marginRight: 8 },
  donationStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  donationDate: { fontSize: 12, color: '#888' },
  donationAssignedBox: { backgroundColor: '#dcfce7', borderRadius: 8, padding: 8, marginTop: 4 },
  donationAssignedText: { fontSize: 12, color: '#166534' },
  orderCard: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1 },
  orderHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  orderTitle: { fontSize: 13, fontWeight: 'bold', color: '#222', marginRight: 8 },
  orderBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4, alignItems: 'center', justifyContent: 'center' },
  orderBadgeText: { fontSize: 12, fontWeight: 'bold' },
  orderTime: { fontSize: 12, color: '#888', marginLeft: 'auto' },
  orderDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  orderDetailLabel: { fontSize: 12, color: '#555', marginRight: 2 },
  orderDetailValue: { fontSize: 12, color: '#222', fontWeight: 'bold', marginRight: 8 },
  quickSearchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 10, padding: 12, marginTop: 12 },
  quickSearchIcon: { fontSize: 22, color: '#2563eb', marginRight: 10 },
  quickSearchTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  quickSearchDesc: { fontSize: 12, color: '#555', marginBottom: 6 },
  quickSearchBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  quickSearchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});