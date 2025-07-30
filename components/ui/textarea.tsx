import * as React from "react";
import { StyleSheet, TextInput } from "react-native";

type TextareaProps = React.ComponentPropsWithoutRef<typeof TextInput>;

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref: React.ForwardedRef<TextInput>) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.textarea, style]}
        multiline
        numberOfLines={4}
        placeholderTextColor="#9ca3af"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
});

export { Textarea };
