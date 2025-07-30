
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPriorityColor } from './donationHelpers';

interface PatientCardProps {
  patient: any;
  onView: (patient: any) => void;
  onAssign: (patientId: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function PatientCard({ patient, onView, onAssign, showActions, compact }: PatientCardProps) {
  // TODO: Add localization and RTL support when hooks are available
  const language = 'ar'; // fallback for now
  const isRTL = false;
  const priorityColor = getPriorityColor(language === 'ar' ? patient.medicalPriority : patient.medicalPriorityEn);

  return (
    <View style={styles.card}>
      <View style={[styles.inner, compact ? styles.compactPadding : styles.regularPadding]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <View style={[styles.nameRow, isRTL && styles.rowReverse]}>
              <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
                {language === 'ar' ? patient.name : patient.nameEn}
              </Text>
              <View style={[styles.infoRow, isRTL && styles.rowReverse]}>
                <Text style={styles.ageBadge}>
                  {language === 'ar' ? 'العمر:' : 'Age:'} {patient.age}
                </Text>
                <Text style={[styles.priorityBadge, priorityColor && { backgroundColor: priorityColor }]}> 
                  {language === 'ar' ? patient.medicalPriority : patient.medicalPriorityEn}
                </Text>
              </View>
            </View>
          </View>
          {showActions && (
            <View style={[styles.actionsRow, isRTL && styles.rowReverse]}>
              <TouchableOpacity
                style={[styles.actionButton, compact ? styles.actionButtonCompact : styles.actionButtonRegular]}
                onPress={() => onView(patient)}
              >
                <Text style={styles.actionIcon}>👁️</Text>
                <Text style={styles.actionText}>{language === 'ar' ? 'عرض' : 'View'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.assignButton, compact ? styles.actionButtonCompact : styles.actionButtonRegular]}
                onPress={() => onAssign(patient.id)}
              >
                <Text style={styles.actionIcon}>✅</Text>
                <Text style={styles.actionText}>{language === 'ar' ? 'توزيع' : 'Assign'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          {/* Medical Condition */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{language === 'ar' ? 'الحالة الطبية:' : 'Medical Condition:'}</Text>
            <Text style={[styles.detailValue, language === 'ar' ? styles.textRight : styles.textLeft]} numberOfLines={1}>
              {language === 'ar' ? patient.condition : patient.conditionEn}
            </Text>
          </View>
          {/* Financial Status */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{language === 'ar' ? 'الوضع المالي:' : 'Financial Status:'}</Text>
            <Text style={[styles.detailValue, language === 'ar' ? styles.textRight : styles.textLeft]} numberOfLines={1}>
              {language === 'ar' ? patient.financialStatus : patient.financialStatusEn}
            </Text>
          </View>
          {/* Notes */}
          {patient.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>{language === 'ar' ? 'ملاحظات:' : 'Notes:'}</Text>
              <View style={styles.notesBox}>
                <Text style={[styles.notesText, language === 'ar' ? styles.textRight : styles.textLeft]}>{patient.notes}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
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
  inner: {
    flex: 1,
  },
  compactPadding: {
    padding: 12,
  },
  regularPadding: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  name: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    flexShrink: 1,
    marginRight: 8,
    marginLeft: 0,
  },
  nameCompact: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ageBadge: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  priorityBadge: {
    fontSize: 12,
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    backgroundColor: '#2563eb',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
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
  actionButtonRegular: {
    height: 32,
  },
  actionButtonCompact: {
    height: 28,
  },
  assignButton: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  actionIcon: {
    fontSize: 13,
    marginRight: 4,
    color: '#2563eb',
  },
  actionText: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
  },
  detailsSection: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#222',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  notesSection: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notesBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  notesText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
});
