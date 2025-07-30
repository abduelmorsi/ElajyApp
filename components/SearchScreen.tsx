import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Clock, Navigation, Truck, Phone, Plus, Grid3X3, List, Map, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLocalization, useRTL } from './services/LocalizationService';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function SearchScreen({ navigateTo, addToCart }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // Default to map for prominence
  const [mapReady, setMapReady] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Realistic search suggestions
  const searchSuggestions = [
    {
      ar: 'باراسيتامول',
      en: 'Paracetamol',
      type: 'medicine',
      description: 'مسكن للآلام وخافض للحرارة',
      descriptionEn: 'Pain reliever and fever reducer'
    },
    {
      ar: 'أسبرين',
      en: 'Aspirin',
      type: 'medicine',
      description: 'مضاد للالتهابات ومميع للدم',
      descriptionEn: 'Anti-inflammatory and blood thinner'
    },
    {
      ar: 'أنسولين',
      en: 'Insulin',
      type: 'medicine',
      description: 'لعلاج داء السكري',
      descriptionEn: 'For diabetes treatment'
    },
    {
      ar: 'أموكسيسيلين',
      en: 'Amoxicillin',
      type: 'medicine',
      description: 'مضاد حيوي واسع المجال',
      descriptionEn: 'Broad-spectrum antibiotic'
    },
    {
      ar: 'فيتامين د',
      en: 'Vitamin D',
      type: 'supplement',
      description: 'مكمل غذائي لصحة العظام',
      descriptionEn: 'Dietary supplement for bone health'
    },
    {
      ar: 'كريم مرطب',
      en: 'Moisturizing Cream',
      type: 'skincare',
      description: 'للعناية بالبشرة الجافة',
      descriptionEn: 'For dry skin care'
    }
  ];

  // Unified, simple color palette for categories
  const categories = [
    {
      id: 'all',
      name: 'الكل',
      nameEn: 'All',
      icon: '🏥',
      color: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200'
    },
    {
      id: 'general',
      name: 'أدوية عامة',
      nameEn: 'General Medicine',
      icon: '💊',
      color: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-300'
    },
    {
      id: 'children',
      name: 'أدوية الأطفال',
      nameEn: 'Children Medicine',
      icon: '👶',
      color: 'bg-slate-50',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-200'
    },
    {
      id: 'supplements',
      name: 'مكملات غذائية',
      nameEn: 'Supplements',
      icon: '🌿',
      color: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-300'
    },
    {
      id: 'medical',
      name: 'مستلزمات طبية',
      nameEn: 'Medical Supplies',
      icon: '🩹',
      color: 'bg-slate-50',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-200'
    },
    {
      id: 'skincare',
      name: 'العناية بالبشرة',
      nameEn: 'Skincare',
      icon: '🧴',
      color: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-300'
    },
    {
      id: 'chronic',
      name: 'الأمراض المزمنة',
      nameEn: 'Chronic Diseases',
      icon: '🏥',
      color: 'bg-slate-50',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-200'
    },
    {
      id: 'herbal',
      name: 'أدوية عشبية',
      nameEn: 'Herbal Medicine',
      icon: '🌱',
      color: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-300'
    }
  ];

  // Sample medicines with enhanced Sudanese context
  const medicines = [
    {
      id: 1,
      name: 'باراسيتامول 500 مجم',
      nameEn: 'Paracetamol 500mg',
      brand: 'سودانية للأدوية',
      brandEn: 'Sudanese Pharmaceutical',
      price: 15,
      category: 'general',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 12,
      rating: 4.5,
      description: 'مسكن للآلام وخافض للحرارة',
      descriptionEn: 'Pain reliever and fever reducer'
    },
    {
      id: 2,
      name: 'أموكسيسيلين 250 مجم',
      nameEn: 'Amoxicillin 250mg',
      brand: 'الخرطوم فارما',
      brandEn: 'Khartoum Pharma',
      price: 45,
      category: 'general',
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 8,
      rating: 4.7,
      description: 'مضاد حيوي واسع المجال',
      descriptionEn: 'Broad-spectrum antibiotic'
    },
    {
      id: 3,
      name: 'فيتامين د للأطفال',
      nameEn: 'Children Vitamin D',
      brand: 'النيل الأزرق',
      brandEn: 'Blue Nile',
      price: 35,
      category: 'children',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 15,
      rating: 4.8,
      description: 'مكمل غذائي لصحة العظام',
      descriptionEn: 'Dietary supplement for bone health'
    },
    {
      id: 4,
      name: 'كريم ترطيب البشرة',
      nameEn: 'Moisturizing Cream',
      brand: 'العناية السودانية',
      brandEn: 'Sudanese Care',
      price: 25,
      category: 'skincare',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 10,
      rating: 4.6,
      description: 'للعناية بالبشرة الجافة',
      descriptionEn: 'For dry skin care'
    },
    {
      id: 5,
      name: 'أنسولين سريع المفعول',
      nameEn: 'Fast-Acting Insulin',
      brand: 'دلتا فارما',
      brandEn: 'Delta Pharma',
      price: 120,
      category: 'chronic',
      image: 'https://images.unsplash.com/photo-1550572017-cdefed14b9c1?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 6,
      rating: 4.9,
      description: 'ضروري لمرضى السكري',
      descriptionEn: 'Essential for diabetes patients'
    },
    {
      id: 6,
      name: 'أسبرين 100 مجم',
      nameEn: 'Aspirin 100mg',
      brand: 'النيل الأبيض',
      brandEn: 'White Nile',
      price: 18,
      category: 'general',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop',
      inStock: true,
      pharmacyCount: 14,
      rating: 4.3,
      description: 'مضاد للالتهابات ومميع للدم',
      descriptionEn: 'Anti-inflammatory and blood thinner'
    }
  ];

  // Sample pharmacies with enhanced details
  const pharmacies = [
    {
      id: 1,
      name: 'صيدلية النيل الأزرق',
      nameEn: 'Blue Nile Pharmacy',
      location: 'الخرطوم - المقرن',
      locationEn: 'Khartoum - Mogran',
      distance: '0.8 كم',
      distanceEn: '0.8 km',
      rating: 4.8,
      deliveryTime: '25-35 دقيقة',
      deliveryTimeEn: '25-35 min',
      deliveryFee: 15,
      isOpen: true,
      phone: '+249123456789',
      coordinates: { lat: 15.5007, lng: 32.5599 },
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop',
      availableMedicines: [1, 2, 3, 5]
    },
    {
      id: 2,
      name: 'صيدلية الصحة المتكاملة',
      nameEn: 'Integrated Health Pharmacy',
      location: 'أم درمان - الثورة',
      locationEn: 'Omdurman - Al-Thawra',
      distance: '1.2 كم',
      distanceEn: '1.2 km',
      rating: 4.9,
      deliveryTime: '30-40 دقيقة',
      deliveryTimeEn: '30-40 min',
      deliveryFee: 20,
      isOpen: true,
      phone: '+249123456790',
      coordinates: { lat: 15.6440, lng: 32.4772 },
      image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=300&h=200&fit=crop',
      availableMedicines: [1, 2, 4, 6]
    },
    {
      id: 3,
      name: 'صيدلية الخرطوم المركزية',
      nameEn: 'Central Khartoum Pharmacy',
      location: 'الخرطوم بحري - الدرجة الثالثة',
      locationEn: 'Khartoum North - Al-Daraja Al-Thalitha',
      distance: '2.1 كم',
      distanceEn: '2.1 km',
      rating: 4.6,
      deliveryTime: '35-45 دقيقة',
      deliveryTimeEn: '35-45 min',
      deliveryFee: 25,
      isOpen: true,
      phone: '+249123456791',
      coordinates: { lat: 15.6393, lng: 32.5363 },
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      availableMedicines: [3, 4, 5, 6]
    }
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter pharmacies that have the searched medicine
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    if (!searchQuery) return true;
    const matchingMedicines = filteredMedicines.filter(medicine => 
      pharmacy.availableMedicines.includes(medicine.id)
    );
    return matchingMedicines.length > 0;
  });

  // Horizontal category scrolling
  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll-container');
    if (container) {
      const scrollAmount = 200;
      const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount;
      container.scrollBy({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // Initialize map with React-friendly approach
  useEffect(() => {
    if (viewMode === 'map') {
      // Simulate map loading without DOM manipulation conflicts
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setMapReady(false);
    }
  }, [viewMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (!searchQuery) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(language === 'ar' ? suggestion.ar : suggestion.en);
    setShowSuggestions(false);
  };

  const handleMedicineClick = (medicine) => {
    navigateTo('product-detail', medicine);
  };

  // Enhanced add to cart handler with validation
  const handleAddToCart = (medicine) => {
    if (!addToCart) {
      console.error('addToCart function not provided');
      return;
    }
    
    if (!medicine || !medicine.id) {
      console.error('Invalid medicine data:', medicine);
      return;
    }

    if (!medicine.inStock) {
      // Could show an error toast here
      console.warn('Medicine out of stock:', medicine.name);
      return;
    }

    addToCart(medicine, 1);
  };

  const handlePharmacyCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handlePharmacyDirections = (pharmacy) => {
    // Simple directions without complex DOM manipulation
    const message = language === 'ar' 
      ? `الاتجاهات إلى ${pharmacy.name} - ${pharmacy.distance}`
      : `Directions to ${pharmacy.nameEn} - ${pharmacy.distanceEn}`;
    alert(message);
  };

  // Enhanced map component with search results integration
  const MapComponent = () => (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex flex-col relative overflow-hidden">
      {/* Map Header with search info */}
      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-sm px-3 py-2 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {searchQuery 
              ? `${language === 'ar' ? 'نتائج البحث عن:' : 'Results for:'} ${searchQuery}`
              : (language === 'ar' ? 'خريطة الصيدليات' : 'Pharmacy Map')
            }
          </span>
        </div>
        {searchQuery && (
          <div className="text-xs text-gray-500 mt-1">
            {filteredPharmacies.length} {language === 'ar' ? 'صيدلية متاحة' : 'pharmacies available'}
          </div>
        )}
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
        {language === 'ar' ? 'خريطة تفاعلية' : 'Interactive Map'}
      </div>

      {/* Enhanced Pharmacy Markers with search integration */}
      <div className="absolute inset-0">
        {filteredPharmacies.map((pharmacy, index) => (
          <div
            key={pharmacy.id}
            className="absolute cursor-pointer group z-20"
            style={{
              top: `${25 + index * 18}%`,
              left: `${30 + index * 12}%`
            }}
            onClick={() => {
              const info = language === 'ar' ? pharmacy.name : pharmacy.nameEn;
              const availableMeds = filteredMedicines.filter(med => 
                pharmacy.availableMedicines.includes(med.id)
              ).length;
              alert(`${info}\n${language === 'ar' ? pharmacy.location : pharmacy.locationEn}\n${availableMeds} ${language === 'ar' ? 'أدوية متوفرة' : 'medicines available'}`);
            }}
          >
            {/* Pharmacy marker */}
            <div className={`w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
              searchQuery && filteredMedicines.some(med => pharmacy.availableMedicines.includes(med.id))
                ? 'bg-green-500' 
                : 'bg-primary'
            }`}>
              <MapPin size={18} className="text-white" />
            </div>
            
            {/* Pharmacy info popup on hover */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 min-w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="text-xs font-medium text-gray-900">
                {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
              </div>
              <div className="text-xs text-gray-600">
                {language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}
              </div>
              {searchQuery && (
                <div className="text-xs text-green-600 mt-1">
                  {filteredMedicines.filter(med => pharmacy.availableMedicines.includes(med.id)).length} {language === 'ar' ? 'متوفر' : 'available'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {!mapReady && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-background arabic-pattern">
      {/* Enhanced Header with better spacing */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              {language === 'ar' ? 'البحث والاستكشاف' : 'Search & Explore'}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-2 py-1.5"
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-2 py-1.5"
              >
                <List size={14} />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="px-2 py-1.5"
              >
                <Map size={14} />
              </Button>
            </div>
          </div>

          {/* Enhanced Search Bar with suggestions */}
          <div className="relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن دواء أو صيدلية...' : 'Search for medicine or pharmacy...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-10 py-2.5 bg-gray-50 border-gray-200 focus:bg-white rounded-lg text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Filter size={14} />
                </Button>
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? 'اقتراحات البحث' : 'Search Suggestions'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Search size={12} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-0.5 text-sm">
                            {language === 'ar' ? suggestion.ar : suggestion.en}
                          </div>
                          <div className="text-xs text-gray-600">
                            {language === 'ar' ? suggestion.description : suggestion.descriptionEn}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimized Horizontal Categories with unified palette */}
      <div className="bg-white border-b border-gray-50 py-3">
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              {language === 'ar' ? 'الفئات' : 'Categories'}
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollCategories('left')}
                className="w-7 h-7 p-0 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollCategories('right')}
                className="w-7 h-7 p-0 text-gray-400 hover:text-gray-600"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
          
          {/* Horizontal Scrollable Categories with unified colors */}
          <div 
            id="category-scroll-container"
            className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`
                  flex-shrink-0 w-20 cursor-pointer transition-all duration-200 border
                  ${selectedCategory === category.id 
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                style={{ scrollSnapAlign: 'start' }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-2 text-center">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                    <span className="text-base">{category.icon}</span>
                  </div>
                  <h4 className={`text-xs font-medium leading-tight ${
                    selectedCategory === category.id ? 'text-primary' : category.textColor
                  }`}>
                    {language === 'ar' ? category.name : category.nameEn}
                  </h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Prominent Map */}
      <div className="p-4">
        <Tabs defaultValue="pharmacies" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger value="pharmacies" className="rounded-md py-2 text-sm">{language === 'ar' ? 'الصيدليات' : 'Pharmacies'}</TabsTrigger>
            <TabsTrigger value="medicines" className="rounded-md py-2 text-sm">{language === 'ar' ? 'الأدوية' : 'Medicines'}</TabsTrigger>
          </TabsList>

          <TabsContent value="pharmacies" className="space-y-4">
            {/* Prominent Map Display - 70% of screen height with better integration */}
            {viewMode === 'map' ? (
              <Card className="bg-white border border-gray-100 shadow-sm" style={{ height: '65vh' }}>
                <CardContent className="p-0 h-full">
                  <MapComponent />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredPharmacies.map((pharmacy) => (
                  <Card
                    key={pharmacy.id}
                    className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={pharmacy.image}
                            alt={pharmacy.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 flex items-center mb-1">
                                {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                                {pharmacy.isOpen && (
                                  <Badge className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5">
                                    {language === 'ar' ? 'مفتوح' : 'Open'}
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center mb-2">
                                <MapPin size={12} className={`${getMargin('0', '1')} text-gray-400`} />
                                {language === 'ar' ? pharmacy.location : pharmacy.locationEn}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                                  <span className="text-gray-600 arabic-numbers">{pharmacy.rating}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={12} className="text-gray-400 mr-1" />
                                  <span className="text-gray-600">
                                    {language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Truck size={12} className="text-gray-400 mr-1" />
                                  <span className="text-gray-600 arabic-numbers">
                                    {pharmacy.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePharmacyCall(pharmacy.phone)}
                                className="px-2 py-1.5"
                              >
                                <Phone size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePharmacyDirections(pharmacy)}
                                className="px-2 py-1.5"
                              >
                                <Navigation size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="medicines" className="space-y-4">
            {/* Medicines Results */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">
                  {language === 'ar' ? 'النتائج' : 'Results'} ({filteredMedicines.length})
                </h3>
              </div>

              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 gap-3">
                  {filteredMedicines.map((medicine) => (
                    <Card
                      key={medicine.id}
                      className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                      onClick={() => handleMedicineClick(medicine)}
                    >
                      <CardContent className="p-3">
                        <div className="w-full h-20 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          <ImageWithFallback
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1 leading-tight">
                          {language === 'ar' ? medicine.name : medicine.nameEn}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {language === 'ar' ? medicine.brand : medicine.brandEn}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-primary text-sm arabic-numbers">
                            {medicine.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                          </span>
                          <div className="flex items-center space-x-0.5">
                            <Star size={10} className="text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 arabic-numbers">{medicine.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-xs px-2 py-0.5 ${
                              medicine.inStock 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {medicine.inStock 
                              ? (language === 'ar' ? 'متوفر' : 'In Stock')
                              : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')
                            }
                          </Badge>
                          {medicine.inStock && addToCart && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(medicine);
                              }}
                              className="bg-primary text-white px-2 py-1 text-xs"
                            >
                              <Plus size={12} />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-3">
                  {filteredMedicines.map((medicine) => (
                    <Card
                      key={medicine.id}
                      className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 border border-gray-100"
                      onClick={() => handleMedicineClick(medicine)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={medicine.image}
                              alt={medicine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm">
                              {language === 'ar' ? medicine.name : medicine.nameEn}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {language === 'ar' ? medicine.brand : medicine.brandEn}
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-primary arabic-numbers text-sm">
                                {medicine.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 arabic-numbers">{medicine.rating}</span>
                              </div>
                              <Badge
                                className={`text-xs px-2 py-0.5 ${
                                  medicine.inStock 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {medicine.inStock 
                                  ? (language === 'ar' ? 'متوفر' : 'In Stock')
                                  : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')
                                }
                              </Badge>
                            </div>
                          </div>
                          {medicine.inStock && addToCart && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(medicine);
                              }}
                              className="bg-primary text-white px-3 py-2 flex-shrink-0"
                            >
                              <Plus size={14} />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}