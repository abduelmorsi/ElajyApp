import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  FileText, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Legend
} from 'recharts';
import { useLocalization, sudanesePharmaceuticalData, useRTL } from '../services/LocalizationService';

// Mock analytics data with Sudanese context
const generateAnalyticsData = () => {
  const currentDate = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('ar-SD', { weekday: 'short' }),
      dayEn: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 100) + 50,
      customers: Math.floor(Math.random() * 80) + 30,
      prescriptions: Math.floor(Math.random() * 40) + 20
    };
  });

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 45000) + 25000,
      orders: Math.floor(Math.random() * 90) + 60
    };
  });

  const topProducts = sudanesePharmaceuticalData.commonMedicines.map(medicine => ({
    ...medicine,
    soldQuantity: Math.floor(Math.random() * 200) + 50,
    revenue: (Math.floor(Math.random() * 200) + 50) * medicine.price,
    growth: (Math.random() - 0.5) * 40 // -20% to +20%
  })).sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 6);

  const categoryData = [
    { name: 'أدوية الألم', nameEn: 'Pain Relief', value: 35, revenue: 450000 },
    { name: 'الفيتامينات', nameEn: 'Vitamins', value: 25, revenue: 320000 },
    { name: 'المضادات الحيوية', nameEn: 'Antibiotics', value: 20, revenue: 280000 },
    { name: 'أدوية الملاريا', nameEn: 'Anti-Malarial', value: 15, revenue: 200000 },
    { name: 'أخرى', nameEn: 'Others', value: 5, revenue: 80000 }
  ];

  const pharmacyLocations = [
    { name: 'الصيدلية المركزية - الخرطوم', sales: 850000, orders: 1250, growth: 12.5 },
    { name: 'صيدلية النيل - أم درمان', sales: 720000, orders: 980, growth: 8.3 },
    { name: 'صيدلية الصحة - بحري', sales: 640000, orders: 850, growth: -2.1 },
    { name: 'صيدلية العافية - الكوبرا', sales: 580000, orders: 760, growth: 15.7 }
  ];

  return {
    last7Days,
    last30Days,
    topProducts,
    categoryData,
    pharmacyLocations,
    summary: {
      totalRevenue: 2890000,
      totalOrders: 4840,
      totalCustomers: 1520,
      totalPrescriptions: 890,
      growthRate: 12.5,
      averageOrderValue: 597,
      customerSatisfaction: 4.7,
      prescriptionAccuracy: 98.5
    }
  };
};

const COLORS = ['#2d7d6b', '#22c55e', '#34d399', '#6ee7b7', '#86efac', '#a7f3d0'];

