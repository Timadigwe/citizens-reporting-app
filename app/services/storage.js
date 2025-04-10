import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user for demo
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  password: 'password123',
  name: 'Demo User'
};

// Storage keys
const STORAGE_KEYS = {
  INCIDENTS: 'incidents',
  USER: 'user'
};

// Mock authentication
export const auth = {
  login: async (email, password) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    throw new Error('Invalid credentials');
  },
  
  signup: async (email, password, name) => {
    const user = { ...DEMO_USER, email, name };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }
};

// Incidents management
export const incidents = {
  add: async (incident) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.INCIDENTS);
      const incidents = stored ? JSON.parse(stored) : [];
      
      const newIncident = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...incident
      };
      
      incidents.unshift(newIncident);
      await AsyncStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
      return newIncident;
    } catch (error) {
      console.error('Error adding incident:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting incidents:', error);
      return [];
    }
  },

  getByCategory: async (category) => {
    const incidents = await incidents.getAll();
    return incidents.filter(incident => incident.category === category);
  },

  getByUser: async (userId) => {
    const incidents = await incidents.getAll();
    return incidents.filter(incident => incident.userId === userId);
  }
};

// Default export
export default {
  auth,
  incidents,
  STORAGE_KEYS
}; 