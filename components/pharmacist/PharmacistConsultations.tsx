import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, Video, Clock, User, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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

export default function PharmacistConsultations({ navigateTo }) {
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeConsultations = consultations.filter(c => c.status === 'active');
  const waitingConsultations = consultations.filter(c => c.status === 'waiting');
  const completedConsultations = consultations.filter(c => c.status === 'completed');

  const ConsultationCard = ({ consultation }) => (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedConsultation(consultation)}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={consultation.avatar} alt={consultation.patient} />
            <AvatarFallback>{consultation.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            consultation.status === 'active' ? 'bg-green-500' : 
            consultation.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h4 className="text-sm">{consultation.patient}</h4>
              <p className="text-xs text-muted-foreground">{consultation.topic}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(consultation.status)}>
                {consultation.status}
              </Badge>
              {consultation.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  {consultation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {consultation.lastMessage}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {consultation.type === 'video' ? (
                <Video size={12} />
              ) : (
                <MessageCircle size={12} />
              )}
              <span>{consultation.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{new Date(consultation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (selectedConsultation) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedConsultation(null)}>
              <ArrowLeft size={16} />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedConsultation.avatar} alt={selectedConsultation.patient} />
              <AvatarFallback>{selectedConsultation.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="text-sm">{selectedConsultation.patient}</h4>
              <p className="text-xs text-muted-foreground">{selectedConsultation.topic}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Phone size={14} />
              </Button>
              <Button variant="outline" size="sm">
                <Video size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'pharmacist' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'pharmacist' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'pharmacist' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your response..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigateTo('pharmacist-dashboard')}>
          <ArrowLeft size={16} />
        </Button>
        <h3>Consultations</h3>
        <div></div>
      </div>

      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeConsultations.length})</TabsTrigger>
            <TabsTrigger value="waiting">Waiting ({waitingConsultations.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="flex-1 overflow-y-auto px-4 space-y-4">
          {activeConsultations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Active Consultations</h4>
              <p className="text-muted-foreground">Active patient consultations will appear here</p>
            </div>
          ) : (
            activeConsultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          )}
        </TabsContent>

        <TabsContent value="waiting" className="flex-1 overflow-y-auto px-4 space-y-4">
          {waitingConsultations.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Waiting Consultations</h4>
              <p className="text-muted-foreground">Patients waiting for consultation will appear here</p>
            </div>
          ) : (
            waitingConsultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="flex-1 overflow-y-auto px-4 space-y-4">
          {completedConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}