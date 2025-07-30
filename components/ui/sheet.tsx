
import * as React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Emoji for close icon
const XIcon = (): React.ReactElement => <Text style={styles.closeIcon}>✖️</Text>;

const SheetContext = React.createContext({ open: false, setOpen: (_: boolean) => {} });

function Sheet({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <TouchableOpacity style={style} onPress={() => setOpen(true)}>
      {children}
    </TouchableOpacity>
  );
}

function SheetClose({ children, style }: { children?: React.ReactNode; style?: any }): React.ReactElement {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <TouchableOpacity style={style} onPress={() => setOpen(false)}>
      {children || <XIcon />}
    </TouchableOpacity>
  );
}

function SheetContent({ children, side = "right", style }: { children: React.ReactNode; side?: "right" | "left" | "top" | "bottom"; style?: any }): React.ReactElement {
  const { open, setOpen } = React.useContext(SheetContext);
  // Merge base content style with side-specific style
  let contentStyle = styles.content;
  if (side === "right") contentStyle = { ...styles.content, ...styles.contentRight };
  else if (side === "left") contentStyle = { ...styles.content, ...styles.contentLeft };
  else if (side === "top") contentStyle = { ...styles.content, ...styles.contentTop };
  else if (side === "bottom") contentStyle = { ...styles.content, ...styles.contentBottom };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)} />
      <View style={[contentStyle, style]}>
        <View style={styles.closeWrap}>
          <SheetClose />
        </View>
        {children}
      </View>
    </Modal>
  );
}

function SheetHeader({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <View style={[styles.header, style]}>{children}</View>;
}

function SheetFooter({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <View style={[styles.footer, style]}>{children}</View>;
}

function SheetTitle({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

function SheetDescription({ children, style }: { children: React.ReactNode; style?: any }): React.ReactElement {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50,
  },
  content: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    padding: 20,
    minWidth: 280,
    minHeight: 120,
  },
  contentRight: {
    right: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    position: 'absolute',
  },
  contentLeft: {
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    position: 'absolute',
  },
  contentTop: {
    left: 0,
    top: 0,
    right: 0,
    height: 220,
    position: 'absolute',
  },
  contentBottom: {
    left: 0,
    bottom: 0,
    right: 0,
    height: 220,
    position: 'absolute',
  },
  closeWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 22,
    color: '#888',
  },
  header: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
});

export {
  Sheet, SheetClose,
  SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger
};

