import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

type ContextMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: { label: string; onPress: () => void; checked?: boolean; radio?: boolean; destructive?: boolean; shortcut?: string; group?: string; }[];
  title?: string;
};

function ContextMenu({ visible, onClose, items, title }: ContextMenuProps): React.ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {title && <Text style={styles.menuTitle}>{title}</Text>}
          {items.map((item, idx) => (
            <ContextMenuItem
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

const ContextMenuTrigger = ({ children, onLongPress, style }: { children: React.ReactNode; onLongPress: () => void; style?: any }): React.ReactElement => (
  <TouchableOpacity onLongPress={onLongPress} style={style}>
    {children}
  </TouchableOpacity>
);

const ContextMenuItem = ({ label, onPress, checked, radio, destructive, shortcut }: { label: string; onPress: () => void; checked?: boolean; radio?: boolean; destructive?: boolean; shortcut?: string }): React.ReactElement => (
  <TouchableOpacity onPress={onPress} style={[styles.menuItem, destructive && styles.menuItemDestructive]}>
    {checked ? <Icon name="check" size={16} color="#22c55e" style={styles.menuIcon} /> : radio ? <Icon name="radio-button-checked" size={16} color="#007bff" style={styles.menuIcon} /> : <View style={styles.menuIcon} />}
    <Text style={[styles.menuItemLabel, destructive && styles.menuItemLabelDestructive]}>{label}</Text>
    {shortcut && <Text style={styles.menuShortcut}>{shortcut}</Text>}
  </TouchableOpacity>
);

const ContextMenuCheckboxItem = ({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }): React.ReactElement => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    {checked ? <Icon name="check" size={16} color="#22c55e" style={styles.menuIcon} /> : <View style={styles.menuIcon} />}
    <Text style={styles.menuItemLabel}>{label}</Text>
  </TouchableOpacity>
);

const ContextMenuRadioItem = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }): React.ReactElement => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    {selected ? <Icon name="radio-button-checked" size={16} color="#007bff" style={styles.menuIcon} /> : <Icon name="radio-button-unchecked" size={16} color="#ccc" style={styles.menuIcon} />}
    <Text style={styles.menuItemLabel}>{label}</Text>
  </TouchableOpacity>
);

const ContextMenuLabel = ({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement => (
  <Text style={[styles.menuLabel, style]}>{children}</Text>
);

const ContextMenuSeparator = (): React.ReactElement => <View style={styles.menuSeparator} />;

const ContextMenuShortcut = ({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement => (
  <Text style={[styles.menuShortcut, style]}>{children}</Text>
);

const ContextMenuGroup = ({ children, label }: { children: React.ReactNode; label?: string }): React.ReactElement => (
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
  ContextMenu, ContextMenuCheckboxItem, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator,
  ContextMenuShortcut, ContextMenuTrigger
};

// Export alias for compatibility
export const ContextMenuContent = ContextMenu;
