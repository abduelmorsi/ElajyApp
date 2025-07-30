import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

// Simple Chart Components
const SimpleLineChart = ({ data, title, language }) => {
  const maxValue = Math.max(...data.map(d => d.sales));
  const minValue = Math.min(...data.map(d => d.sales));
  const range = maxValue - minValue;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {data.map((item, index) => {
            const height = range > 0 ? ((item.sales - minValue) / range) * 100 : 50;
            return (
              <View key={index} style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: `${height}%`, backgroundColor: '#3b82f6' }]} />
                <Text style={styles.chartLabel}>{language === 'ar' ? item.day : item.dayEn}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const SimplePieChart = ({ data, title, language }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            
            return (
              <View key={index} style={[styles.pieSlice, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: [{ rotate: `${startAngle}deg` }]
              }]}>
                <View style={[styles.pieSliceInner, { 
                  backgroundColor: COLORS[index % COLORS.length],
                  width: '50%',
                  height: '100%',
                  borderTopLeftRadius: 60,
                  borderBottomLeftRadius: 60,
                  transform: [{ rotate: `${angle}deg` }]
                }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.pieLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS[index % COLORS.length] }]} />
              <Text style={styles.legendText}>
                {language === 'ar' ? item.name : item.nameEn} ({item.value}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

type PharmacistAnalyticsProps = {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
  userData: any;
};

export default function PharmacistAnalytics({ navigateTo, goBack, userData }: PharmacistAnalyticsProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const analyticsData = generateAnalyticsData();

  const periods = [
    { label: language === 'ar' ? '7 أيام' : '7D', value: '7d' },
    { label: language === 'ar' ? '30 يوم' : '30D', value: '30d' },
    { label: language === 'ar' ? '3 أشهر' : '3M', value: '3m' },
    { label: language === 'ar' ? 'سنة' : '1Y', value: '1y' }
  ];

  const getCurrentData = () => {
    return selectedPeriod === '7d' ? analyticsData.last7Days : analyticsData.last30Days;
  };

  const formatCurrency = (amount) => {
    // For very large amounts, use custom M notation
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `SDG ${millions.toFixed(2)}M`;
    }
    
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SD' : 'en-US', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString(language === 'ar' ? 'ar-SD' : 'en-US');
  };

  // Tab state
  const [tab, setTab] = useState('overview');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'التحليلات والإحصائيات' : 'Analytics & Statistics'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 100 }}>
        <View style={styles.body}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map(period => (
              <TouchableOpacity
                key={period.value}
                style={[styles.periodBtn, selectedPeriod === period.value && styles.periodBtnActive]}
                onPress={() => setSelectedPeriod(period.value)}
              >
                <Text style={[styles.periodBtnText, selectedPeriod === period.value && styles.periodBtnTextActive]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Key Metrics Cards */}
          <View style={styles.metricsGrid}>
            {/* Orders */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</Text>
                  <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalOrders)}</Text>
                  <View style={styles.metricTrendRow}>
                    <Icon name="trending-up" size={16} color="#22c55e" />
                    <Text style={[styles.metricTrendText, { color: '#22c55e' }]}>+{analyticsData.summary.growthRate}%</Text>
                  </View>
                </View>
                <View style={styles.metricIconBox}>
                  <Icon name="inventory" size={18} color="#49C5B8" />
                </View>
              </View>
            </View>

            {/* Revenue */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{language === 'ar' ? 'الإيرادات' : 'Revenue'}</Text>
                  <Text style={styles.metricValue}>{formatCurrency(analyticsData.summary.totalRevenue)}</Text>
                  <View style={styles.metricTrendRow}>
                    <Icon name="trending-up" size={16} color="#22c55e" />
                    <Text style={[styles.metricTrendText, { color: '#22c55e' }]}>+12.3%</Text>
                  </View>
                </View>
                <View style={styles.metricIconBox}>
                  <Icon name="attach-money" size={18} color="#49C5B8" />
                </View>
              </View>
            </View>

            {/* Customers */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{language === 'ar' ? 'العملاء' : 'Customers'}</Text>
                  <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalCustomers)}</Text>
                  <View style={styles.metricTrendRow}>
                    <Icon name="trending-up" size={16} color="#22c55e" />
                    <Text style={[styles.metricTrendText, { color: '#22c55e' }]}>+8.7%</Text>
                  </View>
                </View>
                <View style={styles.metricIconBox}>
                  <Icon name="people" size={18} color="#49C5B8" />
                </View>
              </View>
            </View>

            {/* Prescriptions */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions'}</Text>
                  <Text style={styles.metricValue}>{formatNumber(analyticsData.summary.totalPrescriptions)}</Text>
                  <View style={styles.metricTrendRow}>
                    <Icon name="check-circle" size={16} color="#22c55e" />
                    <Text style={[styles.metricTrendText, { color: '#22c55e' }]}>98.5%</Text>
                  </View>
                </View>
                <View style={styles.metricIconBox}>
                  <Icon name="description" size={18} color="#49C5B8" />
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'overview' && styles.tabBtnActive]} onPress={() => setTab('overview')}>
              <Text style={[styles.tabBtnText, tab === 'overview' && styles.tabBtnTextActive]}>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'sales' && styles.tabBtnActive]} onPress={() => setTab('sales')}>
              <Text style={[styles.tabBtnText, tab === 'sales' && styles.tabBtnTextActive]}>{language === 'ar' ? 'المبيعات' : 'Sales'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'products' && styles.tabBtnActive]} onPress={() => setTab('products')}>
              <Text style={[styles.tabBtnText, tab === 'products' && styles.tabBtnTextActive]}>{language === 'ar' ? 'المنتجات' : 'Products'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'locations' && styles.tabBtnActive]} onPress={() => setTab('locations')}>
              <Text style={[styles.tabBtnText, tab === 'locations' && styles.tabBtnTextActive]}>{language === 'ar' ? 'المواقع' : 'Locations'}</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {tab === 'overview' && (
            <View style={styles.tabContentBox}>
              {/* Sales Trends Chart */}
              <SimpleLineChart 
                data={getCurrentData()} 
                title={language === 'ar' ? 'اتجاهات المبيعات' : 'Sales Trends'} 
                language={language} 
              />
              
              {/* Sales by Category Chart */}
              <SimplePieChart 
                data={analyticsData.categoryData} 
                title={language === 'ar' ? 'المبيعات حسب الفئة' : 'Sales by Category'} 
                language={language} 
              />
            </View>
          )}

          {tab === 'sales' && (
            <View style={styles.tabContentBox}>
              <SimpleLineChart 
                data={getCurrentData()} 
                title={`${t('analytics.sales')} - ${selectedPeriod}`} 
                language={language} 
              />
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
                      <Icon name={product.growth > 0 ? "trending-up" : "trending-down"} size={14} color={product.growth > 0 ? "#22c55e" : "#e11d48"} />
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
                    <Icon name="map" size={16} color="#222" />
                    <Text style={styles.locationName}>{location.name}</Text>
                    <View style={[styles.locationBadge, { backgroundColor: location.growth > 0 ? '#dbeafe' : '#f3f4f6' }]}>
                      <Text style={{ color: location.growth > 0 ? '#1e40af' : '#374151', fontSize: 12, fontWeight: '500' }}>
                        {location.growth > 0 ? '+' : ''}{location.growth}%
                      </Text>
                    </View>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  body: {
    padding: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  periodBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  periodBtnActive: {
    backgroundColor: '#49C5B8',
  },
  periodBtnText: {
    color: '#222',
    fontSize: 13,
  },
  periodBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    minWidth: 160,
    elevation: 1,
    minHeight: 100,
  },
  metricCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 13,
    color: '#555',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    flexShrink: 1,
  },
  metricTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metricTrendIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metricTrendText: {
    fontSize: 12,
    color: '#22c55e',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e6f7f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 2,
    flexShrink: 0,
  },
  metricIcon: {
    fontSize: 22,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabBtnActive: {
    backgroundColor: '#49C5B8',
  },
  tabBtnText: {
    color: '#222',
    fontSize: 15,
  },
  tabBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContentBox: {
    marginBottom: 18,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#49C5B8',
    marginBottom: 8,
  },
  chartPlaceholder: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 24,
  },
  // Chart Styles
  chartContainer: {
    height: 200,
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBar: {
    width: 20,
    backgroundColor: '#22c55e',
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  // Pie Chart Styles
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pieSliceInner: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  pieLegend: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  productRankBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f7f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  productRank: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#49C5B8',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  productBrand: {
    fontSize: 12,
    color: '#555',
  },
  productQty: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productGrowthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productGrowthIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  productGrowthText: {
    fontSize: 12,
  },
  locationRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  locationBadge: {
    fontSize: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    marginLeft: 6,
  },
  locationStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationStatLabel: {
    fontSize: 12,
    color: '#555',
  },
  locationStatValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
});