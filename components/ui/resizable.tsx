
import * as React from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

// Emoji for the handle
const GripVerticalIcon = () => <Text style={styles.handleIcon}>⋮</Text>;

// Simple horizontal resizable panel group for React Native
const ResizablePanelGroup = ({ children, style }) => {
  return <View style={[styles.group, style]}>{children}</View>;
};

const ResizablePanel = ({ children, style }) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const ResizableHandle = ({ withHandle = true, style, onResize }) => {
  // Use PanResponder for drag
  const pan = React.useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (onResize) onResize(gestureState.dx, gestureState.dy);
      },
      onPanResponderRelease: () => {
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.handle, style]}
      {...panResponder.panHandlers}
    >
      {withHandle && (
        <View style={styles.handleInner}>
          <GripVerticalIcon />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    minWidth: 40,
    minHeight: 40,
  },
  handle: {
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    // cursor: 'col-resize', // Not supported in React Native
  },
  handleInner: {
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 12,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  handleIcon: {
    fontSize: 18,
    color: '#888',
  },
});

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };

