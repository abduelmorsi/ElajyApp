import { Stack } from 'expo-router';
import App from './App';

export default function Layout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <App />
    </>
  );
} 