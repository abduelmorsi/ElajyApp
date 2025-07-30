import React, { createContext, useContext, useState, useEffect } from 'react';

// Notification types
export interface Notification {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  userId: string;
  userType: 'patient' | 'pharmacist';
  actionUrl?: string;
  actionLabel?: string;
  actionLabelEn?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Sample notifications
const generateSampleNotifications = (userType: 'patient' | 'pharmacist'): Notification[] => {
  const baseNotifications: Omit<Notification, 'id' | 'timestamp' | 'userId' | 'userType'>[] = 
    userType === 'patient' ? [
      {
        title: 'طلبك في الطريق',
        titleEn: 'Your order is on the way',
        message: 'سيصل طلبك خلال 15 دقيقة',
        messageEn: 'Your order will arrive within 15 minutes',
        type: 'info',
        read: false,
        actionUrl: 'delivery-tracking',
        actionLabel: 'تتبع الطلب',
        actionLabelEn: 'Track Order'
      },
      {
        title: 'استشارة جديدة متاحة',
        titleEn: 'New consultation available',
        message: 'د. فاطمة أحمد متاحة للاستشارة',
        messageEn: 'Dr. Fatima Ahmed is available for consultation',
        type: 'success',
        read: false,
        actionUrl: 'consult',
        actionLabel: 'بدء الاستشارة',
        actionLabelEn: 'Start Consultation'
      },
      {
        title: 'تذكير بالدواء',
        titleEn: 'Medication reminder',
        message: 'حان موعد تناول دواء الضغط',
        messageEn: 'Time to take your blood pressure medication',
        type: 'warning',
        read: true
      }
    ] : [
      {
        title: 'طلب جديد',
        titleEn: 'New order received',
        message: 'طلب جديد من أحمد محمد علي',
        messageEn: 'New order from Ahmed Mohammed Ali',
        type: 'info',
        read: false,
        actionUrl: 'pharmacist-orders',
        actionLabel: 'عرض الطلب',
        actionLabelEn: 'View Order'
      },
      {
        title: 'مخزون منخفض',
        titleEn: 'Low inventory alert',
        message: 'باراسيتامول 500 مجم - 5 علب متبقية',
        messageEn: 'Paracetamol 500mg - 5 boxes remaining',
        type: 'warning',
        read: false,
        actionUrl: 'pharmacist-inventory',
        actionLabel: 'إدارة المخزون',
        actionLabelEn: 'Manage Inventory'
      },
      {
        title: 'استشارة عاجلة',
        titleEn: 'Urgent consultation',
        message: 'مريض يحتاج استشارة فورية',
        messageEn: 'Patient needs immediate consultation',
        type: 'error',
        read: true,
        actionUrl: 'pharmacist-consultations',
        actionLabel: 'بدء الاستشارة',
        actionLabelEn: 'Start Consultation'
      }
    ];

  return baseNotifications.map((notification, index) => ({
    ...notification,
    id: `notif_${Date.now()}_${index}`,
    timestamp: new Date(Date.now() - index * 3600000), // 1 hour apart
    userId: userType === 'patient' ? 'user_001' : 'pharm_001',
    userType
  }));
};

export const NotificationProvider: React.FC<{ 
  children: React.ReactNode; 
  userType: 'patient' | 'pharmacist' | null;
}> = ({ children, userType }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (userType) {
      const sampleNotifications = generateSampleNotifications(userType);
      setNotifications(sampleNotifications);
    } else {
      setNotifications([]);
    }
  }, [userType]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};