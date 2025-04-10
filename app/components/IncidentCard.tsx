import { View, Text, Image, StyleSheet } from 'react-native';

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
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: incident.image_url || DEFAULT_IMAGE }} 
        style={styles.image}
        defaultSource={{ uri: DEFAULT_IMAGE }}  // Fallback while loading
      />
      <View style={styles.content}>
        <Text style={styles.title}>{incident.title}</Text>
        <Text style={styles.category}>{incident.category}</Text>
        <Text style={styles.description}>{incident.description}</Text>
        <Text style={styles.timestamp}>
          {new Date(incident.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    color: '#666',
    marginTop: 4,
  },
  description: {
    marginTop: 8,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
}); 