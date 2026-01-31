export type ServiceType = string; // Allow custom types

export type ServiceStatus = 'pending' | 'done';

export interface ServiceEntry {
  id: string;
  serviceType: ServiceType;
  odometer: number;
  interval: number;
  nextDue: number;
  notes?: string;
  date: string; // ISO string
  status: ServiceStatus;
}

export interface AppSettings {
  defaultInterval: number;
}

export interface AppData {
  current: ServiceEntry | null;
  history: ServiceEntry[];
  settings: AppSettings;
}