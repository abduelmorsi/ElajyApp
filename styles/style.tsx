// styles.tsx
import { StyleSheet, I18nManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ==================== THEME CONSTANTS ====================
export const lightTheme = {
  fontSize: 14,
  background: '#ffffff',
  foreground: '#1f2937',
  card: '#ffffff',
  cardForeground: '#1f2937',
  popover: '#ffffff',
  popoverForeground: '#1f2937',
  primary: '#49C5B8',
  primaryForeground: '#ffffff',
  secondary: '#f8fafc',
  secondaryForeground: '#475569',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#475569',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0',
  input: 'transparent',
  inputBackground: '#ffffff',
  switchBackground: '#e2e8f0',
  success: '#059669',
  successForeground: '#ffffff',
  warning: '#d97706',
  warningForeground: '#ffffff',
  info: '#0284c7',
  infoForeground: '#ffffff',
  healthStatusGood: '#10b981',
  healthStatusWarning: '#f59e0b',
  healthStatusError: '#ef4444',
  healthStatusInfo: '#3b82f6',
  ring: '#49C5B8',
  chart1: '#49C5B8',
  chart2: '#059669',
  chart3: '#7c3aed',
  chart4: '#dc2626',
  chart5: '#d97706',
  chart6: '#0284c7',
  radius: 12, // 0.75rem ≈ 12px
  radiusCard: 16, // 1rem ≈ 16px
  radiusButton: 8, // 0.5rem ≈ 8px
  sidebar: '#ffffff',
  sidebarForeground: '#1f2937',
  sidebarPrimary: '#49C5B8',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f8fafc',
  sidebarAccentForeground: '#475569',
  sidebarBorder: '#e2e8f0',
  sidebarRing: '#49C5B8',
  
  // Derived values
  radiusSm: 8,  // (12 - 4)
  radiusMd: 10, // (12 - 2)
  radiusLg: 12,
  radiusXl: 16, // (12 + 4)
  radius2xl: 16,
};

export const darkTheme = {
  ...lightTheme,
  background: '#0f172a',
  foreground: '#f1f5f9',
  card: '#1e293b',
  cardForeground: '#f1f5f9',
  popover: '#1e293b',
  popoverForeground: '#f1f5f9',
  primary: '#49C5B8',
  primaryForeground: '#0f172a',
  secondary: '#1e293b',
  secondaryForeground: '#f1f5f9',
  muted: '#1e293b',
  mutedForeground: '#94a3b8',
  accent: '#1e293b',
  accentForeground: '#f1f5f9',
  border: '#334155',
  input: '#334155',
  ring: '#49C5B8',
  sidebar: '#1e293b',
  sidebarForeground: '#f1f5f9',
  sidebarPrimary: '#49C5B8',
  sidebarPrimaryForeground: '#0f172a',
  sidebarAccent: '#334155',
  sidebarAccentForeground: '#f1f5f9',
  sidebarBorder: '#334155',
  sidebarRing: '#49C5B8',
};

// ==================== BASE STYLES ====================
export const baseStyles = StyleSheet.create({
  body: {
    backgroundColor: lightTheme.background,
    color: lightTheme.foreground,
    lineHeight: 1.6,
  },
  h1: {
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 1.3,
    letterSpacing: -0.25,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 1.5,
  },
  p: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 1.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 1.5,
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 1.4,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 1.5,
  },
});

