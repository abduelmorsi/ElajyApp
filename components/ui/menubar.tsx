
import * as React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Emoji icons for check, chevron, and circle
const CheckIcon = () => <Text style={styles.icon}>✔️</Text>;
const ChevronRightIcon = () => <Text style={styles.icon}>▶️</Text>;
const CircleIcon = () => <Text style={styles.icon}>●</Text>;

// Menubar root
function Menubar({ style, children }) {
  return (
    <View style={[styles.menubar, style]}>{children}</View>
  );
}


function MenubarMenu({ children }) {
  return <View>{children}</View>;
}


function MenubarGroup({ children }) {
  return <View style={styles.group}>{children}</View>;
}


function MenubarPortal({ children }) {
  return <View>{children}</View>;
}


function MenubarRadioGroup({ children }) {
  return <View style={styles.radioGroup}>{children}</View>;
}


function MenubarTrigger({ children, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress}>
      <Text style={styles.triggerText}>{children}</Text>
    </TouchableOpacity>
  );
}


function MenubarContent({ visible, onRequestClose, children, style }) {
  // Use Modal for menu content
  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={onRequestClose} />
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </Modal>
  );
}


function MenubarItem({ children, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress}>
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
}


function MenubarCheckboxItem({ children, checked, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress}>
      {checked ? <CheckIcon /> : <Text style={styles.iconPlaceholder}> </Text>}
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
}


function MenubarRadioItem({ children, selected, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress}>
      {selected ? <CircleIcon /> : <Text style={styles.iconPlaceholder}> </Text>}
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
}


function MenubarLabel({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}


function MenubarSeparator({ style }) {
  return <View style={[styles.separator, style]} />;
}


function MenubarShortcut({ children, style }) {
  return <Text style={[styles.shortcut, style]}>{children}</Text>;
}


function MenubarSub({ children }) {
  return <View style={styles.sub}>{children}</View>;
}


function MenubarSubTrigger({ children, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.subTrigger, style]} onPress={onPress}>
      <Text style={styles.itemText}>{children}</Text>
      <ChevronRightIcon />
    </TouchableOpacity>
  );
}


function MenubarSubContent({ visible, onRequestClose, children, style }) {
  // Use Modal for sub menu content
  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={onRequestClose} />
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  menubar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    gap: 4,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trigger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    marginHorizontal: 2,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    minWidth: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginVertical: 2,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 15,
    color: '#222',
    marginLeft: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 2,
  },
  iconPlaceholder: {
    width: 18,
    height: 18,
    marginRight: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
    marginHorizontal: -4,
  },
  shortcut: {
    fontSize: 12,
    color: '#888',
    marginLeft: 'auto',
    letterSpacing: 1,
  },
  sub: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 4,
  },
  subTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    marginVertical: 2,
  },
});

export {
  Menubar, MenubarCheckboxItem, MenubarContent,
  MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup,
  MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger
};

