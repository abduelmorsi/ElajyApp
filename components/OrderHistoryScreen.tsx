import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 45.97,
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 12.99 },
      { name: "Vitamin D3 1000IU", quantity: 1, price: 24.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 67.50,
    items: [
      { name: "Omega-3 Fish Oil", quantity: 1, price: 29.99 },
      { name: "Ibuprofen 400mg", quantity: 2, price: 18.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-17"
  },
  {
    id: "ORD-003",
    date: "2024-01-05", 
    status: "processing",
    total: 25.99,
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 25.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001"
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered': return { backgroundColor: '#bbf7d0', color: '#166534' }; // green-100, green-800
    case 'shipped': return { backgroundColor: '#dbeafe', color: '#1e40af' }; // blue-100, blue-800
    case 'processing': return { backgroundColor: '#fef9c3', color: '#854d0e' }; // yellow-100, yellow-800
    case 'cancelled': return { backgroundColor: '#fecaca', color: '#991b1b' }; // red-100, red-800
    default: return { backgroundColor: '#f3f4f6', color: '#374151' }; // gray-100, gray-800
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return '✅';
    case 'shipped': return '🚚';
    case 'processing': return '⏳';
    default: return '📦';
  }
};

export default function OrderHistoryScreen({ navigateTo }) {
  const insets = useSafeAreaInsets();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('active');

  const activeOrders = orders.filter(order => ['processing', 'shipped'].includes(order.status));
  const pastOrders = orders.filter(order => ['delivered', 'cancelled'].includes(order.status));

  const OrderCard = ({ order, onPress }) => {
    const statusColor = getStatusColor(order.status);
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
              <Text style={styles.orderId}>Order #{order.id}</Text>
            </View>
            <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.backgroundColor }]}> 
            <Text style={{ color: statusColor.color, fontWeight: 'bold', fontSize: 12 }}>{order.status}</Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text style={styles.itemsLabel}>{order.items.length} item(s):</Text>
          {order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.name} x{item.quantity}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItemsText}>+{order.items.length - 2} more items</Text>
          )}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
          {order.status === 'shipped' && order.estimatedDelivery && (
            <Text style={styles.estimatedDeliveryText}>
              Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedOrder) {
    const statusColor = getStatusColor(selectedOrder.status);
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.headerButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order Status */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View>
                <Text style={styles.detailOrderId}>Order #{selectedOrder.id}</Text>
                <Text style={styles.detailOrderDate}>
                  Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor.backgroundColor }]}> 
                <Text style={{ color: statusColor.color, fontWeight: 'bold', fontSize: 12 }}>{selectedOrder.status}</Text>
              </View>
            </View>
            {selectedOrder.trackingNumber && (
              <View style={styles.trackingBox}>
                <Text style={styles.trackingLabel}>Tracking Number</Text>
                <Text style={styles.trackingNumber}>{selectedOrder.trackingNumber}</Text>
              </View>
            )}
          </View>

          {/* Items */}
          <View style={styles.detailCard}>
            <Text style={styles.itemsTitle}>Items Ordered</Text>
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
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${selectedOrder.total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.detailCard}>
            <View style={styles.addressRow}>
              <Text style={styles.addressIcon}>📍</Text>
              <View>
                <Text style={styles.addressTitle}>Delivery Address</Text>
                <Text style={styles.addressText}>{selectedOrder.deliveryAddress}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {selectedOrder.status === 'delivered' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('search')}>
                <Text style={styles.actionButtonText}>Reorder Items</Text>
              </TouchableOpacity>
            )}
            {selectedOrder.trackingNumber && (
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
                <Text style={[styles.actionButtonText, styles.actionButtonOutlineText]}>Track Package</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
              <Text style={[styles.actionButtonText, styles.actionButtonOutlineText]}>📞 Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigateTo('profile')} style={styles.headerButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'active' && styles.tabButtonActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.tabButtonText, tab === 'active' && styles.tabButtonTextActive]}>Active Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'past' && styles.tabButtonActive]}
            onPress={() => setTab('past')}
          >
            <Text style={[styles.tabButtonText, tab === 'past' && styles.tabButtonTextActive]}>Past Orders</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {tab === 'active' ? (
            activeOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>No Active Orders</Text>
                <Text style={styles.emptyDesc}>You don't have any active orders at the moment</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('search')}>
                  <Text style={styles.actionButtonText}>Browse Medicines</Text>
                </TouchableOpacity>
              </View>
            ) : (
              activeOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPress={() => setSelectedOrder(order)}
                />
              ))
            )
          ) : (
            pastOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>⏳</Text>
                <Text style={styles.emptyTitle}>No Past Orders</Text>
                <Text style={styles.emptyDesc}>Your completed orders will appear here</Text>
              </View>
            ) : (
              pastOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPress={() => setSelectedOrder(order)}
                />
              ))
            )
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabButtonText: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
  },
  tabButtonTextActive: {
    color: '#49C5B8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  orderId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#222',
  },
  moreItemsText: {
    fontSize: 13,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  estimatedDeliveryText: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailOrderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  detailOrderDate: {
    fontSize: 13,
    color: '#888',
  },
  trackingBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  trackingLabel: {
    fontSize: 13,
    color: '#888',
  },
  trackingNumber: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#222',
    marginTop: 2,
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemQty: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
  },
  addressText: {
    fontSize: 14,
    color: '#888',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#49C5B8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#49C5B8',
  },
  actionButtonOutlineText: {
    color: '#49C5B8',
  },
});