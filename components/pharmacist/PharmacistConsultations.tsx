import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalization, useRTL } from '../services/LocalizationService';

const consultations = [
  {
    id: "CONS-001",
    patient: "سليم عبد الحميد",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    status: "نشط",
    startTime: "2024-01-15T10:30:00",
    type: "chat",
    topic: "الآثار الجانبية للأدوية",
    lastMessage: "شكرا عل التوضيح بخصوص الجرعة.",
    unreadCount: 0
  },
  {
    id: "CONS-002", 
    patient: "تبيان خالد",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
    status: "في الانتظار",
    startTime: "2024-01-15T11:15:00",
    type: "محادثة نصية",
    topic: "استشارة حول تفاعلات الأدوية",
    lastMessage: "انا باخد في دواء جديداسي, هل ممكن تحصل تفاعلات مع أدوية تانية؟",
    unreadCount: 2
  },
  {
    id: "CONS-003",
    patient: "هديل مأمون", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    status: "اكتملت",
    startTime: "2024-01-15T09:00:00",
    endTime: "2024-01-15T09:30:00",
    type: "فيديو",
    topic: "استشارة حول دواء جديد",
    lastMessage: "تمت الاستشارة بنجاح, شكرا لك.",
    unreadCount: 0
  }
];

const chatMessages = [
  {
    id: 1,
    sender: "مريض",
    message: "السلام عليكم يا دكتور, عندي استفسار عن الدواء دة",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    sender: "صيدلي",
    message: "و عليكم السلام, مرحب بيك والله سؤالك شنو؟",
    timestamp: "10:31 AM"
  },
  {
    id: 3,
    sender: "مريض", 
    message: "والله ياخ عندي شوية غثيان بعد ما اخدت الاموكسيسيلين, هل ده طبيعي؟",
    timestamp: "10:32 AM"
  },
  {
    id: 4,
    sender: "صيدلي",
    message: "الغثيان ممكن يكون من الآثار الجانبية للدواء, لكن لو استمر أو زاد, لازم تشوف طبيب.",
    timestamp: "10:34 AM"
  }
];

type PharmacistConsultationsProps = {
  navigateTo: (screen: string, data?: any) => void;
  goBack?: () => void;
};

export default function PharmacistConsultations({ navigateTo, goBack }: PharmacistConsultationsProps) {
  const { t, language } = useLocalization();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "pharmacist",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'waiting': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'completed': return { backgroundColor: '#F3F4F6', color: '#374151' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'fiber-manual-record';
      case 'waiting': return 'schedule';
      case 'completed': return 'check-circle';
      default: return 'help';
    }
  };

  const ConsultationCard = ({ consultation }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedConsultation(consultation)}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: consultation.avatar }} style={styles.avatar} />
        <View style={styles.cardInfo}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.patientName}>{consultation.patient}</Text>
            <View style={[styles.statusBadge, getStatusColor(consultation.status)]}>
              <Icon name={getStatusIcon(consultation.status)} size={12} color={getStatusColor(consultation.status).color} />
              <Text style={[styles.statusText, { color: getStatusColor(consultation.status).color }]}>
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.topic}>{consultation.topic}</Text>
          <Text style={styles.lastMessage}>{consultation.lastMessage}</Text>
            </View>
        <View style={styles.cardMeta}>
          <Text style={styles.time}>{new Date(consultation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          {consultation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{consultation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedConsultation) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => setSelectedConsultation(null)} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
          <Image source={{ uri: selectedConsultation.avatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerTitle}>{selectedConsultation.patient}</Text>
              <Text style={styles.headerSubtitle}>{selectedConsultation.topic}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="call" size={20} color="#49C5B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="videocam" size={20} color="#49C5B8" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.chatContainer}>
            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {messages.map((message) => (
                <View key={message.id} style={[
                  styles.messageContainer,
                  message.sender === 'pharmacist' ? styles.pharmacistMessage : styles.patientMessage
                ]}>
                  <View style={[
                    styles.messageBubble,
                    message.sender === 'pharmacist' ? styles.pharmacistBubble : styles.patientBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.sender === 'pharmacist' ? styles.pharmacistText : styles.patientText
                    ]}>
                      {message.message}
                    </Text>
                    <Text style={styles.messageTime}>{message.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

            <View style={styles.inputContainer}>
          <TextInput
                style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
                placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
                multiline
          />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{language === 'ar' ? 'الاستشارات' : 'Consultations'}</Text>
        </View>
        <View style={{ width: 40 }} />
        </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.body}>
          {consultations.map((consultation) => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
              </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb' 
  },
  body: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  backButton: { 
    padding: 8 
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#555',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 14, 
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  topic: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  cardMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 32,
  },
  messageContainer: {
    marginBottom: 10,
  },
  pharmacistMessage: {
    alignItems: 'flex-end',
  },
  patientMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pharmacistBubble: {
    backgroundColor: '#49C5B8',
  },
  patientBubble: {
    backgroundColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 14,
  },
  pharmacistText: {
    color: '#fff',
  },
  patientText: {
    color: '#555',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#49C5B8',
    borderRadius: 8,
    padding: 10,
  },
});