import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { loadData, saveData } from '../storage';
import { AppData, ServiceEntry, ServiceType } from '../types';
import { theme } from '../theme';

type RootStackParamList = {
  Home: undefined;
  AddEditService: { service?: ServiceEntry };
  History: undefined;
  Settings: undefined;
};

const AddEditServiceScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'AddEditService'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddEditService'>>();
  const { service } = route.params || {};
  const isEditing = !!service;

  const [serviceType, setServiceType] = useState<ServiceType>('Engine Oil Change');
  const [customType, setCustomType] = useState('');
  const [odometer, setOdometer] = useState('');
  const [interval, setInterval] = useState('');
  const [notes, setNotes] = useState('');
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    loadAppData();
    if (isEditing && service) {
      const defaultTypes = ['Engine Oil Change', 'Oil Filter Change', 'Air Filter', 'Brake Inspection', 'General Service'];
      if (defaultTypes.includes(service.serviceType)) {
        setServiceType(service.serviceType);
      } else {
        setServiceType('Custom');
        setCustomType(service.serviceType);
      }
      setOdometer(service.odometer.toString());
      setInterval(service.interval.toString());
      setNotes(service.notes || '');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAppData = async () => {
    const appData = await loadData();
    setData(appData);
    if (!isEditing) {
      setInterval(appData.settings.defaultInterval.toString());
    }
  };

  const handleSave = async () => {
    const odometerNum = parseFloat(odometer);
    const intervalNum = parseFloat(interval);

    if (isNaN(odometerNum) || isNaN(intervalNum)) {
      Alert.alert('Error', 'Please enter valid numbers for odometer and interval.');
      return;
    }

    const finalServiceType = serviceType === 'Custom' ? (customType.trim() || 'Custom') : serviceType;

    const newService: ServiceEntry = {
      id: isEditing && service ? service.id : Date.now().toString(),
      serviceType: finalServiceType as ServiceType,
      odometer: odometerNum,
      interval: intervalNum,
      nextDue: odometerNum + intervalNum,
      notes,
      date: isEditing && service ? service.date : new Date().toISOString(),
      status: 'pending',
    };

    if (!data) return;

    const newData: AppData = {
      ...data,
      current: newService,
    };

    await saveData(newData);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Service Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={serviceType}
              onValueChange={(value) => setServiceType(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Engine Oil Change" value="Engine Oil Change" />
              <Picker.Item label="Oil Filter Change" value="Oil Filter Change" />
              <Picker.Item label="Air Filter" value="Air Filter" />
              <Picker.Item label="Brake Inspection" value="Brake Inspection" />
              <Picker.Item label="General Service" value="General Service" />
              <Picker.Item label="Custom" value="Custom" />
            </Picker>
          </View>
        </View>

        {serviceType === 'Custom' && (
          <View style={styles.formSection}>
            <Text style={styles.label}>Custom Service Name</Text>
            <TextInput
              style={styles.input}
              value={customType}
              onChangeText={setCustomType}
              placeholder="E.g. Tire Rotation"
              placeholderTextColor="#999"
            />
          </View>
        )}

        <View style={styles.row}>
          <View style={[styles.formSection, { flex: 1, marginRight: theme.spacing.s }]}>
            <Text style={styles.label}>Odometer (km)</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formSection, { flex: 1, marginLeft: theme.spacing.s }]}>
            <Text style={styles.label}>Interval (km)</Text>
            <TextInput
              style={styles.input}
              value={interval}
              onChangeText={setInterval}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional details..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Service' : 'Schedule Service'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.l,
    paddingBottom: 50,
  },
  formSection: {
    marginBottom: theme.spacing.l,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600' as '600',
    marginBottom: theme.spacing.s,
    color: theme.colors.textSecondary,
  },
  pickerContainer: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: theme.colors.textPrimary,
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
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
    ...theme.shadows.card,
  },
  saveButtonText: {
    ...theme.typography.button,
  },
});

export default AddEditServiceScreen;