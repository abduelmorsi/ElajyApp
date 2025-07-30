
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  Image, 
  Alert, 
  ActivityIndicator,
  Modal,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ocrService, OCRProgress } from './services/OCRService';

type PrescriptionScreenProps = {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
};

interface Prescription {
  id: number;
  doctorName: string;
  doctorNameEn: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  medicines: Array<{
    name: string;
    nameEn: string;
    quantity: string;
    quantityEn: string;
  }>;
  image: string;
  refills?: number;
  ocrText?: string;
}

export default function PrescriptionScreen({ navigateTo, goBack }: PrescriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      doctorName: 'د. محمد أحمد الفاتح',
      doctorNameEn: 'Dr. Mohammed Ahmed Al-Fatih',
      date: '2024-01-15',
      status: 'approved',
      medicines: [
        { name: 'باراسيتامول 500 مجم', nameEn: 'Paracetamol 500mg', quantity: '20 قرص', quantityEn: '20 tablets' },
        { name: 'أموكسيسلين 250 مجم', nameEn: 'Amoxicillin 250mg', quantity: '14 كبسولة', quantityEn: '14 capsules' }
      ],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      refills: 2
    },
    {
      id: 2,
      doctorName: 'د. فاطمة عبدالرحمن',
      doctorNameEn: 'Dr. Fatima Abdulrahman',
      date: '2024-01-10',
      status: 'pending',
      medicines: [
        { name: 'كلوروكين 250 مجم', nameEn: 'Chloroquine 250mg', quantity: '10 أقراص', quantityEn: '10 tablets' }
      ],
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  // Real OCR function using OCR Service
  const performOCR = async (imageUri: string): Promise<string> => {
    try {
      console.log('Starting OCR for image:', imageUri);
      
      const result = await ocrService.recognizeText(imageUri, (progress: OCRProgress) => {
        // Update progress for user feedback
        const progressMessage = language === 'ar' 
          ? ocrService.getArabicProgressMessage(progress.status)
          : progress.message;
        setProcessingProgress(progressMessage);
        console.log('OCR Progress:', progress);
      });

      console.log('OCR Result:', result);
      return result.text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        language === 'ar' ? 'إذن مطلوب' : 'Permission Required',
        language === 'ar' ? 'نحتاج إذن للوصول إلى مكتبة الصور' : 'We need permission to access your photo library'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowOcrModal(true);
      }
    } catch (error) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء اختيار الصورة' : 'Error selecting image'
      );
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        language === 'ar' ? 'إذن مطلوب' : 'Permission Required',
        language === 'ar' ? 'نحتاج إذن للوصول إلى الكاميرا' : 'We need permission to access your camera'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowOcrModal(true);
      }
    } catch (error) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء التقاط الصورة' : 'Error taking photo'
      );
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProcessingProgress(language === 'ar' ? 'جاري بدء المعالجة...' : 'Starting processing...');
    
    // Test OCR initialization
    try {
      await ocrService.initialize();
      console.log('OCR service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OCR service:', error);
    }
    
    try {
      // Preprocess image for better OCR results
      setProcessingProgress(language === 'ar' ? 'جاري تحسين الصورة...' : 'Optimizing image...');
      const processedImage = await manipulateAsync(
        selectedImage,
        [
          { resize: { width: 1200 } }, // Resize for optimal OCR performance
        ],
        { format: SaveFormat.JPEG }
      );

      console.log('Original image URI:', selectedImage);
      console.log('Processed image URI:', processedImage.uri);

      const ocrText = await performOCR(processedImage.uri);
      
      // Check if OCR returned meaningful text
      if (!ocrText || ocrText.trim().length === 0) {
        console.log('OCR returned empty text');
        setOcrResult(language === 'ar' ? 'لم يتم العثور على نص في الصورة' : 'No text found in image');
        setEditedText(language === 'ar' ? 'لم يتم العثور على نص في الصورة' : 'No text found in image');
      } else {
        console.log('OCR successful, extracted text:', ocrText);
        setOcrResult(ocrText);
        setEditedText(ocrText);
      }
      
      setIsProcessing(false);
      setProcessingProgress('');
    } catch (error) {
      setIsProcessing(false);
      setProcessingProgress('');
      Alert.alert(
        language === 'ar' ? 'خطأ في معالجة الصورة' : 'Image Processing Error',
        language === 'ar' ? 'فشل في استخراج النص من الصورة' : 'Failed to extract text from image'
      );
    }
  };

  const savePrescription = () => {
    if (!editedText.trim()) {
      Alert.alert(
        language === 'ar' ? 'نص فارغ' : 'Empty Text',
        language === 'ar' ? 'يرجى إدخال نص الوصفة' : 'Please enter prescription text'
      );
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now(),
      doctorName: language === 'ar' ? 'د. غير محدد' : 'Dr. Unknown',
      doctorNameEn: 'Dr. Unknown',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      medicines: [],
      image: selectedImage || '',
      ocrText: editedText
    };

    setUploadedPrescriptions(prev => [newPrescription, ...prev]);
    setShowOcrModal(false);
    setSelectedImage(null);
    setOcrResult('');
    setEditedText('');
    setIsEditing(false);

    Alert.alert(
      language === 'ar' ? 'تم الحفظ' : 'Saved',
      language === 'ar' ? 'تم حفظ الوصفة بنجاح' : 'Prescription saved successfully'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return language === 'ar' ? 'موافق عليه' : 'Approved';
      case 'pending': return language === 'ar' ? 'قيد المراجعة' : 'Pending';
      case 'rejected': return language === 'ar' ? 'مرفوض' : 'Rejected';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {goBack && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 0 }}>

        <View style={styles.body}>
          {/* Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'رفع وصفة جديدة' : 'Upload New Prescription'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {language === 'ar' ? 'التقط صورة أو اختر من المعرض' : 'Take a photo or choose from gallery'}
            </Text>
            
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Text style={styles.uploadButtonIcon}>📷</Text>
                <Text style={styles.uploadButtonText}>
                  {language === 'ar' ? 'التقط صورة' : 'Take Photo'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonIcon}>🖼️</Text>
                <Text style={styles.uploadButtonText}>
                  {language === 'ar' ? 'اختر من المعرض' : 'Choose from Gallery'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Prescriptions List */}
          <View style={styles.prescriptionsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'الوصفات المرفوعة' : 'Uploaded Prescriptions'}
            </Text>
            
            {uploadedPrescriptions.map((prescription) => (
              <View key={prescription.id} style={styles.prescriptionCard}>
                <View style={styles.prescriptionHeader}>
                  <Image source={{ uri: prescription.image }} style={styles.prescriptionImage} />
                  <View style={styles.prescriptionInfo}>
                    <Text style={styles.doctorName}>
                      {language === 'ar' ? prescription.doctorName : prescription.doctorNameEn}
                    </Text>
                    <Text style={styles.prescriptionDate}>{prescription.date}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prescription.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(prescription.status)}</Text>
                    </View>
                  </View>
                </View>
                
                {prescription.medicines.length > 0 && (
                  <View style={styles.medicinesList}>
                    {prescription.medicines.map((medicine, index) => (
                      <Text key={index} style={styles.medicineText}>
                        • {language === 'ar' ? medicine.name : medicine.nameEn} - {language === 'ar' ? medicine.quantity : medicine.quantityEn}
                      </Text>
                    ))}
                  </View>
                )}
                
                {prescription.ocrText && (
                  <View style={styles.ocrTextContainer}>
                    <Text style={styles.ocrTextLabel}>
                      {language === 'ar' ? 'النص المستخرج:' : 'Extracted Text:'}
                    </Text>
                    <Text style={styles.ocrText} numberOfLines={3}>
                      {prescription.ocrText}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* OCR Modal */}
      <Modal
        visible={showOcrModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOcrModal(false)} style={styles.modalCloseButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {language === 'ar' ? 'معالجة الوصفة' : 'Process Prescription'}
            </Text>
            <TouchableOpacity onPress={processImage} style={styles.processButton} disabled={isProcessing}>
              <Text style={styles.processButtonText}>
                {isProcessing ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') : (language === 'ar' ? 'استخراج النص' : 'Extract Text')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              </View>
            )}

            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.processingText}>
                  {processingProgress || (language === 'ar' ? 'جاري استخراج النص من الصورة...' : 'Extracting text from image...')}
                </Text>
              </View>
            )}

            {ocrResult && (
              <View style={styles.ocrResultContainer}>
                <View style={styles.ocrResultHeader}>
                  <Text style={styles.ocrResultTitle}>
                    {language === 'ar' ? 'النص المستخرج' : 'Extracted Text'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setIsEditing(!isEditing)} 
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>
                      {isEditing ? (language === 'ar' ? 'عرض' : 'View') : (language === 'ar' ? 'تعديل' : 'Edit')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isEditing ? (
                  <TextInput
                    style={styles.editableText}
                    value={editedText}
                    onChangeText={setEditedText}
                    multiline
                    textAlignVertical="top"
                    placeholder={language === 'ar' ? 'أدخل نص الوصفة هنا...' : 'Enter prescription text here...'}
                  />
                ) : (
                  <ScrollView style={styles.ocrTextDisplay}>
                    <Text style={styles.ocrTextContent}>{ocrResult}</Text>
                  </ScrollView>
                )}
              </View>
            )}
          </ScrollView>

          {ocrResult && (
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => setShowOcrModal(false)} 
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={savePrescription} 
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>
                  {language === 'ar' ? 'حفظ الوصفة' : 'Save Prescription'}
                </Text>
              </TouchableOpacity>
      </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  uploadSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  uploadButtonIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151'
  },
  prescriptionsSection: {
    marginBottom: 20
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  prescriptionHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  prescriptionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  prescriptionInfo: {
    flex: 1
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4
  },
  prescriptionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff'
  },
  medicinesList: {
    marginTop: 8
  },
  medicineText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4
  },
  ocrTextContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#f3f4f6'
  },
  ocrTextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4
  },
  ocrText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  modalCloseButton: {
    padding: 8
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center'
  },
  processButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6
  },
  processButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  imagePreviewContainer: {
    marginBottom: 16
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8
  },
  processingContainer: {
    alignItems: 'center',
    padding: 32
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  ocrResultContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16
  },
  ocrResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  ocrResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222'
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  editableText: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 120,
    textAlignVertical: 'top'
  },
  ocrTextDisplay: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    maxHeight: 200
  },
  ocrTextContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    gap: 12
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
});