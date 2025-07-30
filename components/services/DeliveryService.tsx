import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Delivery-related types
export interface DeliveryAddress {
  id: string;
  title: string;
  titleEn: string;
  street: string;
  streetEn: string;
  district: string;
  districtEn: string;
  city: string;
  cityEn: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone: string;
  isDefault: boolean;
  instructions?: string;
  instructionsEn?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  estimatedTime: string;
  estimatedTimeEn: string;
  available: boolean;
  icon: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  timeEn: string;
  available: boolean;
  date: string;
}

export interface DeliveryOrder {
  id: string;
  customerId: string;
  pharmacyId: string;
  items: any[];
  deliveryAddress: DeliveryAddress;
  deliveryOption: DeliveryOption;
  timeSlot?: TimeSlot;
  paymentMethod: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';
  total: number;
  deliveryFee: number;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  contactless: boolean;
  trackingId: string;
  driver?: {
    id: string;
    name: string;
    nameEn: string;
    phone: string;
    rating: number;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
  notesEn?: string;
}

// Sample data
const sampleAddresses: DeliveryAddress[] = [
  {
    id: 'addr_001',
    title: 'المنزل',
    titleEn: 'Home',
    street: 'شارع النيل، الخرطوم',
    streetEn: 'Nile Street, Khartoum',
    district: 'الخرطوم',
    districtEn: 'Khartoum',
    city: 'الخرطوم',
    cityEn: 'Khartoum',
    coordinates: { lat: 15.5007, lng: 32.5599 },
    phone: '+249 123 456 789',
    isDefault: true,
    instructions: 'الشقة رقم 5، الطابق الثاني',
    instructionsEn: 'Apartment 5, Second Floor'
  },
  {
    id: 'addr_002',
    title: 'المكتب',
    titleEn: 'Office',
    street: 'شارع الجامعة، أم درمان',
    streetEn: 'University Street, Omdurman',
    district: 'أم درمان',
    districtEn: 'Omdurman',
    city: 'أم درمان',
    cityEn: 'Omdurman',
    coordinates: { lat: 15.6440, lng: 32.4772 },
    phone: '+249 123 456 789',
    isDefault: false
  }
];

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'same_day',
    name: 'توصيل في نفس اليوم',
    nameEn: 'Same Day Delivery',
    description: 'توصيل خلال 2-4 ساعات',
    descriptionEn: 'Delivery within 2-4 hours',
    price: 25,
    estimatedTime: '2-4 ساعات',
    estimatedTimeEn: '2-4 hours',
    available: true,
    icon: '🚚'
  },
  {
    id: 'express',
    name: 'توصيل سريع',
    nameEn: 'Express Delivery',
    description: 'توصيل خلال ساعة واحدة',
    descriptionEn: 'Delivery within 1 hour',
    price: 50,
    estimatedTime: '30-60 دقيقة',
    estimatedTimeEn: '30-60 minutes',
    available: true,
    icon: '⚡'
  },
  {
    id: 'scheduled',
    name: 'توصيل مجدول',
    nameEn: 'Scheduled Delivery',
    description: 'اختر وقت مناسب للتوصيل',
    descriptionEn: 'Choose a convenient delivery time',
    price: 15,
    estimatedTime: 'حسب الاختيار',
    estimatedTimeEn: 'As selected',
    available: true,
    icon: '📅'
  },
  {
    id: 'pickup',
    name: 'استلام من الصيدلية',
    nameEn: 'Pharmacy Pickup',
    description: 'استلم طلبك من الصيدلية',
    descriptionEn: 'Pick up from pharmacy',
    price: 0,
    estimatedTime: '15-30 دقيقة',
    estimatedTimeEn: '15-30 minutes',
    available: true,
    icon: '🏪'
  }
];

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = [9, 11, 13, 15, 17, 19];
  
  hours.forEach((hour, index) => {
    slots.push({
      id: `slot_${hour}`,
      time: `${hour}:00 - ${hour + 2}:00`,
      timeEn: `${hour}:00 - ${hour + 2}:00`,
      available: Math.random() > 0.3, // Random availability
      date: date.toISOString().split('T')[0]
    });
  });
  
  return slots;
};

