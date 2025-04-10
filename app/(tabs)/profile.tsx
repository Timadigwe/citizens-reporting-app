import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../services/supabase';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { incidents } from '../services/supabase';

interface UserStats {
  totalReports: number;
  lastReport: string | null;
  categories: Record<string, number>;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalReports: 0,
    lastReport: null,
    categories: {}
  });

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadUserStats();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const data = await incidents.getUserIncidents();
      const categories: Record<string, number> = {};
      data.forEach(incident => {
        categories[incident.category] = (categories[incident.category] || 0) + 1;
      });

      setStats({
        totalReports: data.length,
        lastReport: data.length > 0 ? data[0].created_at : null,
        categories
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.replace('/(auth)/login');
    } catch (error: any) {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=random` }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.email}</Text>
        <Text style={styles.joinDate}>
          Member since {new Date(user?.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalReports}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        {stats.lastReport && (
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Last Report</Text>
            <Text style={styles.statDate}>
              {new Date(stats.lastReport).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {Object.keys(stats.categories).length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Report Categories</Text>
          {Object.entries(stats.categories).map(([category, count]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <MaterialIcons 
                  name={getCategoryIcon(category)} 
                  size={24} 
                  color="#666" 
                />
                <Text style={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
              <Text style={styles.categoryCount}>{count}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="settings" size={24} color="#666" />
          <Text style={styles.actionText}>Settings</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="help" size={24} color="#666" />
          <Text style={styles.actionText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const getCategoryIcon = (category: string): keyof typeof MaterialIcons.glyphMap => {
  const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    accident: 'warning',
    infrastructure: 'build',
    safety: 'security',
    environment: 'nature',
    noise: 'volume-up',
    vandalism: 'broken-image',
    health: 'local-hospital',
    animal: 'pets',
    emergency: 'emergency',
    other: 'info'
  };
  return icons[category] || 'report-problem';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginTop: 16,
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 120,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  categoriesSection: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    marginLeft: 12,
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  actionsSection: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 