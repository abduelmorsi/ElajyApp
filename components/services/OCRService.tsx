import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OCRResult {
  text: string;
  confidence: number;
  medications: PrescriptionMedication[];
  doctor: string;
  date: string;
  patientName: string;
}


interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidence: number;
}

export interface OCRScannerProps {
  onResult: (result: OCRResult) => void;
  onClose: () => void;
}

// Emoji icon map for replacements
const ICONS = {
  camera: '📷',
  upload: '⬆️',
  close: '❌',
  scan: '🔍',
  alert: '⚠️',
  check: '✅',
};

// Mock OCR service for development
const mockOCRProcess = (imageData: string): Promise<OCRResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResult: OCRResult = {
        text: `\nالجمهورية السودانية\nوزارة الصحة الاتحادية\n\nد. أحمد محمد علي\nطبيب باطنية\n\nالتاريخ: ${new Date().toLocaleDateString('ar-SD')}\nاسم المريض: فاطمة عبدالله\n\nالوصفة الطبية:\n1. باراسيتامول 500 مجم - حبة كل 8 ساعات - لمدة 5 أيام\n2. فيتامين د3 1000 وحدة - حبة يومياً - لمدة شهر\n3. أملاح الإمهاء الفموي - كيس كل 6 ساعات عند الحاجة\n\nتوقيع الطبيب: د. أحمد محمد علي\nرقم الترخيص: 123456\n`,
        confidence: 0.92,
        medications: [
          {
            name: 'باراسيتامول 500 مجم',
            dosage: '500 مجم',
            frequency: 'كل 8 ساعات',
            duration: '5 أيام',
            confidence: 0.95
          },
          {
            name: 'فيتامين د3',
            dosage: '1000 وحدة',
            frequency: 'مرة يومياً',
            duration: 'شهر',
            confidence: 0.89
          },
          {
            name: 'أملاح الإمهاء الفموي',
            dosage: 'كيس',
            frequency: 'كل 6 ساعات عند الحاجة',
            duration: 'حسب الحاجة',
            confidence: 0.87
          }
        ],
        doctor: 'د. أحمد محمد علي',
        date: new Date().toLocaleDateString('ar-SD'),
        patientName: 'فاطمة عبدالله'
      };
      resolve(mockResult);
    }, 3000);
  });
};


export const OCRScanner: React.FC<OCRScannerProps> = ({ onResult, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Camera and gallery picker
  const pickImage = useCallback(async () => {
    setError(null);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setCapturedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } else if (result.canceled) {
      setError(null);
    } else {
      setError('يرجى اختيار صورة صالحة');
    }
  }, []);

  const takePhoto = useCallback(async () => {
    setError(null);
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      setError('تم رفض الوصول للكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات الجهاز.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setCapturedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } else if (result.canceled) {
      setError(null);
    } else {
      setError('يرجى التقاط صورة صالحة');
    }
  }, []);

  const processImage = useCallback(async (imageData: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const result = await mockOCRProcess(imageData);
      onResult(result);
    } catch (error) {
      setError('خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  }, [onResult]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{ICONS.scan} مسح الوصفة الطبية</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>{ICONS.close}</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>{ICONS.alert}</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      {!capturedImage && !isProcessing && (
        <View style={styles.centerBox}>
          <View style={styles.iconCircle}><Text style={styles.iconCircleText}>{ICONS.camera}</Text></View>
          <Text style={styles.centerDesc}>التقط صورة للوصفة الطبية أو ارفع صورة من معرض الصور</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
              <Text style={styles.actionBtnIcon}>{ICONS.camera}</Text>
              <Text style={styles.actionBtnText}>التقاط صورة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
              <Text style={styles.actionBtnIcon}>{ICONS.upload}</Text>
              <Text style={styles.actionBtnText}>رفع صورة</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {capturedImage && !isProcessing && (
        <View style={styles.centerBox}>
          <Image source={{ uri: capturedImage }} style={styles.previewImg} />
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>{ICONS.check} تم التقاط الصورة</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => processImage(capturedImage)}>
              <Text style={[styles.actionBtnIcon, { color: '#fff' }]}>{ICONS.scan}</Text>
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>تحليل الوصفة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={retakePhoto}>
              <Text style={styles.actionBtnIcon}>{ICONS.camera}</Text>
              <Text style={styles.actionBtnText}>إعادة التقاط</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isProcessing && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#22c55e" style={{ marginBottom: 16 }} />
          <Text style={styles.processingTitle}>جاري تحليل الوصفة الطبية</Text>
          <Text style={styles.processingDesc}>يرجى الانتظار بينما نقوم بتحليل الوصفة وتحديد الأدوية المطلوبة...</Text>
          <View style={styles.processingSteps}>
            <Text style={styles.processingStep}>قراءة النص... ✓</Text>
            <Text style={styles.processingStep}>تحديد الأدوية... ⏳</Text>
            <Text style={styles.processingStep}>التحقق من المعلومات... ⏳</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Enhanced OCR service with better error handling

export const processImageOCR = async (imageData: string): Promise<OCRResult> => {
  try {
    return await mockOCRProcess(imageData);
  } catch (error) {
    throw new Error('خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.');
  }
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, margin: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  closeBtn: { padding: 6 },
  closeBtnText: { fontSize: 18 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderRadius: 8, padding: 10, marginBottom: 10 },
  errorIcon: { fontSize: 18, color: '#dc2626', marginRight: 8 },
  errorText: { color: '#dc2626', fontSize: 13, flex: 1 },
  centerBox: { alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  iconCircle: { width: 64, height: 64, backgroundColor: '#e0f2fe', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconCircleText: { fontSize: 32 },
  centerDesc: { fontSize: 14, color: '#555', marginBottom: 18, textAlign: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  actionBtn: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginHorizontal: 4, alignItems: 'center' },
  actionBtnIcon: { fontSize: 20, marginBottom: 2 },
  actionBtnText: { fontSize: 13, fontWeight: 'bold' },
  previewImg: { width: 220, height: 220, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  badgeBox: { backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, position: 'absolute', top: 10, right: 10 },
  badgeText: { color: '#15803d', fontSize: 12, fontWeight: 'bold' },
  processingTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  processingDesc: { fontSize: 13, color: '#555', marginBottom: 10, textAlign: 'center' },
  processingSteps: { marginTop: 8 },
  processingStep: { fontSize: 13, color: '#555', marginBottom: 2 },
});

export default OCRScanner;