import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Task 1: D1 Database Schema & Wrangler Configuration', () => {
  test('migrations schema file exists and defines bookings table with unique constraint', () => {
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_initial_schema.sql');
    expect.soft(fs.existsSync(migrationPath)).toBe(true);

    const schemaContent = fs.readFileSync(migrationPath, 'utf-8');
    expect.soft(schemaContent).toContain('CREATE TABLE IF NOT EXISTS bookings');
    expect.soft(schemaContent).toContain('CONSTRAINT unique_booking_slot UNIQUE (date, time)');
    expect.soft(schemaContent).toContain('idx_bookings_date');
  });

  test('wrangler configuration file exists with D1 database binding', () => {
    const wranglerPath = path.resolve(process.cwd(), 'wrangler.jsonc');
    expect.soft(fs.existsSync(wranglerPath)).toBe(true);

    const wranglerContent = fs.readFileSync(wranglerPath, 'utf-8');
    expect.soft(wranglerContent).toContain('"binding": "DB"');
    expect.soft(wranglerContent).toContain('"database_name": "homecare-db"');
  });
});
