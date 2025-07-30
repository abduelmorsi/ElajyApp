import React from 'react';
import { Star, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useLocalization } from '../services/LocalizationService';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { language } = useLocalization();

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 mb-1 leading-tight">
              {language === 'ar' ? product.name : product.nameEn}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {language === 'ar' ? product.brand : product.brandEn}
            </p>
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium arabic-numbers">{product.rating || 4.5}</span>
              </div>
              <div className="flex items-center">
                <Shield size={14} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">{language === 'ar' ? 'أصلي' : 'Authentic'}</span>
              </div>
            </div>
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'ar' ? product.description : product.descriptionEn}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}