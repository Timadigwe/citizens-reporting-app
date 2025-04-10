import { View, StyleSheet, Text, Pressable } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { incidents } from '../services/supabase';

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

interface IncidentWithLocation extends Incident {
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function MapScreen() {
  const router = useRouter();
  const [markers, setMarkers] = useState<IncidentWithLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [])
  );

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidents.getAll();
      setMarkers(data.filter((incident): incident is IncidentWithLocation => 
        incident.location !== undefined && 
        'latitude' in incident.location && 
        'longitude' in incident.location
      ));
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.location}
            pinColor={getCategoryColor(marker.category)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutCategory}>{marker.category}</Text>
                <Text numberOfLines={2}>{marker.description}</Text>
                <Text style={styles.calloutTime}>
                  {new Date(marker.created_at).toLocaleString()}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    accident: 'red',
    infrastructure: 'orange',
    safety: 'yellow',
    environment: 'green',
    noise: 'blue',
    vandalism: 'purple',
    health: 'pink',
    animal: 'brown',
    emergency: 'red',
    other: 'gray',
  };
  return colors[category] || 'red';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutCategory: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  calloutTime: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
}); 