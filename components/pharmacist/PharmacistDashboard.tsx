import React, { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, AlertTriangle, Clock, Star, Heart, MessageCircle, Upload, BarChart3, Search, Plus, ChevronRight, Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useLocalization, useRTL } from '../services/LocalizationService';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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
      icon: Package,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      count: 12
    },
    {
      id: 'donations',
      title: language === 'ar' ? 'إدارة التبرعات' : 'Donation Management',
      subtitle: language === 'ar' ? 'توزيع الأدوية' : 'Distribute medicines',
      icon: Heart,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      count: 5
    },
    {
      id: 'pharmacist-consultations',
      title: language === 'ar' ? 'الاستشارات' : 'Consultations',
      subtitle: language === 'ar' ? 'استفسارات المرضى' : 'Patient inquiries',
      icon: MessageCircle,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      count: 8
    },
    {
      id: 'pharmacist-inventory',
      title: language === 'ar' ? 'المخزون' : 'Inventory',
      subtitle: language === 'ar' ? 'إدارة المنتجات' : 'Manage products',
      icon: Upload,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
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
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'ar' ? 'الإيرادات' : 'Revenue',
      value: `${language === 'ar' ? '12,450 ج.س' : '12,450 SDG'}`,
      change: +8.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'ar' ? 'العملاء الجدد' : 'New Customers',
      value: 7,
      change: +3,
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'ar' ? 'التبرعات' : 'Donations',
      value: 5,
      change: +2,
      changeType: 'increase',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
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
        return 'bg-yellow-100 text-yellow-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'assigned':
        return 'bg-green-100 text-green-700';
      case 'pending_assignment':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background clean-pattern">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              {/* Added a null check for userData.name before split */}
              <h1 className="text-base font-semibold text-gray-900 mb-1">
                {greeting}, {userData?.name?.split(' ')[1] || (language === 'ar' ? 'د. فاطمة' : 'Dr. Fatima')}
              </h1>
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <MapPin size={10} className={`${getMargin('0', '1')} text-gray-400`} />
                  {/* Added a null check for userData.pharmacy.name */}
                  {userData?.pharmacy?.name || (language === 'ar' ? 'صيدلية النيل الأزرق' : 'Blue Nile Pharmacy')}
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center">
                  <Clock size={10} className="text-gray-400 mr-1" />
                  {currentTime}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">
                  {language === 'ar' ? 'مفتوح' : 'Open'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {language === 'ar' ? 'يغلق الساعة 22:00' : 'Closes at 10:00 PM'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Compact Quick Actions with fixed text boundaries and black titles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </h2>
            <Sparkles size={14} className="text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
                  onClick={() => handleQuickAction(action.id)}
                >
                  <CardContent className="p-3">
                    {/* Compact layout with proper text boundaries */}
                    <div className="space-y-2">
                      {/* Icon and badge row */}
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon size={20} className={action.iconColor} />
                        </div>
                        {action.count && (
                          <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                            {action.count}
                          </Badge>
                        )}
                      </div>

                      {/* Text with proper boundaries - BLACK titles as requested */}
                      <div className="space-y-1 px-1">
                        <h3 className="text-gray-900 font-semibold text-xs leading-tight">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-tight">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Compact Metrics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'مقاييس اليوم' : "Today's Metrics"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('pharmacist-analytics')}
              className="text-primary hover:text-primary/80 text-xs px-2"
            >
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              <BarChart3 size={12} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {todayMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="bg-white border border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-7 h-7 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon size={14} className={metric.color} />
                      </div>
                      <div className={`flex items-center text-xs px-2 py-0.5 rounded-full ${
                        metric.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendingUp size={10} className="mr-1" />
                        +{metric.change}%
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm text-gray-900 arabic-numbers">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {metric.title}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Compact Donation Management with consistent layout */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center">
              <Heart size={14} className="text-red-500 mr-2" />
              {language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('donations')}
              className="text-primary hover:text-primary/80 text-xs px-2"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {pendingDonations.slice(0, 3).map((donation) => (
              <Card
                key={donation.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                onClick={() => handleDonationAssignment(donation.id)}
              >
                <CardContent className="p-3">
                  {/* Fixed grid layout for consistent alignment */}
                  <div className="space-y-2">
                    {/* Header row with proper alignment */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 text-xs">
                        {language === 'ar' ? donation.medicine : donation.medicineEn}
                      </h3>
                      <Badge className={`text-xs px-2 py-0.5 ${getUrgencyColor(donation.urgency)}`}>
                        {donation.urgency === 'high' ? (language === 'ar' ? 'عاجل' : 'Urgent') :
                          donation.urgency === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                          (language === 'ar' ? 'عادي' : 'Normal')}
                      </Badge>
                    </div>

                    {/* Details grid with consistent spacing */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{language === 'ar' ? 'الكمية:' : 'Quantity:'}</span>
                        <span className="font-medium arabic-numbers">{donation.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{language === 'ar' ? 'المتبرع:' : 'Donor:'}</span>
                        <span className="font-medium truncate ml-1">
                          {language === 'ar' ? donation.donor : donation.donorEn}
                        </span>
                      </div>
                    </div>

                    {/* Status row with consistent alignment */}
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(donation.status)}`}>
                        {donation.status === 'pending_assignment'
                          ? (language === 'ar' ? 'في انتظار التوزيع' : 'Pending Assignment')
                          : (language === 'ar' ? 'تم التوزيع' : 'Assigned')
                        }
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {new Date(donation.donatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Assignment info with consistent styling */}
                    {donation.status === 'assigned' && donation.assignedTo && (
                      <div className="p-2 bg-green-50 rounded-lg">
                        <div className="text-xs text-green-700">
                          {language === 'ar' ? 'تم التوزيع على:' : 'Assigned to:'}
                          <span className="font-medium ml-1">
                            {language === 'ar' ? donation.assignedTo : donation.assignedToEn}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compact Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {language === 'ar' ? 'الطلبات الحديثة' : 'Recent Orders'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('pharmacist-orders')}
              className="text-primary hover:text-primary/80 text-xs px-2"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                onClick={() => navigateTo('pharmacist-orders', { orderId: order.id })}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Header with consistent alignment */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 text-xs">
                          #{order.id}
                        </h3>
                        <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' ? (language === 'ar' ? 'في الانتظار' : 'Pending') :
                            order.status === 'preparing' ? (language === 'ar' ? 'قيد التحضير' : 'Preparing') :
                            (language === 'ar' ? 'جاهز' : 'Ready')}
                        </Badge>
                        {order.priority === 'urgent' && (
                          <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0.5">
                            {language === 'ar' ? 'عاجل' : 'Urgent'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.time}
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{language === 'ar' ? 'العميل:' : 'Customer:'}</span>
                        <span className="font-medium truncate ml-1">
                          {language === 'ar' ? order.customer : order.customerEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{language === 'ar' ? 'المبلغ:' : 'Total:'}</span>
                        <span className="font-medium arabic-numbers">
                          {order.total} {language === 'ar' ? 'ج.س' : 'SDG'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compact Quick Search */}
        <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search size={18} className="text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {language === 'ar' ? 'البحث السريع' : 'Quick Search'}
                </h3>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'ابحث عن الأدوية والمنتجات' : 'Search for medicines and products'}
                </p>
                <Button
                  onClick={() => navigateTo('search')}
                  className="bg-primary text-white text-xs px-3 py-1.5"
                >
                  {language === 'ar' ? 'البحث الآن' : 'Search Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}