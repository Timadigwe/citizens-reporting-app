import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CATEGORIES = ['all', 'accident', 'fighting', 'rioting', 'other'];

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.category,
            selectedCategory === category && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category)}>
          <Text style={[
            styles.categoryText,
            selectedCategory === category && styles.selectedCategoryText,
          ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: 'white',
  },
}); 