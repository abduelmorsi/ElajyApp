import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabsContext = React.createContext(null);

function Tabs({ value: controlledValue, defaultValue, onValueChange, style, children }) {
  const [value, setValue] = React.useState(controlledValue ?? defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : value;
  const setTab = (val) => {
    if (!isControlled) setValue(val);
    if (onValueChange) onValueChange(val);
  };
  return (
    <TabsContext.Provider value={{ value: currentValue, setValue: setTab }}>
      <View style={[styles.tabs, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

function TabsList({ style, children }) {
  return <View style={[styles.tabsList, style]}>{children}</View>;
}

function TabsTrigger({ value, style, children, disabled }) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, disabled && styles.tabsTriggerDisabled, style]}
      onPress={() => !disabled && ctx?.setValue(value)}
      disabled={disabled}
    >
      <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
}

function TabsContent({ value, style, children }) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <View style={[styles.tabsContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    gap: 8,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  tabsTrigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  tabsTriggerActive: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  tabsTriggerDisabled: {
    opacity: 0.5,
  },
  tabsTriggerText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
  tabsTriggerTextActive: {
    color: '#111827',
  },
  tabsContent: {
    flex: 1,
    paddingTop: 8,
  },
});

export { Tabs, TabsContent, TabsList, TabsTrigger };

