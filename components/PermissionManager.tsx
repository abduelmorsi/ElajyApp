import React, { useEffect, useState } from 'react';
import { Modal, Alert as RNAlert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalization, useRTL } from './services/LocalizationService';

interface Permission {
  id: string;
  name: string;
  icon: string; // emoji for icon
  description: string;
  required: boolean;
  status: 'granted' | 'denied' | 'prompt' | 'checking';
}


type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking';

interface PermissionManagerProps {
  requiredPermissions: string[];
  onPermissionChange?: (permissionId: string, status: PermissionState) => void;
  onAllPermissionsResolved?: () => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  showInModal?: boolean;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({
  requiredPermissions,
  onPermissionChange,
  onAllPermissionsResolved,
  trigger,
  title,
  description,
  showInModal = true
}) => {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

  // Define all available permissions (use emoji for icons)
  const availablePermissions: Permission[] = [
    {
      id: 'camera',
      name: t('permission.camera'),
      icon: '📷',
      description: t('permission.cameraDesc'),
      required: false,
      status: 'prompt',
    },
    {
      id: 'location',
      name: t('permission.location'),
      icon: '📍',
      description: t('permission.locationDesc'),
      required: false,
      status: 'prompt',
    },
    {
      id: 'notifications',
      name: t('permission.notifications'),
      icon: '🔔',
      description: t('permission.notificationsDesc'),
      required: false,
      status: 'prompt',
    },
    {
      id: 'contacts',
      name: t('permission.contacts'),
      icon: '👤',
      description: t('permission.contactsDesc'),
      required: false,
      status: 'prompt',
    },
    {
      id: 'storage',
      name: t('permission.storage'),
      icon: '💾',
      description: t('permission.storageDesc'),
      required: false,
      status: 'granted',
    },
  ];

  // Initialize permissions based on required list
  useEffect(() => {
    const filteredPermissions = availablePermissions
      .filter(perm => requiredPermissions.includes(perm.id))
      .map(perm => ({
        ...perm,
        required: requiredPermissions.includes(perm.id)
      }));
    
    setPermissions(filteredPermissions);
  }, [requiredPermissions]);

  // Placeholder: In a real app, use react-native-permissions or similar
  const checkPermissionStatus = async (permission: Permission): Promise<PermissionState> => {
    // Always return 'prompt' for demo
    return permission.status;
  };

  // Request permission (placeholder for demo)
  const requestPermission = async (permission: Permission): Promise<PermissionState> => {
    // In a real app, use react-native-permissions or similar
    RNAlert.alert(
      t('permission.requestTitle') || 'Request Permission',
      `${permission.name}: ${permission.description}`,
      [
        { text: t('permission.deny') || 'Deny', onPress: () => {}, style: 'cancel' },
        { text: t('permission.grant') || 'Grant', onPress: () => {} },
      ]
    );
    // Simulate granting permission
    return 'granted';
  };

  // Check all permissions
  const checkAllPermissions = async () => {
    setIsCheckingPermissions(true);
    
    const updatedPermissions = await Promise.all(
      permissions.map(async (permission) => {
        const status = await checkPermissionStatus(permission);
        return { ...permission, status };
      })
    );
    
    setPermissions(updatedPermissions);
    setIsCheckingPermissions(false);
  };

  // Handle permission request
  const handlePermissionRequest = async (permission: Permission) => {
    setPermissions(prev => 
      prev.map(p => 
        p.id === permission.id 
          ? { ...p, status: 'checking' }
          : p
      )
    );

    const newStatus = await requestPermission(permission);
    
    setPermissions(prev => 
      prev.map(p => 
        p.id === permission.id 
          ? { ...p, status: newStatus }
          : p
      )
    );

    onPermissionChange?.(permission.id, newStatus);

    // Check if all required permissions are granted
    const allRequiredGranted = permissions
      .filter(p => p.required)
      .every(p => p.id === permission.id ? newStatus === 'granted' : p.status === 'granted');
    
    if (allRequiredGranted) {
      onAllPermissionsResolved?.();
    }
  };

  // Permission status badge
  const getStatusBadge = (status: PermissionState | 'checking') => {
    switch (status) {
      case 'granted':
        return <Text style={[styles.badge, styles.badgeGranted]}>✅ {language === 'ar' ? 'منح' : 'Granted'}</Text>;
      case 'denied':
        return <Text style={[styles.badge, styles.badgeDenied]}>❌ {language === 'ar' ? 'مرفوض' : 'Denied'}</Text>;
      case 'checking':
        return <Text style={[styles.badge, styles.badgeChecking]}>{language === 'ar' ? 'جاري التحقق...' : 'Checking...'}</Text>;
      default:
        return <Text style={[styles.badge, styles.badgePrompt]}>{language === 'ar' ? 'مطلوب' : 'Required'}</Text>;
    }
  };

  // Permission status icon
  const getStatusIcon = (status: PermissionState | 'checking') => {
    switch (status) {
      case 'granted':
        return <Text style={styles.statusIcon}>✅</Text>;
      case 'denied':
        return <Text style={styles.statusIcon}>❌</Text>;
      case 'checking':
        return <Text style={styles.statusIcon}>⏳</Text>;
      default:
        return <Text style={styles.statusIcon}>⚠️</Text>;
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAllPermissions();
    }
  }, [isOpen]);

