
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Emoji for selected indicator
const CircleIcon = (): React.ReactElement => <View style={styles.selectedDot} />;

type RadioGroupProps = {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  style?: any;
};

function RadioGroup({ value, onValueChange, children, style }: RadioGroupProps): React.ReactElement {
  // Clone children to inject checked and onPress
  return (
    <View style={[styles.group, style]}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const typedChild = child as React.ReactElement<RadioGroupItemProps>;
        return React.cloneElement(typedChild, {
          checked: typedChild.props.value === value,
          onPress: () => onValueChange(typedChild.props.value),
        });
      })}
    </View>
  );
}

type RadioGroupItemProps = {
  value: string;
  checked?: boolean;
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
};

function RadioGroupItem({ checked, onPress, style, children }: RadioGroupItemProps): React.ReactElement {
  return (
    <TouchableOpacity
      style={[styles.item, checked && styles.itemChecked, style]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={checked ? { selected: true } : undefined}
    >
      <View style={[styles.circle, checked && styles.circleChecked]}>
        {checked ? <CircleIcon /> : null}
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'column',
    // gap: 12, // Not supported in React Native
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  itemChecked: {
    backgroundColor: '#f3f4f6',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  circleChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#e5f0ff',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
});

export { RadioGroup, RadioGroupItem };
