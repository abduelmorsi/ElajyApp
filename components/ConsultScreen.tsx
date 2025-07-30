import React, { useState } from 'react';
import { MessageCircle, Video, Phone, User, Star, Clock, Send, Paperclip, Mic, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useLocalization, useRTL } from './services/LocalizationService';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ConsultScreen() {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [consultationType, setConsultationType] = useState('chat');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample pharmacists with enhanced Sudanese context
  const pharmacists = [
    {
      id: 1,
      name: 'د. فاطمة أحمد علي',
      nameEn: 'Dr. Fatima Ahmed Ali',
      specialization: 'الصيدلة السريرية',
      specializationEn: 'Clinical Pharmacy',
      experience: '8 سنوات',
      experienceEn: '8 Years',
      rating: 4.9,
      reviewCount: 156,
      location: 'الخرطوم',
      locationEn: 'Khartoum',
      languages: ['العربية', 'الإنجليزية'],
      languagesEn: ['Arabic', 'English'],
      isOnline: true,
      responseTime: 'خلال 5 دقائق',
      responseTimeEn: 'Within 5 minutes',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      consultations: 234,
      services: ['استشارات عامة', 'مراجعة الأدوية', 'التداخلات الدوائية']
    },
    {
      id: 2,
      name: 'د. محمد عثمان إبراهيم',
      nameEn: 'Dr. Mohammed Othman Ibrahim',
      specialization: 'صيدلة الأطفال',
      specializationEn: 'Pediatric Pharmacy',
      experience: '12 سنة',
      experienceEn: '12 Years',
      rating: 4.8,
      reviewCount: 203,
      location: 'أم درمان',
      locationEn: 'Omdurman',
      languages: ['العربية'],
      languagesEn: ['Arabic'],
      isOnline: false,
      responseTime: 'خلال 15 دقيقة',
      responseTimeEn: 'Within 15 minutes',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      consultations: 189,
      services: ['أدوية الأطفال', 'الجرعات حسب العمر', 'اللقاحات']
    },
    {
      id: 3,
      name: 'د. عائشة محمد النور',
      nameEn: 'Dr. Aisha Mohammed Al-Nour',
      specialization: 'الصيدلة الباطنية',
      specializationEn: 'Internal Medicine Pharmacy',
      experience: '6 سنوات',
      experienceEn: '6 Years',
      rating: 4.7,
      reviewCount: 98,
      location: 'الخرطوم بحري',
      locationEn: 'Khartoum North',
      languages: ['العربية', 'الإنجليزية'],
      languagesEn: ['Arabic', 'English'],
      isOnline: true,
      responseTime: 'خلال 10 دقائق',
      responseTimeEn: 'Within 10 minutes',
      avatar: 'https://images.unsplash.com/photo-1594824475562-66448d74b8b6?w=150&h=150&fit=crop&crop=face',
      consultations: 145,
      services: ['الأمراض المزمنة', 'ضغط الدم', 'السكري']
    }
  ];

  const filteredPharmacists = pharmacists.filter(pharmacist => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pharmacist.name.toLowerCase().includes(query) ||
      pharmacist.nameEn.toLowerCase().includes(query) ||
      pharmacist.specialization.toLowerCase().includes(query) ||
      pharmacist.specializationEn.toLowerCase().includes(query)
    );
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic
      setMessage('');
    }
  };

  const handleStartConsultation = (pharmacist, type) => {
    setSelectedPharmacist(pharmacist);
    setConsultationType(type);
  };

  if (selectedPharmacist) {
    return (
      <div className="h-full flex flex-col bg-background pattern-geometric">
        {/* Consultation Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPharmacist(null)}
                className="text-gray-500"
              >
                ←
              </Button>
              <Avatar className="w-10 h-10">
                <ImageWithFallback
                  src={selectedPharmacist.avatar}
                  alt={selectedPharmacist.name}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>
                  {(language === 'ar' ? selectedPharmacist.name : selectedPharmacist.nameEn).charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === 'ar' ? selectedPharmacist.name : selectedPharmacist.nameEn}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedPharmacist.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {selectedPharmacist.isOnline 
                      ? (language === 'ar' ? 'متصل' : 'Online')
                      : (language === 'ar' ? 'غير متصل' : 'Offline')
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone size={16} />
              </Button>
              <Button variant="outline" size="sm">
                <Video size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                <p className="text-sm text-gray-900">
                  {language === 'ar' 
                    ? `مرحبا! أنا ${selectedPharmacist.name}. كيف يمكنني مساعدتك اليوم؟`
                    : `Hello! I'm ${selectedPharmacist.nameEn}. How can I help you today?`
                  }
                </p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {language === 'ar' ? 'الآن' : 'Now'}
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Info */}
          <Card className="bg-blue-50 border border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    {language === 'ar' ? 'بدء الاستشارة' : 'Consultation Started'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === 'ar' 
                      ? 'يمكنك الآن طرح أسئلتك حول الأدوية والعلاجات'
                      : 'You can now ask questions about medications and treatments'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Paperclip size={16} />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleSendMessage}
              >
                <Send size={16} />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Mic size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background pattern-nile">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'الاستشارات الصيدلانية' : 'Pharmacy Consultations'}
            </h1>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'تواصل مع صيادلة مختصين' : 'Connect with qualified pharmacists'}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن صيدلي...' : 'Search for pharmacist...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Service Overview - Neutral presentation */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageCircle size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'خدمات الاستشارة المتاحة' : 'Available Consultation Services'}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    • {language === 'ar' ? 'استشارات حول الأدوية والجرعات' : 'Medication and dosage consultations'}
                  </p>
                  <p className="text-sm text-gray-600">
                    • {language === 'ar' ? 'مراجعة التداخلات الدوائية' : 'Drug interaction reviews'}
                  </p>
                  <p className="text-sm text-gray-600">
                    • {language === 'ar' ? 'نصائح صحية وإرشادات' : 'Health tips and guidance'}
                  </p>
                  <p className="text-sm text-gray-600">
                    • {language === 'ar' ? 'استفسارات حول الأعراض الجانبية' : 'Side effects inquiries'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Types */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'أنواع الاستشارة' : 'Consultation Types'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={24} className="text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {language === 'ar' ? 'محادثة نصية' : 'Text Chat'}
                </h4>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'رسائل فورية' : 'Instant messaging'}
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone size={24} className="text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {language === 'ar' ? 'مكالمة صوتية' : 'Voice Call'}
                </h4>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'تواصل مباشر' : 'Direct communication'}
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Video size={24} className="text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {language === 'ar' ? 'مكالمة مرئية' : 'Video Call'}
                </h4>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'تفاعل بصري' : 'Visual interaction'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Pharmacists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {language === 'ar' ? 'الصيادلة المتاحون' : 'Available Pharmacists'}
            </h3>
            <Button variant="ghost" size="sm">
              <Filter size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'فلتر' : 'Filter'}
            </Button>
          </div>

          <div className="space-y-4">
            {filteredPharmacists.map((pharmacist) => (
              <Card
                key={pharmacist.id}
                className="hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <ImageWithFallback
                          src={pharmacist.avatar}
                          alt={pharmacist.name}
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback>
                          {(language === 'ar' ? pharmacist.name : pharmacist.nameEn).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        pharmacist.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {language === 'ar' ? pharmacist.name : pharmacist.nameEn}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === 'ar' ? pharmacist.specialization : pharmacist.specializationEn}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? pharmacist.experience : pharmacist.experienceEn} • {language === 'ar' ? pharmacist.location : pharmacist.locationEn}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <Star size={12} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-sm text-gray-600 arabic-numbers">{pharmacist.rating}</span>
                              <span className="text-sm text-gray-500 arabic-numbers">
                                ({pharmacist.reviewCount})
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={12} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">
                                {language === 'ar' ? pharmacist.responseTime : pharmacist.responseTimeEn}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {pharmacist.languages.map((lang, index) => (
                              <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                                {language === 'ar' ? lang : pharmacist.languagesEn[index]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleStartConsultation(pharmacist, 'chat')}
                          className="bg-primary text-white flex-1"
                        >
                          <MessageCircle size={14} className={getMargin('0', '2')} />
                          {language === 'ar' ? 'محادثة' : 'Chat'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartConsultation(pharmacist, 'call')}
                          className="border-gray-200"
                        >
                          <Phone size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartConsultation(pharmacist, 'video')}
                          className="border-gray-200"
                        >
                          <Video size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gray-50 border border-gray-100">
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 mb-1">
                {language === 'ar' ? 'ما هي مدة الاستشارة؟' : 'How long is a consultation?'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'ar' 
                  ? 'عادة ما تستغرق الاستشارة بين 15-30 دقيقة حسب حالتك'
                  : 'Consultations typically last 15-30 minutes depending on your case'
                }
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-1">
                {language === 'ar' ? 'هل المعلومات سرية؟' : 'Is my information confidential?'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'ar' 
                  ? 'نعم، جميع المعلومات والاستشارات سرية تماماً'
                  : 'Yes, all information and consultations are completely confidential'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}