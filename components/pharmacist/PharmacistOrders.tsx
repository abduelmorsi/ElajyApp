import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';

interface PharmacistOrdersProps {
  navigateTo: (screen: string, data?: any) => void;
  // Based on your App.tsx, userData is passed, so include it here.
  // If this component doesn't actually need it, you could consider not passing it from App.tsx.
  // For consistency with other pharmacist components, let's include it.
  userData?: { // Mark as optional if it's not strictly used in this specific component's logic right now
    id?: string;
    name?: string;
    email?: string;
    // Add other relevant user data properties if this component will use them
  };
}

export default function PharmacistOrders({ navigateTo, userData }: PharmacistOrdersProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'pending' | 'processing' | 'ready' | 'completed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Sample orders data
const orders = [
  {
      id: 'ORD-001',
      customer: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      phone: '+249 912 345 678',
      address: language === 'ar' ? 'الخرطوم، السودان' : 'Khartoum, Sudan',
    items: [
        { name: language === 'ar' ? 'باراسيتامول 500 مجم' : 'Paracetamol 500mg', quantity: 2, price: 15 },
        { name: language === 'ar' ? 'أموكسيسيلين 250 مجم' : 'Amoxicillin 250mg', quantity: 1, price: 25 }
      ],
      total: 55,
      status: 'pending' as const,
      orderTime: '2024-01-15T10:30:00',
      paymentMethod: language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery',
      deliveryType: 'delivery' as const
    },
    {
      id: 'ORD-002',
      customer: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      phone: '+249 987 654 321',
      address: language === 'ar' ? 'أم درمان، السودان' : 'Omdurman, Sudan',
    items: [
        { name: language === 'ar' ? 'فيتامين سي 1000 مجم' : 'Vitamin C 1000mg', quantity: 1, price: 30 }
      ],
      total: 30,
      status: 'processing' as const,
      orderTime: '2024-01-15T09:15:00',
      paymentMethod: language === 'ar' ? 'المال الإلكتروني' : 'Mobile Money',
      deliveryType: 'pickup' as const
    },
    {
      id: 'ORD-003',
      customer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      phone: '+249 876 543 210',
      address: language === 'ar' ? 'الخرطوم بحري، السودان' : 'Khartoum North, Sudan',
    items: [
        { name: language === 'ar' ? 'أنسولين' : 'Insulin Vial', quantity: 2, price: 150 },
        { name: language === 'ar' ? 'محاقن' : 'Syringes', quantity: 10, price: 5 }
      ],
      total: 350,
      status: 'ready' as const,
      orderTime: '2024-01-15T08:45:00',
      paymentMethod: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
      deliveryType: 'delivery' as const
    },
    {
      id: 'ORD-004',
      customer: language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed',
      phone: '+249 765 432 109',
      address: language === 'ar' ? 'بورت سودان، السودان' : 'Port Sudan, Sudan',
    items: [
        { name: language === 'ar' ? 'أسبرين 100 مجم' : 'Aspirin 100mg', quantity: 1, price: 20 }
      ],
      total: 20,
      status: 'completed' as const,
      orderTime: '2024-01-14T16:30:00',
      paymentMethod: language === 'ar' ? 'نقداً' : 'Cash',
      deliveryType: 'pickup' as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'processing': return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'ready': return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'completed': return { backgroundColor: '#F3F4F6', color: '#374151' };
      case 'cancelled': return { backgroundColor: '#FECACA', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'inventory';
      case 'ready': return 'check-circle';
      case 'completed': return 'done';
      case 'cancelled': return 'cancel';
      default: return 'inventory';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => { // Added types for parameters
    // Update the order status in the orders array
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus as any;
      // Force re-render by updating state
      setSelectedOrder({ ...orders[orderIndex] });
    }
  };

  interface Order {
    id: string;
    customer: string;
    phone: string;
    address: string;
    items: { name: string; quantity: number; price: number; }[];
    total: number;
    status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled'; // Specific literal types
    orderTime: string;
    paymentMethod: string;
    deliveryType: 'pickup' | 'delivery'; // Specific literal types
  }

  interface OrderCardProps {
    order: Order; // Use the Order type here
    showActions?: boolean; // Optional prop
  }

  const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => setSelectedOrder(order)}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderTime}>{new Date(order.orderTime).toLocaleTimeString()}</Text>
          </View>
        <View style={[styles.badge, getStatusColor(order.status)]}>
          <Icon name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status).color} />
          <Text style={[styles.badgeText, { color: getStatusColor(order.status).color }]}>
            {t(`pharmacist.orders.${order.status}`)}
          </Text>
        </View>
      </View>
              <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Icon name="person" size={16} color="#6b7280" />
          <Text style={styles.customerName}>{order.customer}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={16} color="#6b7280" />
          <Text style={styles.address}>{order.address}</Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>{order.items.length} {t('pharmacist.orders.items')}</Text>
          <Text style={styles.total}>${order.total.toFixed(2)}</Text>
        </View>
      </View>
      {showActions && order.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => updateOrderStatus(order.id, 'processing')}>
            <Icon name="check" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{t('pharmacist.orders.confirmOrder')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={() => updateOrderStatus(order.id, 'cancelled')}>
            <Icon name="close" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{t('pharmacist.orders.rejectOrder')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedOrder) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('pharmacist.orders.viewDetails')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
          <View style={styles.body}>
          {/* Order Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Order #{selectedOrder.id}</Text>
                <Text style={styles.orderTime}>{new Date(selectedOrder.orderTime).toLocaleString()}</Text>
              </View>
                <View style={[styles.badge, getStatusColor(selectedOrder.status)]}>
                  <Icon name={getStatusIcon(selectedOrder.status)} size={14} color={getStatusColor(selectedOrder.status).color} />
                                  <Text style={[styles.badgeText, { color: getStatusColor(selectedOrder.status).color }]}>
                  {t(`pharmacist.orders.${selectedOrder.status}`)}
                </Text>
                </View>
            </View>
            <View style={styles.infoRow}>
                <Icon name="phone" size={16} color="#6b7280" />
              <View>
                <Text style={styles.customer}>{selectedOrder.customer}</Text>
                <Text style={styles.phone}>{selectedOrder.phone}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
                <Icon name="location-on" size={16} color="#6b7280" />
              <View>
                <Text style={styles.deliveryTypeLabel}>{selectedOrder.deliveryType === 'delivery' ? t('search.delivery') : t('search.pickup')}</Text>
                <Text style={styles.address}>{selectedOrder.address}</Text>
              </View>
            </View>
          </View>
          {/* Items */}
          <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('pharmacist.orders.items')}</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemQty}>{t('product.quantity')}: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.separator} />
            <View style={styles.summaryRow}>
              <Text>{t('pharmacist.orders.orderTotal')}</Text>
              <Text>${selectedOrder.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.paymentLabel}>{t('cart.payment')}</Text>
              <Text style={styles.paymentValue}>{selectedOrder.paymentMethod}</Text>
            </View>
          </View>
          {/* Actions */}
          <View style={styles.actionColumn}>
            {selectedOrder.status === 'pending' && (
              <View>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                  <Text style={styles.buttonText}>{t('pharmacist.orders.confirmOrder')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => updateOrderStatus(selectedOrder.id, 'cancelled')}>
                  <Text style={styles.buttonText}>{t('pharmacist.orders.rejectOrder')}</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedOrder.status === 'processing' && (
              <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus(selectedOrder.id, 'ready')}>
                <Text style={styles.buttonText}>{t('pharmacist.orders.markAsCompleted')}</Text>
              </TouchableOpacity>
            )}
            {selectedOrder.status === 'ready' && (
              <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus(selectedOrder.id, 'completed')}>
                <Text style={styles.buttonText}>{t('pharmacist.orders.markAsCompleted')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => Alert.alert(t('action.call'), selectedOrder.phone)}>
                <Icon name="phone" size={16} color="#007bff" />
                <Text style={[styles.buttonText, { color: '#007bff' }]}> {t('action.call')}</Text>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Tab navigation and content for React Native
  const renderTabContent = () => {
    let data = [];
    let emptyText = '';
    let emptyIcon = '';
    switch (tab) {
      case 'pending':
        data = orders.filter(order => order.status === 'pending');
        emptyText = t('pharmacist.orders.noOrders');
        emptyIcon = 'schedule';
        break;
      case 'processing':
        data = orders.filter(order => order.status === 'processing');
        emptyText = t('pharmacist.orders.noOrders');
        emptyIcon = 'inventory';
        break;
      case 'ready':
        data = orders.filter(order => order.status === 'ready');
        emptyText = t('pharmacist.orders.noOrders');
        emptyIcon = 'check-circle';
        break;
      case 'completed':
        data = orders.filter(order => order.status === 'completed');
        emptyText = t('pharmacist.orders.noOrders');
        emptyIcon = 'done';
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

    return data.map((order) => (
      <OrderCard key={order.id} order={order} />
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigateTo('pharmacist-dashboard')} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('pharmacist.orders.title')}</Text>
        </View>
        <View style={{ width: 40 }} />
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
                {t('pharmacist.orders.pending')}
              </Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'processing' && styles.activeTab]}
              onPress={() => setTab('processing')}
            >
              <Text style={[styles.tabText, tab === 'processing' && styles.activeTabText]}>
                {t('pharmacist.orders.processing')}
              </Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'ready' && styles.activeTab]}
              onPress={() => setTab('ready')}
            >
              <Text style={[styles.tabText, tab === 'ready' && styles.activeTabText]}>
                {t('pharmacist.orders.ready')}
              </Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'completed' && styles.activeTab]}
              onPress={() => setTab('completed')}
            >
              <Text style={[styles.tabText, tab === 'completed' && styles.activeTabText]}>
                {t('pharmacist.orders.completed')}
              </Text>
          </TouchableOpacity>
          </View>

          {/* Orders List */}
          <View style={styles.ordersList}>
            {renderTabContent()}
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  body: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  ordersList: {
    // No specific styles needed for the list itself
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  orderTime: {
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  orderInfo: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  address: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemCount: {
    fontSize: 12,
    color: '#64748b',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  declineButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  phone: {
    fontSize: 14,
    color: '#64748b',
  },
  deliveryTypeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  itemQty: {
    fontSize: 12,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 14,
    color: '#334155',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  paymentValue: {
    fontSize: 13,
    color: '#334155',
  },
  actionColumn: {
    gap: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});