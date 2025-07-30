import * as React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

type TooltipContextType = {
  show: (tooltipContent: React.ReactNode) => void;
  hide: () => void;
  visible: boolean;
  content: React.ReactNode;
};

const TooltipContext = React.createContext<TooltipContextType>({
  show: () => {},
  hide: () => {},
  visible: false,
  content: null,
});


type TooltipProviderProps = { children: React.ReactNode };
const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [visible, setVisible] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const show = (tooltipContent: React.ReactNode) => {
    setContent(tooltipContent);
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
    setContent(null);
  };
  return (
    <TooltipContext.Provider value={{ show, hide, visible, content }}>
      {children}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={hide}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipText}>{content}</Text>
          </View>
        </View>
      </Modal>
    </TooltipContext.Provider>
  );
};


type TooltipProps = { children: React.ReactElement; content: React.ReactNode };
const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  // Usage: <Tooltip content="Tooltip text"><TouchableOpacity>...</TouchableOpacity></Tooltip>
  return (
    <TooltipContext.Consumer>
      {({ show, hide }) => {
        // Only add handlers if child is a Touchable* (cast as React.ReactElement<any>)
        if (React.isValidElement(children)) {
          return React.cloneElement(children as React.ReactElement<any>, {
            onLongPress: () => show(content),
            onPressOut: hide,
          });
        }
        return children;
      }}
    </TooltipContext.Consumer>
  );
};


type TooltipTriggerProps = { children: React.ReactElement; [key: string]: any };
const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, ...props }) => {
  // This is just a wrapper for the trigger element
  return React.cloneElement(children, props);
};


const TooltipContent: React.FC = () => {
  // Content is handled by the provider modal
  return null;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tooltipContent: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 240,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
  },
});

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

