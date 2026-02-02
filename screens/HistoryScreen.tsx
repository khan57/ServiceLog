import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
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
    <TouchableOpacity style={styles.card} onPress={() => showDetail(item)} activeOpacity={0.7}>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
        </View>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🕒</Text>
              <Text style={styles.emptyText}>No service history</Text>
              <Text style={styles.emptySubText}>Completed services will appear here.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  odometerBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  emptyIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.m,
    color: theme.colors.textSecondary,
    opacity: 0.5,
  },
  emptyText: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  emptySubText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default HistoryScreen;