import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 45.97,
    items: [
      { 
        name: "Paracetamol 500mg", 
        nameAr: "باراسيتامول 500 مجم",
        quantity: 2, 
        price: 12.99 
      },
      { 
        name: "Vitamin D3 1000IU", 
        nameAr: "فيتامين د3 1000 وحدة دولية",
        quantity: 1, 
        price: 24.99 
      }
    ],
    deliveryAddress: "Al-Mek Nimir Street, Khartoum, Sudan",
    deliveryAddressAr: "شارع المك نمر، الخرطوم، السودان",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 67.50,
    items: [
      { 
        name: "Omega-3 Fish Oil", 
        nameAr: "زيت السمك أوميغا 3",
        quantity: 1, 
        price: 29.99 
      },
      { 
        name: "Ibuprofen 400mg", 
        nameAr: "إيبوبروفين 400 مجم",
        quantity: 2, 
        price: 18.99 
      }
    ],
    deliveryAddress: "Al-Zubeir Pasha Street, Omdurman, Sudan",
    deliveryAddressAr: "شارع الزبير باشا، أم درمان، السودان",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-17"
  },
  {
    id: "ORD-003",
    date: "2024-01-05", 
    status: "processing",
    total: 25.99,
    items: [
      { 
        name: "Amoxicillin 250mg", 
        nameAr: "أموكسيسيلين 250 مجم",
        quantity: 1, 
        price: 25.99 
      }
    ],
    deliveryAddress: "Al-Gamhoria Street, Khartoum North, Sudan",
    deliveryAddressAr: "شارع الجمهورية، الخرطوم بحري، السودان"
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
    case 'delivered': return 'check-circle';
    case 'shipped': return 'local-shipping';
    case 'processing': return 'schedule';
    default: return 'inventory';
  }
};

