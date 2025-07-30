import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeliveryOrder, useDelivery } from './services/DeliveryService';
import { useLocalization, useRTL } from './services/LocalizationService';

interface DeliveryTrackingProps {
  orderId: string;
  navigateTo: (screen: string) => void;
}

export default function DeliveryTracking({ orderId, navigateTo }: DeliveryTrackingProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const insets = useSafeAreaInsets();
  const { getOrderById, updateOrderStatus } = useDelivery();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<Date | null>(null);

  useEffect(() => {
    const foundOrder = getOrderById(orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      // Simulate estimated arrival time
      const now = new Date();
      const estimatedTime = new Date(now.getTime() + 45 * 60000); // 45 minutes from now
      setEstimatedArrival(estimatedTime);
    }
  }, [orderId]);

  // Simulate real-time updates
  useEffect(() => {
    if (!order) return;
    
    const interval = setInterval(() => {
      // Simulate status progression
      const statusProgression: DeliveryOrder['status'][] = [
        'pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'in_transit', 'delivered'
      ];
      
      const currentIndex = statusProgression.indexOf(order.status);
      if (currentIndex < statusProgression.length - 2) {
        const nextStatus = statusProgression[currentIndex + 1];
        updateOrderStatus(order.id, nextStatus);
        setOrder(prev => prev ? { ...prev, status: nextStatus } : null);
      }
    }, 30000); // Update every 30 seconds for demo

    return () => clearInterval(interval);
  }, [order?.status]);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={[styles.centered, { flex: 1 }]}> 
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>{language === 'ar' ? 'لم يتم العثور على الطلب' : 'Order not found'}</Text>
      </View>
      </SafeAreaView>
    );
  }

  const getStatusInfo = (status: DeliveryOrder['status']) => {
    const statusMap = {
      pending: {
        ar: 'في انتظار التأكيد',
        en: 'Pending Confirmation',
        icon: '⏰',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        progress: 10
      },
      confirmed: {
        ar: 'تم تأكيد الطلب',
        en: 'Order Confirmed',
        icon: '✔️',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        progress: 25
      },
      preparing: {
        ar: 'جاري التحضير',
        en: 'Preparing Order',
        icon: '📦',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        progress: 45
      },
      ready: {
        ar: 'جاهز للتوصيل',
        en: 'Ready for Delivery',
        icon: '✔️',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progress: 65
      },
      dispatched: {
        ar: 'تم الإرسال',
        en: 'Dispatched',
        icon: '🚚',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        progress: 80
      },
      in_transit: {
        ar: 'في الطريق',
        en: 'In Transit',
        icon: '🚚',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        progress: 90
      },
      delivered: {
        ar: 'تم التوصيل',
        en: 'Delivered',
        icon: '✔️',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progress: 100
      },
      cancelled: {
        ar: 'تم الإلغاء',
        en: 'Cancelled',
        icon: '⏰',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        progress: 0
      }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(order.status);

  const trackingSteps = [
    {
      id: 'confirmed',
      title: language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmed',
      time: language === 'ar' ? '10:30 ص' : '10:30 AM',
      completed: ['confirmed', 'preparing', 'ready', 'dispatched', 'in_transit', 'delivered'].includes(order.status)
    },
    {
      id: 'preparing',
      title: language === 'ar' ? 'تحضير الطلب' : 'Preparing Order',
      time: language === 'ar' ? '10:45 ص' : '10:45 AM',
      completed: ['preparing', 'ready', 'dispatched', 'in_transit', 'delivered'].includes(order.status)
    },
    {
      id: 'dispatched',
      title: language === 'ar' ? 'خرج للتوصيل' : 'Out for Delivery',
      time: language === 'ar' ? '11:15 ص' : '11:15 AM',
      completed: ['dispatched', 'in_transit', 'delivered'].includes(order.status)
    },
    {
      id: 'delivered',
      title: language === 'ar' ? 'تم التوصيل' : 'Delivered',
      time: estimatedArrival ? `${estimatedArrival.getHours()}:${estimatedArrival.getMinutes().toString().padStart(2, '0')}` : '',
      completed: order.status === 'delivered'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={styles.container}>
      {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigateTo('order-history')} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'تتبع التوصيل' : 'Delivery Tracking'}
          </Text>
        </View>

      {/* Status Overview */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.statusIconBox, { backgroundColor: '#e0e7ff' }]}> {/* bgColor placeholder */}
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>{language === 'ar' ? statusInfo.ar : statusInfo.en}</Text>
            {order.status === 'in_transit' && estimatedArrival && (
              <Text style={styles.statusSubtitle}>
                {language === 'ar' ? 'الوصول المتوقع:' : 'Estimated arrival:'} {estimatedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${statusInfo.progress}%` }]} /></View>
      </View>
      {/* Delivery Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressIcon}>📍</Text>
          <View>
            <Text style={styles.addressTitle}>{language === 'ar' ? order.deliveryAddress.title : order.deliveryAddress.titleEn}</Text>
            <Text style={styles.addressStreet}>{language === 'ar' ? order.deliveryAddress.street : order.deliveryAddress.streetEn}</Text>
            <Text style={styles.addressPhone}>{order.deliveryAddress.phone}</Text>
          </View>
        </View>
      </View>
      {/* Driver Info (when assigned) */}
      {(order.status === 'dispatched' || order.status === 'in_transit') && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{language === 'ar' ? 'معلومات السائق' : 'Driver Information'}</Text>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}><Text style={styles.driverAvatarIcon}>👤</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>محمد أحمد</Text>
              <View style={styles.driverRatingRow}>
                <Text style={styles.driverRatingIcon}>⭐</Text>
                <Text style={styles.driverRatingText}>4.8</Text>
              </View>
            </View>
            <View style={styles.driverActionRow}>
              <TouchableOpacity style={styles.driverActionBtn}><Text style={styles.driverActionIcon}>💬</Text></TouchableOpacity>
              <TouchableOpacity style={styles.driverActionBtn}><Text style={styles.driverActionIcon}>📞</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Order Timeline */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{language === 'ar' ? 'تتبع الطلب' : 'Order Timeline'}</Text>
        {trackingSteps.map((step, index) => (
          <View key={step.id} style={styles.timelineRow}>
            <View style={[styles.timelineIconBox, step.completed && styles.timelineIconBoxActive]}>
              <Text style={styles.timelineIcon}>{step.completed ? '✔️' : '○'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.timelineTitle, step.completed && styles.timelineTitleActive]}>{step.title}</Text>
              {step.time && <Text style={styles.timelineTime}>{step.time}</Text>}
            </View>
          </View>
        ))}
      </View>
      {/* Order Items */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{language === 'ar' ? item.name : item.nameEn}</Text>
              <Text style={styles.itemQty}>{language === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</Text>
            </View>
            <Text style={styles.itemPrice}>{item.price * item.quantity} {language === 'ar' ? 'ج.س' : 'SDG'}</Text>
          </View>
        ))}
        <View style={styles.orderSummaryRow}><Text style={styles.orderSummaryLabel}>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</Text><Text style={styles.orderSummaryValue}>{order.total - order.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</Text></View>
        <View style={styles.orderSummaryRow}><Text style={styles.orderSummaryLabel}>{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</Text><Text style={styles.orderSummaryValue}>{order.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</Text></View>
        <View style={styles.orderSummaryRow}><Text style={styles.orderSummaryTotal}>{language === 'ar' ? 'الإجمالي' : 'Total'}</Text><Text style={styles.orderSummaryTotal}>{order.total} {language === 'ar' ? 'ج.س' : 'SDG'}</Text></View>
      </View>
      {/* Actions */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <View style={styles.actionRow}>
          {order.status === 'pending' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => {}}>
              <Text style={styles.cancelBtnText}>{language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.contactBtn} onPress={() => navigateTo('consult')}>
            <Text style={styles.contactBtnIcon}>💬</Text>
            <Text style={styles.contactBtnText}>{language === 'ar' ? 'تواصل مع الصيدلية' : 'Contact Pharmacy'}</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 24 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, color: '#bbb', marginBottom: 12 },
  emptyText: { color: '#666', fontSize: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerBackBtn: { marginRight: 12, padding: 6 },
  headerBackIcon: { fontSize: 22, color: '#888' },
  headerSubtitle: { fontSize: 13, color: '#666' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', padding: 18, marginBottom: 18 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statusIcon: { fontSize: 24 },
  statusTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  statusSubtitle: { fontSize: 13, color: '#666' },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#007bff', borderRadius: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  addressIcon: { fontSize: 18, color: '#888', marginRight: 8 },
  addressTitle: { fontWeight: 'bold', color: '#222', fontSize: 14 },
  addressStreet: { color: '#444', fontSize: 13 },
  addressPhone: { color: '#888', fontSize: 12 },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  driverAvatarIcon: { fontSize: 24, color: '#888' },
  driverName: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  driverRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  driverRatingIcon: { fontSize: 14, color: '#FFD700', marginRight: 2 },
  driverRatingText: { fontSize: 13, color: '#666' },
  driverActionRow: { flexDirection: 'row', alignItems: 'center' },
  driverActionBtn: { marginLeft: 8, padding: 6 },
  driverActionIcon: { fontSize: 18 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  timelineIconBox: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#eee', alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: '#fff' },
  timelineIconBoxActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  timelineIcon: { fontSize: 16, color: '#fff' },
  timelineTitle: { fontSize: 14, color: '#888', fontWeight: 'bold' },
  timelineTitleActive: { color: '#222' },
  timelineTime: { fontSize: 12, color: '#888' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f3f3f3', marginRight: 12 },
  itemName: { fontWeight: 'bold', color: '#222', fontSize: 14 },
  itemQty: { color: '#888', fontSize: 12 },
  itemPrice: { fontWeight: 'bold', color: '#007bff', fontSize: 14 },
  orderSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  orderSummaryLabel: { color: '#666', fontSize: 13 },
  orderSummaryValue: { color: '#222', fontWeight: 'bold', fontSize: 13 },
  orderSummaryTotal: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  actionRow: { marginTop: 12 },
  cancelBtn: { backgroundColor: '#fff0f0', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginBottom: 8 },
  cancelBtnText: { color: '#e00', fontWeight: 'bold', fontSize: 15 },
  contactBtn: { backgroundColor: '#f3f3f3', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: 14 },
  contactBtnIcon: { fontSize: 18, marginRight: 6 },
  contactBtnText: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
    padding: 6,
  },
  backIcon: {
    fontSize: 22,
    color: '#888',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
});