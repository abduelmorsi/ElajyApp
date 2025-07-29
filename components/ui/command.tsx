import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type CommandDialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  items: { label: string; shortcut?: string; onPress: () => void; group?: string; }[];
  placeholder?: string;
};

function CommandDialog({ visible, onClose, title = "Command Palette", description = "Search for a command to run...", items, placeholder = "Type a command..." }: CommandDialogProps) {
  const [query, setQuery] = useState("");
  const filtered = items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholderTextColor="#888"
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => item.label}
            style={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No commands found.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => { item.onPress(); onClose(); }}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.shortcut && <Text style={styles.shortcut}>{item.shortcut}</Text>}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Individual building blocks for custom command UIs
const CommandInput = ({ value, onChangeText, placeholder, style }: { value: string; onChangeText: (t: string) => void; placeholder?: string; style?: any }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.searchIcon}>🔍</Text>
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#888"
    />
  </View>
);

const CommandList = ({ items, onItemPress }: { items: { label: string; shortcut?: string; onPress: () => void; }[]; onItemPress: (item: any) => void; }) => (
  <FlatList
    data={items}
    keyExtractor={item => item.label}
    style={styles.list}
    ListEmptyComponent={<Text style={styles.empty}>No commands found.</Text>}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.shortcut && <Text style={styles.shortcut}>{item.shortcut}</Text>}
      </TouchableOpacity>
    )}
  />
);

const CommandEmpty = () => <Text style={styles.empty}>No commands found.</Text>;

const CommandGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.group}>
    <Text style={styles.groupLabel}>{label}</Text>
    {children}
  </View>
);

const CommandItem = ({ label, shortcut, onPress }: { label: string; shortcut?: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemLabel}>{label}</Text>
    {shortcut && <Text style={styles.shortcut}>{shortcut}</Text>}
  </TouchableOpacity>
);

const CommandShortcut = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.shortcut, style]}>{children}</Text>
);

const CommandSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    paddingHorizontal: 4,
    height: 40,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 6,
    color: '#888',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  list: {
    maxHeight: 240,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginBottom: 2,
    backgroundColor: '#f7f7f7',
  },
  itemLabel: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  shortcut: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
    letterSpacing: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginVertical: 16,
  },
  group: {
    marginVertical: 8,
  },
  groupLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 15,
  },
});

export {
  CommandDialog, CommandEmpty,
  CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut
};

