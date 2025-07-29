import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  children: React.ReactNode;
  multiple?: boolean;
}

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  expanded?: boolean;
  onPress?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Clone children to inject expanded/onPress
  return (
    <View>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        // Only inject props if child is AccordionItem
        if ((child.type as any).displayName === 'AccordionItem' || child.type === AccordionItem) {
          return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
            expanded: openIndex === idx,
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setOpenIndex(openIndex === idx ? null : idx);
            },
          });
        }
        return child;
      })}
    </View>
  );
};


function AccordionItem({ title, children, expanded = false, onPress }: AccordionItemProps) {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.trigger} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.chevron, expanded && styles.chevronOpen]}>▼</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}
AccordionItem.displayName = 'AccordionItem';

export { Accordion, AccordionItem };

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
});
