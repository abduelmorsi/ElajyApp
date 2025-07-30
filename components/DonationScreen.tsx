import React from 'react';
import { Heart } from 'lucide-react';
import { useLocalization } from './services/LocalizationService';
import PatientDonationFlow from './donation/PatientDonationFlow';
import PharmacistDonationManager from './donation/PharmacistDonationManager';

interface DonationScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  userType: 'patient' | 'pharmacist';
  userData: any;
}

export default function DonationScreen({ navigateTo, userType, userData }: DonationScreenProps) {
  const { language } = useLocalization();

  return (
    <div className="h-full overflow-y-auto bg-background pattern-nile">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'التبرعات' : 'Donations'}
              </h1>
              <p className="text-sm text-gray-600">
                {userType === 'patient' 
                  ? (language === 'ar' ? 'ساعد المرضى المحتاجين' : 'Help patients in need')
                  : (language === 'ar' ? 'إدارة التبرعات والتوزيع' : 'Manage donations and distribution')
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTo(userType === 'patient' ? 'home' : 'pharmacist-dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {userType === 'patient' ? (
          <PatientDonationFlow navigateTo={navigateTo} />
        ) : (
          <PharmacistDonationManager 
            navigateTo={navigateTo} 
            userData={userData} 
          />
        )}
      </div>
    </div>
  );
}