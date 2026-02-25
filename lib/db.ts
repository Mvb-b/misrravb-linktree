import Database from 'better-sqlite3';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Database path - stored in a data directory
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'analytics.db');

// Ensure directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Lazy database initialization to avoid build errors
let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    // Check if we're in build time (no data dir or special flag)
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    if (isBuildTime) {
      // Return a mock DB for build time
      throw new Error('Database not available during build');
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export { getDb };
export default {
  prepare: (sql: string) => getDb().prepare(sql),
  exec: (sql: string) => getDb().exec(sql),
};

// Initialize tables
export function initDb() {
  // Track clicks on each link
  db.exec(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
      user_agent TEXT,
      ip_hash TEXT,
      referrer TEXT
    )
  `);

  // Track daily aggregated stats (for faster queries)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      total_clicks INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_clicks_platform ON clicks(platform);
    CREATE INDEX IF NOT EXISTS idx_clicks_date ON clicks(date(clicked_at));
    CREATE INDEX IF NOT EXISTS idx_clicks_datetime ON clicks(clicked_at);
  `);
}

// Initialize on import
initDb();

// Initialize devotionals table
export function initDevotionalsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS devotionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      devotional_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT DEFAULT NULL
    )
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_devotionals_status ON devotionals(status);
    CREATE INDEX IF NOT EXISTS idx_devotionals_date ON devotionals(devotional_date);
    CREATE INDEX IF NOT EXISTS idx_devotionals_deleted ON devotionals(deleted_at);
  `);
}

// Initialize devotionals table on import
initDevotionalsTable();

// Devotional types
export interface Devotional {
  id: number;
  title: string;
  content: string;
  devotional_date: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DevotionalInput {
  title: string;
  content: string;
  devotional_date: string;
  status: 'draft' | 'published';
}

// Create devotional
export function createDevotional(input: DevotionalInput): Devotional {
  const stmt = db.prepare(`
    INSERT INTO devotionals (title, content, devotional_date, status)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(input.title, input.content, input.devotional_date, input.status);
  return getDevotionalById(Number(result.lastInsertRowid))!;
}

// Get devotional by id (including soft deleted)
export function getDevotionalById(id: number): Devotional | null {
  const result = db.prepare('SELECT * FROM devotionals WHERE id = ?').get(id);
  return result as Devotional | null;
}

// Get devotional by id (excluding soft deleted)
export function getDevotionalByIdActive(id: number): Devotional | null {
  const result = db.prepare('SELECT * FROM devotionals WHERE id = ? AND deleted_at IS NULL').get(id);
  return result as Devotional | null;
}

