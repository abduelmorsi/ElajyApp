import * as React from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  style,
  trackStyle,
  thumbStyle,
  ...props
}) {
  const [internalValue, setInternalValue] = React.useState(
    value ?? defaultValue ?? min
  );
  const sliderValue = value !== undefined ? value : internalValue;
  const trackRef = React.useRef(null);
  const [trackWidth, setTrackWidth] = React.useState(1);

  // Calculate thumb position
  const percent = (sliderValue - min) / (max - min);
  const thumbPosition = percent * trackWidth;

  // PanResponder for thumb drag
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const x = clamp(gestureState.dx + thumbPosition, 0, trackWidth);
        const newValue = clamp(
          Math.round((x / trackWidth) * (max - min) / step) * step + min,
          min,
          max
        );
        if (onValueChange) onValueChange(newValue);
        if (value === undefined) setInternalValue(newValue);
      },
    })
  ).current;

  return (
    <View
      style={[styles.root, style]}
      onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
      ref={trackRef}
      {...props}
    >
      <View style={[styles.track, trackStyle]}>
        <View
          style={[
            styles.range,
            { width: thumbPosition, backgroundColor: '#2563eb' },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            { left: thumbPosition - 12 },
            thumbStyle,
          ]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  track: {
    height: 16,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
  },
  range: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    height: 16,
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export { Slider };
