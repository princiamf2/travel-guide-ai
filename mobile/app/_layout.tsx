import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{title: "Mon profil" }} />
        <Stack.Screen name="history" options={{ title: "Mes voyages" }} />
        <Stack.Screen name="trip-result" options={{ title: "Ton voyage" }} />
        <Stack.Screen name="trip-section" options={{ title: "Détail du voyage" }} />
        <Stack.Screen name="login" options={{ title: "Connexion" }} />
        <Stack.Screen name="register" options={{ title: "Créer un compte" }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="compare" options={{ title: "Comparer" }} />
        <Stack.Screen name="preferences" options={{ title: "Préférences voyage" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
