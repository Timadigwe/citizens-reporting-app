import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Button, TouchableOpacity } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incidents</Text>
        <Text style={styles.headerSubtitle}>Recent reports in your area</Text>
      </View>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadIncidents}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredIncidents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IncidentCard incident={item} />}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadIncidents}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No incidents found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
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
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
