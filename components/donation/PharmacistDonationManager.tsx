import React, { useState } from 'react';
import { Heart, Users, Package, Eye, Check, X, FileText, Phone, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useLocalization, useRTL } from '../services/LocalizationService';
import { pendingDonations, eligiblePatients } from './donationData';
import { getUrgencyColor, getStatusColor, getPriorityColor, formatDonationDate, getUrgencyText, getStatusText } from './donationHelpers';
import PatientCard from './PatientCard';

interface PharmacistDonationManagerProps {
  navigateTo: (screen: string, data?: any) => void;
  userData: any;
}

export default function PharmacistDonationManager({ navigateTo, userData }: PharmacistDonationManagerProps) {
  const { language } = useLocalization();
  const { isRTL } = useRTL();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDialog, setShowPatientDialog] = useState(false);

  const handleAssignDonation = (donationId: number, patientId: number) => {
    setSelectedPatient(null);
    setShowPatientDialog(false);
    // Handle assignment logic here
  };

  const handleViewPatientProfile = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };

  const handleDonationAssignment = (donationId: number) => {
    navigateTo('donations', { donationId });
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg p-4">
        <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-white" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'ar' 
                  ? 'قم بمراجعة الأدوية المتبرع بها وتوزيعها على المرضى المستحقين بناءً على حالتهم الطبية والمالية.'
                  : 'Review donated medicines and distribute them to eligible patients based on their medical and financial conditions.'
                }
              </p>
            </div>
            
            {/* Compact Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 p-2 bg-white rounded-lg border border-gray-100`}>
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package size={12} className="text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm arabic-numbers">
                    {pendingDonations.length}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'ar' ? 'تبرع في الانتظار' : 'Pending Donations'}
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 p-2 bg-white rounded-lg border border-gray-100`}>
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={12} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm arabic-numbers">
                    {eligiblePatients.length}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'ar' ? 'مريض مؤهل' : 'Eligible Patients'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Pending Donations with properly structured patient cards */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {language === 'ar' ? 'التبرعات في الانتظار' : 'Pending Donations'}
        </h3>
        
        <div className="space-y-4">
          {pendingDonations.map((donation) => (
            <Card key={donation.id} className="border border-gray-100 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Fixed header with consistent alignment */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 mb-2`}>
                        <h4 className="text-base font-semibold text-gray-900">
                          {language === 'ar' ? donation.medicine : donation.medicineEn}
                        </h4>
                        <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(donation.urgency)}`}>
                          {getUrgencyText(donation.urgency, language)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fixed donation details grid with consistent spacing and alignment */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">
                          {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                        </span>
                        <span className="font-semibold text-gray-900 arabic-numbers">{donation.quantity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">
                          {language === 'ar' ? 'المتبرع:' : 'Donor:'}
                        </span>
                        <span className="font-semibold text-gray-900 truncate max-w-[120px]">
                          {language === 'ar' ? donation.donor : donation.donorEn}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">
                          {language === 'ar' ? 'التاريخ:' : 'Date:'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatDonationDate(donation.donatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">
                          {language === 'ar' ? 'المؤهلين:' : 'Eligible:'}
                        </span>
                        <span className="font-semibold text-gray-900 arabic-numbers">{donation.eligiblePatients}</span>
                      </div>
                    </div>
                  </div>

                  {/* Donor message with consistent styling */}
                  {donation.donorMessage && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                        <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText size={12} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900 text-sm mb-1">
                            {language === 'ar' ? 'رسالة من المتبرع:' : 'Message from Donor:'}
                          </h5>
                          <p className={`text-xs text-blue-700 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {donation.donorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Eligible patients section using the new PatientCard component */}
                  {donation.status === 'pending_assignment' && (
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm mb-3">
                        {language === 'ar' ? 'المرضى المؤهلين:' : 'Eligible Patients:'}
                      </h5>
                      
                      <div className="space-y-3">
                        {eligiblePatients.slice(0, donation.eligiblePatients).map((patient) => (
                          <PatientCard
                            key={patient.id}
                            patient={patient}
                            onView={handleViewPatientProfile}
                            onAssign={(patientId) => handleAssignDonation(donation.id, patientId)}
                            showActions={true}
                            compact={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Already assigned donations with consistent styling */}
                  {donation.status === 'assigned' && donation.assignedTo && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                          <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-green-700">
                              {language === 'ar' ? 'تم التوزيع على:' : 'Assigned to:'} 
                            </span>
                            <span className="text-xs font-semibold text-green-900 ml-1">
                              {language === 'ar' ? donation.assignedTo : donation.assignedToEn}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                          {getStatusText(donation.status, language)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Patient Profile Dialog with proper RTL support */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {language === 'ar' ? 'ملف المريض' : 'Patient Profile'}
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient header */}
              <div className="text-center pb-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-1 text-base">
                  {language === 'ar' ? selectedPatient.name : selectedPatient.nameEn}
                </h4>
                <p className="text-xs text-gray-600 arabic-numbers">
                  {language === 'ar' ? 'العمر:' : 'Age:'} {selectedPatient.age} {language === 'ar' ? 'سنة' : 'years'}
                </p>
              </div>

              {/* Patient details with proper structure */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    {language === 'ar' ? 'الحالة الطبية:' : 'Medical Condition:'}
                  </label>
                  <span className="text-xs font-semibold text-gray-900 text-right max-w-[60%]">
                    {language === 'ar' ? selectedPatient.condition : selectedPatient.conditionEn}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    {language === 'ar' ? 'الوضع المالي:' : 'Financial Status:'}
                  </label>
                  <span className="text-xs font-semibold text-gray-900 text-right max-w-[60%]">
                    {language === 'ar' ? selectedPatient.financialStatus : selectedPatient.financialStatusEn}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    {language === 'ar' ? 'الأولوية الطبية:' : 'Medical Priority:'}
                  </label>
                  <Badge className={`text-xs px-2 py-1 ${getPriorityColor(language === 'ar' ? selectedPatient.medicalPriority : selectedPatient.medicalPriorityEn)}`}>
                    {language === 'ar' ? selectedPatient.medicalPriority : selectedPatient.medicalPriorityEn}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    {language === 'ar' ? 'آخر زيارة:' : 'Last Visit:'}
                  </label>
                  <span className="text-xs font-semibold text-gray-900 arabic-numbers text-right">
                    {formatDonationDate(selectedPatient.lastVisit)}
                  </span>
                </div>

                {selectedPatient.notes && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-2">
                      {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className={`text-xs text-gray-900 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {selectedPatient.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons with consistent spacing and RTL support */}
              <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-2 pt-3 border-t border-gray-200`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `tel:${selectedPatient.phone}`}
                  className="flex-1 text-xs"
                >
                  <Phone size={12} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {language === 'ar' ? 'اتصال' : 'Call'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowPatientDialog(false)}
                  className="flex-1 bg-primary text-white text-xs"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}