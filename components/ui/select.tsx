
import * as React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Emoji icons for select
const CheckIcon = () => <Text style={styles.icon}>✔️</Text>;
const ChevronDownIcon = () => <Text style={styles.icon}>▼</Text>;
const ChevronUpIcon = () => <Text style={styles.icon}>▲</Text>;

// Context for select state
const SelectContext = React.createContext({ open: false, setOpen: (_: boolean) => {}, value: null, setValue: (_: any) => {} });

function Select({ value, onValueChange, children, style }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(value ?? null);

  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleValueChange = (val) => {
    setSelected(val);
    if (onValueChange) onValueChange(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value: selected, setValue: handleValueChange }}>
      <View style={style}>{children}</View>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children, style }) {
  const { setOpen, value } = React.useContext(SelectContext);
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={() => setOpen(true)}>
      <Text style={styles.triggerText}>{children || value || "Select..."}</Text>
      <ChevronDownIcon />
    </TouchableOpacity>
  );
}

function SelectContent({ children, style }) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={() => setOpen(false)} />
        <View style={[styles.content, style]}>
          <ScrollView>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SelectGroup({ children, style }) {
  return <View style={style}>{children}</View>;
}

function SelectItem({ value, children, style }) {
  const { value: selected, setValue } = React.useContext(SelectContext);
  const isActive = selected === value;
  return (
    <TouchableOpacity style={[styles.item, isActive && styles.itemActive, style]} onPress={() => setValue(value)}>
      <Text style={[styles.itemText, isActive && styles.itemTextActive]}>{children}</Text>
      {isActive && <CheckIcon />}
    </TouchableOpacity>
  );
}

function SelectLabel({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

function SelectSeparator({ style }) {
  return <View style={[styles.separator, style]} />;
}

function SelectScrollUpButton() {
  return (
    <View style={styles.scrollButton}><ChevronUpIcon /></View>
  );
}

function SelectScrollDownButton() {
  return (
    <View style={styles.scrollButton}><ChevronDownIcon /></View>
  );
}

function SelectValue({ children, style }) {
  const { value } = React.useContext(SelectContext);
  return <Text style={style}>{children || value || "Select..."}</Text>;
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
    marginVertical: 4,
  },
  triggerText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
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
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
    maxHeight: 320,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
    backgroundColor: '#fff',
  },
  itemActive: {
    backgroundColor: '#e5f0ff',
  },
  itemText: {
    fontSize: 15,
    color: '#222',
  },
  itemTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 13,
    color: '#888',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  scrollButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  icon: {
    fontSize: 16,
    marginLeft: 4,
  },
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};

