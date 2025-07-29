
import * as React from "react";
import { StyleSheet, TextInput } from "react-native";

type InputProps = React.ComponentProps<typeof TextInput> & {
  type?: string;
};

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, type, ...props }, ref) => {
    // Map HTML input types to React Native keyboardType
    let keyboardType: InputProps["keyboardType"] = "default";
    if (type === "email") keyboardType = "email-address";
    else if (type === "number" || type === "tel") keyboardType = "numeric";
    else if (type === "phone") keyboardType = "phone-pad";
    else if (type === "url") keyboardType = "url";
    else if (type === "decimal") keyboardType = "decimal-pad";

    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        keyboardType={keyboardType}
        secureTextEntry={type === "password"}
        autoCapitalize={type === "email" ? "none" : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    height: 44,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});

export { Input };
