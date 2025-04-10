import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'accident', label: 'Accident', icon: 'car-crash' },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'construction' },
  { id: 'safety', label: 'Safety', icon: 'warning' },
  { id: 'environment', label: 'Environment', icon: 'nature' },
  { id: 'noise', label: 'Noise', icon: 'volume-up' },
  { id: 'vandalism', label: 'Vandalism', icon: 'broken-image' },
  { id: 'health', label: 'Health', icon: 'local-hospital' },
  { id: 'animal', label: 'Animal', icon: 'pets' },
  { id: 'emergency', label: 'Emergency', icon: 'emergency' },
  { id: 'other', label: 'Other', icon: 'info' },
];

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.category,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <MaterialIcons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? 'white' : '#666'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: 'white',
  },
}); 