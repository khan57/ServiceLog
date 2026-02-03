import SQLite from 'react-native-sqlite-storage';
import { AppData } from './types';

SQLite.enablePromise(true);

const DB_NAME = 'servicelog.db';
const STORAGE_KEY = 'vehicleMaintenanceData';

const defaultData: AppData = {
  current: null,
  history: [],
  settings: { defaultInterval: 1000 },
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabase({ name: DB_NAME, location: 'default' }).then(
      async (db) => {
        await db.executeSql(
          'CREATE TABLE IF NOT EXISTS app_data (key TEXT PRIMARY KEY, value TEXT NOT NULL);',
        );
        return db;
      },
    );
  }

  return dbPromise;
};

export const loadData = async (): Promise<AppData> => {
  try {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT value FROM app_data WHERE key = ?;',
      [STORAGE_KEY],
    );
    if (result.rows.length === 0) {
      return defaultData;
    }
    const row = result.rows.item(0) as { value: string };
    return JSON.parse(row.value);
  } catch (e) {
    console.error('Failed to load data', e);
    return defaultData;
  }
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    const db = await getDb();
    await db.executeSql(
      'INSERT OR REPLACE INTO app_data (key, value) VALUES (?, ?);',
      [STORAGE_KEY, jsonValue],
    );
  } catch (e) {
    console.error('Failed to save data', e);
  }
};
