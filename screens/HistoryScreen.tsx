import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadData } from '../storage';
import { ServiceEntry } from '../types';
import { theme } from '../theme';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState<ServiceEntry[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    const data = await loadData();
    // Sort by newest date first
    const sortedHistory = [...data.history].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setHistory(sortedHistory);
  };

  const showDetail = (service: ServiceEntry) => {
    Alert.alert(
      service.serviceType,
      `Odometer: ${service.odometer.toLocaleString()} km\n\nDate: ${new Date(service.date).toLocaleDateString()}\n\nNotes: ${service.notes || 'None'}`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const renderItem = ({ item }: { item: ServiceEntry }) => (
    <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.odometerBadge}>
          <Text style={styles.odometerText}>{item.odometer.toLocaleString()} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No service history yet.</Text>
            <Text style={styles.emptySubText}>Completed services will appear here.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceType: {
    ...theme.typography.h2,
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    ...theme.typography.caption,
  },
  odometerBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
  },
  odometerText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  emptySubText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

export default HistoryScreen;