import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG } from '../config/supabase';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

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
}

export const incidents = {
  add: async (incident: Omit<Incident, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('incidents')
      .insert([incident])
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
  }
};

export default supabase;
export { incidents }; 