
import * as React from "react";
import { StyleSheet, Text } from "react-native";

type LabelProps = React.ComponentProps<typeof Text>;

function Label({ style, ...props }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    userSelect: 'none', // ignored in RN, but for parity
    color: '#222',
    marginBottom: 2,
  },
});

export { Label };
