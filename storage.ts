import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './types';

const STORAGE_KEY = 'vehicleMaintenanceData';

const defaultData: AppData = {
  current: null,
  history: [],
  settings: { defaultInterval: 1000 },
};

export const loadData = async (): Promise<AppData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultData;
  } catch (e) {
    console.error('Failed to load data', e);
    return defaultData;
  }
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save data', e);
  }
};