import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Using Unsplash's random beautiful image API with specific parameters
const DEFAULT_IMAGE = 'https://source.unsplash.com/random/800x400/?city,incident';

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

export default function IncidentCard({ incident }: { incident: Incident }) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      accident: 'car-crash',
      infrastructure: 'construction',
      safety: 'warning',
      environment: 'nature',
      noise: 'volume-up',
      vandalism: 'broken-image',
      health: 'local-hospital',
      animal: 'pets',
      emergency: 'emergency',
      other: 'info',
    };
    return icons[category] || 'report-problem';
  };

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: incident.image_url || DEFAULT_IMAGE }} 
        style={styles.image}
        defaultSource={{ uri: DEFAULT_IMAGE }}  // Fallback while loading
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <MaterialIcons 
              name={getCategoryIcon(incident.category)} 
              size={16} 
              color="#666" 
            />
            <Text style={styles.category}>{incident.category}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(incident.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <Text style={styles.title}>{incident.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {incident.description}
        </Text>

        {incident.location && (
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={14} color="#666" />
            <Text style={styles.locationText}>
              {`${incident.location.latitude.toFixed(3)}, ${incident.location.longitude.toFixed(3)}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    height: 180,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  category: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
}); 