export default function OrderHistoryScreen({ navigateTo }) {
  const insets = useSafeAreaInsets();
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('active');

  const activeOrders = orders.filter(order => ['processing', 'shipped'].includes(order.status));
  const pastOrders = orders.filter(order => ['delivered', 'cancelled'].includes(order.status));

  const OrderCard = ({ order, onPress }) => {
    const statusColor = getStatusColor(order.status);
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={[styles.cardHeader, isRTL && styles.cardHeaderRTL]}>
          <View>
            <View style={[styles.cardHeaderRow, isRTL && styles.cardHeaderRowRTL]}>
              <Icon name={getStatusIcon(order.status)} size={20} color="#49C5B8" style={[styles.statusIcon, isRTL && styles.statusIconRTL]} />
              <Text style={[styles.orderId, isRTL && styles.orderIdRTL]}>{t('order.number')} #{order.id}</Text>
            </View>
            <Text style={[styles.orderDate, isRTL && styles.orderDateRTL]}>{new Date(order.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.backgroundColor }, isRTL && styles.statusBadgeRTL]}> 
            <Text style={[{ color: statusColor.color, fontWeight: 'bold', fontSize: 12 }, isRTL && styles.statusTextRTL]}>{t(`order.${order.status}`)}</Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.itemsLabel, isRTL && styles.itemsLabelRTL]}>{order.items.length} {t('order.items')}:</Text>
          {order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={[styles.itemText, isRTL && styles.itemTextRTL]}>
              {language === 'ar' ? item.nameAr : item.name} x{item.quantity}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={[styles.moreItemsText, isRTL && styles.moreItemsTextRTL]}>+{order.items.length - 2} {t('order.moreItems')}</Text>
          )}
        </View>
        <View style={[styles.cardFooter, isRTL && styles.cardFooterRTL]}>
          <Text style={[styles.totalText, isRTL && styles.totalTextRTL]}>{t('order.total')}: {language === 'ar' ? `${order.total.toFixed(2)} ج.س` : `$${order.total.toFixed(2)}`}</Text>
          {order.status === 'shipped' && order.estimatedDelivery && (
            <Text style={[styles.estimatedDeliveryText, isRTL && styles.estimatedDeliveryTextRTL]}>
              {t('order.estimatedDelivery')}: {new Date(order.estimatedDelivery).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

     if (selectedOrder) {
     const statusColor = getStatusColor(selectedOrder.status);
     return (
       <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
         <View style={styles.container}>
           {/* Header */}
           <View style={[styles.header, { paddingTop: insets.top + 16 }, isRTL && styles.headerRTL]}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.headerButton}>
            <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>{t('order.details')}</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order Status */}
          <View style={styles.detailCard}>
            <View style={[styles.detailCardHeader, isRTL && styles.detailCardHeaderRTL]}>
              <View>
                <Text style={[styles.detailOrderId, isRTL && styles.detailOrderIdRTL]}>{t('order.number')} #{selectedOrder.id}</Text>
                <Text style={[styles.detailOrderDate, isRTL && styles.detailOrderDateRTL]}>
                  {t('order.placedOn')} {new Date(selectedOrder.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor.backgroundColor }, isRTL && styles.statusBadgeRTL]}> 
                <Text style={[{ color: statusColor.color, fontWeight: 'bold', fontSize: 12 }, isRTL && styles.statusTextRTL]}>{t(`order.${selectedOrder.status}`)}</Text>
              </View>
            </View>
            {selectedOrder.trackingNumber && (
              <View style={styles.trackingBox}>
                <Text style={[styles.trackingLabel, isRTL && styles.trackingLabelRTL]}>{t('order.trackingNumber')}</Text>
                <Text style={[styles.trackingNumber, isRTL && styles.trackingNumberRTL]}>{selectedOrder.trackingNumber}</Text>
              </View>
            )}
          </View>

          {/* Items */}
          <View style={styles.detailCard}>
            <Text style={[styles.itemsTitle, isRTL && styles.itemsTitleRTL]}>{t('order.itemsOrdered')}</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={[styles.itemRow, isRTL && styles.itemRowRTL]}>
                <View>
                  <Text style={[styles.itemText, isRTL && styles.itemTextRTL]}>{language === 'ar' ? item.nameAr : item.name}</Text>
                  <Text style={[styles.itemQty, isRTL && styles.itemQtyRTL]}>{t('order.quantity')}: {item.quantity}</Text>
                </View>
                <Text style={[styles.itemPrice, isRTL && styles.itemPriceRTL]}>{language === 'ar' ? `${(item.price * item.quantity).toFixed(2)} ج.س` : `$${(item.price * item.quantity).toFixed(2)}`}</Text>
              </View>
            ))}
            <View style={styles.separator} />
            <View style={[styles.totalRow, isRTL && styles.totalRowRTL]}>
              <Text style={[styles.totalLabel, isRTL && styles.totalLabelRTL]}>{t('order.total')}</Text>
              <Text style={[styles.totalValue, isRTL && styles.totalValueRTL]}>{language === 'ar' ? `${selectedOrder.total.toFixed(2)} ج.س` : `$${selectedOrder.total.toFixed(2)}`}</Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.detailCard}>
            <View style={[styles.addressRow, isRTL && styles.addressRowRTL]}>
              <Icon name="location-on" size={20} color="#49C5B8" style={[styles.addressIcon, isRTL && styles.addressIconRTL]} />
              <View>
                <Text style={[styles.addressTitle, isRTL && styles.addressTitleRTL]}>{t('order.deliveryAddress')}</Text>
                <Text style={[styles.addressText, isRTL && styles.addressTextRTL]}>{language === 'ar' ? selectedOrder.deliveryAddressAr : selectedOrder.deliveryAddress}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {selectedOrder.status === 'delivered' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('search')}>
                <Text style={[styles.actionButtonText, isRTL && styles.actionButtonTextRTL]}>{t('order.reorderItems')}</Text>
              </TouchableOpacity>
            )}
            {selectedOrder.trackingNumber && (
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
                <Text style={[styles.actionButtonText, styles.actionButtonOutlineText, isRTL && styles.actionButtonTextRTL]}>{t('order.trackPackage')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
              <View style={[styles.actionButtonContent, isRTL && styles.actionButtonContentRTL]}>
                <Icon name="phone" size={16} color="#49C5B8" style={[styles.actionButtonIcon, isRTL && styles.actionButtonIconRTL]} />
                <Text style={[styles.actionButtonText, styles.actionButtonOutlineText, isRTL && styles.actionButtonTextRTL]}>{t('order.contactSupport')}</Text>
              </View>
            </TouchableOpacity>
          </View>
                 </ScrollView>
         </View>
       </SafeAreaView>
     );
   }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }, isRTL && styles.headerRTL]}>
          <TouchableOpacity onPress={() => navigateTo('profile')} style={styles.headerButton}>
            <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>{t('profile.orderHistory')}</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'active' && styles.tabButtonActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.tabButtonText, tab === 'active' && styles.tabButtonTextActive, isRTL && styles.tabButtonTextRTL]}>{t('order.activeOrders')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'past' && styles.tabButtonActive]}
            onPress={() => setTab('past')}
          >
            <Text style={[styles.tabButtonText, tab === 'past' && styles.tabButtonTextActive, isRTL && styles.tabButtonTextRTL]}>{t('order.pastOrders')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {tab === 'active' ? (
            activeOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="inventory" size={48} color="#49C5B8" style={styles.emptyIcon} />
                <Text style={[styles.emptyTitle, isRTL && styles.emptyTitleRTL]}>{t('order.noActiveOrders')}</Text>
                <Text style={[styles.emptyDesc, isRTL && styles.emptyDescRTL]}>{t('order.noActiveOrdersDesc')}</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('search')}>
                  <Text style={[styles.actionButtonText, isRTL && styles.actionButtonTextRTL]}>{t('order.browseMedicines')}</Text>
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
                <Icon name="schedule" size={48} color="#49C5B8" style={styles.emptyIcon} />
                <Text style={[styles.emptyTitle, isRTL && styles.emptyTitleRTL]}>{t('order.noPastOrders')}</Text>
                <Text style={[styles.emptyDesc, isRTL && styles.emptyDescRTL]}>{t('order.noPastOrdersDesc')}</Text>
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
  headerRTL: {
    flexDirection: 'row-reverse',
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
  headerTitleRTL: {
    textAlign: 'right',
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
  tabButtonTextRTL: {
    textAlign: 'right',
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
  cardHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardHeaderRowRTL: {
    flexDirection: 'row-reverse',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statusIconRTL: {
    marginLeft: 6,
    marginRight: 0,
  },
  orderId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  orderIdRTL: {
    textAlign: 'right',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  orderDateRTL: {
    textAlign: 'right',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  statusBadgeRTL: {
    alignItems: 'flex-end',
  },
  statusTextRTL: {
    textAlign: 'right',
  },
  itemsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  itemsLabelRTL: {
    textAlign: 'right',
  },
  itemText: {
    fontSize: 14,
    color: '#222',
  },
  itemTextRTL: {
    textAlign: 'right',
  },
  moreItemsText: {
    fontSize: 13,
    color: '#888',
  },
  moreItemsTextRTL: {
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardFooterRTL: {
    flexDirection: 'row-reverse',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  totalTextRTL: {
    textAlign: 'right',
  },
  estimatedDeliveryText: {
    fontSize: 12,
    color: '#888',
  },
  estimatedDeliveryTextRTL: {
    textAlign: 'right',
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
  emptyTitleRTL: {
    textAlign: 'right',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescRTL: {
    textAlign: 'right',
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
  detailCardHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  detailOrderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  detailOrderIdRTL: {
    textAlign: 'right',
  },
  detailOrderDate: {
    fontSize: 13,
    color: '#888',
  },
  detailOrderDateRTL: {
    textAlign: 'right',
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
  trackingLabelRTL: {
    textAlign: 'right',
  },
  trackingNumber: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#222',
    marginTop: 2,
  },
  trackingNumberRTL: {
    textAlign: 'right',
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  itemsTitleRTL: {
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemRowRTL: {
    flexDirection: 'row-reverse',
  },
  itemQty: {
    fontSize: 12,
    color: '#888',
  },
  itemQtyRTL: {
    textAlign: 'right',
  },
  itemPrice: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  itemPriceRTL: {
    textAlign: 'right',
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
  totalRowRTL: {
    flexDirection: 'row-reverse',
  },
  totalLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  totalLabelRTL: {
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  totalValueRTL: {
    textAlign: 'right',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  addressRowRTL: {
    flexDirection: 'row-reverse',
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addressIconRTL: {
    marginLeft: 8,
    marginRight: 0,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
  },
  addressTitleRTL: {
    textAlign: 'right',
  },
  addressText: {
    fontSize: 14,
    color: '#888',
  },
  addressTextRTL: {
    textAlign: 'right',
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
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonContentRTL: {
    flexDirection: 'row-reverse',
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonIconRTL: {
    marginLeft: 8,
    marginRight: 0,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextRTL: {
    textAlign: 'right',
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