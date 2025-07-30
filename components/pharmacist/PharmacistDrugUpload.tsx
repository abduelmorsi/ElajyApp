import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, Check, AlertCircle, MapPin, Calendar, DollarSign, Package, FileText, Image as ImageIcon, X, Save, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { useLocalization, sudanesePharmaceuticalData, useRTL } from '../services/LocalizationService';
import { toast } from 'sonner';

// Define the interface for PharmacistDrugUpload's props
interface PharmacistDrugUploadProps {
  navigateTo: (screen: string, data?: any) => void;
  // userData is not passed to this component in your App.tsx snippet,
  // so it's not included here.
}

// Define the structure for drug data state
interface DrugData {
  nameAr: string;
  nameEn: string;
  brandAr: string;
  brandEn: string;
  genericName: string;
  dosage: string;
  form: string; // Should ideally map to form['id']
  category: string; // Should ideally map to category['id']
  subcategory: string;
  manufacturer: string;
  manufacturerEn: string;
  price: string; // Use string for input value, convert to number for submission
  stockQuantity: string; // Use string for input value
  minStockLevel: string; // Use string for input value
  expiryDate: string; // ISO date string (YYYY-MM-DD)
  batchNumber: string;
  descriptionAr: string;
  descriptionEn: string;
  usageAr: string;
  usageEn: string;
  warningsAr: string;
  warningsEn: string;
  sideEffectsAr: string;
  sideEffectsEn: string;
  storage: string;
  prescription: boolean;
  activeIngredient: string;
  contraindications: string;
  pharmacyLocations: string[]; // Array of location IDs
}

// Define the structure for an uploaded image
interface UploadedImage {
  file: File;
  preview: string | ArrayBuffer; // Data URL string
  name: string;
}

// Define the structure for errors
interface FormErrors {
  nameAr?: string;
  nameEn?: string;
  category?: string;
  price?: string;
  stockQuantity?: string;
  image?: string;
  locations?: string;
  [key: string]: string | undefined; // Allow for dynamic error keys
}

// Define the structure for categories and dosage forms
interface LocalizedOption {
  id: string;
  nameAr: string;
  nameEn: string;
}

// Define the structure for pharmacy locations (similar to LocalizedOption but might have more fields)
interface PharmacyLocation extends LocalizedOption {
  // Add any other specific fields if they exist for a pharmacy location
}


