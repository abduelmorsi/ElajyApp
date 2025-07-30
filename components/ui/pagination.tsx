
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Emoji icons for chevron and ellipsis
const ChevronLeftIcon = () => <Text style={styles.icon}>◀️</Text>;
const ChevronRightIcon = () => <Text style={styles.icon}>▶️</Text>;
const MoreHorizontalIcon = () => <Text style={styles.icon}>…</Text>;

function Pagination({ style, children }) {
  return (
    <View style={[styles.pagination, style]}>{children}</View>
  );
}


function PaginationContent({ children, style }) {
  return <View style={[styles.content, style]}>{children}</View>;
}


function PaginationItem({ children, style }) {
  return <View style={style}>{children}</View>;
}


type PaginationLinkProps = {
  isActive?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
};

function PaginationLink({ isActive, onPress, children, style }: PaginationLinkProps) {
  return (
    <TouchableOpacity
      style={[styles.link, isActive && styles.activeLink, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={isActive ? { selected: true } : undefined}
    >
      <Text style={[styles.linkText, isActive && styles.activeLinkText]}>{children}</Text>
    </TouchableOpacity>
  );
}


function PaginationPrevious({ onPress, style }) {
  return (
    <PaginationLink onPress={onPress} style={style}>
      <ChevronLeftIcon />
      <Text style={styles.prevNextText}>Previous</Text>
    </PaginationLink>
  );
}


function PaginationNext({ onPress, style }) {
  return (
    <PaginationLink onPress={onPress} style={style}>
      <Text style={styles.prevNextText}>Next</Text>
      <ChevronRightIcon />
    </PaginationLink>
  );
}


function PaginationEllipsis({ style }) {
  return (
    <View style={[styles.ellipsis, style]}>
      <MoreHorizontalIcon />
    </View>
  );
}


const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    marginHorizontal: 2,
  },
  activeLink: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  linkText: {
    fontSize: 15,
    color: '#222',
    marginHorizontal: 2,
  },
  activeLinkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  prevNextText: {
    fontSize: 15,
    marginHorizontal: 2,
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginHorizontal: 2,
  },
});

export {
  Pagination,
  PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
};

