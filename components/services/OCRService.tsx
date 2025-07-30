import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Scan, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';

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

interface OCRScannerProps {
  onResult: (result: OCRResult) => void;
  onClose: () => void;
}

// Enhanced error handling for camera access
class CameraErrorHandler {
  static handleCameraError(error: any): string {
    console.warn('Camera Error:', error);
    
    if (error.name === 'NotAllowedError') {
      return 'تم رفض الوصول للكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح وإعادة المحاولة.';
    }
    
    if (error.name === 'NotFoundError') {
      return 'لم يتم العثور على كاميرا. يرجى التأكد من وجود كاميرا متصلة بالجهاز.';
    }
    
    if (error.name === 'NotReadableError') {
      return 'الكاميرا قيد الاستخدام من قبل تطبيق آخر. يرجى إغلاق التطبيقات الأخرى وإعادة المحاولة.';
    }
    
    if (error.name === 'OverconstrainedError') {
      return 'إعدادات الكاميرا غير متوافقة. يرجى المحاولة مرة أخرى.';
    }
    
    if (error.name === 'AbortError') {
      return 'تم إلغاء الوصول للكاميرا. يرجى المحاولة مرة أخرى.';
    }
    
    return 'خطأ في الوصول للكاميرا. يرجى التحقق من إعدادات الكاميرا وإعادة المحاولة.';
  }
}

// Mock OCR service for development
const mockOCRProcess = (imageData: string): Promise<OCRResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate OCR processing with mock Sudanese prescription data
      const mockResult: OCRResult = {
        text: `
          الجمهورية السودانية
          وزارة الصحة الاتحادية
          
          د. أحمد محمد علي
          طبيب باطنية
          
          التاريخ: ${new Date().toLocaleDateString('ar-SD')}
          اسم المريض: فاطمة عبدالله
          
          الوصفة الطبية:
          1. باراسيتامول 500 مجم - حبة كل 8 ساعات - لمدة 5 أيام
          2. فيتامين د3 1000 وحدة - حبة يومياً - لمدة شهر
          3. أملاح الإمهاء الفموي - كيس كل 6 ساعات عند الحاجة
          
          توقيع الطبيب: د. أحمد محمد علي
          رقم الترخيص: 123456
        `,
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
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check camera permission status
  const checkCameraPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
      
      permission.addEventListener('change', () => {
        setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
      });
    } catch (error) {
      console.warn('Could not check camera permission:', error);
    }
  }, []);

  React.useEffect(() => {
    checkCameraPermission();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [checkCameraPermission, stream]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      // Request camera access with enhanced error handling
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast.success('تم تشغيل الكاميرا بنجاح');
    } catch (error) {
      const errorMessage = CameraErrorHandler.handleCameraError(error);
      setError(errorMessage);
      setIsScanning(false);
      setCameraPermission('denied');
      toast.error(errorMessage);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    
    toast.success('تم التقاط الصورة بنجاح');
  }, [stream]);

  const processImage = useCallback(async (imageData: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      toast.info('جاري معالجة الوصفة الطبية...');
      
      const result = await mockOCRProcess(imageData);
      
      toast.success('تم تحليل الوصفة الطبية بنجاح');
      onResult(result);
      
    } catch (error) {
      const errorMessage = 'خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [onResult]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة صحيح');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      toast.success('تم تحميل الصورة بنجاح');
    };
    reader.readAsDataURL(file);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  const resetScanner = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    setIsScanning(false);
    setIsProcessing(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Scan size={20} className="mr-2" />
          مسح الوصفة الطبية
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {error && (
        <Alert className="mb-4 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!capturedImage && !isScanning && !isProcessing && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              التقط صورة للوصفة الطبية أو ارفع صورة من معرض الصور
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={startCamera}
              disabled={cameraPermission === 'denied'}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Camera size={24} />
              <span className="text-sm">التقاط صورة</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Upload size={24} />
              <span className="text-sm">رفع صورة</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {cameraPermission === 'denied' && (
            <Alert className="border-warning/50 bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning">
                تم رفض الوصول للكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح لاستخدام ميزة التقاط الصور.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {isScanning && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg bg-black"
            />
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
              <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                <div className="w-full h-full border-2 border-dashed border-primary/60 rounded-lg"></div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={captureImage} className="flex-1">
              <Camera size={16} className="mr-2" />
              التقاط الصورة
            </Button>
            <Button variant="outline" onClick={resetScanner}>
              إلغاء
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            ضع الوصفة الطبية داخل الإطار واضغط على التقاط الصورة
          </p>
        </div>
      )}

      {capturedImage && !isProcessing && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="الوصفة الطبية"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
              <CheckCircle size={12} className="mr-1" />
              تم التقاط الصورة
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => processImage(capturedImage)} className="flex-1">
              <Scan size={16} className="mr-2" />
              تحليل الوصفة
            </Button>
            <Button variant="outline" onClick={retakePhoto}>
              إعادة التقاط
            </Button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <h4 className="font-medium mb-2">جاري تحليل الوصفة الطبية</h4>
            <p className="text-sm text-muted-foreground">
              يرجى الانتظار بينما نقوم بتحليل الوصفة وتحديد الأدوية المطلوبة...
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>قراءة النص...</span>
              <span className="text-primary">✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>تحديد الأدوية...</span>
              <span className="animate-pulse">⏳</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>التحقق من المعلومات...</span>
              <span>⏳</span>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};

// Enhanced OCR service with better error handling
export const processImageOCR = async (imageData: string): Promise<OCRResult> => {
  try {
    return await mockOCRProcess(imageData);
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.');
  }
};

export default OCRScanner;