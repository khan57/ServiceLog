import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Preferences</Text>

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
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>About</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  header: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.s,
    color: theme.colors.textSecondary,
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600' as '600',
    marginBottom: theme.spacing.xs,
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
  },
  saveButtonText: {
    ...theme.typography.button,
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