  const PermissionContent = () => (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerIconCircle}>
          <Text style={styles.headerShield}>🛡️</Text>
        </View>
        <Text style={styles.headerTitleBox}>
          {title || (language === 'ar' ? 'أذونات التطبيق' : 'App Permissions')}
        </Text>
        <Text style={styles.headerDesc}>
          {description || (language === 'ar' ? 
            'نحتاج هذه الأذونات لتوفير أفضل تجربة للمستخدم' :
            'We need these permissions to provide the best user experience'
          )}
        </Text>
      </View>

      {/* Permission List */}
      {permissions.map((permission) => (
        <View key={permission.id} style={styles.permissionCard}>
          <View style={styles.permissionRow}>
            <View style={styles.permissionIconCircle}>
              <Text style={styles.permissionIcon}>{permission.icon}</Text>
            </View>
            <View style={styles.permissionInfoBox}>
              <View style={styles.permissionTitleRow}>
                <Text style={styles.permissionTitle}>{permission.name}</Text>
                {permission.required && (
                  <Text style={styles.badgeRequired}>{language === 'ar' ? 'مطلوب' : 'Required'}</Text>
                )}
              </View>
              <Text style={styles.permissionDesc}>{permission.description}</Text>
            </View>
            <View style={styles.permissionStatusBox}>
              {getStatusIcon(permission.status)}
              {(permission.status === 'prompt' || permission.status === 'denied') ? (
                <TouchableOpacity
                  style={styles.grantButton}
                  onPress={() => handlePermissionRequest(permission)}
                  disabled={permission.status === 'checking' as PermissionState}
                >
                  <Text style={styles.grantButtonText}>{t('permission.grant')}</Text>
                </TouchableOpacity>
              ) : (
                getStatusBadge(permission.status)
              )}
            </View>
          </View>
        </View>
      ))}

      {/* Info Alert */}
      <View style={styles.infoAlert}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          {language === 'ar' ? 
            'يمكنك تغيير هذه الأذونات في أي وقت من إعدادات التطبيق.' :
            'You can change these permissions anytime in your app settings.'
          }
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.actionButtonOutline]} 
          onPress={checkAllPermissions} 
          disabled={isCheckingPermissions}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonOutlineText]}>
            {isCheckingPermissions ? 'جاري التحقق...' : 'تحديث الحالة'}
          </Text>
        </TouchableOpacity>
        {showInModal && (
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsOpen(false)}>
            <Text style={styles.actionButtonText}>{language === 'ar' ? 'إغلاق' : 'Close'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  if (showInModal) {
    return (
      <>
        {trigger ? (
          <TouchableOpacity onPress={() => setIsOpen(true)}>{trigger}</TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.openButton} onPress={() => setIsOpen(true)}>
            <Text style={styles.openButtonText}>🛡️ {language === 'ar' ? 'إدارة الأذونات' : 'Manage Permissions'}</Text>
          </TouchableOpacity>
        )}
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <PermissionContent />
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return <PermissionContent />;
};


// Hook for easy permission checking (placeholder)
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, PermissionState>>({});

  const checkPermission = async (permissionId: string): Promise<PermissionState> => {
    return 'prompt';
  };

  const requestPermission = async (permissionId: string): Promise<PermissionState> => {
    return 'granted';
  };

  return {
    permissions,
    checkPermission,
    requestPermission
  };
};

// Styles
const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerShield: {
    fontSize: 32,
  },
  headerTitleBox: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
    textAlign: 'center',
  },
  headerDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  permissionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  permissionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permissionIcon: {
    fontSize: 20,
  },
  permissionInfoBox: {
    flex: 1,
  },
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  badgeRequired: {
    fontSize: 12,
    color: '#2563eb',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  permissionDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  permissionStatusBox: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  grantButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 6,
  },
  grantButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  badgeGranted: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
  },
  badgeDenied: {
    backgroundColor: '#fecaca',
    color: '#991b1b',
  },
  badgeChecking: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
  },
  badgePrompt: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
  },
  statusIcon: {
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2563eb',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  actionButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2563eb',
    marginLeft: 0,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionButtonOutlineText: {
    color: '#2563eb',
  },
  openButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    margin: 12,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    overflow: 'hidden',
  },
});

export default PermissionManager;