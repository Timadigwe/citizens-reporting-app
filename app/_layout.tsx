import React, { useEffect, useState } from 'react';
import { Stack, Slot } from 'expo-router';
import { auth } from './services/supabase';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Just check if we can access AsyncStorage
    auth.getCurrentUser()
      .finally(() => setInitializing(false));
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
