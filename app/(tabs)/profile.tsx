import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/storage';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 