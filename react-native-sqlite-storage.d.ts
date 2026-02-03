declare module 'react-native-sqlite-storage' {
  export interface OpenDatabaseParams {
    name: string;
    location?: string;
    createFromLocation?: number | string;
  }

  export interface ResultSetRowList {
    length: number;
    item(index: number): any;
  }

  export interface ResultSet {
    rows: ResultSetRowList;
    rowsAffected: number;
    insertId?: number;
  }

  export interface SQLiteDatabase {
    executeSql(
      statement: string,
      params?: any[],
    ): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface SQLiteStatic {
    enablePromise(enabled: boolean): void;
    openDatabase(params: OpenDatabaseParams): Promise<SQLiteDatabase>;
  }

  const SQLite: SQLiteStatic;
  export default SQLite;
}
