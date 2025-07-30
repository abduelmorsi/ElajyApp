import React, { useState } from 'react';
import { Heart, Search, MapPin, Star, Plus, Minus, ArrowRight, CheckCircle, Users, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useLocalization, useRTL } from '../services/LocalizationService';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { participatingPharmacies, donationMedicines } from './donationData';
import { getDemandColor, calculateDonationTotal } from './donationHelpers';

interface PatientDonationFlowProps {
  navigateTo: (screen: string) => void;
}

export default function PatientDonationFlow({ navigateTo }: PatientDonationFlowProps) {
  const { language } = useLocalization();
  const { getMargin } = useRTL();
  const [currentStep, setCurrentStep] = useState('select-pharmacy');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [donationItems, setDonationItems] = useState([]);
  const [donorMessage, setDonorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setCurrentStep('select-medicines');
  };

  const handleAddToCart = (medicine) => {
    setDonationItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      setDonationItems(prev => prev.filter(item => item.id !== medicineId));
    } else {
      setDonationItems(prev => 
        prev.map(item => 
          item.id === medicineId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleConfirmDonation = () => {
    setCurrentStep('donation-complete');
  };

  const renderPharmacySelection = () => (
    <div className="space-y-6">
      {/* Program Introduction */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'برنامج التبرع بالأدوية' : 'Medicine Donation Program'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'ar' 
                  ? 'ساعد المرضى المحتاجين من خلال التبرع بالأدوية. الصيدليات المشاركة ستقوم بتوزيع الأدوية على المرضى الأكثر حاجة.'
                  : 'Help patients in need by donating medicines. Participating pharmacies will distribute medicines to the most needy patients.'
                }
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Users size={14} className="text-green-600 mr-1" />
                  <span className="text-gray-600">
                    {language === 'ar' ? '450+ مريض استفاد' : '450+ Patients Helped'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Package size={14} className="text-blue-600 mr-1" />
                  <span className="text-gray-600">
                    {language === 'ar' ? '1,240 دواء تم التبرع به' : '1,240 Medicines Donated'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={language === 'ar' ? 'ابحث عن صيدلية...' : 'Search for pharmacy...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Participating Pharmacies */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          {language === 'ar' ? 'الصيدليات المشاركة' : 'Participating Pharmacies'}
        </h3>
        <div className="space-y-4">
          {participatingPharmacies.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200"
              onClick={() => handlePharmacySelect(pharmacy)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={pharmacy.image}
                      alt={pharmacy.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
                          <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                            {language === 'ar' ? pharmacy.verificationLevel : pharmacy.verificationLevelEn}
                          </Badge>
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin size={12} className={getMargin('0', '1')} />
                          {language === 'ar' ? pharmacy.location : pharmacy.locationEn}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center">
                            <Star size={12} className="text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-600 arabic-numbers">{pharmacy.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500 arabic-numbers">
                            {pharmacy.totalDonations} {language === 'ar' ? 'تبرع' : 'donations'}
                          </span>
                          <span className="text-sm text-gray-500 arabic-numbers">
                            {pharmacy.patientsHelped} {language === 'ar' ? 'مريض استفاد' : 'patients helped'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(language === 'ar' ? pharmacy.specialPrograms : pharmacy.specialProgramsEn).map((program, index) => (
                            <Badge key={index} className="bg-blue-50 text-blue-700 text-xs">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMedicineSelection = () => (
    <div className="space-y-6">
      {/* Selected Pharmacy Info */}
      <Card className="bg-primary/5 border border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                {language === 'ar' ? 'التبرع عبر:' : 'Donating through:'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? selectedPharmacy?.name : selectedPharmacy?.nameEn}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep('select-pharmacy')}
            >
              {language === 'ar' ? 'تغيير' : 'Change'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Selection */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          {language === 'ar' ? 'الأدوية المطلوبة' : 'Needed Medicines'}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {donationMedicines.map((medicine) => {
            const cartItem = donationItems.find(item => item.id === medicine.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <Card key={medicine.id} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={medicine.image}
                        alt={medicine.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {language === 'ar' ? medicine.name : medicine.nameEn}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {language === 'ar' ? medicine.description : medicine.descriptionEn}
                          </p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`text-xs ${getDemandColor(language === 'ar' ? medicine.demandLevel : medicine.demandLevelEn)}`}>
                              {language === 'ar' ? `الطلب: ${medicine.demandLevel}` : `Demand: ${medicine.demandLevelEn}`}
                            </Badge>
                            <span className="text-sm font-bold text-primary arabic-numbers">
                              {medicine.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {quantity > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(medicine.id, quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="font-medium arabic-numbers">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(medicine.id, quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(medicine)}
                              className="bg-primary text-white"
                            >
                              <Plus size={14} className="mr-1" />
                              {language === 'ar' ? 'تبرع' : 'Donate'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Donation Summary */}
      {donationItems.length > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ar' ? 'ملخص التبرع' : 'Donation Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {donationItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{language === 'ar' ? item.name : item.nameEn}</span>
                  <span className="text-sm text-gray-600 arabic-numbers"> × {item.quantity}</span>
                </div>
                <span className="font-bold text-primary arabic-numbers">
                  {item.price * item.quantity} {language === 'ar' ? 'ج.س' : 'SDG'}
                </span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {language === 'ar' ? 'المجموع الكلي' : 'Total Amount'}
                </span>
                <span className="font-bold text-lg text-primary arabic-numbers">
                  {calculateDonationTotal(donationItems)} {language === 'ar' ? 'ج.س' : 'SDG'}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setCurrentStep('confirm-donation')}
              className="w-full bg-primary text-white"
            >
              {language === 'ar' ? 'متابعة التبرع' : 'Continue Donation'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderConfirmDonation = () => (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">
            {language === 'ar' ? 'تأكيد التبرع' : 'Confirm Donation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'الصيدلية' : 'Pharmacy'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? selectedPharmacy?.name : selectedPharmacy?.nameEn}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'الأدوية المتبرع بها' : 'Donated Medicines'}
            </h4>
            <div className="space-y-2">
              {donationItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? item.name : item.nameEn}</span>
                  <span className="text-sm font-medium arabic-numbers">
                    {item.quantity} × {item.price} = {item.quantity * item.price} {language === 'ar' ? 'ج.س' : 'SDG'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'رسالة للمرضى (اختيارية)' : 'Message to Patients (Optional)'}
            </h4>
            <Textarea
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              placeholder={language === 'ar' 
                ? 'اكتب رسالة تشجيعية للمرضى المستفيدين...'
                : 'Write an encouraging message for the benefiting patients...'
              }
              className="min-h-[80px]"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
              </span>
              <span className="font-bold text-lg text-primary arabic-numbers">
                {calculateDonationTotal(donationItems)} {language === 'ar' ? 'ج.س' : 'SDG'}
              </span>
            </div>
          </div>

          <Button
            onClick={handleConfirmDonation}
            className="w-full bg-primary text-white h-12"
          >
            {language === 'ar' ? 'تأكيد التبرع' : 'Confirm Donation'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDonationComplete = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {language === 'ar' ? 'شكراً لك على تبرعك!' : 'Thank you for your donation!'}
        </h3>
        <p className="text-gray-600 max-w-md">
          {language === 'ar' 
            ? 'تم استلام تبرعك بنجاح. ستقوم الصيدلية بتقييم المرضى المحتاجين وتوزيع الأدوية عليهم.'
            : 'Your donation has been received successfully. The pharmacy will assess needy patients and distribute the medicines to them.'
          }
        </p>
      </div>

      <Card className="w-full max-w-md bg-green-50 border border-green-200">
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            <p className="font-medium text-green-900">
              {language === 'ar' ? 'تفاصيل التبرع' : 'Donation Details'}
            </p>
            <p className="text-sm text-green-700 arabic-numbers">
              {donationItems.length} {language === 'ar' ? 'نوع دواء' : 'medicine types'}
            </p>
            <p className="text-sm text-green-700 arabic-numbers">
              {calculateDonationTotal(donationItems)} {language === 'ar' ? 'جنيه سوداني' : 'Sudanese Pounds'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 w-full max-w-md">
        <Button
          onClick={() => navigateTo('home')}
          className="w-full bg-primary text-white"
        >
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep('select-pharmacy');
            setSelectedPharmacy(null);
            setDonationItems([]);
            setDonorMessage('');
          }}
          className="w-full"
        >
          {language === 'ar' ? 'تبرع جديد' : 'New Donation'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === 'select-pharmacy' && renderPharmacySelection()}
      {currentStep === 'select-medicines' && renderMedicineSelection()}
      {currentStep === 'confirm-donation' && renderConfirmDonation()}
      {currentStep === 'donation-complete' && renderDonationComplete()}
    </>
  );
}