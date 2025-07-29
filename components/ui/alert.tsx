import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  style?: any;
}

const Alert: React.FC<AlertProps> = ({ variant = 'default', children, style }) => (
  <View style={[styles.alert, variant === 'destructive' ? styles.destructive : styles.default, style]}>
    {children}
  </View>
);

const AlertTitle: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const AlertDescription: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  alert: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 2,
  },
  default: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  destructive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
  },
});

export { Alert, AlertDescription, AlertTitle };

