import React from 'react';
import { MapPin, Clock, Star, Truck, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLocalization } from '../services/LocalizationService';
import { handlePhoneCall } from './productDetailHelpers';

interface PharmacyCardProps {
  pharmacy: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onCall: (phone: string) => void;
}

export default function PharmacyCard({ pharmacy, index, isSelected, onSelect, onCall }: PharmacyCardProps) {
  const { language } = useLocalization();

  return (
    <div
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-primary/30'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900 text-sm">
              {language === 'ar' ? pharmacy.name : pharmacy.nameEn}
            </h4>
            {pharmacy.inStock ? (
              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                {language === 'ar' ? 'متوفر' : 'In Stock'}
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0.5">
                {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin size={12} className="text-gray-400 mr-1" />
              <span>{language === 'ar' ? pharmacy.distance : pharmacy.distanceEn}</span>
            </div>
            <div className="flex items-center">
              <Clock size={12} className="text-gray-400 mr-1" />
              <span>{language === 'ar' ? pharmacy.deliveryTime : pharmacy.deliveryTimeEn}</span>
            </div>
            <div className="flex items-center">
              <Star size={12} className="text-yellow-400 fill-current mr-1" />
              <span className="arabic-numbers">{pharmacy.rating}</span>
            </div>
            <div className="flex items-center">
              <Truck size={12} className="text-gray-400 mr-1" />
              <span className="arabic-numbers">{pharmacy.deliveryFee} {language === 'ar' ? 'ج.س' : 'SDG'}</span>
            </div>
          </div>
        </div>
        <div className="text-right ml-3">
          <div className="font-bold text-primary arabic-numbers text-lg">
            {pharmacy.price} {language === 'ar' ? 'ج.س' : 'SDG'}
          </div>
          {pharmacy.inStock && (
            <div className="text-xs text-gray-500 arabic-numbers">
              {pharmacy.stockCount} {language === 'ar' ? 'متوفر' : 'available'}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCall(pharmacy.phone);
            }}
            className="mt-2 px-2 py-1"
          >
            <Phone size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}