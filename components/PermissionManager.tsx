import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Bell, 
  ContactRound, 
  HardDrive,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useLocalization, useRTL } from './services/LocalizationService';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  required: boolean;
  status: 'granted' | 'denied' | 'prompt' | 'checking';
  apiName?: PermissionName;
  customCheck?: () => Promise<PermissionState>;
}

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

  // Define all available permissions
  const availablePermissions: Permission[] = [
    {
      id: 'camera',
      name: t('permission.camera'),
      icon: Camera,
      description: t('permission.cameraDesc'),
      required: false,
      status: 'prompt',
      customCheck: async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          return 'granted' as PermissionState;
        } catch (error) {
          if (error.name === 'NotAllowedError') return 'denied' as PermissionState;
          return 'prompt' as PermissionState;
        }
      }
    },
    {
      id: 'location',
      name: t('permission.location'),
      icon: MapPin,
      description: t('permission.locationDesc'),
      required: false,
      status: 'prompt',
      apiName: 'geolocation' as PermissionName
    },
    {
      id: 'notifications',
      name: t('permission.notifications'),
      icon: Bell,
      description: t('permission.notificationsDesc'),
      required: false,
      status: 'prompt',
      customCheck: async () => {
        if (!('Notification' in window)) return 'denied' as PermissionState;
        return Notification.permission as PermissionState;
      }
    },
    {
      id: 'contacts',
      name: t('permission.contacts'),
      icon: ContactRound,
      description: t('permission.contactsDesc'),
      required: false,
      status: 'prompt'
    },
    {
      id: 'storage',
      name: t('permission.storage'),
      icon: HardDrive,
      description: t('permission.storageDesc'),
      required: false,
      status: 'granted' // Usually granted by default
    }
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

  // Check current permission status
  const checkPermissionStatus = async (permission: Permission): Promise<PermissionState> => {
    try {
      if (permission.customCheck) {
        return await permission.customCheck();
      }

      if (permission.apiName && 'permissions' in navigator) {
        const result = await navigator.permissions.query({ name: permission.apiName });
        return result.state;
      }

      return 'prompt';
    } catch (error) {
      console.warn(`Could not check permission for ${permission.id}:`, error);
      return 'prompt';
    }
  };

  // Request permission
  const requestPermission = async (permission: Permission): Promise<PermissionState> => {
    try {
      switch (permission.id) {
        case 'camera':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            toast.success(t('permission.cameraGranted') || 'Camera access granted');
            return 'granted';
          } catch (error) {
            if (error.name === 'NotAllowedError') {
              toast.error(t('permission.cameraDenied') || 'Camera access denied');
              return 'denied';
            }
            throw error;
          }

        case 'location':
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              () => {
                toast.success(t('permission.locationGranted') || 'Location access granted');
                resolve('granted');
              },
              (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                  toast.error(t('permission.locationDenied') || 'Location access denied');
                  resolve('denied');
                } else {
                  resolve('prompt');
                }
              },
              { timeout: 10000 }
            );
          });

        case 'notifications':
          if (!('Notification' in window)) {
            toast.error(t('permission.notificationsNotSupported') || 'Notifications not supported');
            return 'denied';
          }
          
          const result = await Notification.requestPermission();
          if (result === 'granted') {
            toast.success(t('permission.notificationsGranted') || 'Notifications enabled');
          } else {
            toast.error(t('permission.notificationsDenied') || 'Notifications denied');
          }
          return result as PermissionState;

        case 'contacts':
          // This is usually handled by the browser automatically
          toast.info(t('permission.contactsInfo') || 'Contacts access will be requested when needed');
          return 'granted';

        case 'storage':
          // Storage is usually granted by default
          return 'granted';

        default:
          return 'prompt';
      }
    } catch (error) {
      console.error(`Error requesting permission for ${permission.id}:`, error);
      toast.error(t('permission.requestError') || 'Error requesting permission');
      return 'denied';
    }
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
        return <Badge className="bg-success text-success-foreground"><CheckCircle size={12} className="mr-1" />منح</Badge>;
      case 'denied':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />مرفوض</Badge>;
      case 'checking':
        return <Badge variant="outline">جاري التحقق...</Badge>;
      default:
        return <Badge variant="outline">مطلوب</Badge>;
    }
  };

  // Permission status icon
  const getStatusIcon = (status: PermissionState | 'checking') => {
    switch (status) {
      case 'granted':
        return <CheckCircle size={16} className="text-success" />;
      case 'denied':
        return <XCircle size={16} className="text-destructive" />;
      case 'checking':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle size={16} className="text-warning" />;
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAllPermissions();
    }
  }, [isOpen]);

  const PermissionContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">
          {title || (language === 'ar' ? 'أذونات التطبيق' : 'App Permissions')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description || (language === 'ar' ? 
            'نحتاج هذه الأذونات لتوفير أفضل تجربة للمستخدم' :
            'We need these permissions to provide the best user experience'
          )}
        </p>
      </div>

      {/* Permission List */}
      <div className="space-y-3">
        {permissions.map((permission) => {
          const Icon = permission.icon;
          return (
            <Card key={permission.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{permission.name}</h4>
                      {permission.required && (
                        <Badge variant="outline" className="text-xs">مطلوب</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {permission.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-3">
                  {getStatusIcon(permission.status)}
                  {permission.status === 'prompt' || permission.status === 'denied' ? (
                    <Button
                      size="sm"
                      onClick={() => handlePermissionRequest(permission)}
                      disabled={permission.status === 'checking'}
                    >
                      {t('permission.grant')}
                    </Button>
                  ) : (
                    getStatusBadge(permission.status)
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Alert */}
      <Alert className="border-info/20 bg-info/10">
        <Info size={16} className="text-info" />
        <AlertDescription className="text-info">
          {language === 'ar' ? 
            'يمكنك تغيير هذه الأذونات في أي وقت من إعدادات المتصفح.' :
            'You can change these permissions anytime in your browser settings.'
          }
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button 
          onClick={checkAllPermissions} 
          variant="outline" 
          disabled={isCheckingPermissions}
          className="flex-1"
        >
          {isCheckingPermissions ? 'جاري التحقق...' : 'تحديث الحالة'}
        </Button>
        {showInModal && (
          <Button onClick={() => setIsOpen(false)} className="flex-1">
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        )}
      </div>
    </div>
  );

  if (showInModal) {
    return (
      <>
        {trigger ? (
          <div onClick={() => setIsOpen(true)}>
            {trigger}
          </div>
        ) : (
          <Button onClick={() => setIsOpen(true)}>
            <Shield size={16} className={getMargin('0', '2')} />
            {language === 'ar' ? 'إدارة الأذونات' : 'Manage Permissions'}
          </Button>
        )}
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <PermissionContent />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <PermissionContent />;
};

// Hook for easy permission checking
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, PermissionState>>({});

  const checkPermission = async (permissionId: string): Promise<PermissionState> => {
    // Implementation would check specific permission
    return 'prompt';
  };

  const requestPermission = async (permissionId: string): Promise<PermissionState> => {
    // Implementation would request specific permission
    return 'granted';
  };

  return {
    permissions,
    checkPermission,
    requestPermission
  };
};

export default PermissionManager;