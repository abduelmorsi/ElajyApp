
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PatientCardProps {
  patient: any;
  onView: (patient: any) => void;
  onAssign: (patientId: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function PatientCard({ patient, onView, onAssign, showActions = false, compact = false }) {
  const language = 'ar'; // fallback for now

  return (
    <TouchableOpacity style={[styles.card, compact && styles.compactCard]} onPress={() => onView(patient)}>
      <View style={styles.cardContent}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {language === 'ar' ? patient.name : patient.nameEn}
          </Text>
          <Text style={styles.patientAge}>
            {language === 'ar' ? 'العمر:' : 'Age:'} {patient.age} {language === 'ar' ? 'سنة' : 'years'}
          </Text>
          <Text style={styles.patientCondition}>
            {language === 'ar' ? patient.condition : patient.conditionEn}
          </Text>
        </View>
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onAssign(patient.id)}>
              <Icon name="check-circle" size={16} color="#22c55e" />
              <Text style={styles.actionText}>{language === 'ar' ? 'توزيع' : 'Assign'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 12,
  },
  compactCard: {
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  patientInfo: {
    flex: 1,
    marginRight: 10,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  patientAge: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  patientCondition: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
