import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Dialog({ visible, onClose, children }: DialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>{children}</View>
      </View>
    </Modal>
  );
}

const DialogTrigger = ({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);

const DialogClose = ({ onPress, style }: { onPress: () => void; style?: any }) => (
  <TouchableOpacity onPress={onPress} style={[styles.closeButton, style]}>
    <Text style={styles.closeButtonText}>✖️</Text>
  </TouchableOpacity>
);

const DialogContent = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <View style={styles.content}>
    {children}
    <DialogClose onPress={onClose} />
  </View>
);

const DialogHeader = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const DialogFooter = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const DialogTitle = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const DialogDescription = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'stretch',
  },
  content: {
    position: 'relative',
    paddingBottom: 24,
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
    fontSize: 18,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
};

