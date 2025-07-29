import React from "react";
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";

type CardProps = ViewProps & { children?: React.ReactNode };
type CardHeaderProps = ViewProps & { children?: React.ReactNode };
type CardTitleProps = TextProps & { children?: React.ReactNode };
type CardDescriptionProps = TextProps & { children?: React.ReactNode };
type CardActionProps = ViewProps & { children?: React.ReactNode };
type CardContentProps = ViewProps & { children?: React.ReactNode };
type CardFooterProps = ViewProps & { children?: React.ReactNode };

const Card = React.forwardRef<View, CardProps>(({ style, children, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props}>
    {children}
  </View>
));
Card.displayName = "Card";

function CardHeader({ style, children, ...props }: CardHeaderProps) {
  return (
    <View style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  );
}

function CardTitle({ style, children, ...props }: CardTitleProps) {
  return (
    <Text style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  );
}

function CardDescription({ style, children, ...props }: CardDescriptionProps) {
  return (
    <Text style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  );
}

function CardAction({ style, children, ...props }: CardActionProps) {
  return (
    <View style={[styles.cardAction, style]} {...props}>
      {children}
    </View>
  );
}

function CardContent({ style, children, ...props }: CardContentProps) {
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
}

function CardFooter({ style, children, ...props }: CardFooterProps) {
  return (
    <View style={[styles.cardFooter, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 0,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  cardAction: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 0,
    gap: 8,
  },
});

export {
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};
