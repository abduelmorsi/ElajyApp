
import * as React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

// Context to manage popover open state
const PopoverContext = React.createContext({ open: false, setOpen: (_: boolean) => {} });

function Popover({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children, style, ...props }) {
  const { setOpen } = React.useContext(PopoverContext);
  return (
    <TouchableOpacity style={style} onPress={() => setOpen(true)} {...props}>
      {children}
    </TouchableOpacity>
  );
}

function PopoverContent({ children, style, ...props }) {
  const { open, setOpen } = React.useContext(PopoverContext);
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={() => setOpen(false)} />
        <View style={[styles.content, style]} {...props}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function PopoverAnchor({ children, style }) {
  // In React Native, anchor is just a wrapper
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
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
    minWidth: 288,
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
  },
});

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };

