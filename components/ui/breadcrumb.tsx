import React from "react";
import { StyleSheet, Text, TextProps, TouchableOpacity, View, ViewProps } from "react-native";

type BreadcrumbProps = ViewProps & {
  children?: React.ReactNode;
};

function Breadcrumb({ style, children, ...props }: BreadcrumbProps) {
  return (
    <View style={[styles.breadcrumb, style]} {...props}>
      {children}
    </View>
  );
}

type BreadcrumbListProps = ViewProps & {
  children?: React.ReactNode;
};

function BreadcrumbList({ style, children, ...props }: BreadcrumbListProps) {
  return (
    <View style={[styles.breadcrumbList, style]} {...props}>
      {children}
    </View>
  );
}

type BreadcrumbItemProps = ViewProps & {
  children?: React.ReactNode;
};

function BreadcrumbItem({ style, children, ...props }: BreadcrumbItemProps) {
  return (
    <View style={[styles.breadcrumbItem, style]} {...props}>
      {children}
    </View>
  );
}

type BreadcrumbLinkProps = {
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
};

function BreadcrumbLink({ onPress, children, style, textStyle, disabled }: BreadcrumbLinkProps) {
  return (
    <TouchableOpacity
      style={[styles.breadcrumbLink, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.breadcrumbLinkText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

type BreadcrumbPageProps = TextProps & {
  children?: React.ReactNode;
};

function BreadcrumbPage({ style, children, ...props }: BreadcrumbPageProps) {
  return (
    <Text style={[styles.breadcrumbPage, style]} {...props}>
      {children}
    </Text>
  );
}

type BreadcrumbSeparatorProps = {
  children?: React.ReactNode;
  style?: any;
};

function BreadcrumbSeparator({ children, style }: BreadcrumbSeparatorProps) {
  return (
    <Text style={[styles.breadcrumbSeparator, style]} accessibilityElementsHidden>
      {children ?? "›"}
    </Text>
  );
}

type BreadcrumbEllipsisProps = {
  style?: any;
  textStyle?: any;
};

function BreadcrumbEllipsis({ style, textStyle }: BreadcrumbEllipsisProps) {
  return (
    <View style={[styles.breadcrumbEllipsis, style]}>
      <Text style={[styles.breadcrumbEllipsisText, textStyle]}>…</Text>
      {/* Accessibility: "More" visually hidden, not needed in RN */}
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  breadcrumbList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breadcrumbLink: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  breadcrumbLinkText: {
    color: "#007bff",
    fontSize: 14,
  },
  breadcrumbPage: {
    color: "#222",
    fontSize: 14,
    fontWeight: "400",
  },
  breadcrumbSeparator: {
    color: "#888",
    fontSize: 16,
    marginHorizontal: 2,
  },
  breadcrumbEllipsis: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  breadcrumbEllipsisText: {
    fontSize: 18,
    color: "#888",
  },
});

export {
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
};

