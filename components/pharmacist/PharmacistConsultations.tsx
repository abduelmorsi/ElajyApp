import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ICONS = {
  arrowLeft: '←',
  message: '💬',
  phone: '📞',
  video: '🎥',
  clock: '⏰',
  user: '👤',
  send: '📤',
};

const consultations = [
  {
    id: "CONS-001",
    patient: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    status: "active",
    startTime: "2024-01-15T10:30:00",
    type: "chat",
    topic: "Medication side effects",
    lastMessage: "Thank you for the clarification about the dosage.",
    unreadCount: 0
  },
  {
    id: "CONS-002", 
    patient: "Sarah Smith",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
    status: "waiting",
    startTime: "2024-01-15T11:15:00",
    type: "chat",
    topic: "Drug interaction concerns",
    lastMessage: "I'm taking multiple medications and worried about interactions.",
    unreadCount: 2
  },
  {
    id: "CONS-003",
    patient: "Mike Johnson", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    status: "completed",
    startTime: "2024-01-15T09:00:00",
    endTime: "2024-01-15T09:30:00",
    type: "video",
    topic: "Prescription guidance",
    lastMessage: "Consultation completed successfully.",
    unreadCount: 0
  }
];

const chatMessages = [
  {
    id: 1,
    sender: "patient",
    message: "Hi Dr. Wilson, I have some questions about my medication.",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    sender: "pharmacist",
    message: "Hello John! I'm here to help. What questions do you have about your medication?",
    timestamp: "10:31 AM"
  },
  {
    id: 3,
    sender: "patient", 
    message: "I'm experiencing some mild nausea after taking the amoxicillin. Is this normal?",
    timestamp: "10:32 AM"
  },
  {
    id: 4,
    sender: "pharmacist",
    message: "Mild nausea can be a common side effect of amoxicillin. Try taking it with food to reduce stomach irritation. If it persists or worsens, please contact your doctor.",
    timestamp: "10:34 AM"
  }
];


type PharmacistConsultationsProps = {
  navigateTo: (screen: string, data?: any) => void;
};

