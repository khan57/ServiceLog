import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loadData, saveData } from '../storage';
import { AppData, ServiceEntry } from '../types';
import { theme } from '../theme';

type RootStackParamList = {
  Home: undefined;
  AddEditService: { service?: ServiceEntry };
  History: undefined;
  Settings: undefined;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAppData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAppData = async () => {
    const appData = await loadData();
    setData(appData);
  };

  const handleDone = async () => {
    if (!data || !data.current) return;

    Alert.alert(
      "Complete Service",
      "Are you sure you want to mark this service as done?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            const now = new Date().toISOString();
            const completedService: ServiceEntry = {
              ...data.current!,
              status: 'done',
              date: now,
            };

            const newData: AppData = {
              ...data,
              current: null,
              history: [completedService, ...data.history],
            };

            await saveData(newData);
            setData(newData);
          }
        }
      ]
    );
  };

  const navigateToAddService = () => {
    (navigation as any).navigate('AddEditService');
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const current = data.current;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header Status */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vehicle Status</Text>
          <Text style={styles.headerSubtitle}>
            {current ? 'Service Pending' : 'All Systems Go'}
          </Text>
        </View>

        {/* Main Card */}
        {current ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Next Service Due</Text>
              <Text style={styles.serviceTypeBadge}>{current.serviceType}</Text>
            </View>

            <View style={styles.odometerContainer}>
              <Text style={styles.odometerValue}>{current.nextDue.toLocaleString()}</Text>
              <Text style={styles.odometerUnit}>km</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Service</Text>
              <Text style={styles.detailValue}>{current.odometer.toLocaleString()} km</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Interval</Text>
              <Text style={styles.detailValue}>{current.interval.toLocaleString()} km</Text>
            </View>
            {current.notes ? (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesValue}>{current.notes}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>MARK AS COMPLETED</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Pending Service</Text>
            <Text style={styles.emptyDescription}>
              You have no active service reminders. Add one to track your vehicle maintenance.
            </Text>
            <TouchableOpacity style={styles.addServiceLargeButton} onPress={navigateToAddService}>
              <Text style={styles.addServiceLargeButtonText}>+ Schedule Service</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => (navigation as any).navigate('History')}>
          <Text style={styles.navButtonText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navButton, styles.primaryNavButton]} onPress={navigateToAddService}>
          <Text style={styles.primaryNavButtonText}>
            {current ? 'Edit' : 'Add'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => (navigation as any).navigate('Settings')}>
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.m,
    paddingBottom: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  header: {
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.s,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    ...theme.typography.h2,
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  serviceTypeBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 12,
    overflow: 'hidden',
  },
  odometerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.l,
  },
  odometerValue: {
    fontSize: 42,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  odometerUnit: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: theme.spacing.s,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
  },
  notesLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  notesValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: theme.spacing.l,
    ...theme.shadows.card,
  },
  doneButtonText: {
    ...theme.typography.button,
    letterSpacing: 1,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  emptyTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
  },
  emptyDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  addServiceLargeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
  },
  addServiceLargeButtonText: {
    ...theme.typography.button,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: theme.spacing.s,
  },
  navButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryNavButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.l,
  },
  primaryNavButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
});

export default HomeScreen;