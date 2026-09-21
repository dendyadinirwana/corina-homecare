import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Task 2: Cloudflare Pages Functions API Definitions', () => {
  test('functions/types.ts defines Cloudflare Pages Env and BookingRow interfaces', () => {
    const typesPath = path.resolve(process.cwd(), 'functions/types.ts');
    expect.soft(fs.existsSync(typesPath)).toBe(true);
    const content = fs.readFileSync(typesPath, 'utf-8');
    expect.soft(content).toContain('interface Env');
    expect.soft(content).toContain('DB: D1Database');
  });

  test('availability.ts exports onRequestGet returning booked times', () => {
    const availPath = path.resolve(process.cwd(), 'functions/api/bookings/availability.ts');
    expect.soft(fs.existsSync(availPath)).toBe(true);
    const content = fs.readFileSync(availPath, 'utf-8');
    expect.soft(content).toContain('onRequestGet');
    expect.soft(content).toContain('SELECT time FROM bookings');
  });

  test('bookings/index.ts handles atomic insert and catches SQLITE_CONSTRAINT with 409', () => {
    const indexPath = path.resolve(process.cwd(), 'functions/api/bookings/index.ts');
    expect.soft(fs.existsSync(indexPath)).toBe(true);
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect.soft(content).toContain('onRequestGet');
    expect.soft(content).toContain('onRequestPost');
    expect.soft(content).toContain('INSERT INTO bookings');
    expect.soft(content).toContain('409');
    expect.soft(content).toContain('SLOT_ALREADY_BOOKED');
  });
});
