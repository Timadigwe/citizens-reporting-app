import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user';

const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  password: 'password123',
  name: 'Demo User'
};

export const auth = {
  login: async (email: string, password: string) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    throw new Error('Invalid credentials');
  },

  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
};

export default auth;
export { auth }; 