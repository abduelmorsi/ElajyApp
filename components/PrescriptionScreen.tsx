import React, { useState } from 'react';
import { Upload, Camera, FileText, Check, X, Clock, AlertCircle, Eye, Download, Plus, Scan } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLocalization, useRTL } from './services/LocalizationService';
import { OCRService } from './services/OCRService';
import PermissionManager from './PermissionManager';
import { toast } from 'sonner';

export default function PrescriptionScreen({ navigateTo }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState([
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
  const [ocrResult, setOcrResult] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error(language === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 10MB)' : 'File too large (max 10MB)');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload with OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate OCR result
      const mockOCR = {
        doctorName: 'د. أحمد محمد علي',
        doctorNameEn: 'Dr. Ahmed Mohammed Ali',
        date: new Date().toISOString().split('T')[0],
        medicines: [
          { name: 'باراسيتامول 500 مجم', nameEn: 'Paracetamol 500mg', quantity: '20 قرص', quantityEn: '20 tablets' }
        ],
        confidence: 0.95
      };
      
      setOcrResult(mockOCR);
      toast.success(language === 'ar' ? 'تم رفع الوصفة بنجاح!' : 'Prescription uploaded successfully!');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في رفع الوصفة' : 'Failed to upload prescription');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = () => {
    setShowPermissionModal(true);
  };

  const onCameraPermissionGranted = async () => {
    setShowPermissionModal(false);
    try {
      // Simulate camera capture and OCR
      setIsUploading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        doctorName: 'د. سارة أحمد',
        doctorNameEn: 'Dr. Sara Ahmed',
        date: new Date().toISOString().split('T')[0],
        medicines: [
          { name: 'أملاح الإمهاء الفموي', nameEn: 'ORS', quantity: '5 أكياس', quantityEn: '5 sachets' }
        ],
        confidence: 0.92
      };
      
      setOcrResult(mockResult);
      toast.success(language === 'ar' ? 'تم التقاط الوصفة ومعالجتها!' : 'Prescription captured and processed!');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في التقاط الوصفة' : 'Failed to capture prescription');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmPrescription = () => {
    if (ocrResult) {
      const newPrescription = {
        id: uploadedPrescriptions.length + 1,
        ...ocrResult,
        status: 'pending',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
      };
      
      setUploadedPrescriptions(prev => [newPrescription, ...prev]);
      setOcrResult(null);
      toast.success(language === 'ar' ? 'تم إرسال الوصفة للمراجعة' : 'Prescription sent for review');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'pharmacy-available';
      case 'pending': return 'prescription-reminder';
      case 'rejected': return 'medical-emergency';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return language === 'ar' ? 'موافق عليها' : 'Approved';
      case 'pending': return language === 'ar' ? 'قيد المراجعة' : 'Under Review';
      case 'rejected': return language === 'ar' ? 'مرفوضة' : 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs defaultValue="upload" className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-card/50 p-4">
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-primary">
              {language === 'ar' ? 'الوصفات الطبية' : 'Medical Prescriptions'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'ارفع وصفاتك الطبية واحصل على أدويتك بسهولة' : 'Upload your prescriptions and get your medicines easily'}
            </p>
          </div>

          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Upload size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'رفع وصفة طبية' : 'Upload Prescription'}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'الوصفات السابقة' : 'Prescription History'}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="upload" className="p-4 space-y-6 mt-0">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-center">
                {language === 'ar' ? 'رفع وصفة طبية جديدة' : 'Upload New Prescription'}
              </h3>

              {!ocrResult ? (
                <div className="space-y-4">
                  {/* File Upload */}
                  <Card className="p-6 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="prescription-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="prescription-upload" className="cursor-pointer">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Upload size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {language === 'ar' ? 'رفع وصفة طبية من الجهاز' : 'Upload Prescription from Device'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'PNG, JPG, PDF حتى 10MB' : 'PNG, JPG, PDF up to 10MB'}
                          </p>
                        </div>
                        <Button disabled={isUploading}>
                          <Upload size={16} className={getMargin('0', '2')} />
                          {language === 'ar' ? 'اختيار ملف' : 'Choose File'}
                        </Button>
                      </div>
                    </label>
                  </Card>

                  {/* Camera Capture */}
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-muted"></div>
                    <span className="px-3 text-sm text-muted-foreground bg-background">
                      {language === 'ar' ? 'أو' : 'OR'}
                    </span>
                    <div className="flex-1 border-t border-muted"></div>
                  </div>

                  <Card className="p-6 border-primary/20">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                        <Camera size={24} className="text-success" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {language === 'ar' ? 'التقاط صورة بالكاميرا' : 'Capture with Camera'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'مسح ذكي باستخدام تقنية OCR' : 'Smart scanning with OCR technology'}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleCameraCapture}
                        disabled={isUploading}
                        className="border-success/30 hover:bg-success/5"
                      >
                        <Scan size={16} className={getMargin('0', '2')} />
                        {language === 'ar' ? 'مسح ذكي' : 'Smart Scan'}
                      </Button>
                    </div>
                  </Card>

                  {/* Upload Progress */}
                  {isUploading && (
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {language === 'ar' ? 'جاري معالجة الوصفة...' : 'Processing prescription...'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {language === 'ar' ? '٧٥%' : '75%'}
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'جاري قراءة النص وتحليل المحتوى...' : 'Reading text and analyzing content...'}
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Tips */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {language === 'ar' ? 
                        'للحصول على أفضل النتائج، تأكد من وضوح الكتابة وإضاءة جيدة للصورة' :
                        'For best results, ensure clear writing and good lighting in the image'
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                /* OCR Results */
                <div className="space-y-4">
                  <Alert className="border-success/30 bg-success/5">
                    <Check className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success">
                      {language === 'ar' ? 
                        `تم قراءة الوصفة بنجاح! دقة القراءة: ${Math.round(ocrResult.confidence * 100)}%` :
                        `Prescription read successfully! Reading accuracy: ${Math.round(ocrResult.confidence * 100)}%`
                      }
                    </AlertDescription>
                  </Alert>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {language === 'ar' ? 'معلومات الوصفة' : 'Prescription Details'}
                        </h4>
                        <Button variant="outline" size="sm" onClick={() => setOcrResult(null)}>
                          <X size={14} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'ar' ? 'الطبيب:' : 'Doctor:'}
                          </span>
                          <p className="font-medium">
                            {language === 'ar' ? ocrResult.doctorName : ocrResult.doctorNameEn}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'ar' ? 'التاريخ:' : 'Date:'}
                          </span>
                          <p className="font-medium arabic-numbers">{ocrResult.date}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground text-sm">
                          {language === 'ar' ? 'الأدوية:' : 'Medicines:'}
                        </span>
                        <div className="space-y-2 mt-1">
                          {ocrResult.medicines.map((medicine, index) => (
                            <div key={index} className="bg-muted/30 rounded-lg p-2">
                              <p className="font-medium text-sm">
                                {language === 'ar' ? medicine.name : medicine.nameEn}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? medicine.quantity : medicine.quantityEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-3 border-t">
                        <Button onClick={confirmPrescription} className="flex-1 bg-primary">
                          <Check size={16} className={getMargin('0', '2')} />
                          {language === 'ar' ? 'تأكيد الوصفة' : 'Confirm Prescription'}
                        </Button>
                        <Button variant="outline" onClick={() => setOcrResult(null)}>
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-4 space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {language === 'ar' ? 'الوصفات السابقة' : 'Previous Prescriptions'}
              </h3>
              <span className="text-sm text-muted-foreground arabic-numbers">
                {uploadedPrescriptions.length} {language === 'ar' ? 'وصفة' : 'prescriptions'}
              </span>
            </div>

            <div className="space-y-3">
              {uploadedPrescriptions.map((prescription) => (
                <Card 
                  key={prescription.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={prescription.image} 
                        alt="Prescription"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            {language === 'ar' ? prescription.doctorName : prescription.doctorNameEn}
                          </h4>
                          <p className="text-xs text-muted-foreground arabic-numbers">
                            {prescription.date}
                          </p>
                        </div>
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusText(prescription.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {prescription.medicines.slice(0, 2).map((medicine, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium">
                              {language === 'ar' ? medicine.name : medicine.nameEn}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              • {language === 'ar' ? medicine.quantity : medicine.quantityEn}
                            </span>
                          </div>
                        ))}
                        {prescription.medicines.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{prescription.medicines.length - 2} {language === 'ar' ? 'أدوية أخرى' : 'more medicines'}
                          </p>
                        )}
                      </div>

                      {prescription.status === 'approved' && prescription.refills && (
                        <div className="mt-2 pt-2 border-t border-muted/30">
                          <p className="text-xs text-success">
                            ✅ {language === 'ar' ? `${prescription.refills} إعادات متبقية` : `${prescription.refills} refills remaining`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionManager
          permissions={['camera']}
          onPermissionGranted={onCameraPermissionGranted}
          onPermissionDenied={() => setShowPermissionModal(false)}
          title={language === 'ar' ? 'إذن الكاميرا مطلوب' : 'Camera Permission Required'}
          description={language === 'ar' ? 
            'نحتاج إلى الوصول للكاميرا لالتقاط صور الوصفات الطبية' : 
            'We need camera access to capture prescription images'
          }
        />
      )}
    </div>
  );
}