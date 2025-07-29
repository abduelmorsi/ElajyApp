import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { sudanesePharmaceuticalData, useLocalization, useRTL } from '../services/LocalizationService';

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

const ICONS = {
  trendingUp: '📈',
  trendingDown: '📉',
  dollar: '💵',
  package: '📦',
  users: '👥',
  file: '📄',
  calendar: '📅',
  download: '⬇️',
  filter: '🔍',
  barChart: '📊',
  pieChart: '🥧',
  activity: '🏃',
  alert: '⚠️',
  check: '✅',
  clock: '⏰',
  mapPin: '📍',
};


type PharmacistAnalyticsProps = {
  navigateTo: (screen: string, data?: any) => void;
  userData: any;
};

export default function PharmacistAnalytics({ navigateTo, userData }: PharmacistAnalyticsProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
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
    { value: 'revenue', label: t('analytics.revenue'), icon: ICONS.dollar },
    { value: 'orders', label: t('analytics.orders'), icon: ICONS.package },
    { value: 'customers', label: t('analytics.customers'), icon: ICONS.users },
    { value: 'prescriptions', label: t('analytics.prescriptions'), icon: ICONS.file }
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

  // No exportReport in React Native

  // Tab state
  const [tab, setTab] = useState('overview');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t('analytics.title')}</Text>
          <Text style={styles.headerDesc}>
            {language === 'ar' ? 'تحليل شامل لأداء الصيدلية' : 'Comprehensive pharmacy performance analysis'}
          </Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <View style={styles.pickerRow}>
            {periods.map(period => (
              <TouchableOpacity
                key={period.value}
                style={[styles.periodBtn, selectedPeriod === period.value && styles.periodBtnActive]}
                onPress={() => setSelectedPeriod(period.value)}
              >
                <Text style={[styles.periodBtnText, selectedPeriod === period.value && styles.periodBtnTextActive]}>{period.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Key Metrics Cards */}
      <View style={styles.metricsGrid}>
        {/* Orders */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>{t('analytics.totalOrders')}</Text>
              <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalOrders)}</Text>
              <View style={styles.metricTrendRow}>
                <Text style={styles.metricTrendIcon}>{ICONS.trendingUp}</Text>
                <Text style={styles.metricTrendText}>+{analyticsData.summary.growthRate}%</Text>
              </View>
            </View>
            <View style={styles.metricIconBox}>
              <Text style={styles.metricIcon}>{ICONS.package}</Text>
            </View>
          </View>
        </View>
        {/* Revenue */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>{t('analytics.revenue')}</Text>
              <Text style={styles.metricValue}>{formatCurrency(analyticsData.summary.totalRevenue)}</Text>
              <View style={styles.metricTrendRow}>
                <Text style={styles.metricTrendIcon}>{ICONS.trendingUp}</Text>
                <Text style={styles.metricTrendText}>+12.3%</Text>
              </View>
            </View>
            <View style={styles.metricIconBox}>
              <Text style={styles.metricIcon}>{ICONS.dollar}</Text>
            </View>
          </View>
        </View>
        {/* Customers */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>{t('analytics.customers')}</Text>
              <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalCustomers)}</Text>
              <View style={styles.metricTrendRow}>
                <Text style={styles.metricTrendIcon}>{ICONS.trendingUp}</Text>
                <Text style={styles.metricTrendText}>+8.7%</Text>
              </View>
            </View>
            <View style={styles.metricIconBox}>
              <Text style={styles.metricIcon}>{ICONS.users}</Text>
            </View>
          </View>
        </View>
        {/* Prescriptions */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>{t('analytics.prescriptions')}</Text>
              <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalPrescriptions)}</Text>
              <View style={styles.metricTrendRow}>
                <Text style={styles.metricTrendIcon}>{ICONS.check}</Text>
                <Text style={styles.metricTrendText}>98.5%</Text>
              </View>
            </View>
            <View style={styles.metricIconBox}>
              <Text style={styles.metricIcon}>{ICONS.file}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'overview' && styles.tabBtnActive]} onPress={() => setTab('overview')}>
          <Text style={[styles.tabBtnText, tab === 'overview' && styles.tabBtnTextActive]}>{t('analytics.overview')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'sales' && styles.tabBtnActive]} onPress={() => setTab('sales')}>
          <Text style={[styles.tabBtnText, tab === 'sales' && styles.tabBtnTextActive]}>{t('analytics.sales')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'products' && styles.tabBtnActive]} onPress={() => setTab('products')}>
          <Text style={[styles.tabBtnText, tab === 'products' && styles.tabBtnTextActive]}>{t('analytics.products')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'locations' && styles.tabBtnActive]} onPress={() => setTab('locations')}>
          <Text style={[styles.tabBtnText, tab === 'locations' && styles.tabBtnTextActive]}>{language === 'ar' ? 'المواقع' : 'Locations'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {tab === 'overview' && (
        <View style={styles.tabContentBox}>
          {/* Chart Placeholder */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t('analytics.trends')}</Text>
            <Text style={styles.chartPlaceholder}>[Chart not available in React Native]</Text>
          </View>
          {/* Category Distribution Placeholder */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{language === 'ar' ? 'توزيع المبيعات بالفئات' : 'Sales by Category'}</Text>
            <Text style={styles.chartPlaceholder}>[Pie chart not available in React Native]</Text>
          </View>
          {/* Performance Indicators */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{language === 'ar' ? 'مؤشرات الأداء' : 'Performance Indicators'}</Text>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceIcon}>{ICONS.check}</Text>
              <Text style={styles.performanceLabel}>{language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}</Text>
              <Text style={styles.performanceValue}>{analyticsData.summary.customerSatisfaction}/5</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceIcon}>{ICONS.activity}</Text>
              <Text style={styles.performanceLabel}>{language === 'ar' ? 'متوسط قيمة الطلب' : 'Average Order Value'}</Text>
              <Text style={styles.performanceValue}>{formatCurrency(analyticsData.summary.averageOrderValue)}</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceIcon}>{ICONS.file}</Text>
              <Text style={styles.performanceLabel}>{language === 'ar' ? 'دقة الوصفات' : 'Prescription Accuracy'}</Text>
              <Text style={styles.performanceValue}>{analyticsData.summary.prescriptionAccuracy}%</Text>
            </View>
          </View>
        </View>
      )}

      {tab === 'sales' && (
        <View style={styles.tabContentBox}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t('analytics.sales')} - {selectedPeriod}</Text>
            <Text style={styles.chartPlaceholder}>[Bar chart not available in React Native]</Text>
          </View>
        </View>
      )}

      {tab === 'products' && (
        <View style={styles.tabContentBox}>
          <Text style={styles.chartTitle}>{t('analytics.topSellingProducts')}</Text>
          {analyticsData.topProducts.map((product, index) => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productRankBox}>
                <Text style={styles.productRank}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{language === 'ar' ? product.name : product.nameEn}</Text>
                <Text style={styles.productBrand}>{language === 'ar' ? product.brand : product.brandEn}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.productQty}>{formatNumber(product.soldQuantity)} {language === 'ar' ? 'وحدة' : 'units'}</Text>
                <View style={styles.productGrowthRow}>
                  <Text style={styles.productGrowthIcon}>{product.growth > 0 ? ICONS.trendingUp : ICONS.trendingDown}</Text>
                  <Text style={[styles.productGrowthText, { color: product.growth > 0 ? '#22c55e' : '#e11d48' }]}>
                    {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {tab === 'locations' && (
        <View style={styles.tabContentBox}>
          <Text style={styles.chartTitle}>{language === 'ar' ? 'أداء المواقع' : 'Location Performance'}</Text>
          {analyticsData.pharmacyLocations.map((location, index) => (
            <View key={index} style={styles.locationRow}>
              <View style={styles.locationHeaderRow}>
                <Text style={styles.locationIcon}>{ICONS.mapPin}</Text>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={[styles.locationBadge, { backgroundColor: location.growth > 0 ? '#dcfce7' : '#f3f4f6', color: location.growth > 0 ? '#166534' : '#374151' }]}> {location.growth > 0 ? '+' : ''}{location.growth}% </Text>
              </View>
              <View style={styles.locationStatsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationStatLabel}>{t('analytics.revenue')}</Text>
                  <Text style={styles.locationStatValue}>{formatCurrency(location.sales)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationStatLabel}>{t('analytics.orders')}</Text>
                  <Text style={styles.locationStatValue}>{formatNumber(location.orders)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  contentContainer: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2d7d6b', marginBottom: 2 },
  headerDesc: { fontSize: 14, color: '#555', marginBottom: 2 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  periodBtn: { backgroundColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, marginBottom: 4 },
  periodBtnActive: { backgroundColor: '#2d7d6b' },
  periodBtnText: { color: '#222', fontSize: 13 },
  periodBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
  metricCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, width: '48%', minWidth: 160, elevation: 1 },
  metricCardRow: { flexDirection: 'row', alignItems: 'center' },
  metricLabel: { fontSize: 13, color: '#555' },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  metricTrendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  metricTrendIcon: { fontSize: 14, marginRight: 4 },
  metricTrendText: { fontSize: 12, color: '#22c55e' },
  metricIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  metricIcon: { fontSize: 22 },
  tabsRow: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#e5e7eb', borderRadius: 8 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#2d7d6b' },
  tabBtnText: { color: '#222', fontSize: 15 },
  tabBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  tabContentBox: { marginBottom: 18 },
  chartCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, elevation: 1 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d7d6b', marginBottom: 8 },
  chartPlaceholder: { color: '#bbb', fontSize: 14, textAlign: 'center', marginVertical: 24 },
  performanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  performanceIcon: { fontSize: 18, marginRight: 8 },
  performanceLabel: { fontSize: 14, color: '#555', flex: 1 },
  performanceValue: { fontSize: 14, fontWeight: 'bold', color: '#2d7d6b' },
  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1 },
  productRankBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  productRank: { fontSize: 15, fontWeight: 'bold', color: '#2d7d6b' },
  productName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  productBrand: { fontSize: 12, color: '#555' },
  productQty: { fontSize: 13, color: '#222', fontWeight: 'bold', marginBottom: 2 },
  productGrowthRow: { flexDirection: 'row', alignItems: 'center' },
  productGrowthIcon: { fontSize: 14, marginRight: 4 },
  productGrowthText: { fontSize: 12 },
  locationRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1 },
  locationHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locationIcon: { fontSize: 16, marginRight: 6 },
  locationName: { fontSize: 15, fontWeight: 'bold', color: '#222', flex: 1 },
  locationBadge: { fontSize: 12, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden', marginLeft: 6 },
  locationStatsRow: { flexDirection: 'row', gap: 12 },
  locationStatLabel: { fontSize: 12, color: '#555' },
  locationStatValue: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 2 },
});