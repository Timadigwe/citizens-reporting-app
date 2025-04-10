import React from 'react';
import { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { auth } from './services/storage';

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await auth.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {user ? (
        // Show main app layout when user is authenticated
        <Slot />
      ) : (
        // Show auth screens when user is not authenticated
        <Stack>
          <Stack.Screen 
            name="(auth)/login" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="(auth)/signup" 
            options={{ headerShown: false }} 
          />
        </Stack>
      )}
    </>
  );
}
