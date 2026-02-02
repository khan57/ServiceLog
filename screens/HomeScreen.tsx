import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, SafeAreaView } from 'react-native';
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
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const current = data.current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                {current ? 'Service Required' : 'All systems operational'}
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileIcon} />
            </TouchableOpacity>
          </View>

          {/* Main Status Card */}
          {current ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.serviceTypeBadge}>{current.serviceType.toUpperCase()}</Text>
                </View>
                <Text style={styles.dueLabel}>DUE AT</Text>
              </View>

              <View style={styles.odometerContainer}>
                <Text style={styles.odometerValue}>{current.nextDue.toLocaleString()}</Text>
                <Text style={styles.odometerUnit}>km</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: '70%' }]}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>On Track</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>LAST SERVICE</Text>
                  <Text style={styles.statValue}>{current.odometer.toLocaleString()}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>INTERVAL</Text>
                  <Text style={styles.statValue}>{current.interval.toLocaleString()}</Text>
                </View>
              </View>

              {current.notes ? (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>NOTES</Text>
                  <Text style={styles.notesValue}>{current.notes}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
                <Text style={styles.doneButtonText}>MARK COMPLETED</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>✓</Text>
              </View>
              <Text style={styles.emptyTitle}>No Pending Service</Text>
              <Text style={styles.emptyDescription}>
                You're all caught up! Schedule your next maintenance to keep tracking.
              </Text>
              <TouchableOpacity style={styles.addServiceLargeButton} onPress={navigateToAddService}>
                <Text style={styles.addServiceLargeButtonText}>Schedule Service</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions / Stats (Placeholder for future) */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{data.history.length}</Text>
              <Text style={styles.quickStatLabel}>Total Services</Text>
            </View>
            {/* Add more stats here if needed */}
          </View>

        </ScrollView>

        {/* Floating Bottom Dock */}
        <View style={styles.bottomDockContainer}>
          <View style={styles.bottomDock}>
            <TouchableOpacity style={styles.dockButton} onPress={() => (navigation as any).navigate('History')}>
              {/* Icon placeholder */}
              <Text style={styles.dockIcon}>🕒</Text>
              <Text style={styles.dockLabel}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockPrimaryButton} onPress={navigateToAddService}>
              <Text style={styles.dockPrimaryLabel}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockButton} onPress={() => (navigation as any).navigate('Settings')}>
              <Text style={styles.dockIcon}>⚙️</Text>
              <Text style={styles.dockLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollContent: {
    padding: theme.spacing.l,
    paddingBottom: 120, // Space for bottom dock
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.s,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  profileButton: {
    padding: theme.spacing.s,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.l,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  badgeContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue with opacity
    borderRadius: theme.borderRadius.s,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
  },
  serviceTypeBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  dueLabel: {
    ...theme.typography.caption,
    fontWeight: '600',
    letterSpacing: 1,
  },
  odometerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.s,
  },
  odometerValue: {
    fontSize: 48, // Massive typography
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  odometerUnit: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.l,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.l,
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.l,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  notesContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.l,
  },
  notesLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  notesValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  doneButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Success green low opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  emptyIcon: {
    fontSize: 32,
    color: theme.colors.success,
  },
  emptyTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  emptyDescription: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.m,
  },
  addServiceLargeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  addServiceLargeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickStatsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.l,
    gap: theme.spacing.m,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  quickStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  bottomDockContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  bottomDock: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tabBar,
    borderRadius: 30,
    padding: 8,
    paddingHorizontal: theme.spacing.l,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  dockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dockIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  dockLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  dockPrimaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Floating effect
    ...theme.shadows.glow,
    shadowColor: theme.colors.accent, // Override glow color
  },
  dockPrimaryLabel: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
    marginTop: -2,
  },
});

export default HomeScreen;