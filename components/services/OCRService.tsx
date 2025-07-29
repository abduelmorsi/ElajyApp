import * as FileSystem from 'expo-file-system';

export interface OCRProgress {
  status: string;
  progress: number;
  message: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export class OCRService {
  private static instance: OCRService;
  private isInitialized = false;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Initialize OCR engine
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // For now, we'll use a simulated OCR that works with React Native
      // In a production app, you would integrate with a cloud OCR service
      // like Google Cloud Vision API, Azure Computer Vision, or AWS Textract
      console.log('OCR Service: Initializing...');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
      throw new Error('Failed to initialize OCR engine');
    }
  }

  /**
   * Perform OCR on an image using OCR.space API
   */
  public async recognizeText(
    imageUri: string, 
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    try {
      console.log('OCR Service: Starting recognition for:', imageUri);
      
      // Update progress
      if (onProgress) {
        onProgress({ status: 'loading', progress: 0.1, message: 'Preparing image...' });
      }

      // Convert image to base64
      const base64Image = await this.imageToBase64(imageUri);
      
      if (onProgress) {
        onProgress({ status: 'processing', progress: 0.3, message: 'Sending to OCR service...' });
      }

      // Call OCR.space API
      const ocrResult = await this.callOCRAPI(base64Image);
      
      if (onProgress) {
        onProgress({ status: 'finalizing', progress: 0.9, message: 'Processing results...' });
      }

      console.log('OCR Service: Raw API result:', ocrResult);
      
      // Extract text from API response
      let extractedText = '';
      let confidence = 0;
      
      if (ocrResult && ocrResult.ParsedResults && ocrResult.ParsedResults.length > 0) {
        extractedText = ocrResult.ParsedResults.map((result: any) => result.ParsedText).join('\n');
        confidence = ocrResult.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.Confidence || 0;
      }

      // If no text found, return empty result
      if (!extractedText || extractedText.trim().length === 0) {
        console.log('No text found in OCR result');
        return {
          text: '',
          confidence: 0,
          words: []
        };
      }

      console.log('OCR Service: Final extracted text:', extractedText);

      return {
        text: extractedText.trim(),
        confidence: confidence / 100, // Convert to 0-1 scale
        words: []
      };
    } catch (error) {
      console.error('OCR Service Error:', error);
      
      // Return error result instead of fallback
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  /**
   * Convert image URI to base64 string
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  }

  /**
   * Call OCR.space API to extract text from image
   */
  private async callOCRAPI(base64Image: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('apikey', 'K81634588988957'); // Free API key
      formData.append('language', 'ara,eng'); // Arabic and English
      formData.append('isOverlayRequired', 'false');
      formData.append('filetype', 'jpg');
      formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 seconds
      });

      // Create the fetch promise
      const fetchPromise = fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OCR API Error:', error);
      throw new Error('Failed to call OCR API');
    }
  }



  /**
   * Utility function to simulate delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get user-friendly progress message
   */
  private getProgressMessage(status: string): string {
    switch (status) {
      case 'loading':
        return 'Preparing image...';
      case 'processing':
        return 'Analyzing image...';
      case 'recognizing':
        return 'Extracting text...';
      case 'finalizing':
        return 'Finalizing results...';
      default:
        return 'Processing...';
    }
  }

  /**
   * Get Arabic progress message
   */
  public getArabicProgressMessage(status: string): string {
    switch (status) {
      case 'loading':
        return 'جاري تحضير الصورة...';
      case 'processing':
        return 'جاري تحليل الصورة...';
      case 'recognizing':
        return 'جاري استخراج النص...';
      case 'finalizing':
        return 'جاري إنهاء النتائج...';
      default:
        return 'جاري المعالجة...';
    }
  }

  /**
   * Clean up OCR resources
   */
  public async terminate(): Promise<void> {
    try {
      this.isInitialized = false;
    } catch (error) {
      console.error('Error terminating OCR:', error);
    }
  }
}

// Export singleton instance
export const ocrService = OCRService.getInstance();