import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { loadData, saveData } from '../storage';
import { AppData } from '../types';
import { theme } from '../theme';

const SettingsScreen: React.FC = () => {
  const [defaultInterval, setDefaultInterval] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await loadData();
    setDefaultInterval(data.settings.defaultInterval.toString());
  };

  const saveSettings = async () => {
    const intervalNum = parseFloat(defaultInterval);
    if (isNaN(intervalNum) || intervalNum <= 0) {
      Alert.alert('Error', 'Please enter a valid positive number for default interval.');
      return;
    }

    const data = await loadData();
    const newData: AppData = {
      ...data,
      settings: { defaultInterval: intervalNum },
    };

    await saveData(newData);
    Alert.alert('Success', 'Settings saved successfully.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Default Service Interval (km)</Text>
          <Text style={styles.description}>
            This value will be pre-filled when you add a new service.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={defaultInterval}
              onChangeText={setDefaultInterval}
              placeholder="e.g. 5000"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Developer</Text>
            <Text style={styles.rowValue}>ServiceLog</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Simple, offline vehicle maintenance tracking.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.m,
    paddingBottom: 50,
  },
  header: {
    marginBottom: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  sectionTitle: {
    ...theme.typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
    marginLeft: theme.spacing.xs,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600' as '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.textPrimary,
  },
  description: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.m,
  },
  inputContainer: {
    marginBottom: theme.spacing.l,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  saveButtonText: {
    ...theme.typography.button,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
  },
  rowLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  rowValue: {
    ...theme.typography.body,
    fontWeight: '600' as '600',
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.s,
  },
  footer: {
    marginTop: theme.spacing.m,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.caption,
    fontStyle: 'italic',
  }
});

export default SettingsScreen;