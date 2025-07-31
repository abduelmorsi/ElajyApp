import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
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
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
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
         <View style={[{ 
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
         }, isRTL && { flexDirection: 'row-reverse' }]}>
           <TouchableOpacity style={[styles.chatBackButton, isRTL && styles.chatBackButtonRTL]} onPress={() => setSelectedPharmacist(null)}>
             <Icon name="arrow-back" size={24} color="#222" />
           </TouchableOpacity>
           <Image source={{ uri: selectedPharmacist.avatar }} style={[styles.chatAvatar, isRTL && styles.chatAvatarRTL]} />
           <View style={[styles.chatInfo, isRTL && styles.chatInfoRTL]}>
             <Text style={[styles.chatName, isRTL && styles.chatNameRTL]}>{language === 'ar' ? selectedPharmacist.name : selectedPharmacist.nameEn}</Text>
             <View style={[styles.onlineStatus, isRTL && styles.onlineStatusRTL]}>
               <View style={[styles.statusDot, isRTL && styles.statusDotRTL]} />
               <Text style={[styles.statusText, isRTL && styles.statusTextRTL]}>
                 {selectedPharmacist.isOnline
                   ? (language === 'ar' ? 'متصل' : 'Online')
                   : (language === 'ar' ? 'غير متصل' : 'Offline')}
               </Text>
             </View>
           </View>
           <View style={[styles.chatActions, isRTL && styles.chatActionsRTL]}>
             <TouchableOpacity style={styles.chatActionButton}>
               <Icon name="call" size={16} color="#49C5B8" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.chatActionButton}>
               <Icon name="videocam" size={16} color="#49C5B8" />
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
             <View style={[styles.welcomeMessageContainer, isRTL && styles.welcomeMessageContainerRTL]}>
               <View style={[styles.welcomeMessage, isRTL && styles.welcomeMessageRTL]}>
                 <Text style={[styles.welcomeText, isRTL && styles.welcomeTextRTL]}>
                   {language === 'ar'
                     ? `مرحبا! أنا ${selectedPharmacist.name}. كيف يمكنني مساعدتك اليوم؟`
                     : `Hello! I'm ${selectedPharmacist.nameEn}. How can I help you today?`}
                 </Text>
                 <Text style={[styles.welcomeTime, isRTL && styles.welcomeTimeRTL]}>{language === 'ar' ? 'الآن' : 'Now'}</Text>
               </View>
             </View>
             {/* Consultation Info */}
             <View style={[styles.consultationInfo, isRTL && styles.consultationInfoRTL]}>
               <View style={[styles.consultationIcon, isRTL && styles.consultationIconRTL]}>
                 <Icon name="chat" size={16} color="#fff" />
               </View>
               <View style={styles.consultationText}>
                 <Text style={[styles.consultationTitle, isRTL && styles.consultationTitleRTL]}>{language === 'ar' ? 'بدء الاستشارة' : 'Consultation Started'}</Text>
                 <Text style={[styles.consultationDesc, isRTL && styles.consultationDescRTL]}>{language === 'ar'
                   ? 'يمكنك الآن طرح أسئلتك حول الأدوية والعلاجات'
                   : 'You can now ask questions about medications and treatments'}</Text>
               </View>
             </View>
          </ScrollView>
                     {/* Message Input */}
           <View style={[styles.messageInputContainer, isRTL && styles.messageInputContainerRTL]}>
             <TouchableOpacity style={styles.inputActionButton}>
               <Icon name="attach-file" size={16} color="#666" />
             </TouchableOpacity>
             <TextInput
               style={[styles.messageInput, isRTL && styles.messageInputRTL]}
               value={message}
               onChangeText={setMessage}
               placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
               onSubmitEditing={handleSendMessage}
               placeholderTextColor="#888"
               textAlign={isRTL ? 'right' : 'left'}
             />
             <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
               <Icon name="send" size={16} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.inputActionButton}>
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
       <View style={[styles.header, { paddingTop: insets.top + 16 }, isRTL && styles.headerRTL]}>
         <View style={[styles.headerLeft, isRTL && styles.headerLeftRTL]}>
           {goBack && (
             <TouchableOpacity onPress={() => {
               console.log('Back button pressed in ConsultScreen');
               goBack();
             }} style={[styles.backButton, isRTL && styles.backButtonRTL]}>
               <Icon name="arrow-back" size={24} color="#222" />
             </TouchableOpacity>
           )}
         </View>
         <View style={styles.headerCenter}>
           <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]} numberOfLines={1} ellipsizeMode="tail">
             {language === 'ar' ? 'الاستشارات' : 'Consultations'}
           </Text>
         </View>
         <View style={[styles.headerRight, isRTL && styles.headerRightRTL]}>
           {/* Empty space to balance the layout */}
         </View>
       </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 0 }}>

        <View style={{ paddingVertical: 12 }}>
                     {/* Service Overview */}
           <View style={[styles.serviceOverview, isRTL && styles.serviceOverviewRTL]}>
           <View style={[styles.serviceOverviewContent, isRTL && styles.serviceOverviewContentRTL]}>
             <View style={[styles.serviceIcon, isRTL && styles.serviceIconRTL]}>
               <Icon name="chat" size={18} color="#49C5B8" />
             </View>
             <View style={styles.serviceText}>
               <Text style={[styles.serviceTitle, isRTL && styles.serviceTitleRTL]}>
                 {language === 'ar' ? 'خدمات الاستشارة المتاحة' : 'Available Consultation Services'}
               </Text>
               <Text style={[styles.serviceItem, isRTL && styles.serviceItemRTL]}>• {language === 'ar' ? 'استشارات حول الأدوية والجرعات' : 'Medication and dosage consultations'}</Text>
               <Text style={[styles.serviceItem, isRTL && styles.serviceItemRTL]}>• {language === 'ar' ? 'مراجعة التداخلات الدوائية' : 'Drug interaction reviews'}</Text>
               <Text style={[styles.serviceItem, isRTL && styles.serviceItemRTL]}>• {language === 'ar' ? 'نصائح صحية وإرشادات' : 'Health tips and guidance'}</Text>
               <Text style={[styles.serviceItem, isRTL && styles.serviceItemRTL]}>• {language === 'ar' ? 'استفسارات حول الأعراض الجانبية' : 'Side effects inquiries'}</Text>
             </View>
           </View>
         </View>

                     {/* Consultation Types */}
           <View style={[styles.consultationTypes, isRTL && styles.consultationTypesRTL]}>
             <Text style={[styles.consultationTypesTitle, isRTL && styles.consultationTypesTitleRTL]}>
               {language === 'ar' ? 'أنواع الاستشارة' : 'Consultation Types'}
             </Text>
             <View style={[styles.consultationTypesRow, isRTL && styles.consultationTypesRowRTL]}>
             <TouchableOpacity style={[styles.consultationTypeCard, styles.chatCard, isRTL && styles.chatCardRTL]} onPress={() => setConsultationType('chat')}>
               <Icon name="chat" size={20} color="#49C5B8" style={styles.consultationTypeIcon} />
               <Text style={[styles.consultationTypeTitle, isRTL && styles.consultationTypeTitleRTL]}>{language === 'ar' ? 'محادثة نصية' : 'Text Chat'}</Text>
               <Text style={[styles.consultationTypeDesc, isRTL && styles.consultationTypeDescRTL]}>{language === 'ar' ? 'رسائل فورية' : 'Instant messaging'}</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.consultationTypeCard, styles.callCard, isRTL && styles.callCardRTL]} onPress={() => setConsultationType('call')}>
               <Icon name="call" size={20} color="#49C5B8" style={styles.consultationTypeIcon} />
               <Text style={[styles.consultationTypeTitle, isRTL && styles.consultationTypeTitleRTL]}>{language === 'ar' ? 'مكالمة صوتية' : 'Voice Call'}</Text>
               <Text style={[styles.consultationTypeDesc, isRTL && styles.consultationTypeDescRTL]}>{language === 'ar' ? 'تواصل مباشر' : 'Direct communication'}</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.consultationTypeCard, styles.videoCard, isRTL && styles.videoCardRTL]} onPress={() => setConsultationType('video')}>
               <Icon name="videocam" size={20} color="#49C5B8" style={styles.consultationTypeIcon} />
               <Text style={[styles.consultationTypeTitle, isRTL && styles.consultationTypeTitleRTL]}>{language === 'ar' ? 'مكالمة مرئية' : 'Video Call'}</Text>
               <Text style={[styles.consultationTypeDesc, isRTL && styles.consultationTypeDescRTL]}>{language === 'ar' ? 'تفاعل بصري' : 'Visual interaction'}</Text>
             </TouchableOpacity>
           </View>
         </View>

                     {/* Available Pharmacists */}
           <View style={[styles.availablePharmacists, isRTL && styles.availablePharmacistsRTL]}>
           <View style={[styles.pharmacistsHeader, isRTL && styles.pharmacistsHeaderRTL]}>
             <Text style={[styles.pharmacistsTitle, isRTL && styles.pharmacistsTitleRTL]}>{language === 'ar' ? 'الصيادلة المتاحون' : 'Available Pharmacists'}</Text>
             <TouchableOpacity style={[styles.filterButton, isRTL && styles.filterButtonRTL]}>
               <Icon name="filter-list" size={14} color="#49C5B8" style={[styles.filterIcon, isRTL && styles.filterIconRTL]} />
               <Text style={[styles.filterText, isRTL && styles.filterTextRTL]}>{language === 'ar' ? 'فلتر' : 'Filter'}</Text>
             </TouchableOpacity>
           </View>
           {filteredPharmacists.map((pharmacist) => (
             <View key={pharmacist.id} style={[styles.pharmacistCard, isRTL && styles.pharmacistCardRTL]}>
               <Image source={{ uri: pharmacist.avatar }} style={[styles.pharmacistAvatar, isRTL && styles.pharmacistAvatarRTL]} />
               <View style={styles.pharmacistInfo}>
                 <Text style={[styles.pharmacistName, isRTL && styles.pharmacistNameRTL]}>{language === 'ar' ? pharmacist.name : pharmacist.nameEn}</Text>
                 <Text style={[styles.pharmacistSpecialization, isRTL && styles.pharmacistSpecializationRTL]}>{language === 'ar' ? pharmacist.specialization : pharmacist.specializationEn}</Text>
                 <Text style={[styles.pharmacistDetails, isRTL && styles.pharmacistDetailsRTL]}>{language === 'ar' ? pharmacist.experience : pharmacist.experienceEn} • {language === 'ar' ? pharmacist.location : pharmacist.locationEn}</Text>
                 <View style={[styles.pharmacistRating, isRTL && styles.pharmacistRatingRTL]}>
                   <Icon name="star" size={12} color="#fbbf24" style={[styles.ratingIcon, isRTL && styles.ratingIconRTL]} />
                   <Text style={[styles.ratingText, isRTL && styles.ratingTextRTL]}>{pharmacist.rating}</Text>
                   <Text style={[styles.reviewCount, isRTL && styles.reviewCountRTL]}>({pharmacist.reviewCount})</Text>
                   <Icon name="schedule" size={12} color="#888" style={[styles.scheduleIcon, isRTL && styles.scheduleIconRTL]} />
                   <Text style={[styles.responseTime, isRTL && styles.responseTimeRTL]}>{language === 'ar' ? pharmacist.responseTime : pharmacist.responseTimeEn}</Text>
                 </View>
                 <View style={[styles.languagesContainer, isRTL && styles.languagesContainerRTL]}>
                   {pharmacist.languages.map((lang, index) => (
                     <View key={index} style={[styles.languageTag, isRTL && styles.languageTagRTL]}>
                       <Text style={[styles.languageText, isRTL && styles.languageTextRTL]}>{language === 'ar' ? lang : pharmacist.languagesEn[index]}</Text>
                     </View>
                   ))}
                 </View>
                 <View style={[styles.pharmacistActions, isRTL && styles.pharmacistActionsRTL]}>
                   <TouchableOpacity style={[styles.actionButton, styles.chatAction, isRTL && styles.chatActionRTL]} onPress={() => handleStartConsultation(pharmacist, 'chat')}>
                     <Text style={styles.actionButtonText}>{language === 'ar' ? 'محادثة' : 'Chat'}</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.actionButton, styles.callAction, isRTL && styles.callActionRTL]} onPress={() => handleStartConsultation(pharmacist, 'call')}>
                     <Text style={styles.actionButtonText}>{language === 'ar' ? 'مكالمة' : 'Call'}</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.actionButton, styles.videoAction, isRTL && styles.videoActionRTL]} onPress={() => handleStartConsultation(pharmacist, 'video')}>
                     <Text style={styles.actionButtonText}>{language === 'ar' ? 'مرئية' : 'Video'}</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           ))}
         </View>

                     {/* FAQ Section */}
           <View style={[styles.faqSection, isRTL && styles.faqSectionRTL]}>
           <Text style={[styles.faqTitle, isRTL && styles.faqTitleRTL]}>{language === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</Text>
           <View style={[styles.faqItem, isRTL && styles.faqItemRTL]}>
             <Text style={[styles.faqQuestion, isRTL && styles.faqQuestionRTL]}>{language === 'ar' ? 'ما هي مدة الاستشارة؟' : 'How long is a consultation?'}</Text>
             <Text style={[styles.faqAnswer, isRTL && styles.faqAnswerRTL]}>{language === 'ar' ? 'عادة ما تستغرق الاستشارة بين 15-30 دقيقة حسب حالتك' : 'Consultations typically last 15-30 minutes depending on your case'}</Text>
           </View>
           <View style={[styles.faqItem, isRTL && styles.faqItemRTL]}>
             <Text style={[styles.faqQuestion, isRTL && styles.faqQuestionRTL]}>{language === 'ar' ? 'هل المعلومات سرية؟' : 'Is my information confidential?'}</Text>
             <Text style={[styles.faqAnswer, isRTL && styles.faqAnswerRTL]}>{language === 'ar' ? 'نعم، جميع المعلومات والاستشارات سرية تماماً' : 'Yes, all information and consultations are completely confidential'}</Text>
           </View>
         </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

 const styles = StyleSheet.create({
   header: { 
     backgroundColor: '#fff', 
     borderBottomWidth: 1, 
     borderColor: '#eee', 
     paddingHorizontal: 24, 
     paddingVertical: 16,
     zIndex: 1000,
     elevation: 3,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     flexDirection: 'row',
     alignItems: 'center',
   },
   headerRTL: {
     flexDirection: 'row-reverse',
   },
   headerLeft: {
     flex: 1,
     alignItems: 'flex-start',
   },
   headerLeftRTL: {
     alignItems: 'flex-end',
   },
   headerCenter: {
     flex: 2,
     alignItems: 'center',
   },
   headerRight: {
     flex: 1,
     alignItems: 'flex-end',
   },
   headerRightRTL: {
     alignItems: 'flex-start',
   },
   headerTitle: { 
     fontSize: 20, 
     fontWeight: 'bold', 
     color: '#222',
     textAlign: 'center'
   },
   headerTitleRTL: {
     textAlign: 'center',
   },
   backButton: {
     marginRight: 12,
   },
   backButtonRTL: {
     marginRight: 0,
     marginLeft: 12,
   },
   // Chat Header Styles
   chatBackButton: {
     padding: 8,
     marginRight: 8,
   },
   chatBackButtonRTL: {
     marginRight: 0,
     marginLeft: 8,
   },
   chatAvatar: {
     width: 48,
     height: 48,
     borderRadius: 24,
     marginRight: 12,
   },
   chatAvatarRTL: {
     marginRight: 0,
     marginLeft: 12,
   },
   chatInfo: {
     flex: 1,
   },
   chatInfoRTL: {
     alignItems: 'flex-end',
   },
   chatName: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 16,
   },
   chatNameRTL: {
     textAlign: 'right',
   },
   onlineStatus: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 2,
   },
   onlineStatusRTL: {
     flexDirection: 'row-reverse',
   },
   statusDot: {
     width: 10,
     height: 10,
     borderRadius: 5,
     marginRight: 4,
   },
   statusDotRTL: {
     marginRight: 0,
     marginLeft: 4,
   },
   statusText: {
     color: '#666',
     fontSize: 12,
   },
   statusTextRTL: {
     textAlign: 'right',
   },
   chatActions: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   chatActionsRTL: {
     flexDirection: 'row-reverse',
   },
   chatActionButton: {
     marginHorizontal: 4,
     padding: 8,
     borderRadius: 8,
     backgroundColor: '#f3f4f6',
   },
   // Welcome Message Styles
   welcomeMessageContainer: {
     flexDirection: 'row',
     marginBottom: 10,
   },
   welcomeMessageContainerRTL: {
     flexDirection: 'row-reverse',
   },
   welcomeMessage: {
     backgroundColor: '#e0f2fe',
     borderRadius: 12,
     padding: 12,
     maxWidth: '80%',
   },
   welcomeMessageRTL: {
     alignItems: 'flex-end',
   },
   welcomeText: {
     color: '#222',
     fontSize: 14,
     marginBottom: 2,
   },
   welcomeTextRTL: {
     textAlign: 'right',
   },
   welcomeTime: {
     color: '#888',
     fontSize: 11,
     textAlign: 'right',
   },
   welcomeTimeRTL: {
     textAlign: 'left',
   },
   // Consultation Info Styles
   consultationInfo: {
     backgroundColor: '#bae6fd',
     borderRadius: 10,
     padding: 10,
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 10,
   },
   consultationInfoRTL: {
     flexDirection: 'row-reverse',
   },
   consultationIcon: {
     width: 32,
     height: 32,
     backgroundColor: '#38bdf8',
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 10,
   },
   consultationIconRTL: {
     marginRight: 0,
     marginLeft: 10,
   },
   consultationText: {
     flex: 1,
   },
   consultationTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 14,
   },
   consultationTitleRTL: {
     textAlign: 'right',
   },
   consultationDesc: {
     color: '#666',
     fontSize: 12,
   },
   consultationDescRTL: {
     textAlign: 'right',
   },
   // Message Input Styles
   messageInputContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#fff',
     borderTopWidth: 1,
     borderColor: '#eee',
     padding: 10,
   },
   messageInputContainerRTL: {
     flexDirection: 'row-reverse',
   },
   inputActionButton: {
     marginHorizontal: 4,
     padding: 8,
     borderRadius: 8,
     backgroundColor: '#f3f4f6',
   },
   messageInput: {
     flex: 1,
     fontSize: 15,
     color: '#222',
     backgroundColor: '#f3f4f6',
     borderRadius: 8,
     paddingHorizontal: 12,
     paddingVertical: 8,
     marginHorizontal: 6,
   },
   messageInputRTL: {
     marginHorizontal: 6,
   },
   sendButton: {
     marginHorizontal: 4,
     padding: 8,
     borderRadius: 8,
     backgroundColor: '#49C5B8',
   },
   // Service Overview Styles
   serviceOverview: {
     backgroundColor: '#e0f2fe',
     borderRadius: 12,
     borderWidth: 1,
     borderColor: '#bae6fd',
     padding: 16,
     marginHorizontal: 8,
     marginBottom: 16,
   },
   serviceOverviewRTL: {
     alignItems: 'flex-end',
   },
   serviceOverviewContent: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   serviceOverviewContentRTL: {
     flexDirection: 'row-reverse',
   },
   serviceIcon: {
     width: 40,
     height: 40,
     backgroundColor: '#bae6fd',
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 12,
   },
   serviceIconRTL: {
     marginRight: 0,
     marginLeft: 12,
   },
   serviceText: {
     flex: 1,
   },
   serviceTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 16,
     marginBottom: 4,
   },
   serviceTitleRTL: {
     textAlign: 'right',
   },
   serviceItem: {
     color: '#666',
     fontSize: 13,
   },
   serviceItemRTL: {
     textAlign: 'right',
   },
   // Consultation Types Styles
   consultationTypes: {
     marginHorizontal: 8,
     marginBottom: 20,
   },
   consultationTypesRTL: {
     alignItems: 'flex-end',
   },
   consultationTypesTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 16,
     marginBottom: 10,
   },
   consultationTypesTitleRTL: {
     textAlign: 'right',
   },
   consultationTypesRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   consultationTypesRowRTL: {
     flexDirection: 'row-reverse',
   },
   consultationTypeCard: {
     flex: 1,
     backgroundColor: '#e6f7f5',
     borderRadius: 10,
     alignItems: 'center',
     padding: 14,
   },
   consultationTypeIcon: {
     marginBottom: 6,
   },
   consultationTypeTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 14,
   },
   consultationTypeTitleRTL: {
     textAlign: 'center',
   },
   consultationTypeDesc: {
     color: '#666',
     fontSize: 12,
   },
   consultationTypeDescRTL: {
     textAlign: 'center',
   },
   chatCard: {
     marginRight: 6,
   },
   chatCardRTL: {
     marginRight: 0,
     marginLeft: 6,
   },
   callCard: {
     marginHorizontal: 6,
   },
   callCardRTL: {
     marginHorizontal: 6,
   },
   videoCard: {
     marginLeft: 6,
   },
   videoCardRTL: {
     marginLeft: 0,
     marginRight: 6,
   },
   // Available Pharmacists Styles
   availablePharmacists: {
     marginHorizontal: 8,
     marginBottom: 20,
   },
   availablePharmacistsRTL: {
     alignItems: 'flex-end',
   },
   pharmacistsHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     marginBottom: 10,
   },
   pharmacistsHeaderRTL: {
     flexDirection: 'row-reverse',
   },
   pharmacistsTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 16,
   },
   pharmacistsTitleRTL: {
     textAlign: 'right',
   },
   filterButton: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#f3f4f6',
     borderRadius: 8,
     paddingHorizontal: 10,
     paddingVertical: 6,
   },
   filterButtonRTL: {
     flexDirection: 'row-reverse',
   },
   filterIcon: {
     marginRight: 4,
   },
   filterIconRTL: {
     marginRight: 0,
     marginLeft: 4,
   },
   filterText: {
     color: '#49C5B8',
     fontWeight: 'bold',
     fontSize: 14,
   },
   filterTextRTL: {
     textAlign: 'right',
   },
   pharmacistCard: {
     backgroundColor: '#fff',
     borderRadius: 12,
     borderWidth: 1,
     borderColor: '#eee',
     marginBottom: 12,
     padding: 14,
     flexDirection: 'row',
     alignItems: 'center',
   },
   pharmacistCardRTL: {
     flexDirection: 'row-reverse',
   },
   pharmacistAvatar: {
     width: 64,
     height: 64,
     borderRadius: 32,
     marginRight: 14,
   },
   pharmacistAvatarRTL: {
     marginRight: 0,
     marginLeft: 14,
   },
   pharmacistInfo: {
     flex: 1,
   },
   pharmacistName: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 15,
   },
   pharmacistNameRTL: {
     textAlign: 'right',
   },
   pharmacistSpecialization: {
     color: '#666',
     fontSize: 13,
   },
   pharmacistSpecializationRTL: {
     textAlign: 'right',
   },
   pharmacistDetails: {
     color: '#888',
     fontSize: 12,
   },
   pharmacistDetailsRTL: {
     textAlign: 'right',
   },
   pharmacistRating: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 4,
   },
   pharmacistRatingRTL: {
     flexDirection: 'row-reverse',
   },
   ratingIcon: {
     marginRight: 2,
   },
   ratingIconRTL: {
     marginRight: 0,
     marginLeft: 2,
   },
   ratingText: {
     color: '#666',
     fontSize: 12,
   },
   ratingTextRTL: {
     textAlign: 'right',
   },
   reviewCount: {
     color: '#aaa',
     fontSize: 12,
   },
   reviewCountRTL: {
     textAlign: 'right',
   },
   scheduleIcon: {
     marginLeft: 8,
     marginRight: 2,
   },
   scheduleIconRTL: {
     marginLeft: 2,
     marginRight: 8,
   },
   responseTime: {
     color: '#666',
     fontSize: 12,
   },
   responseTimeRTL: {
     textAlign: 'right',
   },
   languagesContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     marginTop: 4,
   },
   languagesContainerRTL: {
     flexDirection: 'row-reverse',
   },
   languageTag: {
     backgroundColor: '#f3f4f6',
     borderRadius: 8,
     paddingHorizontal: 6,
     paddingVertical: 2,
     marginRight: 4,
     marginBottom: 2,
   },
   languageTagRTL: {
     marginRight: 0,
     marginLeft: 4,
   },
   languageText: {
     color: '#444',
     fontSize: 11,
   },
   languageTextRTL: {
     textAlign: 'right',
   },
   pharmacistActions: {
     flexDirection: 'row',
     marginTop: 8,
   },
   pharmacistActionsRTL: {
     flexDirection: 'row-reverse',
   },
   actionButton: {
     backgroundColor: '#49C5B8',
     borderRadius: 8,
     paddingHorizontal: 14,
     paddingVertical: 8,
   },
   actionButtonText: {
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 13,
   },
   chatAction: {
     marginRight: 8,
   },
   chatActionRTL: {
     marginRight: 0,
     marginLeft: 8,
   },
   callAction: {
     marginRight: 8,
   },
   callActionRTL: {
     marginRight: 0,
     marginLeft: 8,
   },
   videoAction: {
     marginRight: 0,
   },
   videoActionRTL: {
     marginLeft: 0,
   },
   // FAQ Styles
   faqSection: {
     backgroundColor: '#f3f4f6',
     borderRadius: 10,
     borderWidth: 1,
     borderColor: '#eee',
     padding: 16,
     marginHorizontal: 8,
     marginBottom: 24,
   },
   faqSectionRTL: {
     alignItems: 'flex-end',
   },
   faqTitle: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 15,
     marginBottom: 8,
   },
   faqTitleRTL: {
     textAlign: 'right',
   },
   faqItem: {
     marginBottom: 10,
   },
   faqItemRTL: {
     alignItems: 'flex-end',
   },
   faqQuestion: {
     fontWeight: 'bold',
     color: '#222',
     fontSize: 13,
     marginBottom: 2,
   },
   faqQuestionRTL: {
     textAlign: 'right',
   },
   faqAnswer: {
     color: '#666',
     fontSize: 12,
   },
   faqAnswerRTL: {
     textAlign: 'right',
   },
 });