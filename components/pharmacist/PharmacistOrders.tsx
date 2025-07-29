import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization, useRTL } from '../services/LocalizationService';

// Define the interface for PharmacistOrders's props
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


const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 12.99 },
      { name: "Vitamin D3 1000IU", quantity: 1, price: 24.99 }
    ],
    total: 50.97,
    status: "pending",
    orderTime: "2024-01-15T10:30:00",
    paymentMethod: "Credit Card",
    deliveryType: "pickup"
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, New York, NY 10002",
    items: [
      { name: "Ibuprofen 400mg", quantity: 1, price: 18.99 }
    ],
    total: 23.98,
    status: "processing",
    orderTime: "2024-01-15T09:45:00",
    paymentMethod: "Insurance",
    deliveryType: "delivery"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, New York, NY 10003",
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 25.99 },
      { name: "Omega-3 Fish Oil", quantity: 1, price: 29.99 }
    ],
    total: 61.97,
    status: "ready",
    orderTime: "2024-01-15T08:15:00",
    paymentMethod: "Cash",
    deliveryType: "pickup"
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, New York, NY 10004",
    items: [
      { name: "Vitamin D3 1000IU", quantity: 2, price: 24.99 }
    ],
    total: 54.97,
    status: "completed",
    orderTime: "2024-01-14T16:20:00",
    paymentMethod: "Credit Card",
    deliveryType: "delivery"
  }
];

// Apply the interface to the component's function signature
export default function PharmacistOrders({ navigateTo, userData }: PharmacistOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [tab, setTab] = useState<'pending' | 'processing' | 'ready' | 'completed'>('pending');
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();

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
      case 'pending': return '⏳';
      case 'processing': return '📦';
      case 'ready': return '✅';
      case 'completed': return '✔️';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => { // Added types for parameters
    // In a real app, this would update the order in the backend
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // You'd typically update your local state (orders array) here as well
    // For now, it's just a console log
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const completedOrders = orders.filter(order => ['completed', 'cancelled'].includes(order.status));

  // Define a type for your Order object for better type safety
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

  // Define a type for OrderCardProps
  interface OrderCardProps {
    order: Order; // Use the Order type here
    showActions?: boolean; // Optional prop
  }

  const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedOrder(order)}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
            <Text style={styles.orderId}>Order #{order.id}</Text>
          </View>
          <Text style={styles.customer}>{order.customer}</Text>
          <Text style={styles.orderTime}>{new Date(order.orderTime).toLocaleString()}</Text>
        </View>
        <Text style={[styles.badge, getStatusColor(order.status)]}>{order.status}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.itemsCount}>{order.items.length} item(s):</Text>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText}>{item.name} x{item.quantity}</Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
          <Text style={styles.deliveryType}>{order.deliveryType}</Text>
        </View>
      </View>
      {showActions && order.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => updateOrderStatus(order.id, 'processing')}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => updateOrderStatus(order.id, 'cancelled')}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedOrder) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)}>
            <Text style={styles.headerIcon}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Order #{selectedOrder.id}</Text>
                <Text style={styles.orderTime}>{new Date(selectedOrder.orderTime).toLocaleString()}</Text>
              </View>
              <Text style={[styles.badge, getStatusColor(selectedOrder.status)]}>{selectedOrder.status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <View>
                <Text style={styles.customer}>{selectedOrder.customer}</Text>
                <Text style={styles.phone}>{selectedOrder.phone}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View>
                <Text style={styles.deliveryTypeLabel}>{selectedOrder.deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup'}</Text>
                <Text style={styles.address}>{selectedOrder.address}</Text>
              </View>
            </View>
          </View>
          {/* Items */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.separator} />
            <View style={styles.summaryRow}>
              <Text>Total</Text>
              <Text>${selectedOrder.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.paymentLabel}>Payment</Text>
              <Text style={styles.paymentValue}>{selectedOrder.paymentMethod}</Text>
            </View>
          </View>
          {/* Actions */}
          <View style={styles.actionColumn}>
            {selectedOrder.status === 'pending' && (
              <View>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                  <Text style={styles.buttonText}>Accept Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => updateOrderStatus(selectedOrder.id, 'cancelled')}>
                  <Text style={styles.buttonText}>Decline Order</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedOrder.status === 'processing' && (
              <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus(selectedOrder.id, 'ready')}>
                <Text style={styles.buttonText}>Mark as Ready</Text>
              </TouchableOpacity>
            )}
            {selectedOrder.status === 'ready' && (
              <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus(selectedOrder.id, 'completed')}>
                <Text style={styles.buttonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => Alert.alert('Call Customer', selectedOrder.phone)}>
              <Text style={styles.buttonText}>📞 Call Customer</Text>
            </TouchableOpacity>
          </View>
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
        data = pendingOrders;
        emptyText = 'No Pending Orders\nNew orders will appear here';
        emptyIcon = '⏳';
        break;
      case 'processing':
        data = processingOrders;
        emptyText = 'No Orders in Processing\nAccepted orders will appear here';
        emptyIcon = '📦';
        break;
      case 'ready':
        data = readyOrders;
        emptyText = 'No Orders Ready\nReady orders will appear here';
        emptyIcon = '✅';
        break;
      case 'completed':
        data = completedOrders;
        emptyText = '';
        emptyIcon = '';
        break;
    }
    if (data.length === 0 && tab !== 'completed') {
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
        {data.map((order) => (
          <OrderCard key={order.id} order={order} showActions={tab === 'pending'} />
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
            {language === 'ar' ? 'إدارة الطلبات' : 'Order Management'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tab, tab === 'pending' && styles.tabActive]} onPress={() => setTab('pending')}>
            <Text style={styles.tabText}>Pending ({pendingOrders.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'processing' && styles.tabActive]} onPress={() => setTab('processing')}>
            <Text style={styles.tabText}>Processing ({processingOrders.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'ready' && styles.tabActive]} onPress={() => setTab('ready')}>
            <Text style={styles.tabText}>Ready ({readyOrders.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'completed' && styles.tabActive]} onPress={() => setTab('completed')}>
            <Text style={styles.tabText}>Completed</Text>
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
  orderTime: { fontSize: 12, color: '#64748b' },
  badge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden', textTransform: 'capitalize' },
  cardBody: { marginTop: 4 },
  itemsCount: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  itemText: { fontSize: 14, color: '#334155' },
  moreItems: { fontSize: 13, color: '#64748b' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  total: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' },
  deliveryType: { fontSize: 12, color: '#64748b', fontWeight: 'bold', textTransform: 'capitalize' },
  actionRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  actionColumn: { flexDirection: 'column', gap: 8, marginTop: 12 },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8, backgroundColor: '#2563eb' },
  acceptButton: { backgroundColor: '#22c55e' },
  declineButton: { backgroundColor: '#ef4444' },
  outlineButton: { backgroundColor: '#f3f4f6' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 2 },
  infoIcon: { fontSize: 18, marginRight: 8 },
  deliveryTypeLabel: { fontSize: 13, color: '#334155' },
  address: { fontSize: 12, color: '#64748b' },
  phone: { fontSize: 12, color: '#64748b' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  itemQty: { fontSize: 12, color: '#64748b' },
  itemPrice: { fontSize: 14, color: '#334155', fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  paymentLabel: { fontSize: 13, color: '#64748b' },
  paymentValue: { fontSize: 13, color: '#334155' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 8, color: '#64748b' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#2563eb' },
  emptyDesc: { fontSize: 13, color: '#64748b' },
});