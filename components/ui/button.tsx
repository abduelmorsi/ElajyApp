import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity, ViewProps, ViewStyle } from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
} & ViewProps;



const getButtonStyles = (variant: ButtonVariant = "default", size: ButtonSize = "default") => {
  let container: any[] = [styles.buttonBase];
  let text: any[] = [styles.buttonTextBase];
  // Variant styles
  switch (variant) {
    case "destructive":
      container.push(styles.destructive as import('react-native').ViewStyle);
      text.push(styles.destructiveText as import('react-native').TextStyle);
      break;
    case "outline":
      container.push(styles.outline as import('react-native').ViewStyle);
      text.push(styles.outlineText as import('react-native').TextStyle);
      break;
    case "secondary":
      container.push(styles.secondary as import('react-native').ViewStyle);
      text.push(styles.secondaryText as import('react-native').TextStyle);
      break;
    case "ghost":
      container.push(styles.ghost as import('react-native').ViewStyle);
      text.push(styles.ghostText as import('react-native').TextStyle);
      break;
    case "link":
      container.push(styles.link as import('react-native').ViewStyle);
      text.push(styles.linkText as import('react-native').TextStyle);
      break;
    case "default":
    default:
      container.push(styles.default as import('react-native').ViewStyle);
      text.push(styles.defaultText as import('react-native').TextStyle);
      break;
  }
  // Size styles
  switch (size) {
    case "sm":
      container.push(styles.sm as import('react-native').ViewStyle);
      text.push(styles.smText as import('react-native').TextStyle);
      break;
    case "lg":
      container.push(styles.lg as import('react-native').ViewStyle);
      text.push(styles.lgText as import('react-native').TextStyle);
      break;
    case "icon":
      container.push(styles.icon as import('react-native').ViewStyle);
      text.push(styles.iconText as import('react-native').TextStyle);
      break;
    case "default":
    default:
      container.push(styles.defaultSize as import('react-native').ViewStyle);
      text.push(styles.defaultSizeText as import('react-native').TextStyle);
      break;
  }
  return { container, text };
};

const Button = React.forwardRef<typeof TouchableOpacity, ButtonProps>(
  ({ variant = "default", size = "default", children, style, textStyle, disabled, onPress, ...props }, ref) => {
    const buttonStyles = getButtonStyles(variant, size);
    return (
      <TouchableOpacity
        style={[...buttonStyles.container, style, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
        ref={ref as any}
      >
        <Text style={[...buttonStyles.text, textStyle]}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonTextBase: {
    fontSize: 15,
    fontWeight: "500",
  },
  default: {
    backgroundColor: "#007bff",
    shadowColor: "#007bff",
  },
  defaultText: {
    color: "#fff",
  },
  destructive: {
    backgroundColor: "#e53935",
    shadowColor: "#e53935",
  },
  destructiveText: {
    color: "#fff",
  },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  outlineText: {
    color: "#333",
  },
  secondary: {
    backgroundColor: "#e0e0e0",
  },
  secondaryText: {
    color: "#333",
  },
  ghost: {
    backgroundColor: "#f5f5f5",
  },
  ghostText: {
    color: "#222",
  },
  link: {
    backgroundColor: "transparent",
    borderRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  linkText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  defaultSize: {
    height: 44,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  defaultSizeText: {
    fontSize: 15,
  },
  sm: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  smText: {
    fontSize: 13,
  },
  lg: {
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  lgText: {
    fontSize: 17,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  iconText: {
    fontSize: 20,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button };
