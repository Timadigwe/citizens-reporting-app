import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { incidents } from '../services/supabase';
import IncidentCard from '../components/IncidentCard';
import CategoryFilter from '../components/CategoryFilter';

interface Incident {
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

export default function HomeScreen() {
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [])
  );

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidents.getAll();
      setAllIncidents(data);
      setFilteredIncidents(
        selectedCategory === 'all' 
          ? data 
          : data.filter((incident) => incident.category === selectedCategory)
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredIncidents(allIncidents);
    } else {
      setFilteredIncidents(
        allIncidents.filter((incident) => incident.category === category)
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={loadIncidents} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <FlatList
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IncidentCard incident={item} />}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadIncidents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});
