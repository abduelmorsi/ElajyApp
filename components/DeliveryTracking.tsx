import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, Package, Truck, Star, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useDelivery, DeliveryOrder } from './services/DeliveryService';
import { useLocalization, useRTL } from './services/LocalizationService';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DeliveryTrackingProps {
  orderId: string;
  navigateTo: (screen: string) => void;
}

export default function DeliveryTracking({ orderId, navigateTo }: DeliveryTrackingProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
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
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">{language === 'ar' ? 'لم يتم العثور على الطلب' : 'Order not found'}</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: DeliveryOrder['status']) => {
    const statusMap = {
      pending: {
        ar: 'في انتظار التأكيد',
        en: 'Pending Confirmation',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        progress: 10
      },
      confirmed: {
        ar: 'تم تأكيد الطلب',
        en: 'Order Confirmed',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        progress: 25
      },
      preparing: {
        ar: 'جاري التحضير',
        en: 'Preparing Order',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        progress: 45
      },
      ready: {
        ar: 'جاهز للتوصيل',
        en: 'Ready for Delivery',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progress: 65
      },
      dispatched: {
        ar: 'تم الإرسال',
        en: 'Dispatched',
        icon: Truck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        progress: 80
      },
      in_transit: {
        ar: 'في الطريق',
        en: 'In Transit',
        icon: Truck,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        progress: 90
      },
      delivered: {
        ar: 'تم التوصيل',
        en: 'Delivered',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progress: 100
      },
      cancelled: {
        ar: 'تم الإلغاء',
        en: 'Cancelled',
        icon: Clock,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        progress: 0
      }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

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
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('order-history')}
              className="text-gray-500"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
              </h1>
              <p className="text-sm text-gray-500">{order.trackingId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <Card className="bg-white border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${statusInfo.bgColor} flex items-center justify-center`}>
                <StatusIcon size={24} className={statusInfo.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? statusInfo.ar : statusInfo.en}
                </h3>
                {order.status === 'in_transit' && estimatedArrival && (
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الوصول المتوقع:' : 'Estimated arrival:'} {estimatedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
            <Progress value={statusInfo.progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="bg-white border border-gray-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
            </h4>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">
                  {language === 'ar' ? order.deliveryAddress.title : order.deliveryAddress.titleEn}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? order.deliveryAddress.street : order.deliveryAddress.streetEn}
                </p>
                <p className="text-sm text-gray-500">
                  {order.deliveryAddress.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Info (when assigned) */}
        {(order.status === 'dispatched' || order.status === 'in_transit') && (
          <Card className="bg-white border border-gray-100">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {language === 'ar' ? 'معلومات السائق' : 'Driver Information'}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">محمد أحمد</p>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-200">
                    <MessageCircle size={16} />
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-200">
                    <Phone size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Timeline */}
        <Card className="bg-white border border-gray-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'تتبع الطلب' : 'Order Timeline'}
            </h4>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.completed 
                      ? 'bg-primary border-primary' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {step.completed ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    {step.time && (
                      <p className="text-sm text-gray-500">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-white border border-gray-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
            </h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? item.name : item.nameEn}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 arabic-numbers">
                    {item.price * item.quantity} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="arabic-numbers">{order.total - order.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span className="arabic-numbers">{order.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-100 pt-2">
                <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="arabic-numbers">{order.total} {language === 'ar' ? 'ج.س' : 'SDG'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="space-y-3">
            {order.status === 'pending' && (
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  // Handle order cancellation
                }}
              >
                {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigateTo('consult')}
            >
              <MessageCircle size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'تواصل مع الصيدلية' : 'Contact Pharmacy'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}