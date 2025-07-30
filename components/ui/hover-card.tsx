
import * as React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

// Custom HoverCard for React Native: uses tap/long-press to show content in a modal

type HoverCardContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const HoverCardContext = React.createContext<HoverCardContextType>({ open: false, setOpen: () => {} });


type HoverCardProps = {
  children: React.ReactNode;
};
function HoverCard({ children }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      {children}
    </HoverCardContext.Provider>
  );
}


type HoverCardTriggerProps = {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
};
function HoverCardTrigger({ children, style, ...props }: HoverCardTriggerProps) {
  const { setOpen } = React.useContext(HoverCardContext);
  // Use long press to open hover card (or tap for demo)
  return (
    <TouchableOpacity
      onLongPress={() => setOpen(true)}
      onPress={() => setOpen(true)}
      style={style}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}


type HoverCardContentProps = {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
};
function HoverCardContent({ children, style, ...props }: HoverCardContentProps) {
  const { open, setOpen } = React.useContext(HoverCardContext);
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    minWidth: 256,
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
  },
});

export { HoverCard, HoverCardContent, HoverCardTrigger };