// Update devotional
export function updateDevotional(id: number, input: Partial<DevotionalInput>): Devotional {
  const existing = getDevotionalByIdActive(id);
  if (!existing) throw new Error('Devotional not found');

  const updates: string[] = [];
  const values: (string | null)[] = [];

  if (input.title !== undefined) {
    updates.push('title = ?');
    values.push(input.title);
  }
  if (input.content !== undefined) {
    updates.push('content = ?');
    values.push(input.content);
  }
  if (input.devotional_date !== undefined) {
    updates.push('devotional_date = ?');
    values.push(input.devotional_date);
  }
  if (input.status !== undefined) {
    updates.push('status = ?');
    values.push(input.status);
  }

  updates.push('updated_at = datetime("now")');
  values.push(id.toString());

  const stmt = db.prepare(`UPDATE devotionals SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getDevotionalById(id)!;
}

// Soft delete devotional
export function softDeleteDevotional(id: number): boolean {
  const stmt = db.prepare(`UPDATE devotionals SET deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ? AND deleted_at IS NULL`);
  const result = stmt.run(id);
  return result.changes > 0;
}

// Restore soft deleted devotional
export function restoreDevotional(id: number): boolean {
  const stmt = db.prepare(`UPDATE devotionals SET deleted_at = NULL, updated_at = datetime('now') WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

// Hard delete devotional
export function hardDeleteDevotional(id: number): boolean {
  const stmt = db.prepare('DELETE FROM devotionals WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// List devotionals with search and filter
export interface DevotionalFilter {
  status?: 'draft' | 'published';
  search?: string;
  includeDeleted?: boolean;
}

export function listDevotionals(filter: DevotionalFilter = {}): Devotional[] {
  let query = 'SELECT * FROM devotionals WHERE 1=1';
  const params: (string | null)[] = [];

  if (!filter.includeDeleted) {
    query += ' AND deleted_at IS NULL';
  }

  if (filter.status) {
    query += ' AND status = ?';
    params.push(filter.status);
  }

  if (filter.search) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    const searchPattern = `%${filter.search}%`;
    params.push(searchPattern, searchPattern);
  }

  query += ' ORDER BY devotional_date DESC, created_at DESC';

  return db.prepare(query).all(...params) as Devotional[];
}

// Get published devotionals (for public frontend)
export function getPublishedDevotionals(): Devotional[] {
  return db.prepare(`
    SELECT * FROM devotionals 
    WHERE status = 'published' AND deleted_at IS NULL 
    ORDER BY devotional_date DESC
  `).all() as Devotional[];
}

// Get upcoming devotional (nearest future date that is published)
export function getUpcomingDevotional(): Devotional | null {
  const today = new Date().toISOString().split('T')[0];
  return db.prepare(`
    SELECT * FROM devotionals 
    WHERE status = 'published' AND deleted_at IS NULL AND devotional_date >= ?
    ORDER BY devotional_date ASC LIMIT 1
  `).get(today) as Devotional | null;
}

// Register click
export function registerClick({
  platform,
  url,
  userAgent,
  ipHash,
  referrer
}: {
  platform: string;
  url: string;
  userAgent?: string;
  ipHash?: string;
  referrer?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO clicks (platform, url, user_agent, ip_hash, referrer)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(platform, url, userAgent || null, ipHash || null, referrer || null);

  // Update daily stats
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO daily_stats (date, total_clicks, updated_at)
    VALUES (?, 1, datetime('now'))
    ON CONFLICT(date) DO UPDATE SET
      total_clicks = total_clicks + 1,
      updated_at = datetime('now')
  `).run(today);

  return result.lastInsertRowid;
}

// Get total clicks
export function getTotalClicks(): number {
  const result = db.prepare('SELECT COUNT(*) as count FROM clicks').get() as { count: number };
  return result?.count || 0;
}

// Get clicks by platform
export function getClicksByPlatform(): { platform: string; count: number }[] {
  return db.prepare(`
    SELECT platform, COUNT(*) as count
    FROM clicks
    GROUP BY platform
    ORDER BY count DESC
  `).all() as { platform: string; count: number }[];
}

// Get clicks for last N days
export function getClicksLastDays(days: number = 7): { date: string; count: number }[] {
  return db.prepare(`
    SELECT 
      date(clicked_at) as date,
      COUNT(*) as count
    FROM clicks
    WHERE clicked_at >= datetime('now', '-' || ? || ' days')
    GROUP BY date(clicked_at)
    ORDER BY date(clicked_at)
  `).all(days) as { date: string; count: number }[];
}

// Get recent clicks (last 24 hours)
export function getRecentClicks(): number {
  const result = db.prepare(`
    SELECT COUNT(*) as count 
    FROM clicks 
    WHERE clicked_at >= datetime('now', '-24 hours')
  `).get() as { count: number };
  return result?.count || 0;
}

// Get top performing links

// ===== PAYMENTS TABLE =====
export interface Payment {
  id: number;
  paymentRecorderId: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export function initPaymentsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paymentRecorderId TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  
  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_payments_recorder ON payments(paymentRecorderId);
  `);
}

// Initialize payments table
initPaymentsTable();

// Create a new payment
export function createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
  const stmt = db.prepare(`
    INSERT INTO payments (paymentRecorderId, amount, date, description, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    payment.paymentRecorderId,
    payment.amount,
    payment.date,
    payment.description,
    payment.status
  );
  
  return getPaymentById(result.lastInsertRowid as number)!;
}

// Get payment by ID
export function getPaymentById(id: number): Payment | undefined {
  return db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as Payment | undefined;
}

// Get all payments with optional filters
export function getAllPayments(filters?: { 
  startDate?: string; 
  endDate?: string; 
  status?: string;
  recorderId?: string;
}): Payment[] {
  let query = 'SELECT * FROM payments WHERE 1=1';
  const params: any[] = [];
  
  if (filters?.startDate) {
    query += ' AND date >= ?';
    params.push(filters.startDate);
  }
  
  if (filters?.endDate) {
    query += ' AND date <= ?';
    params.push(filters.endDate);
  }
  
  if (filters?.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters?.recorderId) {
    query += ' AND paymentRecorderId = ?';
    params.push(filters.recorderId);
  }
  
  query += ' ORDER BY date DESC, createdAt DESC';
  
  return db.prepare(query).all(...params) as Payment[];
}

// Update a payment
export function updatePayment(id: number, payment: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>): Payment | undefined {
  const updates: string[] = [];
  const params: any[] = [];
  
  if (payment.paymentRecorderId !== undefined) {
    updates.push('paymentRecorderId = ?');
    params.push(payment.paymentRecorderId);
  }
  if (payment.amount !== undefined) {
    updates.push('amount = ?');
    params.push(payment.amount);
  }
  if (payment.date !== undefined) {
    updates.push('date = ?');
    params.push(payment.date);
  }
  if (payment.description !== undefined) {
    updates.push('description = ?');
    params.push(payment.description);
  }
  if (payment.status !== undefined) {
    updates.push('status = ?');
    params.push(payment.status);
  }
  
  if (updates.length === 0) return getPaymentById(id);
  
  updates.push('updatedAt = datetime("now")');
  params.push(id);
  
  const stmt = db.prepare(`
    UPDATE payments 
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  
  stmt.run(...params);
  return getPaymentById(id);
}

// Delete a payment
export function deletePayment(id: number): boolean {
  const result = db.prepare('DELETE FROM payments WHERE id = ?').run(id);
  return result.changes > 0;
}

// Get payment summary by month (for chart)
export function getPaymentsByMonth(): { month: string; total: number; count: number }[] {
  return db.prepare(`
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(amount) as total,
      COUNT(*) as count
    FROM payments
    WHERE status = 'completed'
    GROUP BY month
    ORDER BY month ASC
  `).all() as { month: string; total: number; count: number }[];
}

// Get total payments summary
export function getPaymentsSummary(): { 
  totalCompleted: number; 
  totalPending: number; 
  totalAmount: number;
  countCompleted: number;
  countPending: number;
} {
  const completed = db.prepare(`
    SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
    FROM payments 
    WHERE status = 'completed'
  `).get() as { count: number; total: number };
  
  const pending = db.prepare(`
    SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
    FROM payments 
    WHERE status = 'pending'
  `).get() as { count: number; total: number };
  
  return {
    totalCompleted: completed.total,
    totalPending: pending.total,
    totalAmount: completed.total + pending.total,
    countCompleted: completed.count,
    countPending: pending.count
  };
}
export function getTopLinks(limit: number = 5): { platform: string; url: string; count: number }[] {
  return db.prepare(`
    SELECT platform, url, COUNT(*) as count
    FROM clicks
    GROUP BY url
    ORDER BY count DESC
    LIMIT ?
  `).all(limit) as { platform: string; url: string; count: number }[];
}

// Get all stats for dashboard
export interface AnalyticsStats {
  totalClicks: number;
  clicksLast24h: number;
  clicksByPlatform: { platform: string; count: number }[];
  trend: { date: string; count: number }[];
  topLinks: { platform: string; url: string; count: number }[];
}

export function getAllStats(): AnalyticsStats {
  return {
    totalClicks: getTotalClicks(),
    clicksLast24h: getRecentClicks(),
    clicksByPlatform: getClicksByPlatform(),
    trend: getClicksLastDays(7),
    topLinks: getTopLinks(5)
  };
}

export default db;
