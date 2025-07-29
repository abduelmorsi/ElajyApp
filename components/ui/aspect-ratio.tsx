import React from 'react';
import { View } from 'react-native';

interface AspectRatioProps {
  ratio?: number;
  style?: any;
  children: React.ReactNode;
}

const AspectRatio: React.FC<AspectRatioProps> = ({ ratio = 1, style, children }) => {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
};

export { AspectRatio };