interface DeliveryContextType {
  addresses: DeliveryAddress[];
  deliveryOptions: DeliveryOption[];
  orders: DeliveryOrder[];
  selectedAddress: DeliveryAddress | null;
  selectedDeliveryOption: DeliveryOption | null;
  selectedTimeSlot: TimeSlot | null;
  getAddresses: () => DeliveryAddress[];
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectAddress: (address: DeliveryAddress) => void;
  selectDeliveryOption: (option: DeliveryOption) => void;
  selectTimeSlot: (slot: TimeSlot) => void;
  getTimeSlots: (date: Date) => TimeSlot[];
  createOrder: (orderData: Partial<DeliveryOrder>) => DeliveryOrder;
  updateOrderStatus: (orderId: string, status: DeliveryOrder['status']) => void;
  getOrderById: (orderId: string) => DeliveryOrder | undefined;
  getOrdersByCustomer: (customerId: string) => DeliveryOrder[];
  getOrdersByPharmacy: (pharmacyId: string) => DeliveryOrder[];
  trackOrder: (trackingId: string) => DeliveryOrder | undefined;
  reorder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  estimateDeliveryFee: (address: DeliveryAddress, option: DeliveryOption) => number;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(sampleAddresses);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(
    sampleAddresses.find(addr => addr.isDefault) || null
  );
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const getAddresses = () => addresses;

  const addAddress = (addressData: Omit<DeliveryAddress, 'id'>) => {
    const newAddress: DeliveryAddress = {
      ...addressData,
      id: `addr_${Date.now()}`,
    };
    
    // If this is the first address or marked as default, make it default
    if (addresses.length === 0 || addressData.isDefault) {
      setAddresses(prev => [
        ...prev.map(addr => ({ ...addr, isDefault: false })),
        newAddress
      ]);
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
    
    toast.success('تم إضافة العنوان بنجاح');
  };

  const updateAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...addr, ...updates } : addr
    ));
    toast.success('تم تحديث العنوان بنجاح');
  };

  const deleteAddress = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // Set another address as default
      const newDefault = addresses.find(addr => addr.id !== id);
      if (newDefault) {
        setAddresses(prev => prev
          .filter(addr => addr.id !== id)
          .map(addr => addr.id === newDefault.id ? { ...addr, isDefault: true } : addr)
        );
      }
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
    toast.success('تم حذف العنوان بنجاح');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success('تم تحديد العنوان الافتراضي');
  };

  const selectAddress = (address: DeliveryAddress) => {
    setSelectedAddress(address);
  };

  const selectDeliveryOption = (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const getTimeSlots = (date: Date) => {
    return generateTimeSlots(date);
  };

  const createOrder = (orderData: Partial<DeliveryOrder>): DeliveryOrder => {
    const newOrder: DeliveryOrder = {
      id: `order_${Date.now()}`,
      customerId: orderData.customerId || 'user_001',
      pharmacyId: orderData.pharmacyId || 'pharmacy_001',
      items: orderData.items || [],
      deliveryAddress: orderData.deliveryAddress || selectedAddress!,
      deliveryOption: orderData.deliveryOption || selectedDeliveryOption!,
      timeSlot: orderData.timeSlot || selectedTimeSlot || undefined,
      paymentMethod: orderData.paymentMethod || 'cash',
      status: 'pending',
      total: orderData.total || 0,
      deliveryFee: orderData.deliveryFee || 0,
      orderDate: new Date(),
      contactless: orderData.contactless || false,
      trackingId: `TRK${Date.now()}`,
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    toast.success('تم إنشاء الطلب بنجاح');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrdersByPharmacy = (pharmacyId: string) => {
    return orders.filter(order => order.pharmacyId === pharmacyId);
  };

  const trackOrder = (trackingId: string) => {
    return orders.find(order => order.trackingId === trackingId);
  };

  const reorder = (orderId: string) => {
    const originalOrder = orders.find(order => order.id === orderId);
    if (originalOrder) {
      createOrder({
        customerId: originalOrder.customerId,
        pharmacyId: originalOrder.pharmacyId,
        items: originalOrder.items,
        deliveryAddress: originalOrder.deliveryAddress,
        deliveryOption: originalOrder.deliveryOption,
        paymentMethod: originalOrder.paymentMethod,
        total: originalOrder.total,
        deliveryFee: originalOrder.deliveryFee,
        contactless: originalOrder.contactless
      });
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
    toast.success('تم إلغاء الطلب');
  };

  const estimateDeliveryFee = (address: DeliveryAddress, option: DeliveryOption) => {
    return option.price;
  };

  const value: DeliveryContextType = {
    addresses,
    deliveryOptions,
    orders,
    selectedAddress,
    selectedDeliveryOption,
    selectedTimeSlot,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    selectDeliveryOption,
    selectTimeSlot,
    getTimeSlots,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByCustomer,
    getOrdersByPharmacy,
    trackOrder,
    reorder,
    cancelOrder,
    estimateDeliveryFee
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};