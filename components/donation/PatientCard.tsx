import React from 'react';
import { Eye, Check, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLocalization, useRTL } from '../services/LocalizationService';
import { getPriorityColor } from './donationHelpers';

interface PatientCardProps {
  patient: any;
  onView: (patient: any) => void;
  onAssign: (patientId: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function PatientCard({ patient, onView, onAssign, showActions = true, compact = false }: PatientCardProps) {
  const { language } = useLocalization();
  const { isRTL } = useRTL();

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        {/* Patient header with proper structure - prevents overlapping */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Patient name and basic info row - properly structured */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 mb-2`}>
              <h6 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-sm'} truncate`}>
                {language === 'ar' ? patient.name : patient.nameEn}
              </h6>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 flex-shrink-0`}>
                <span className="text-xs text-gray-600 arabic-numbers px-2 py-1 bg-gray-200 rounded-full whitespace-nowrap">
                  {language === 'ar' ? 'العمر:' : 'Age:'} {patient.age}
                </span>
                <Badge className={`text-xs px-2 py-1 whitespace-nowrap ${getPriorityColor(language === 'ar' ? patient.medicalPriority : patient.medicalPriorityEn)}`}>
                  {language === 'ar' ? patient.medicalPriority : patient.medicalPriorityEn}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Action buttons positioned in header to prevent layout issues */}
          {showActions && (
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 ml-4 flex-shrink-0`}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(patient)}
                className={`px-3 py-1.5 ${compact ? 'text-xs h-7' : 'text-xs h-8'} border-gray-300`}
              >
                <Eye size={12} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                {language === 'ar' ? 'عرض' : 'View'}
              </Button>
              <Button
                size="sm"
                onClick={() => onAssign(patient.id)}
                className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 ${compact ? 'text-xs h-7' : 'text-xs h-8'}`}
              >
                <Check size={12} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                {language === 'ar' ? 'توزيع' : 'Assign'}
              </Button>
            </div>
          )}
        </div>
        
        {/* Patient details with proper separation - prevents text overlapping */}
        <div className="space-y-3">
          {/* Medical condition row - completely separate */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {language === 'ar' ? 'الحالة الطبية:' : 'Medical Condition:'}
              </span>
              <span className={`text-xs font-semibold text-gray-900 ${language === 'ar' ? 'text-right' : 'text-left'} max-w-[60%] truncate`}>
                {language === 'ar' ? patient.condition : patient.conditionEn}
              </span>
            </div>
          </div>
          
          {/* Financial status row - completely separate from condition */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {language === 'ar' ? 'الوضع المالي:' : 'Financial Status:'}
              </span>
              <span className={`text-xs font-semibold text-gray-900 ${language === 'ar' ? 'text-right' : 'text-left'} max-w-[60%] truncate`}>
                {language === 'ar' ? patient.financialStatus : patient.financialStatusEn}
              </span>
            </div>
          </div>
          
          {/* Patient notes with proper RTL/LTR support and containment */}
          {patient.notes && (
            <div>
              <span className="text-xs font-medium text-gray-500 block mb-2">
                {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
              </span>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className={`text-xs text-gray-700 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {patient.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}