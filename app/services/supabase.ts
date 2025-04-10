import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

const STORAGE_KEY = 'user';
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  password: 'password123',
  name: 'Demo User'
};

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  user_id: string;
}

export const incidents = {
  add: async (incident: Omit<Incident, 'id' | 'created_at' | 'user_id'>) => {
    // Get current user first
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('incidents')
      .insert([{ 
        ...incident, 
        user_id: user.id  // Use actual user's ID instead of hardcoded '1'
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getUserIncidents: async () => {
    // Get current user first
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('user_id', user.id)  // Use actual user's ID
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

export const auth = {
  signup: async (email: string, password: string) => {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      throw new Error('Invalid email or password');
    }

    // Store user session
    await AsyncStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
  }
};

export default supabase;
