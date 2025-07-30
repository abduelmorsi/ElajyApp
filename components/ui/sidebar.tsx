import * as React from "react";
import { Text, View } from "react-native";

// Emoji for sidebar icon (no custom style)
const PanelLeftIcon = () => <Text>📚</Text>;

// Dummy hooks and components for mobile detection and skeleton
const useIsMobile = () => true;
const Skeleton = ({ style }) => <View style={style} />;

// Sheet components for mobile sidebar

// Separator

// Input

// Only export React Native Sidebar primitives
