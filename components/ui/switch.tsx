import * as React from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

function Switch({
  value,
  onValueChange,
  disabled = false,
  style,
  thumbStyle,
  ...props
}) {
  const [internalValue, setInternalValue] = React.useState(value ?? false);
  const isControlled = value !== undefined;
  const checked = isControlled ? value : internalValue;
  const handleToggle = () => {
    if (disabled) return;
    if (onValueChange) onValueChange(!checked);
    if (!isControlled) setInternalValue(!checked);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      disabled={disabled}
      style={[styles.switch, checked ? styles.switchChecked : styles.switchUnchecked, disabled && styles.switchDisabled, style]}
      {...props}
    >
      <Animated.View
        style={[
          styles.thumb,
          checked ? styles.thumbChecked : styles.thumbUnchecked,
          thumbStyle,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  switchChecked: {
    backgroundColor: '#2563eb',
  },
  switchUnchecked: {
    backgroundColor: '#e5e7eb',
  },
  switchDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2,
    left: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // transitionProperty: 'left', // Not supported in React Native
    // transitionDuration: '200ms', // Not supported in React Native
  },
  thumbChecked: {
    left: 26,
    backgroundColor: '#fff',
  },
  thumbUnchecked: {
    left: 2,
    backgroundColor: '#fff',
  },
});

export { Switch };