export default function PharmacistDrugUpload({ navigateTo }: PharmacistDrugUploadProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); // Explicitly type errors state

  const [drugData, setDrugData] = useState<DrugData>({
    nameAr: '',
    nameEn: '',
    brandAr: '',
    brandEn: '',
    genericName: '',
    dosage: '',
    form: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    manufacturerEn: '',
    price: '',
    stockQuantity: '',
    minStockLevel: '',
    expiryDate: '',
    batchNumber: '',
    descriptionAr: '',
    descriptionEn: '',
    usageAr: '',
    usageEn: '',
    warningsAr: '',
    warningsEn: '',
    sideEffectsAr: '',
    sideEffectsEn: '',
    storage: '',
    prescription: false,
    activeIngredient: '',
    contraindications: '',
    pharmacyLocations: []
  });

  const categories: LocalizedOption[] = [
    { id: 'pain', nameAr: 'أدوية الألم', nameEn: 'Pain Relief' },
    { id: 'antibiotics', nameAr: 'المضادات الحيوية', nameEn: 'Antibiotics' },
    { id: 'vitamins', nameAr: 'الفيتامينات', nameEn: 'Vitamins & Supplements' },
    { id: 'digestive', nameAr: 'الجهاز الهضمي', nameEn: 'Digestive Health' },
    { id: 'antimalarial', nameAr: 'أدوية الملاريا', nameEn: 'Anti-Malarial' },
    { id: 'skincare', nameAr: 'العناية بالبشرة', nameEn: 'Skin Care' },
    { id: 'cardiovascular', nameAr: 'القلب والأوعية الدموية', nameEn: 'Cardiovascular' },
    { id: 'diabetes', nameAr: 'أدوية السكري', nameEn: 'Diabetes Medication' }
  ];

  const dosageForms: LocalizedOption[] = [
    { id: 'tablets', nameAr: 'أقراص', nameEn: 'Tablets' },
    { id: 'capsules', nameAr: 'كبسولات', nameEn: 'Capsules' },
    { id: 'syrup', nameAr: 'شراب', nameEn: 'Syrup' },
    { id: 'injection', nameAr: 'حقن', nameEn: 'Injection' },
    { id: 'cream', nameAr: 'كريم', nameEn: 'Cream' },
    { id: 'drops', nameAr: 'قطرات', nameEn: 'Drops' },
    { id: 'powder', nameAr: 'مسحوق', nameEn: 'Powder' }
  ];

  const pharmacyLocations: PharmacyLocation[] = [
    { id: 'central_khartoum', name: 'الصيدلية المركزية - الخرطوم', nameEn: 'Central Pharmacy - Khartoum' },
    { id: 'blue_nile_omdurman', name: 'صيدلية النيل الأزرق - أم درمان', nameEn: 'Blue Nile Pharmacy - Omdurman' },
    { id: 'health_wellness_bahri', name: 'صيدلية الصحة والعافية - بحري', nameEn: 'Health & Wellness - Bahri' },
    { id: 'care_medical', name: 'صيدلية الرعاية الطبية - الكوبرا', nameEn: 'Medical Care Pharmacy - Al-Kobra' }
  ];

  const steps = [
    {
      id: 1,
      title: language === 'ar' ? 'معلومات الدواء' : 'Drug Information',
      icon: FileText
    },
    {
      id: 2,
      title: language === 'ar' ? 'صورة المنتج' : 'Product Image',
      icon: ImageIcon
    },
    {
      id: 3,
      title: language === 'ar' ? 'مواقع الصيدليات' : 'Pharmacy Locations',
      icon: MapPin
    },
    {
      id: 4,
      title: language === 'ar' ? 'مراجعة وتأكيد' : 'Review & Confirm',
      icon: Check
    }
  ];

  const handleInputChange = (field: keyof DrugData, value: string | boolean | string[]) => {
    setDrugData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing/changing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined })); // Set to undefined to remove the specific error
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Use optional chaining for safety
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(language === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 5MB)' : 'Image too large (max 5MB)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file,
          preview: e.target?.result as string, // Cast to string as it will be a data URL
          name: file.name
        });
        setErrors(prev => ({ ...prev, image: undefined })); // Clear image error on successful upload
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}; // Initialize with the FormErrors type

    if (step === 1) {
      if (!drugData.nameAr) newErrors.nameAr = language === 'ar' ? 'اسم الدواء بالعربية مطلوب' : 'Arabic drug name required';
      if (!drugData.nameEn) newErrors.nameEn = language === 'ar' ? 'اسم الدواء بالإنجليزية مطلوب' : 'English drug name required';
      if (!drugData.category) newErrors.category = language === 'ar' ? 'التصنيف مطلوب' : 'Category required';
      // Use Number() to validate if it's a valid number and greater than 0
      if (!drugData.price || Number(drugData.price) <= 0) newErrors.price = language === 'ar' ? 'السعر مطلوب ورقم موجب' : 'Price required and must be a positive number';
      if (!drugData.stockQuantity || Number(drugData.stockQuantity) <= 0) newErrors.stockQuantity = language === 'ar' ? 'كمية المخزون مطلوبة ورقم موجب' : 'Stock quantity required and must be a positive number';
    } else if (step === 2) {
      if (!uploadedImage) newErrors.image = language === 'ar' ? 'صورة المنتج مطلوبة' : 'Product image required';
    } else if (step === 3) {
      if (drugData.pharmacyLocations.length === 0) newErrors.locations = language === 'ar' ? 'يجب اختيار موقع صيدلية واحد على الأقل' : 'At least one pharmacy location required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(language === 'ar' ?
        'تم إضافة الدواء بنجاح! أصبح متاحاً في التطبيق الآن.' :
        'Drug added successfully! It is now available in the app.'
      );

      // Reset form and go back
      setDrugData({
        nameAr: '', nameEn: '', brandAr: '', brandEn: '', genericName: '',
        dosage: '', form: '', category: '', subcategory: '', manufacturer: '',
        manufacturerEn: '', price: '', stockQuantity: '', minStockLevel: '',
        expiryDate: '', batchNumber: '', descriptionAr: '', descriptionEn: '',
        usageAr: '', usageEn: '', warningsAr: '', warningsEn: '',
        sideEffectsAr: '', sideEffectsEn: '', storage: '', prescription: false,
        activeIngredient: '', contraindications: '', pharmacyLocations: []
      });
      setUploadedImage(null);
      setCurrentStep(1);
      navigateTo('pharmacist-inventory');

    } catch (error) {
      console.error("Error submitting drug data:", error); // Log the actual error
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إضافة الدواء' : 'Error adding drug');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationToggle = (locationId: string) => { // Type locationId
    setDrugData(prev => ({
      ...prev,
      pharmacyLocations: prev.pharmacyLocations.includes(locationId)
        ? prev.pharmacyLocations.filter(id => id !== locationId)
        : [...prev.pharmacyLocations, locationId]
    }));
    setErrors(prev => ({ ...prev, locations: undefined })); // Clear locations error on toggle
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>{language === 'ar' ? 'اسم الدواء (عربي)' : 'Drug Name (Arabic)'}</Label>
                  <Input
                    value={drugData.nameAr}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: باراسيتامول 500 مجم' : 'Example: Paracetamol 500mg'}
                    className={errors.nameAr ? 'border-destructive' : ''}
                  />
                  {errors.nameAr && <p className="text-xs text-destructive mt-1">{errors.nameAr}</p>}
                </div>

                <div>
                  <Label>{language === 'ar' ? 'اسم الدواء (إنجليزي)' : 'Drug Name (English)'}</Label>
                  <Input
                    value={drugData.nameEn}
                    onChange={(e) => handleInputChange('nameEn', e.target.value)}
                    placeholder="Example: Paracetamol 500mg"
                    className={errors.nameEn ? 'border-destructive' : ''}
                  />
                  {errors.nameEn && <p className="text-xs text-destructive mt-1">{errors.nameEn}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{language === 'ar' ? 'العلامة التجارية (عربي)' : 'Brand (Arabic)'}</Label>
                    <Input
                      value={drugData.brandAr}
                      onChange={(e) => handleInputChange('brandAr', e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: صيدلية السودان' : 'Sudan Pharma'}
                    />
                  </div>

                  <div>
                    <Label>{language === 'ar' ? 'العلامة التجارية (إنجليزي)' : 'Brand (English)'}</Label>
                    <Input
                      value={drugData.brandEn}
                      onChange={(e) => handleInputChange('brandEn', e.target.value)}
                      placeholder="Sudan Pharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{language === 'ar' ? 'التصنيف' : 'Category'}</Label>
                    <Select value={drugData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder={language === 'ar' ? 'اختر التصنيف' : 'Select Category'} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {language === 'ar' ? cat.nameAr : cat.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <Label>{language === 'ar' ? 'الشكل الدوائي' : 'Dosage Form'}</Label>
                    <Select value={drugData.form} onValueChange={(value) => handleInputChange('form', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر الشكل' : 'Select Form'} />
                      </SelectTrigger>
                      <SelectContent>
                        {dosageForms.map(form => (
                          <SelectItem key={form.id} value={form.id}>
                            {language === 'ar' ? form.nameAr : form.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{language === 'ar' ? 'الجرعة' : 'Dosage'}</Label>
                    <Input
                      value={drugData.dosage}
                      onChange={(e) => handleInputChange('dosage', e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: 500 مجم' : 'Example: 500mg'}
                    />
                  </div>

                  <div>
                    <Label>{language === 'ar' ? 'المادة الفعالة' : 'Active Ingredient'}</Label>
                    <Input
                      value={drugData.activeIngredient}
                      onChange={(e) => handleInputChange('activeIngredient', e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: الباراسيتامول' : 'Example: Acetaminophen'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing & Stock */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                {language === 'ar' ? 'التسعير والمخزون' : 'Pricing & Stock'}
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>{language === 'ar' ? 'السعر (ج.س)' : 'Price (SDG)'}</Label>
                  <Input
                    type="number"
                    value={drugData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
                </div>

                <div>
                  <Label>{language === 'ar' ? 'كمية المخزون' : 'Stock Quantity'}</Label>
                  <Input
                    type="number"
                    value={drugData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    placeholder="0"
                    className={errors.stockQuantity ? 'border-destructive' : ''}
                  />
                  {errors.stockQuantity && <p className="text-xs text-destructive mt-1">{errors.stockQuantity}</p>}
                </div>

                <div>
                  <Label>{language === 'ar' ? 'الحد الأدنى للمخزون' : 'Min Stock Level'}</Label>
                  <Input
                    type="number"
                    value={drugData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
                  <Input
                    type="date"
                    value={drugData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label>{language === 'ar' ? 'رقم التشغيلة' : 'Batch Number'}</Label>
                  <Input
                    value={drugData.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: SD2024-001' : 'Example: SD2024-001'}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription"
                  checked={drugData.prescription}
                  onCheckedChange={(checked) => handleInputChange('prescription', Boolean(checked))} // Explicitly cast checked to boolean
                />
                <Label htmlFor="prescription" className="text-sm">
                  {language === 'ar' ? 'يتطلب وصفة طبية' : 'Requires prescription'}
                </Label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">
                {language === 'ar' ? 'إضافة صورة المنتج' : 'Add Product Image'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' ?
                  'ارفع صورة واضحة للدواء أو عبوة المنتج (مطلوب)' :
                  'Upload a clear image of the medicine or product package (required)'
                }
              </p>
            </div>

            {!uploadedImage ? (
              <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'ar' ? 'اختر صورة المنتج' : 'Choose Product Image'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'PNG, JPG حتى 5MB' : 'PNG, JPG up to 5MB'}
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      <Upload size={16} className={getMargin('0', '2')} />
                      {language === 'ar' ? 'رفع صورة' : 'Upload Image'}
                    </Button>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={uploadedImage.preview as string} // Ensure it's treated as string for src
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-xl border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X size={14} />
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{uploadedImage.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <label htmlFor="image-replace" className="inline-block mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-replace"
                    />
                    <Button variant="outline" size="sm" as="span">
                      <RefreshCw size={14} className={getMargin('0', '1')} />
                      {language === 'ar' ? 'استبدال الصورة' : 'Replace Image'}
                    </Button>
                  </label>
                </div>
              </div>
            )}

            {errors.image && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.image}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">
                {language === 'ar' ? 'اختر مواقع الصيدليات' : 'Select Pharmacy Locations'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' ?
                  'اختر الصيدليات التي سيتوفر فيها هذا الدواء' :
                  'Select the pharmacies where this drug will be available'
                }
              </p>
            </div>

            <div className="space-y-3">
              {pharmacyLocations.map(location => (
                <Card
                  key={location.id}
                  className={`p-3 cursor-pointer transition-all duration-200 ${
                    drugData.pharmacyLocations.includes(location.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleLocationToggle(location.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {language === 'ar' ? location.name : location.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'نشط • متاح للتوصيل' : 'Active • Available for delivery'}
                        </p>
                      </div>
                    </div>
                    <Checkbox
                      checked={drugData.pharmacyLocations.includes(location.id)}
                      onCheckedChange={() => handleLocationToggle(location.id)}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {errors.locations && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.locations}</AlertDescription>
              </Alert>
            )}

            <div className="bg-info/10 rounded-lg p-3">
              <p className="text-sm text-info">
                {language === 'ar' ?
                  `تم اختيار ${drugData.pharmacyLocations.length} موقع. سيظهر الدواء في نتائج البحث لهذه المواقع فقط.` :
                  `${drugData.pharmacyLocations.length} locations selected. Drug will appear in search results for these locations only.`
                }
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-center mb-4">
              {language === 'ar' ? 'مراجعة البيانات قبل الإضافة' : 'Review Data Before Adding'}
            </h3>

            {/* Summary Cards */}
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-start space-x-3">
                  {uploadedImage && (
                    <img
                      src={uploadedImage.preview as string}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {language === 'ar' ? drugData.nameAr : drugData.nameEn}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? drugData.brandAr : drugData.brandEn}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.id === drugData.category)?.[language === 'ar' ? 'nameAr' : 'nameEn']}
                      </Badge>
                      {drugData.prescription && (
                        <Badge variant="outline" className="text-xs">
                          📋 {language === 'ar' ? 'وصفة طبية' : 'Prescription'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary arabic-numbers">{drugData.price} ج.س</p>
                    <p className="text-xs text-muted-foreground arabic-numbers">
                      {drugData.stockQuantity} {language === 'ar' ? 'قطعة' : 'units'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h5 className="font-medium mb-2">
                  {language === 'ar' ? 'مواقع الصيدليات' : 'Pharmacy Locations'}
                </h5>
                <div className="space-y-1">
                  {drugData.pharmacyLocations.map(locationId => {
                    const location = pharmacyLocations.find(l => l.id === locationId);
                    return (
                      <div key={locationId} className="flex items-center text-sm">
                        <MapPin size={12} className={`text-primary ${getMargin('0', '1')}`} />
                        {language === 'ar' ? location?.name : location?.nameEn}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                {language === 'ar' ?
                  'عند الضغط على "إضافة الدواء"، سيصبح متاحاً فوراً في التطبيق وفي نتائج البحث.' :
                  'By clicking "Add Drug", it will become immediately available in the app and search results.'
                }
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" onClick={() => navigateTo('pharmacist-inventory')}>
            <ArrowLeft size={20} className={getMargin('0', '2')} />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </Button>
          <h1 className="font-semibold">
            {language === 'ar' ? 'إضافة دواء جديد' : 'Add New Drug'}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => {
            setDrugData({
              nameAr: '', nameEn: '', brandAr: '', brandEn: '', genericName: '',
              dosage: '', form: '', category: '', subcategory: '', manufacturer: '',
              manufacturerEn: '', price: '', stockQuantity: '', minStockLevel: '',
              expiryDate: '', batchNumber: '', descriptionAr: '', descriptionEn: '',
              usageAr: '', usageEn: '', warningsAr: '', warningsEn: '',
              sideEffectsAr: '', sideEffectsEn: '', storage: '', prescription: false,
              activeIngredient: '', contraindications: '', pharmacyLocations: []
            });
            setUploadedImage(null);
            setCurrentStep(1);
          }}>
            <RefreshCw size={16} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs
                  ${isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'}
                `}>
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-8 mx-2 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="border-t bg-card/50 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStep} / {steps.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading && <RefreshCw size={16} className="animate-spin mr-2" />}
            {currentStep === 4 ?
              (language === 'ar' ? 'إضافة الدواء' : 'Add Drug') :
              (language === 'ar' ? 'التالي' : 'Next')
            }
          </Button>
        </div>
      </div>
    </div>
  );
}