export default function PharmacistConsultations({ navigateTo }: PharmacistConsultationsProps) {
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
      case 'active': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'waiting': return { backgroundColor: '#fef9c3', color: '#b45309' };
      case 'completed': return { backgroundColor: '#f3f4f6', color: '#374151' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const activeConsultations = consultations.filter(c => c.status === 'active');
  const waitingConsultations = consultations.filter(c => c.status === 'waiting');
  const completedConsultations = consultations.filter(c => c.status === 'completed');

  const ConsultationCard = ({ consultation }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedConsultation(consultation)}>
      <View style={styles.cardRow}>
        <View style={styles.avatarBox}>
          <Image source={{ uri: consultation.avatar }} style={styles.avatarImg} />
          <View style={[styles.statusDot, 
            consultation.status === 'active' ? { backgroundColor: '#22c55e' } :
            consultation.status === 'waiting' ? { backgroundColor: '#fde047' } :
            { backgroundColor: '#a3a3a3' }
          ]} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardPatient}>{consultation.patient}</Text>
              <Text style={styles.cardTopic}>{consultation.topic}</Text>
            </View>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, getStatusColor(consultation.status)]}>
                <Text style={styles.badgeText}>{consultation.status}</Text>
              </View>
              {consultation.unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: '#007bff' }]}> 
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{consultation.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.cardLastMsg}>{consultation.lastMessage}</Text>
          <View style={styles.cardFooterRow}>
            <View style={styles.cardFooterLeft}>
              <Text style={styles.cardFooterIcon}>{consultation.type === 'video' ? ICONS.video : ICONS.message}</Text>
              <Text style={styles.cardFooterType}>{consultation.type}</Text>
            </View>
            <View style={styles.cardFooterRight}>
              <Text style={styles.cardFooterIcon}>{ICONS.clock}</Text>
              <Text style={styles.cardFooterTime}>{new Date(consultation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedConsultation) {
    return (
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => setSelectedConsultation(null)}>
            <Text style={styles.headerBackIcon}>{ICONS.arrowLeft}</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedConsultation.avatar }} style={styles.headerAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerPatient}>{selectedConsultation.patient}</Text>
            <Text style={styles.headerTopic}>{selectedConsultation.topic}</Text>
          </View>
          <View style={styles.headerActionRow}>
            <TouchableOpacity style={styles.headerActionBtn}><Text style={styles.headerActionIcon}>{ICONS.phone}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn}><Text style={styles.headerActionIcon}>{ICONS.video}</Text></TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContent}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.messageRow, message.sender === 'pharmacist' ? styles.messageRowRight : styles.messageRowLeft]}
            >
              <View style={[styles.messageBubble, message.sender === 'pharmacist' ? styles.messageBubblePharmacist : styles.messageBubblePatient]}>
                <Text style={styles.messageText}>{message.message}</Text>
                <Text style={[styles.messageTime, message.sender === 'pharmacist' ? styles.messageTimePharmacist : styles.messageTimePatient]}>{message.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your response..."
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
            <Text style={styles.sendBtnIcon}>{ICONS.send}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Tab state
  const [tab, setTab] = useState('active');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigateTo('pharmacist-dashboard')}>
          <Text style={styles.headerBackIcon}>{ICONS.arrowLeft}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultations</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'active' && styles.tabBtnActive]} onPress={() => setTab('active')}>
          <Text style={[styles.tabBtnText, tab === 'active' && styles.tabBtnTextActive]}>Active ({activeConsultations.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'waiting' && styles.tabBtnActive]} onPress={() => setTab('waiting')}>
          <Text style={[styles.tabBtnText, tab === 'waiting' && styles.tabBtnTextActive]}>Waiting ({waitingConsultations.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'completed' && styles.tabBtnActive]} onPress={() => setTab('completed')}>
          <Text style={[styles.tabBtnText, tab === 'completed' && styles.tabBtnTextActive]}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer}>
        {tab === 'active' && (
          activeConsultations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>{ICONS.message}</Text>
              <Text style={styles.emptyTitle}>No Active Consultations</Text>
              <Text style={styles.emptyDesc}>Active patient consultations will appear here</Text>
            </View>
          ) : (
            activeConsultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          )
        )}
        {tab === 'waiting' && (
          waitingConsultations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>{ICONS.clock}</Text>
              <Text style={styles.emptyTitle}>No Waiting Consultations</Text>
              <Text style={styles.emptyDesc}>Patients waiting for consultation will appear here</Text>
            </View>
          ) : (
            waitingConsultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          )
        )}
        {tab === 'completed' && (
          completedConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  headerBackBtn: { padding: 6, marginRight: 8 },
  headerBackIcon: { fontSize: 22, color: '#888' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d7d6b' },
  tabsRow: { flexDirection: 'row', backgroundColor: '#e5e7eb', borderRadius: 8, margin: 16, marginBottom: 0 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#2d7d6b' },
  tabBtnText: { color: '#222', fontSize: 15 },
  tabBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  tabContent: { flex: 1, paddingHorizontal: 16, marginTop: 12 },
  tabContentContainer: { paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, elevation: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarBox: { marginRight: 12, position: 'relative' },
  avatarImg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  cardPatient: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  cardTopic: { fontSize: 12, color: '#555' },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4, minWidth: 32, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  cardLastMsg: { fontSize: 12, color: '#888', marginBottom: 4 },
  cardFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardFooterLeft: { flexDirection: 'row', alignItems: 'center' },
  cardFooterRight: { flexDirection: 'row', alignItems: 'center' },
  cardFooterIcon: { fontSize: 13, marginRight: 4 },
  cardFooterType: { fontSize: 12, color: '#555' },
  cardFooterTime: { fontSize: 12, color: '#555' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', marginTop: 48 },
  emptyIcon: { fontSize: 48, color: '#bbb', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  emptyDesc: { color: '#888', fontSize: 13 },
  chatContainer: { flex: 1, backgroundColor: '#f9fafb' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
  headerPatient: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  headerTopic: { fontSize: 12, color: '#555' },
  headerActionRow: { flexDirection: 'row', alignItems: 'center' },
  headerActionBtn: { marginLeft: 8, padding: 6, backgroundColor: '#e5e7eb', borderRadius: 8 },
  headerActionIcon: { fontSize: 18 },
  messagesScroll: { flex: 1, padding: 16 },
  messagesContent: { paddingBottom: 32 },
  messageRow: { flexDirection: 'row', marginBottom: 10 },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  messageBubblePharmacist: { backgroundColor: '#2d7d6b' },
  messageBubblePatient: { backgroundColor: '#e5e7eb' },
  messageText: { fontSize: 14, color: '#fff' },
  messageTime: { fontSize: 11, marginTop: 2 },
  messageTimePharmacist: { color: '#fff', opacity: 0.7 },
  messageTimePatient: { color: '#555' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginRight: 8 },
  sendBtn: { backgroundColor: '#2d7d6b', borderRadius: 8, padding: 10 },
  sendBtnIcon: { color: '#fff', fontSize: 18 },
});