// ==================== UTILITY STYLES ====================
export const utilityStyles = (theme) => StyleSheet.create({
  // Status indicators
  statusSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    color: '#16a34a',
    borderRadius: 8,
    padding: 8,
  },
  statusWarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    color: '#d97706',
    borderRadius: 8,
    padding: 8,
  },
  statusError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    color: '#dc2626',
    borderRadius: 8,
    padding: 8,
  },
  statusInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    color: '#2563eb',
    borderRadius: 8,
    padding: 8,
  },

  // Cards
  cardClean: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusCard,
    borderColor: theme.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardSubtle: {
    backgroundColor: theme.muted,
    borderRadius: theme.radiusCard,
    borderColor: theme.border,
    borderWidth: 1,
  },

  // Highlights
  highlightPrimary: {
    backgroundColor: 'rgba(8, 145, 178, 0.05)',
    borderColor: 'rgba(8, 145, 178, 0.2)',
    borderWidth: 1,
    color: theme.primary,
    borderRadius: 8,
  },

  // Interactive effects
  hoverLift: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    transform: [{ translateY: -2 }],
  },
  focusRing: {
    borderColor: theme.ring,
    borderWidth: 2,
    borderRadius: theme.radius,
  },

  // Layout
  flexRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  justifyStart: {
    justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  justifyEnd: {
    justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',
  },
  itemsStart: {
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  itemsEnd: {
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
  },
  textLeft: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  textRight: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },

  // Category cards
  categoryCard: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusCard,
    borderColor: theme.border,
    borderWidth: 1,
    padding: 16,
  },
  categoryCardActive: {
    borderColor: theme.primary,
    backgroundColor: 'rgba(8, 145, 178, 0.05)',
  },

  // Notification
  notificationDismissible: {
    paddingRight: 32,
  },
  notificationDismissBtn: {
    position: 'absolute',
    top: 8,
    right: I18nManager.isRTL ? undefined : 8,
    left: I18nManager.isRTL ? 8 : undefined,
  },

  // Map
  mapContainer: {
    borderRadius: theme.radius,
    overflow: 'hidden',
    borderColor: theme.border,
    borderWidth: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: I18nManager.isRTL ? undefined : 16,
    right: I18nManager.isRTL ? 16 : undefined,
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Donation card
  donationCard: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusCard,
    borderColor: theme.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  donationCardSelected: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  demandIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    fontSize: 12,
    fontWeight: '500',
  },
});

// ==================== BACKGROUND PATTERNS ====================
export function SudanesePattern({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff']}
      style={style}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
      {/* Actual pattern implementation would require SVG or custom drawing */}
    </LinearGradient>
  );
}

export function GeometricPattern({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <LinearGradient
      colors={['#f8fafc', '#f8fafc']}
      style={style}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

// ==================== ANIMATIONS ====================
export const shimmerAnimation = {
  toValue: 1,
  duration: 2000,
  useNativeDriver: true,
};

export const fadeInAnimation = {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
};

// Initial values for animations
export const initialShimmerValue = { x: -200 };
export const initialFadeInValue = { 
  opacity: 0,
  translateY: 10,
};

// Animation styles
export const animatedStyles = (animations) => ({
  shimmer: {
    transform: [{ translateX: animations.shimmer.x }],
  },
  fadeIn: {
    opacity: animations.fadeIn.opacity,
    transform: [{ translateY: animations.fadeIn.translateY }],
  },
});

// ==================== RTL UTILITIES ====================
export const rtlStyles = StyleSheet.create({
  row: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  spaceX1: {
    marginRight: I18nManager.isRTL ? 0 : 4,
    marginLeft: I18nManager.isRTL ? 4 : 0,
  },
  spaceX2: {
    marginRight: I18nManager.isRTL ? 0 : 8,
    marginLeft: I18nManager.isRTL ? 8 : 0,
  },
  spaceX3: {
    marginRight: I18nManager.isRTL ? 0 : 12,
    marginLeft: I18nManager.isRTL ? 12 : 0,
  },
  spaceX4: {
    marginRight: I18nManager.isRTL ? 0 : 16,
    marginLeft: I18nManager.isRTL ? 16 : 0,
  },
});

// ==================== HEALTH COLORS ====================
export const healthColors = {
  good: lightTheme.healthStatusGood,
  warning: lightTheme.healthStatusWarning,
  error: lightTheme.healthStatusError,
  info: lightTheme.healthStatusInfo,
};

// ==================== CHART COLORS ====================
export const chartColors = [
  lightTheme.chart1,
  lightTheme.chart2,
  lightTheme.chart3,
  lightTheme.chart4,
  lightTheme.chart5,
  lightTheme.chart6,
];

// ==================== FONT LOADING ====================
// Note: React Native handles fonts differently. You'll need to:
// 1. Install fonts: `expo install expo-font @expo-google-fonts/inter @expo-google-fonts/noto-sans-arabic`
// 2. Load fonts in your app

import * as Font from 'expo-font';
export const loadFonts = async () => {
  await Font.loadAsync({
    'Inter': require('@expo-google-fonts/inter'),
    'NotoSansArabic': require('@expo-google-fonts/noto-sans-arabic'),
  });
};

export const fontFamily = I18nManager.isRTL 
  ? 'NotoSansArabic, Cairo, Amiri, system-ui'
  : 'Inter, system-ui';