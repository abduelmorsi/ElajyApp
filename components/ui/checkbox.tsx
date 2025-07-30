import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
};

function Checkbox({ checked: checkedProp, onChange, disabled, style }: CheckboxProps) {
  const [checked, setChecked] = useState(!!checkedProp);

  const handlePress = () => {
    if (disabled) return;
    const newChecked = !checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  React.useEffect(() => {
    if (checkedProp !== undefined) setChecked(!!checkedProp);
  }, [checkedProp]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.checkbox, checked && styles.checkboxChecked, disabled && styles.checkboxDisabled, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {checked ? <Text style={styles.checkmark}>✓</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#bbb',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

export { Checkbox };
