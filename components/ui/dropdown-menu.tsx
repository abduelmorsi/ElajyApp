import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DropdownMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: { label: string; onPress: () => void; checked?: boolean; radio?: boolean; destructive?: boolean; shortcut?: string; group?: string; }[];
  title?: string;
};

function DropdownMenu({ visible, onClose, items, title }: DropdownMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {title && <Text style={styles.menuTitle}>{title}</Text>}
          {items.map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              label={item.label}
              onPress={() => { item.onPress(); onClose(); }}
              checked={item.checked}
              radio={item.radio}
              destructive={item.destructive}
              shortcut={item.shortcut}
            />
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const DropdownMenuTrigger = ({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);

const DropdownMenuItem = ({ label, onPress, checked, radio, destructive, shortcut }: { label: string; onPress: () => void; checked?: boolean; radio?: boolean; destructive?: boolean; shortcut?: string }) => (
  <TouchableOpacity onPress={onPress} style={[styles.menuItem, destructive && styles.menuItemDestructive]}>
          {checked ? <Text style={styles.menuIcon}>✔️</Text> : radio ? <Text style={styles.menuIcon}>◉</Text> : <Text style={styles.menuIcon}> </Text>}
    <Text style={[styles.menuItemLabel, destructive && styles.menuItemLabelDestructive]}>{label}</Text>
    {shortcut && <Text style={styles.menuShortcut}>{shortcut}</Text>}
  </TouchableOpacity>
);

const DropdownMenuCheckboxItem = ({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <Text style={styles.menuIcon}>{checked ? "✔️" : ""}</Text>
    <Text style={styles.menuItemLabel}>{label}</Text>
  </TouchableOpacity>
);

const DropdownMenuRadioItem = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <Text style={styles.menuIcon}>{selected ? "◉" : "○"}</Text>
    <Text style={styles.menuItemLabel}>{label}</Text>
  </TouchableOpacity>
);

const DropdownMenuLabel = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.menuLabel, style]}>{children}</Text>
);

const DropdownMenuSeparator = () => <View style={styles.menuSeparator} />;

const DropdownMenuShortcut = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.menuShortcut, style]}>{children}</Text>
);

const DropdownMenuGroup = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <View style={styles.menuGroup}>
    {label && <Text style={styles.menuGroupLabel}>{label}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 220,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'stretch',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 2,
    backgroundColor: '#f7f7f7',
  },
  menuItemDestructive: {
    backgroundColor: '#ffeaea',
  },
  menuItemLabel: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  menuItemLabelDestructive: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  menuIcon: {
    width: 22,
    textAlign: 'center',
    fontSize: 16,
    marginRight: 6,
  },
  menuShortcut: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
    letterSpacing: 1,
  },
  menuLabel: {
    color: '#666',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
  menuGroup: {
    marginVertical: 8,
  },
  menuGroupLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 15,
  },
});

export {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuTrigger
};

