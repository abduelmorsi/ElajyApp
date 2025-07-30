// Sample data for ProductDetailScreen
export const createAvailablePharmacies = (basePrice: number = 15) => [
  {
    id: 1,
    name: 'صيدلية النيل الأزرق',
    nameEn: 'Blue Nile Pharmacy',
    distance: '0.8 كم',
    distanceEn: '0.8 km',
    price: basePrice,
    deliveryTime: '25-35 دقيقة',
    deliveryTimeEn: '25-35 min',
    deliveryFee: 15,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    phone: '+249123456789'
  },
  {
    id: 2,
    name: 'صيدلية الصحة المتكاملة',
    nameEn: 'Integrated Health Pharmacy',
    distance: '1.2 كم',
    distanceEn: '1.2 km',
    price: basePrice + 2,
    deliveryTime: '30-40 دقيقة',
    deliveryTimeEn: '30-40 min',
    deliveryFee: 20,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    phone: '+249123456790'
  },
  {
    id: 3,
    name: 'صيدلية الخرطوم المركزية',
    nameEn: 'Central Khartoum Pharmacy',
    distance: '2.1 كم',
    distanceEn: '2.1 km',
    price: basePrice + 5,
    deliveryTime: '35-45 دقيقة',
    deliveryTimeEn: '35-45 min',
    deliveryFee: 25,
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    phone: '+249123456791'
  }
];

export const createProductSpecifications = (product: any, language: string) => [
  {
    label: language === 'ar' ? 'المادة الفعالة' : 'Active Ingredient',
    value: language === 'ar' ? 'باراسيتامول' : 'Paracetamol'
  },
  {
    label: language === 'ar' ? 'التركيز' : 'Strength',
    value: '500mg'
  },
  {
    label: language === 'ar' ? 'الشكل الصيدلاني' : 'Dosage Form',
    value: language === 'ar' ? 'أقراص' : 'Tablets'
  },
  {
    label: language === 'ar' ? 'العبوة' : 'Package Size',
    value: language === 'ar' ? '20 قرص' : '20 Tablets'
  },
  {
    label: language === 'ar' ? 'الشركة المصنعة' : 'Manufacturer',
    value: language === 'ar' ? product?.brand || 'سودانية للأدوية' : product?.brandEn || 'Sudanese Pharmaceutical'
  },
  {
    label: language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
    value: '12/2026'
  }
];