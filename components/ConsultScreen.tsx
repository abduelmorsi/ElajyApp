import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from './services/LocalizationService';

type ConsultScreenProps = {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
};

export default function ConsultScreen({ navigateTo, goBack }: ConsultScreenProps) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const insets = useSafeAreaInsets();
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
                {/* Fixed Chat Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#fff', 
          borderBottomWidth: 1, 
          borderColor: '#eee', 
          paddingVertical: 14, 
          paddingHorizontal: 12, 
          paddingTop: insets.top + 14,
          zIndex: 1000,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <TouchableOpacity style={{ padding: 8, marginRight: 8 }} onPress={() => setSelectedPharmacist(null)}>
            <Text style={{ fontSize: 20 }}>{language === 'ar' ? '←' : '←'}</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedPharmacist.avatar }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}>{language === 'ar' ? selectedPharmacist.name : selectedPharmacist.nameEn}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: selectedPharmacist.isOnline ? '#22c55e' : '#aaa', marginRight: 4 }} />
              <Text style={{ color: '#666', fontSize: 12 }}>
                {selectedPharmacist.isOnline
                  ? (language === 'ar' ? 'متصل' : 'Online')
                  : (language === 'ar' ? 'غير متصل' : 'Offline')}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginHorizontal: 4, padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
              <Icon name="call" size={16} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 4, padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
              <Icon name="videocam" size={16} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Chat Area */}
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {/* Welcome Message */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ backgroundColor: '#e0f2fe', borderRadius: 12, padding: 12, maxWidth: '80%' }}>
                <Text style={{ color: '#222', fontSize: 14, marginBottom: 2 }}>
                  {language === 'ar'
                    ? `مرحبا! أنا ${selectedPharmacist.name}. كيف يمكنني مساعدتك اليوم؟`
                    : `Hello! I'm ${selectedPharmacist.nameEn}. How can I help you today?`}
                </Text>
                <Text style={{ color: '#888', fontSize: 11, textAlign: 'right' }}>{language === 'ar' ? 'الآن' : 'Now'}</Text>
              </View>
            </View>
            {/* Consultation Info */}
            <View style={{ backgroundColor: '#bae6fd', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, backgroundColor: '#38bdf8', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Icon name="chat" size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 14 }}>{language === 'ar' ? 'بدء الاستشارة' : 'Consultation Started'}</Text>
                <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar'
                  ? 'يمكنك الآن طرح أسئلتك حول الأدوية والعلاجات'
                  : 'You can now ask questions about medications and treatments'}</Text>
              </View>
            </View>
          </ScrollView>
          {/* Message Input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', padding: 10 }}>
            <TouchableOpacity style={{ marginHorizontal: 4, padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
              <Icon name="attach-file" size={16} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={{ flex: 1, fontSize: 15, color: '#222', backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 6 }}
              value={message}
              onChangeText={setMessage}
              placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
              onSubmitEditing={handleSendMessage}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={{ marginHorizontal: 4, padding: 8, borderRadius: 8, backgroundColor: '#007bff' }} onPress={handleSendMessage}>
              <Icon name="send" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 4, padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
              <Icon name="mic" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderColor: '#eee', 
        paddingHorizontal: 8, 
        paddingVertical: 16,
        paddingBottom: 8,
        paddingTop: insets.top,
        zIndex: 1000,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
          {goBack && (
            <TouchableOpacity onPress={() => {
              console.log('Back button pressed in ConsultScreen');
              goBack();
            }} style={{ padding: 8, marginRight: 8 }}>
              <Text style={{ fontSize: 20 }}>{language === 'ar' ? '←' : '←'}</Text>
            </TouchableOpacity>
          )}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>
            {language === 'ar' ? 'الاستشارات الطبية' : 'Medical Consultations'}
          </Text>
        </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 0 }}>

        <View style={{ paddingVertical: 12 }}>
          {/* Service Overview */}
          <View style={{ backgroundColor: '#e0f2fe', borderRadius: 12, borderWidth: 1, borderColor: '#bae6fd', padding: 16, marginHorizontal: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#bae6fd', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Icon name="chat" size={18} color="#007bff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 4 }}>
                {language === 'ar' ? 'خدمات الاستشارة المتاحة' : 'Available Consultation Services'}
              </Text>
              <Text style={{ color: '#666', fontSize: 13 }}>• {language === 'ar' ? 'استشارات حول الأدوية والجرعات' : 'Medication and dosage consultations'}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>• {language === 'ar' ? 'مراجعة التداخلات الدوائية' : 'Drug interaction reviews'}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>• {language === 'ar' ? 'نصائح صحية وإرشادات' : 'Health tips and guidance'}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>• {language === 'ar' ? 'استفسارات حول الأعراض الجانبية' : 'Side effects inquiries'}</Text>
            </View>
          </View>
        </View>

          {/* Consultation Types */}
          <View style={{ marginHorizontal: 8, marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 10 }}>
              {language === 'ar' ? 'أنواع الاستشارة' : 'Consultation Types'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#dbeafe', borderRadius: 10, alignItems: 'center', padding: 14, marginRight: 6 }} onPress={() => setConsultationType('chat')}>
              <Icon name="chat" size={20} color="#007bff" style={{ marginBottom: 6 }} />
              <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 14 }}>{language === 'ar' ? 'محادثة نصية' : 'Text Chat'}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? 'رسائل فورية' : 'Instant messaging'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#bbf7d0', borderRadius: 10, alignItems: 'center', padding: 14, marginHorizontal: 6 }} onPress={() => setConsultationType('call')}>
              <Icon name="call" size={20} color="#22c55e" style={{ marginBottom: 6 }} />
              <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 14 }}>{language === 'ar' ? 'مكالمة صوتية' : 'Voice Call'}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? 'تواصل مباشر' : 'Direct communication'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#ddd6fe', borderRadius: 10, alignItems: 'center', padding: 14, marginLeft: 6 }} onPress={() => setConsultationType('video')}>
              <Icon name="videocam" size={20} color="#a78bfa" style={{ marginBottom: 6 }} />
              <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 14 }}>{language === 'ar' ? 'مكالمة مرئية' : 'Video Call'}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? 'تفاعل بصري' : 'Visual interaction'}</Text>
            </TouchableOpacity>
          </View>
        </View>

          {/* Available Pharmacists */}
          <View style={{ marginHorizontal: 8, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}>{language === 'ar' ? 'الصيادلة المتاحون' : 'Available Pharmacists'}</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Icon name="filter-list" size={14} color="#007bff" style={{ marginRight: 4 }} />
              <Text style={{ color: '#007bff', fontWeight: 'bold', fontSize: 14 }}>{language === 'ar' ? 'فلتر' : 'Filter'}</Text>
            </TouchableOpacity>
          </View>
          {filteredPharmacists.map((pharmacist) => (
            <View key={pharmacist.id} style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 12, padding: 14, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: pharmacist.avatar }} style={{ width: 64, height: 64, borderRadius: 32, marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 15 }}>{language === 'ar' ? pharmacist.name : pharmacist.nameEn}</Text>
                <Text style={{ color: '#666', fontSize: 13 }}>{language === 'ar' ? pharmacist.specialization : pharmacist.specializationEn}</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>{language === 'ar' ? pharmacist.experience : pharmacist.experienceEn} • {language === 'ar' ? pharmacist.location : pharmacist.locationEn}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Icon name="star" size={12} color="#fbbf24" style={{ marginRight: 2 }} />
                  <Text style={{ color: '#666', fontSize: 12 }}>{pharmacist.rating}</Text>
                  <Text style={{ color: '#aaa', fontSize: 12 }}>({pharmacist.reviewCount})</Text>
                  <Icon name="schedule" size={12} color="#888" style={{ marginLeft: 8, marginRight: 2 }} />
                  <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? pharmacist.responseTime : pharmacist.responseTimeEn}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                  {pharmacist.languages.map((lang, index) => (
                    <View key={index} style={{ backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, marginRight: 4, marginBottom: 2 }}>
                      <Text style={{ color: '#444', fontSize: 11 }}>{language === 'ar' ? lang : pharmacist.languagesEn[index]}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity style={{ backgroundColor: '#007bff', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 }} onPress={() => handleStartConsultation(pharmacist, 'chat')}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{language === 'ar' ? 'محادثة' : 'Chat'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#22c55e', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 }} onPress={() => handleStartConsultation(pharmacist, 'call')}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{language === 'ar' ? 'مكالمة' : 'Call'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#a78bfa', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => handleStartConsultation(pharmacist, 'video')}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{language === 'ar' ? 'مرئية' : 'Video'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

          {/* FAQ Section */}
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, borderWidth: 1, borderColor: '#eee', padding: 16, marginHorizontal: 8, marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 15, marginBottom: 8 }}>{language === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13, marginBottom: 2 }}>{language === 'ar' ? 'ما هي مدة الاستشارة؟' : 'How long is a consultation?'}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? 'عادة ما تستغرق الاستشارة بين 15-30 دقيقة حسب حالتك' : 'Consultations typically last 15-30 minutes depending on your case'}</Text>
          </View>
          <View>
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13, marginBottom: 2 }}>{language === 'ar' ? 'هل المعلومات سرية؟' : 'Is my information confidential?'}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{language === 'ar' ? 'نعم، جميع المعلومات والاستشارات سرية تماماً' : 'Yes, all information and consultations are completely confidential'}</Text>
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}