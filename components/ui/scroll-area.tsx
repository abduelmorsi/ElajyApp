
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";

function ScrollArea({ children, style, contentContainerStyle, ...props }) {
  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

// Native scrollbars are used, so this is a no-op or visual only
function ScrollBar() {
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});

export { ScrollArea, ScrollBar };