export default function PharmacistAnalytics({ navigateTo }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData] = useState(generateAnalyticsData());

  const periods = [
    { value: '7days', label: language === 'ar' ? '7 أيام' : '7 Days' },
    { value: '30days', label: language === 'ar' ? '30 يوم' : '30 Days' },
    { value: '3months', label: language === 'ar' ? '3 أشهر' : '3 Months' },
    { value: '1year', label: language === 'ar' ? 'سنة' : '1 Year' }
  ];

  const metrics = [
    { value: 'revenue', label: t('analytics.revenue'), icon: DollarSign },
    { value: 'orders', label: t('analytics.orders'), icon: Package },
    { value: 'customers', label: t('analytics.customers'), icon: Users },
    { value: 'prescriptions', label: t('analytics.prescriptions'), icon: FileText }
  ];

  const getCurrentData = () => {
    return selectedPeriod === '7days' ? analyticsData.last7Days : analyticsData.last30Days;
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('ar-SD')} ${t('unit.sdg')}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString(language === 'ar' ? 'ar-SD' : 'en-US');
  };

  const exportReport = () => {
    // Mock export functionality
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: analyticsData.summary,
      data: getCurrentData()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-analytics-${selectedPeriod}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('analytics.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? 'تحليل شامل لأداء الصيدلية' : 'Comprehensive pharmacy performance analysis'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download size={16} className={getMargin('0', '1')} />
            {t('analytics.export')}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.totalOrders')}</p>
              <p className="text-2xl font-bold arabic-numbers">{formatNumber(analyticsData.summary.totalOrders)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-success mr-1" />
                <span className="text-xs text-success arabic-numbers">+{analyticsData.summary.growthRate}%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.revenue')}</p>
              <p className="text-xl font-bold arabic-numbers">{formatCurrency(analyticsData.summary.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-success mr-1" />
                <span className="text-xs text-success arabic-numbers">+12.3%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.customers')}</p>
              <p className="text-2xl font-bold arabic-numbers">{formatNumber(analyticsData.summary.totalCustomers)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-info mr-1" />
                <span className="text-xs text-info arabic-numbers">+8.7%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.prescriptions')}</p>
              <p className="text-2xl font-bold arabic-numbers">{formatNumber(analyticsData.summary.totalPrescriptions)}</p>
              <div className="flex items-center mt-1">
                <CheckCircle size={12} className="text-primary mr-1" />
                <span className="text-xs text-primary arabic-numbers">98.5%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview">{t('analytics.overview')}</TabsTrigger>
          <TabsTrigger value="sales">{t('analytics.sales')}</TabsTrigger>
          <TabsTrigger value="products">{t('analytics.products')}</TabsTrigger>
          <TabsTrigger value="locations">{language === 'ar' ? 'المواقع' : 'Locations'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Revenue Trend Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('analytics.trends')}</h3>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map(metric => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2ebe7" />
                  <XAxis 
                    dataKey={language === 'ar' ? 'day' : 'dayEn'} 
                    stroke="#6b7b73"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7b73" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2ebe7',
                      borderRadius: '8px',
                      direction: isRTL ? 'rtl' : 'ltr'
                    }}
                    formatter={(value, name) => [
                      selectedMetric === 'sales' ? formatCurrency(value) : formatNumber(value),
                      metrics.find(m => m.value === selectedMetric)?.label || name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#2d7d6b"
                    fill="#2d7d6b"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{language === 'ar' ? 'توزيع المبيعات بالفئات' : 'Sales by Category'}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey={language === 'ar' ? 'name' : 'nameEn'}
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, language === 'ar' ? 'النسبة' : 'Percentage']}
                      contentStyle={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    />
                    <Legend 
                      formatter={(value, entry) => entry.payload[language === 'ar' ? 'name' : 'nameEn']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">{language === 'ar' ? 'مؤشرات الأداء' : 'Performance Indicators'}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle size={20} className="text-success mr-2" />
                    <span className="text-sm">{language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
                  </div>
                  <span className="font-semibold text-success arabic-numbers">
                    {analyticsData.summary.customerSatisfaction}/5
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center">
                    <Activity size={20} className="text-primary mr-2" />
                    <span className="text-sm">{language === 'ar' ? 'متوسط قيمة الطلب' : 'Average Order Value'}</span>
                  </div>
                  <span className="font-semibold text-primary arabic-numbers">
                    {formatCurrency(analyticsData.summary.averageOrderValue)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                  <div className="flex items-center">
                    <FileText size={20} className="text-warning mr-2" />
                    <span className="text-sm">{language === 'ar' ? 'دقة الوصفات' : 'Prescription Accuracy'}</span>
                  </div>
                  <span className="font-semibold text-warning arabic-numbers">
                    {analyticsData.summary.prescriptionAccuracy}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t('analytics.sales')} - {selectedPeriod}</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2ebe7" />
                  <XAxis 
                    dataKey={language === 'ar' ? 'day' : 'dayEn'} 
                    stroke="#6b7b73"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7b73" fontSize={12} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2ebe7',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [formatCurrency(value), t('analytics.revenue')]}
                  />
                  <Bar dataKey="sales" fill="#2d7d6b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t('analytics.topSellingProducts')}</h3>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary arabic-numbers">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{language === 'ar' ? product.name : product.nameEn}</h4>
                      <p className="text-sm text-muted-foreground">{language === 'ar' ? product.brand : product.brandEn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold arabic-numbers">{formatNumber(product.soldQuantity)} {language === 'ar' ? 'وحدة' : 'units'}</p>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp size={12} className="text-success mr-1" />
                      ) : (
                        <TrendingDown size={12} className="text-destructive mr-1" />
                      )}
                      <span className={`text-xs arabic-numbers ${product.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">{language === 'ar' ? 'أداء المواقع' : 'Location Performance'}</h3>
            <div className="space-y-4">
              {analyticsData.pharmacyLocations.map((location, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-primary mr-2" />
                      <h4 className="font-medium">{location.name}</h4>
                    </div>
                    <Badge variant={location.growth > 0 ? 'default' : 'secondary'}>
                      {location.growth > 0 ? '+' : ''}{location.growth}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('analytics.revenue')}</p>
                      <p className="font-semibold arabic-numbers">{formatCurrency(location.sales)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('analytics.orders')}</p>
                      <p className="font-semibold arabic-numbers">{formatNumber(location.orders)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}