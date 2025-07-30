import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type ToggleGroupContextType = {
  size: string;
  variant: string;
  value?: any;
  setValue?: (val: any) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextType>({
  size: "default",
  variant: "default",
});


interface ToggleGroupProps {
  value?: any;
  defaultValue?: any;
  onValueChange?: (val: any) => void;
  variant?: string;
  size?: string;
  style?: any;
  children: React.ReactNode;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ value: controlledValue, defaultValue, onValueChange, variant = "default", size = "default", style, children }) => {
  const [value, setValue] = React.useState(controlledValue ?? defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : value;
  const setGroupValue = (val: any) => {
    if (!isControlled) setValue(val);
    if (onValueChange) onValueChange(val);
  };
  return (
    <ToggleGroupContext.Provider value={{ variant, size, value: currentValue, setValue: setGroupValue }}>
      <View style={[styles.group, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
};


interface ToggleGroupItemProps {
  value: any;
  children: React.ReactNode;
  style?: any;
  disabled?: boolean;
}

const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({ value, children, style, disabled }) => {
  const ctx = React.useContext(ToggleGroupContext);
  const isActive = ctx?.value === value;
  return (
    <TouchableOpacity
      style={[
        styles.item,
        isActive && styles.itemActive,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={() => !disabled && ctx?.setValue && ctx.setValue(value)}
      disabled={disabled}
    >
      <Text style={[styles.itemText, isActive && styles.itemTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    padding: 2,
    width: 'auto',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  itemActive: {
    backgroundColor: '#2563eb',
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
  itemTextActive: {
    color: '#fff',
  },
});

export { ToggleGroup, ToggleGroupItem };
