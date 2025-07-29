import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type BadgeProps = {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  style?: any;
  textStyle?: any;
} & ViewProps;

const getBadgeStyles = (variant: BadgeVariant = "default") => {
  switch (variant) {
    case "secondary":
      return {
        container: [styles.badge, styles.secondary],
        text: [styles.badgeText, styles.secondaryText],
      };
    case "destructive":
      return {
        container: [styles.badge, styles.destructive],
        text: [styles.badgeText, styles.destructiveText],
      };
    case "outline":
      return {
        container: [styles.badge, styles.outline],
        text: [styles.badgeText, styles.outlineText],
      };
    case "default":
    default:
      return {
        container: [styles.badge, styles.default],
        text: [styles.badgeText, styles.defaultText],
      };
  }
};

function Badge({ variant = "default", children, style, textStyle, ...props }: BadgeProps) {
  const badgeStyles = getBadgeStyles(variant);
  return (
    <View style={[badgeStyles.container, style]} {...props}>
      <Text style={[badgeStyles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignSelf: "flex-start",
    overflow: "hidden",
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
  default: {
    backgroundColor: "#007bff", // primary
    borderColor: "transparent",
  },
  defaultText: {
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#e0e0e0",
    borderColor: "transparent",
  },
  secondaryText: {
    color: "#333",
  },
  destructive: {
    backgroundColor: "#e53935",
    borderColor: "transparent",
  },
  destructiveText: {
    color: "#fff",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#333",
  },
  outlineText: {
    color: "#333",
  },
});

export { Badge };
