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

// Create database connection
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

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
