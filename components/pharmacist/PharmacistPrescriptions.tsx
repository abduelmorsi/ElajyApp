import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';
import MedicineImage from '../ui/MedicineImage';

type PharmacistPrescriptionsProps = {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
};

export default function PharmacistPrescriptions({ navigateTo, goBack }: PharmacistPrescriptionsProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [tab, setTab] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const prescriptions = [
    {
      id: 'RX-001',
      patient: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      doctor: language === 'ar' ? 'د. فاطمة علي' : 'Dr. Fatima Ali',
      date: '2024-01-15',
      uploadTime: '2024-01-15T10:30:00',
      status: 'pending',
      medications: [
        { 
          name: language === 'ar' ? 'باراسيتامول 500 ملغ' : 'Paracetamol 500mg', 
          dosage: language === 'ar' ? 'قرص واحد 3 مرات يومياً' : '1 tablet 3 times daily', 
          duration: language === 'ar' ? '5 أيام' : '5 days' 
        },
        { 
          name: language === 'ar' ? 'أموكسيسيلين 250 ملغ' : 'Amoxicillin 250mg', 
          dosage: language === 'ar' ? 'كبسولة واحدة مرتين يومياً' : '1 capsule 2 times daily', 
          duration: language === 'ar' ? '7 أيام' : '7 days' 
        }
      ],
      notes: language === 'ar' ? 'المريض لديه حساسية من البنسلين' : 'Patient has allergy to penicillin'
    },
    {
      id: 'RX-002',
      patient: language === 'ar' ? 'فاطمة حسن' : 'Fatima Hassan',
      doctor: language === 'ar' ? 'د. محمد أحمد' : 'Dr. Mohamed Ahmed',
      date: '2024-01-14',
      uploadTime: '2024-01-14T16:45:00',
      status: 'verified',
      medications: [
        { 
          name: language === 'ar' ? 'فيتامين سي 1000 ملغ' : 'Vitamin C 1000mg', 
          dosage: language === 'ar' ? 'قرص واحد يومياً' : '1 tablet daily', 
          duration: language === 'ar' ? '30 يوماً' : '30 days' 
        }
      ]
    },
    {
      id: 'RX-003',
      patient: language === 'ar' ? 'محمد علي' : 'Mohamed Ali',
      doctor: language === 'ar' ? 'د. سارة إبراهيم' : 'Dr. Sara Ibrahim',
      date: '2024-01-13',
      uploadTime: '2024-01-13T09:15:00',
      status: 'rejected',
      medications: [
        { 
          name: language === 'ar' ? 'أنسولين عادي' : 'Insulin Regular', 
          dosage: language === 'ar' ? '10 وحدات قبل الوجبات' : '10 units before meals', 
          duration: language === 'ar' ? 'مستمر' : 'Ongoing' 
        }
      ],
      notes: language === 'ar' ? 'الوصفة غير واضحة، تحتاج توضيح من الطبيب' : 'Prescription unclear, needs clarification from doctor'
    },
    {
      id: 'RX-004',
      patient: language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed',
      doctor: language === 'ar' ? 'د. علي محمد' : 'Dr. Ali Mohamed',
      date: '2024-01-16',
      uploadTime: '2024-01-16T14:20:00',
      status: 'pending',
      medications: [
        { 
          name: language === 'ar' ? 'أيبوبروفين 400 ملغ' : 'Ibuprofen 400mg', 
          dosage: language === 'ar' ? 'قرص واحد 4 مرات يومياً' : '1 tablet 4 times daily', 
          duration: language === 'ar' ? '3 أيام' : '3 days' 
        },
        { 
          name: language === 'ar' ? 'أموكسيسيلين 500 ملغ' : 'Amoxicillin 500mg', 
          dosage: language === 'ar' ? 'كبسولة واحدة 3 مرات يومياً' : '1 capsule 3 times daily', 
          duration: language === 'ar' ? '10 أيام' : '10 days' 
        },
        { 
          name: language === 'ar' ? 'باراسيتامول 1000 ملغ' : 'Paracetamol 1000mg', 
          dosage: language === 'ar' ? 'قرص واحد عند الحاجة' : '1 tablet as needed', 
          duration: language === 'ar' ? '5 أيام' : '5 days' 
        }
      ],
      notes: language === 'ar' ? 'تناول الدواء مع الطعام لتجنب اضطراب المعدة' : 'Take medication with food to avoid stomach upset'
    },
    {
      id: 'RX-005',
      patient: language === 'ar' ? 'علي حسن' : 'Ali Hassan',
      doctor: language === 'ar' ? 'د. نورا محمد' : 'Dr. Nora Mohamed',
      date: '2024-01-12',
      uploadTime: '2024-01-12T11:45:00',
      status: 'verified',
      medications: [
        { 
          name: language === 'ar' ? 'أوميبرازول 20 ملغ' : 'Omeprazole 20mg', 
          dosage: language === 'ar' ? 'كبسولة واحدة يومياً' : '1 capsule daily', 
          duration: language === 'ar' ? '14 يوماً' : '14 days' 
        },
        { 
          name: language === 'ar' ? 'دومبيريدون 10 ملغ' : 'Domperidone 10mg', 
          dosage: language === 'ar' ? 'قرص واحد 3 مرات يومياً' : '1 tablet 3 times daily', 
          duration: language === 'ar' ? '7 أيام' : '7 days' 
        }
      ]
    },
    {
      id: 'RX-006',
      patient: language === 'ar' ? 'مريم عبدالله' : 'Mariam Abdullah',
      doctor: language === 'ar' ? 'د. أحمد سعيد' : 'Dr. Ahmed Saeed',
      date: '2024-01-11',
      uploadTime: '2024-01-11T08:30:00',
      status: 'rejected',
      medications: [
        { 
          name: language === 'ar' ? 'وارفارين 5 ملغ' : 'Warfarin 5mg', 
          dosage: language === 'ar' ? 'قرص واحد يومياً' : '1 tablet daily', 
          duration: language === 'ar' ? 'مستمر' : 'Ongoing' 
        }
      ],
      notes: language === 'ar' ? 'الجرعة غير واضحة، تحتاج مراجعة من الطبيب المعالج' : 'Dosage unclear, needs review from treating physician'
    },
    {
      id: 'RX-007',
      patient: language === 'ar' ? 'خالد محمد' : 'Khalid Mohamed',
      doctor: language === 'ar' ? 'د. ليلى أحمد' : 'Dr. Layla Ahmed',
      date: '2024-01-17',
      uploadTime: '2024-01-17T15:10:00',
      status: 'pending',
      medications: [
        { 
          name: language === 'ar' ? 'سيتريزين 10 ملغ' : 'Cetirizine 10mg', 
          dosage: language === 'ar' ? 'قرص واحد يومياً' : '1 tablet daily', 
          duration: language === 'ar' ? '7 أيام' : '7 days' 
        },
        { 
          name: language === 'ar' ? 'مونتيلوكاست 10 ملغ' : 'Montelukast 10mg', 
          dosage: language === 'ar' ? 'قرص واحد مساءً' : '1 tablet in the evening', 
          duration: language === 'ar' ? '30 يوماً' : '30 days' 
        }
      ]
    },
    {
      id: 'RX-008',
      patient: language === 'ar' ? 'نورا علي' : 'Nora Ali',
      doctor: language === 'ar' ? 'د. محمد حسن' : 'Dr. Mohamed Hassan',
      date: '2024-01-10',
      uploadTime: '2024-01-10T13:25:00',
      status: 'verified',
      medications: [
        { 
          name: language === 'ar' ? 'ميتفورمين 500 ملغ' : 'Metformin 500mg', 
          dosage: language === 'ar' ? 'قرص واحد مرتين يومياً' : '1 tablet twice daily', 
          duration: language === 'ar' ? 'مستمر' : 'Ongoing' 
        },
        { 
          name: language === 'ar' ? 'جلوكوفاج 850 ملغ' : 'Glucophage 850mg', 
          dosage: language === 'ar' ? 'قرص واحد مع الإفطار' : '1 tablet with breakfast', 
          duration: language === 'ar' ? 'مستمر' : 'Ongoing' 
        }
      ]
    },
    {
      id: 'RX-009',
      patient: language === 'ar' ? 'يوسف أحمد' : 'Youssef Ahmed',
      doctor: language === 'ar' ? 'د. فاطمة علي' : 'Dr. Fatima Ali',
      date: '2024-01-09',
      uploadTime: '2024-01-09T09:50:00',
      status: 'rejected',
      medications: [
        { 
          name: language === 'ar' ? 'أموكسيسيلين 875 ملغ' : 'Amoxicillin 875mg', 
          dosage: language === 'ar' ? 'قرص واحد مرتين يومياً' : '1 tablet twice daily', 
          duration: language === 'ar' ? '7 أيام' : '7 days' 
        }
      ],
      notes: language === 'ar' ? 'المريض لديه تاريخ من الحساسية للبنسلين' : 'Patient has history of penicillin allergy'
    },
    {
      id: 'RX-010',
      patient: language === 'ar' ? 'زينب محمد' : 'Zeinab Mohamed',
      doctor: language === 'ar' ? 'د. أحمد علي' : 'Dr. Ahmed Ali',
      date: '2024-01-18',
      uploadTime: '2024-01-18T12:15:00',
      status: 'pending',
      medications: [
        { 
          name: language === 'ar' ? 'فيتامين د3 1000 وحدة' : 'Vitamin D3 1000 IU', 
          dosage: language === 'ar' ? 'قرص واحد يومياً' : '1 tablet daily', 
          duration: language === 'ar' ? '90 يوماً' : '90 days' 
        },
        { 
          name: language === 'ar' ? 'كالسيوم 500 ملغ' : 'Calcium 500mg', 
          dosage: language === 'ar' ? 'قرص واحد مرتين يومياً' : '1 tablet twice daily', 
          duration: language === 'ar' ? '90 يوماً' : '90 days' 
        },
        { 
          name: language === 'ar' ? 'أوميغا 3 1000 ملغ' : 'Omega 3 1000mg', 
          dosage: language === 'ar' ? 'كبسولة واحدة يومياً' : '1 capsule daily', 
          duration: language === 'ar' ? '60 يوماً' : '60 days' 
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'verified': return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'rejected': return { backgroundColor: '#FECACA', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'verified': return 'check-circle';
      case 'rejected': return 'cancel';
      default: return 'description';
    }
  };

  const verifyPrescription = (prescriptionId) => {
    Alert.alert('Verify', `Verifying prescription ${prescriptionId}`);
  };

  const rejectPrescription = (prescriptionId, reason) => {
    Alert.alert('Reject', `Rejecting prescription ${prescriptionId}: ${reason}`);
  };

  const pendingPrescriptions = prescriptions.filter(rx => rx.status === 'pending');
  const verifiedPrescriptions = prescriptions.filter(rx => rx.status === 'verified');
  const rejectedPrescriptions = prescriptions.filter(rx => rx.status === 'rejected');

  const PrescriptionCard = ({ prescription, showActions = true }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedPrescription(prescription)}>
      <View style={[styles.cardHeader, isRTL && styles.cardHeaderRTL]}>
        <View>
          <View style={[styles.cardHeaderRow, isRTL && styles.cardHeaderRowRTL]}>
            <Icon name={getStatusIcon(prescription.status)} size={18} color={getStatusColor(prescription.status).color} />
            <Text style={[styles.orderId, isRTL && styles.orderIdRTL]}>
              {language === 'ar' ? 'وصفة طبية #' : 'Prescription #'}{prescription.id}
            </Text>
          </View>
          <Text style={[styles.customer, isRTL && styles.customerRTL]}>{prescription.patient}</Text>
          <Text style={[styles.doctor, isRTL && styles.doctorRTL]}>{prescription.doctor}</Text>
        </View>
        <View style={[styles.badge, getStatusColor(prescription.status), isRTL && styles.badgeRTL]}>
          <Icon name={getStatusIcon(prescription.status)} size={14} color={getStatusColor(prescription.status).color} />
                     <Text style={[styles.badgeText, { color: getStatusColor(prescription.status).color }, isRTL && styles.badgeTextRTL]}>
             {language === 'ar' ? 
               (prescription.status === 'pending' ? 'في الانتظار' : 
                prescription.status === 'verified' ? 'موثق' : 
                prescription.status === 'rejected' ? 'مرفوض' : prescription.status) 
               : prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
           </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.itemsCount, isRTL && styles.itemsCountRTL]}>
          {language === 'ar' ? 'الأدوية:' : 'Medications:'}
        </Text>
        {prescription.medications.slice(0, 2).map((med, index) => (
          <Text key={index} style={[styles.itemText, isRTL && styles.itemTextRTL]}>{med.name}</Text>
        ))}
        {prescription.medications.length > 2 && (
          <Text style={[styles.moreItems, isRTL && styles.moreItemsRTL]}>
            +{prescription.medications.length - 2} {language === 'ar' ? 'أخرى' : 'more'}
          </Text>
        )}
        <View style={[styles.cardFooter, isRTL && styles.cardFooterRTL]}>
          <Text style={[styles.dateText, isRTL && styles.dateTextRTL]}>
            {language === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(prescription.date).toLocaleDateString()}
          </Text>
          <Text style={[styles.uploadedText, isRTL && styles.uploadedTextRTL]}>
            {language === 'ar' ? 'تم الرفع:' : 'Uploaded:'} {new Date(prescription.uploadTime).toLocaleString()}
          </Text>
        </View>
      </View>
             {showActions && prescription.status === 'pending' && (
         <View style={[styles.actionRow, isRTL && styles.actionRowRTL]}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => verifyPrescription(prescription.id)}>
            <Icon name="check" size={16} color="#fff" />
                         <Text style={[styles.buttonText, isRTL && styles.buttonTextRTL]}>{language === 'ar' ? 'تحقق' : 'Verify'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(prescription.id, 'Review required')}>
            <Icon name="close" size={16} color="#fff" />
                         <Text style={[styles.buttonText, isRTL && styles.buttonTextRTL]}>{language === 'ar' ? 'رفض' : 'Reject'}</Text>
          </TouchableOpacity>
        </View>
      )}
             {prescription.notes && (
         <View style={[styles.notesBox, isRTL && styles.notesBoxRTL]}>
           <Icon name="warning" size={16} color="#f59e0b" style={isRTL && styles.notesIconRTL} />
          <Text style={[styles.notesText, isRTL && styles.notesTextRTL]}>{prescription.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedPrescription) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
                 {/* Fixed Header */}
         <View style={[styles.header, { paddingTop: insets.top }]}>
           <TouchableOpacity onPress={() => setSelectedPrescription(null)} style={styles.backButton}>
             <Icon name="arrow-back" size={24} color="#222" />
           </TouchableOpacity>
           <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
             {language === 'ar' ? 'تفاصيل الوصفة' : 'Prescription Details'}
           </Text>
           <View style={{ width: 40 }} />
         </View>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
          <View style={styles.body}>
            {/* Prescription Info */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>Prescription #{selectedPrescription.id}</Text>
                  <Text style={styles.uploadedText}>{new Date(selectedPrescription.uploadTime).toLocaleString()}</Text>
                </View>
                <View style={[styles.badge, getStatusColor(selectedPrescription.status)]}>
                  <Icon name={getStatusIcon(selectedPrescription.status)} size={14} color={getStatusColor(selectedPrescription.status).color} />
                                     <Text style={[styles.badgeText, { color: getStatusColor(selectedPrescription.status).color }]}>
                     {language === 'ar' ? 
                       (selectedPrescription.status === 'pending' ? 'في الانتظار' : 
                        selectedPrescription.status === 'verified' ? 'موثق' : 
                        selectedPrescription.status === 'rejected' ? 'مرفوض' : selectedPrescription.status) 
                       : selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                   </Text>
                </View>
              </View>
                             <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
                 <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{language === 'ar' ? 'المريض:' : 'Patient:'}</Text>
                 <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>{selectedPrescription.patient}</Text>
               </View>
               <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
                 <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{language === 'ar' ? 'الطبيب:' : 'Doctor:'}</Text>
                 <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>{selectedPrescription.doctor}</Text>
               </View>
               <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
                 <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{language === 'ar' ? 'تاريخ الإصدار:' : 'Date Issued:'}</Text>
                 <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>{new Date(selectedPrescription.date).toLocaleDateString()}</Text>
               </View>
               <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
                 <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{language === 'ar' ? 'الحالة:' : 'Status:'}</Text>
                 <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                   {language === 'ar' ? 
                     (selectedPrescription.status === 'pending' ? 'في الانتظار' : 
                      selectedPrescription.status === 'verified' ? 'موثق' : 
                      selectedPrescription.status === 'rejected' ? 'مرفوض' : selectedPrescription.status) 
                     : selectedPrescription.status}
                 </Text>
               </View>
            </View>
            {/* Prescription Image */}
            <View style={styles.card}>
                             <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{language === 'ar' ? 'صورة الوصفة' : 'Prescription Image'}</Text>
              <View style={styles.imageBox}>
                <Icon name="description" size={48} color="#6b7280" />
                                 <Text style={[styles.imageLabel, isRTL && styles.imageLabelRTL]}>{language === 'ar' ? 'مستند الوصفة' : 'Prescription Document'}</Text>
                <TouchableOpacity style={[styles.button, styles.outlineButton]}>
                  <Icon name="visibility" size={16} color="#49C5B8" />
                  <Text style={[styles.buttonText, { color: '#49C5B8' }]}> {language === 'ar' ? 'عرض بالحجم الكامل' : 'View Full Size'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Medications */}
            <View style={styles.card}>
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{language === 'ar' ? 'الأدوية' : 'Medications'}</Text>
              {selectedPrescription.medications.map((med, index) => (
                <View key={index} style={styles.medicationItem}>
                  <View style={styles.medicationImageContainer}>
                    <MedicineImage 
                      medicineId={index + 1} // Using index as medicine ID for now
                      size={50}
                      borderRadius={6}
                      showBorder={true}
                    />
                  </View>
                  <View style={styles.medicationInfo}>
                    <Text style={[styles.medicationName, isRTL && styles.medicationNameRTL]}>{med.name}</Text>
                    <Text style={[styles.medicationDosage, isRTL && styles.medicationDosageRTL]}>{med.dosage}</Text>
                    <Text style={[styles.medicationDuration, isRTL && styles.medicationDurationRTL]}>{language === 'ar' ? 'المدة:' : 'Duration:'} {med.duration}</Text>
                  </View>
                </View>
              ))}
            </View>
            {/* Actions */}
            {selectedPrescription.status === 'pending' && (
              <View style={styles.actionColumn}>
                                 <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => verifyPrescription(selectedPrescription.id)}>
                   <Icon name="check" size={16} color="#fff" />
                                      <Text style={[styles.buttonText, isRTL && styles.buttonTextRTL]}>{language === 'ar' ? 'تحقق من الوصفة' : 'Verify Prescription'}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => rejectPrescription(selectedPrescription.id, 'Review required')}>
                   <Icon name="close" size={16} color="#fff" />
                                      <Text style={[styles.buttonText, isRTL && styles.buttonTextRTL]}>{language === 'ar' ? 'رفض الوصفة' : 'Reject Prescription'}</Text>
                 </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    let data = [];
    let emptyText = '';
    let emptyIcon = '';
    switch (tab) {
      case 'pending':
        data = pendingPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات في الانتظار' : 'No pending prescriptions';
        emptyIcon = 'schedule';
        break;
      case 'verified':
        data = verifiedPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات موثقة' : 'No verified prescriptions';
        emptyIcon = 'check-circle';
        break;
      case 'rejected':
        data = rejectedPrescriptions;
        emptyText = language === 'ar' ? 'لا توجد وصفات مرفوضة' : 'No rejected prescriptions';
        emptyIcon = 'cancel';
        break;
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name={emptyIcon} size={64} color="#bbb" />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }

    return data.map((prescription) => (
      <PrescriptionCard key={prescription.id} prescription={prescription} />
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
             {/* Fixed Header */}
       <View style={[styles.header, { paddingTop: insets.top }]}>
         <TouchableOpacity onPress={goBack} style={styles.backButton}>
           <Icon name="arrow-back" size={24} color="#222" />
         </TouchableOpacity>
         <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
           {language === 'ar' ? 'إدارة الوصفات الطبية' : 'Prescription Management'}
         </Text>
         <View style={{ width: 40 }} />
       </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.body}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, tab === 'pending' && styles.activeTab]}
              onPress={() => setTab('pending')}
            >
                             <Text style={[styles.tabText, tab === 'pending' && styles.activeTabText, isRTL && styles.tabTextRTL, tab === 'pending' && isRTL && styles.activeTabTextRTL]}>
                 {language === 'ar' ? 'في الانتظار' : 'Pending'} ({pendingPrescriptions.length})
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'verified' && styles.activeTab]}
              onPress={() => setTab('verified')}
            >
                             <Text style={[styles.tabText, tab === 'verified' && styles.activeTabText, isRTL && styles.tabTextRTL, tab === 'verified' && isRTL && styles.activeTabTextRTL]}>
                 {language === 'ar' ? 'موثق' : 'Verified'} ({verifiedPrescriptions.length})
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'rejected' && styles.activeTab]}
              onPress={() => setTab('rejected')}
            >
                             <Text style={[styles.tabText, tab === 'rejected' && styles.activeTabText, isRTL && styles.tabTextRTL, tab === 'rejected' && isRTL && styles.activeTabTextRTL]}>
                 {language === 'ar' ? 'مرفوض' : 'Rejected'} ({rejectedPrescriptions.length})
               </Text>
            </TouchableOpacity>
          </View>

          {/* Prescriptions List */}
          <View style={styles.prescriptionsList}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6', 
    backgroundColor: '#fff',
  },
  headerIcon: { fontSize: 22, color: '#49C5B8', fontWeight: 'bold', width: 24 },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  headerTitleRTL: { 
    textAlign: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 32 },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 10, backgroundColor: '#f3f4f6', marginHorizontal: 2, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#49C5B8' },
     tabText: { fontSize: 14, color: '#1e293b', fontWeight: 'bold' },
   tabTextRTL: { fontSize: 14, color: '#1e293b', fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardHeaderRTL: { flexDirection: 'row-reverse' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardHeaderRowRTL: { flexDirection: 'row-reverse' },
  statusIcon: { fontSize: 18, marginRight: 6 },
     orderId: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  orderIdRTL: { textAlign: 'right' },
  customer: { fontSize: 14, color: '#334155' },
  customerRTL: { textAlign: 'right' },
  doctor: { fontSize: 13, color: '#64748b' },
  doctorRTL: { textAlign: 'right' },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    overflow: 'hidden' 
  },
  badgeRTL: { flexDirection: 'row-reverse' },
  badgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  badgeTextRTL: { marginLeft: 0, marginRight: 4 },
  cardBody: { marginTop: 4 },
  itemsCount: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  itemsCountRTL: { textAlign: 'right' },
  itemText: { fontSize: 14, color: '#334155' },
  itemTextRTL: { textAlign: 'right' },
  moreItems: { fontSize: 13, color: '#64748b' },
  moreItemsRTL: { textAlign: 'right' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardFooterRTL: { flexDirection: 'row-reverse' },
  dateText: { fontSize: 12, color: '#64748b' },
  dateTextRTL: { textAlign: 'right' },
  uploadedText: { fontSize: 12, color: '#64748b' },
  uploadedTextRTL: { textAlign: 'right' },
     actionRow: { 
     flexDirection: 'row', 
     marginTop: 12, 
     gap: 12,
     justifyContent: 'space-between',
   },
   actionRowRTL: { 
     flexDirection: 'row-reverse', 
     marginTop: 12, 
     gap: 12,
     justifyContent: 'space-between',
   },
  actionColumn: { flexDirection: 'column', gap: 8, marginTop: 12 },
     button: { 
     paddingVertical: 12, 
     paddingHorizontal: 16,
     borderRadius: 8, 
     alignItems: 'center', 
     marginBottom: 8, 
     backgroundColor: '#49C5B8',
     flexDirection: 'row',
     justifyContent: 'center',
     minHeight: 44,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   acceptButton: { 
     backgroundColor: '#22c55e',
     borderWidth: 1,
     borderColor: '#16a34a',
   },
   declineButton: { 
     backgroundColor: '#ef4444',
     borderWidth: 1,
     borderColor: '#dc2626',
   },
  outlineButton: { backgroundColor: '#f3f4f6' },
     buttonText: { 
     color: '#fff', 
     fontWeight: 'bold', 
     fontSize: 15,
     marginLeft: 8,
   },
   buttonTextRTL: { 
     color: '#fff', 
     fontWeight: 'bold', 
     fontSize: 15,
     marginLeft: 0,
     marginRight: 8,
   },
     notesBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, marginTop: 8 },
   notesBoxRTL: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, marginTop: 8 },
   notesIcon: { fontSize: 16, marginRight: 6 },
   notesIconRTL: { fontSize: 16, marginRight: 0, marginLeft: 6 },
  notesText: { fontSize: 13, color: '#92400E' },
  notesTextRTL: { textAlign: 'right' },
  notesCard: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 },
  notesTitle: { fontSize: 15, fontWeight: 'bold', color: '#92400E', marginBottom: 4 },
  verifiedCard: { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0', borderWidth: 1 },
  verifiedTitle: { fontSize: 15, fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  verifiedText: { fontSize: 13, color: '#166534' },
  rejectedCard: { backgroundColor: '#FECACA', borderColor: '#FCA5A5', borderWidth: 1 },
  rejectedTitle: { fontSize: 15, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 },
  rejectedText: { fontSize: 13, color: '#991B1B' },
     infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
   infoRowRTL: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 },
   infoLabel: { fontSize: 13, color: '#64748b', width: 100 },
   infoLabelRTL: { fontSize: 13, color: '#64748b', width: 100, textAlign: 'right' },
   infoValue: { fontSize: 13, color: '#334155', flex: 1 },
   infoValueRTL: { fontSize: 13, color: '#334155', flex: 1, textAlign: 'right' },
     sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#49C5B8' },
   sectionTitleRTL: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#49C5B8', textAlign: 'right' },
  imageBox: { alignItems: 'center', justifyContent: 'center', height: 120, backgroundColor: '#f3f4f6', borderRadius: 8, marginBottom: 8 },
  imageIcon: { fontSize: 32, marginBottom: 4, color: '#64748b' },
     imageLabel: { fontSize: 13, color: '#64748b', marginBottom: 4 },
   imageLabelRTL: { fontSize: 13, color: '#64748b', marginBottom: 4, textAlign: 'center' },
  medBox: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginBottom: 8 },
  medName: { fontSize: 14, fontWeight: 'bold', color: '#49C5B8' },
  medDetail: { fontSize: 12, color: '#64748b' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 8, color: '#64748b' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#49C5B8' },
  emptyDesc: { fontSize: 13, color: '#64748b' },
  backButton: { padding: 8 },
  body: { flex: 1, paddingTop: 0 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 },
  activeTab: { backgroundColor: '#49C5B8', borderRadius: 8 },
     activeTabText: { color: '#fff' },
   activeTabTextRTL: { color: '#fff', textAlign: 'center' },
  emptyText: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#49C5B8' },
  prescriptionsList: { paddingBottom: 32 },
  medicationItem: { 
    backgroundColor: '#f3f4f6', 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  medicationImageContainer: {
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: { fontSize: 14, fontWeight: 'bold', color: '#49C5B8' },
   medicationNameRTL: { fontSize: 14, fontWeight: 'bold', color: '#49C5B8', textAlign: 'right' },
   medicationDosage: { fontSize: 12, color: '#64748b' },
   medicationDosageRTL: { fontSize: 12, color: '#64748b', textAlign: 'right' },
   medicationDuration: { fontSize: 12, color: '#64748b' },
   medicationDurationRTL: { fontSize: 12, color: '#64748b', textAlign: 'right' },
});