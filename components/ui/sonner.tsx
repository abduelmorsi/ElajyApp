import { Alert } from "react-native";

// Simple Toaster for React Native using Alert API
// Usage: Toaster.show("Message")
const Toaster = {
  show: (message, title = "") => {
    Alert.alert(title, message);
  },
};

export { Toaster };
