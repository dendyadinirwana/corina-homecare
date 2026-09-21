export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: Record<string, unknown>;
}

export interface Env {
  DB: D1Database;
}

export interface BookingRow {
  id: string;
  date: string;
  time: string;
  service_type: string;
  patient_name: string;
  patient_phone: string;
  address: string;
  landmark?: string | null;
  lat?: number | null;
  lng?: number | null;
  complaint: string;
  status: string;
  created_at: string;
}
