import { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { incidents } from '../services/supabase';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'accident', label: 'Accident', icon: 'car-crash' },
  { value: 'infrastructure', label: 'Infrastructure', icon: 'construction' },
  { value: 'safety', label: 'Safety', icon: 'warning' },
  { value: 'environment', label: 'Environment', icon: 'nature' },
  { value: 'noise', label: 'Noise', icon: 'volume-up' },
  { value: 'vandalism', label: 'Vandalism', icon: 'broken-image' },
  { value: 'health', label: 'Health', icon: 'local-hospital' },
  { value: 'animal', label: 'Animal', icon: 'pets' },
  { value: 'emergency', label: 'Emergency', icon: 'emergency' },
  { value: 'other', label: 'Other', icon: 'info' },
];

export default function ReportScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageUrl('');
    setLocation(null);
    setLocationAddress('');
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to report incidents.');
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);

      const [address] = await Location.reverseGeocodeAsync({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });

      if (address) {
        const readableAddress = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
        ].filter(Boolean).join(', ');
        setLocationAddress(readableAddress);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await incidents.add({
        title,
        description,
        category,
        image_url: imageUrl || undefined,
        location: location || undefined,
      });
      
      Alert.alert(
        'Success',
        'Incident reported successfully',
        [{ text: 'OK', onPress: () => {
          clearForm();
          router.replace('/(tabs)');
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Report Incident</Text>
            <Text style={styles.headerSubtitle}>Help keep your community informed</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                placeholder="Brief title of the incident"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                placeholder="Detailed description of what happened"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value)}
                  style={styles.picker}
                >
                  {CATEGORIES.map((cat) => (
                    <Picker.Item 
                      key={cat.value} 
                      label={cat.label} 
                      value={cat.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL (optional)</Text>
              <TextInput
                placeholder="URL of related image"
                value={imageUrl}
                onChangeText={setImageUrl}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={getLocation}
              >
                <MaterialIcons name="my-location" size={20} color="#007AFF" />
                <Text style={styles.locationButtonText}>
                  {location ? 'Update Location' : 'Get Current Location'}
                </Text>
              </TouchableOpacity>
              {locationAddress ? (
                <Text style={styles.locationText}>📍 {locationAddress}</Text>
              ) : null}
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    marginHorizontal: -8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  locationButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  locationText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 