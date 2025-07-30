
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ToggleProps = {
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  style?: any;
  children?: React.ReactNode;
};

function getToggleStyle({ variant = "default", size = "default", active, disabled }: { variant?: "default" | "outline"; size?: "default" | "sm" | "lg"; active?: boolean; disabled?: boolean; }) {
  return [
    styles.toggle,
    styles[`toggle_${variant}`],
    styles[`toggle_${size}`],
    active && styles.toggle_active,
    disabled && styles.toggle_disabled,
  ];
}


const Toggle = React.forwardRef<any, ToggleProps>(
  (
    {
      value,
      onValueChange,
      variant = "default",
      size = "default",
      disabled = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [active, setActive] = React.useState(value ?? false);
    const isControlled = value !== undefined;
    const isActive = isControlled ? value : active;
    const handlePress = () => {
      if (disabled) return;
      if (onValueChange) onValueChange(!isActive);
      if (!isControlled) setActive(!isActive);
    };
    return (
      <TouchableOpacity
        ref={ref}
        style={[getToggleStyle({ variant, size, active: isActive, disabled }), style]}
        onPress={handlePress}
        disabled={disabled}
        {...props}
      >
        <Text style={styles.toggleText}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '500',
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  toggle_default: {
    backgroundColor: 'transparent',
    minHeight: 36,
    minWidth: 36,
    paddingHorizontal: 8,
  },
  toggle_outline: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
    minHeight: 36,
    minWidth: 36,
    paddingHorizontal: 8,
  },
  toggle_sm: {
    minHeight: 32,
    minWidth: 32,
    paddingHorizontal: 6,
  },
  toggle_lg: {
    minHeight: 40,
    minWidth: 40,
    paddingHorizontal: 12,
  },
  toggle_active: {
    backgroundColor: '#f1f5f9',
  },
  toggle_disabled: {
    opacity: 0.5,
  },
  toggleText: {
    color: '#111827',
    fontSize: 15,
  },
});

export { Toggle };
