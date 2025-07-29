
import * as React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Emoji for chevron down
const ChevronDownIcon = () => <Text style={styles.icon}>▼</Text>;

function NavigationMenu({ style, children, viewport = true }: { style?: any; children: React.ReactNode; viewport?: boolean }): React.ReactElement {
  return (
    <View style={[styles.menu, style]}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </View>
  );
}


function NavigationMenuList({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <View style={[styles.menuList, style]}>{children}</View>;
}


function NavigationMenuItem({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <View style={style}>{children}</View>;
}


// ...existing code...


function NavigationMenuTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }): React.ReactElement {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress}>
      <Text style={styles.triggerText}>{children}</Text>
      <ChevronDownIcon />
    </TouchableOpacity>
  );
}


function NavigationMenuContent({ visible, onRequestClose, children, style }: { visible: boolean; onRequestClose: () => void; children: React.ReactNode; style?: any }): React.ReactElement {
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


function NavigationMenuViewport({ style }: { style?: any }): React.ReactElement {
  // Just a styled View for viewport
  return <View style={[styles.viewport, style]} />;
}


function NavigationMenuLink({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }): React.ReactElement {
  return (
    <TouchableOpacity style={[styles.link, style]} onPress={onPress}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  );
}


function NavigationMenuIndicator({ style }: { style?: any }): React.ReactElement {
  // Simple indicator: a small square rotated 45deg
  return (
    <View style={[styles.indicatorWrap, style]}>
      <View style={styles.indicator} />
    </View>
  );
}


const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  menuList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 4, // Not supported in React Native
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginRight: 4,
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
    minWidth: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
  },
  viewport: {
    width: '100%',
    minHeight: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 8,
  },
  link: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    marginVertical: 2,
  },
  linkText: {
    fontSize: 15,
    color: '#222',
  },
  indicatorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    backgroundColor: '#e5e7eb',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    fontSize: 14,
    marginLeft: 2,
  },
});
const navigationMenuTriggerStyle = styles.trigger;

export {
  NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport
};

