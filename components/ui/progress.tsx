
import * as React from "react";
import { StyleSheet, View } from "react-native";

type ProgressProps = {
  value?: number;
  style?: any;
  indicatorStyle?: any;
};

const Progress = React.forwardRef<View, ProgressProps>(
  ({ value = 0, style, indicatorStyle, ...props }, ref) => {
    const percent = Math.max(0, Math.min(100, value));
    return (
      <View ref={ref} style={[styles.root, style]} {...props}>
        <View style={[styles.indicator, { width: `${percent}%` }, indicatorStyle]} />
      </View>
    );
  }
);

Progress.displayName = "Progress";

const styles = StyleSheet.create({
  root: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(0,122,255,0.15)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export { Progress };
