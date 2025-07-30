import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

function Drawer({ visible, onClose, children }: DrawerProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.drawer}>{children}</View>
      </View>
    </Modal>
  );
}

const DrawerTrigger = ({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);

const DrawerClose = ({ onPress, style }: { onPress: () => void; style?: any }) => (
  <TouchableOpacity onPress={onPress} style={[styles.closeButton, style]}>
                <Icon name="close" size={20} color="#666" />
  </TouchableOpacity>
);

const DrawerContent = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <View style={styles.content}>
    <View style={styles.handle} />
    {children}
    <DrawerClose onPress={onClose} />
  </View>
);

const DrawerHeader = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const DrawerFooter = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const DrawerTitle = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const DrawerDescription = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    width: '100%',
    minHeight: 180,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'stretch',
  },
  content: {
    position: 'relative',
    paddingBottom: 24,
  },
  handle: {
    width: 100,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#888',
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export {
  Drawer, DrawerClose,
  DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger
};

