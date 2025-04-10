import { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Text, 
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { incidents } from '../services/supabase';
import { Picker } from '@react-native-picker/picker';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const CATEGORIES = [
  { label: 'Select a category', value: '' },
  { label: 'Accident', value: 'accident' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Safety', value: 'safety' },
  { label: 'Environment', value: 'environment' },
  { label: 'Noise', value: 'noise' },
  { label: 'Vandalism', value: 'vandalism' },
  { label: 'Health', value: 'health' },
  { label: 'Animal', value: 'animal' },
  { label: 'Emergency', value: 'emergency' },
  { label: 'Other', value: 'other' },
];

export default function ReportScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');

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
        alert('Permission to access location was denied');
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);

      // Get readable address
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
      alert('Error getting location');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!title || !description || !category) {
        alert('Please fill in all required fields');
        return;
      }

      await incidents.add({
        title,
        description,
        category,
        image_url: imageUrl || undefined,
        location: location || undefined,
      });
      
      clearForm();
      router.replace('/(tabs)');
    } catch (error: any) {
      alert('Error submitting incident: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
          />
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
          <TextInput
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
            autoCapitalize="none"
          />
          <Button title="Get Location" onPress={getLocation} />
          {locationAddress ? (
            <Text style={styles.locationText}>📍 {locationAddress}</Text>
          ) : null}
          <Button title="Submit Report" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationText: {
    marginVertical: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#fff',
    marginHorizontal: -8,
  },
}); 