import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContainerProps = {
  config: ChartConfig;
  children?: React.ReactNode;
  style?: any;
};

const ChartContainer = ({ config, children, style }: ChartContainerProps) => {
  // Placeholder: In React Native, use a chart library like react-native-svg-charts or victory-native
  // Here, just render children in a styled View
  return (
    <View style={[styles.chartContainer, style]}>
      {/* Chart rendering should be implemented with a native chart library */}
      {children || <Text style={styles.chartPlaceholder}>[Chart Placeholder]</Text>}
    </View>
  );
};

type ChartTooltipContentProps = {
  label?: string;
  value?: string | number;
  color?: string;
  style?: any;
};

const ChartTooltipContent = ({ label, value, color, style }: ChartTooltipContentProps) => (
  <View style={[styles.tooltip, style]}>
    {label && <Text style={styles.tooltipLabel}>{label}</Text>}
    {value !== undefined && <Text style={[styles.tooltipValue, color ? { color } : null]}>{value}</Text>}
  </View>
);

type ChartLegendContentProps = {
  items: { label: string; color?: string; icon?: React.ComponentType }[];
  style?: any;
};

const ChartLegendContent = ({ items, style }: ChartLegendContentProps) => (
  <View style={[styles.legend, style]}>
    {items.map((item, idx) => (
      <View key={idx} style={styles.legendItem}>
        <View style={[styles.legendColor, item.color ? { backgroundColor: item.color } : null]} />
        <Text style={styles.legendLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chartPlaceholder: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  tooltip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  tooltipLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  tooltipValue: {
    color: '#007bff',
    fontWeight: '500',
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#007bff',
    marginRight: 4,
  },
  legendLabel: {
    color: '#333',
    fontSize: 13,
  },
});

export {
  ChartContainer, ChartLegendContent, ChartTooltipContent
};

