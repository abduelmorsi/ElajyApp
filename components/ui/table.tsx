import * as React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function Table({ style, children }) {
  return (
    <ScrollView horizontal style={{ width: '100%' }}>
      <View style={[styles.table, style]}>{children}</View>
    </ScrollView>
  );
}

function TableHeader({ style, children }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

function TableBody({ style, children }) {
  return <View style={[styles.body, style]}>{children}</View>;
}

function TableFooter({ style, children }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

function TableRow({ style, children }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

function TableHead({ style, children }) {
  return (
    <Text style={[styles.head, style]} numberOfLines={1} ellipsizeMode="tail">
      {children}
    </Text>
  );
}

function TableCell({ style, children }) {
  return (
    <Text style={[styles.cell, style]} numberOfLines={1} ellipsizeMode="tail">
      {children}
    </Text>
  );
}

function TableCaption({ style, children }) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  body: {
    flexDirection: 'column',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 40,
  },
  head: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111827',
    padding: 8,
    backgroundColor: '#f3f4f6',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    padding: 8,
  },
  caption: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export {
  Table, TableBody, TableCaption, TableCell, TableFooter,
  TableHead, TableHeader, TableRow
};

