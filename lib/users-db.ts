import Database from 'better-sqlite3';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import crypto from 'crypto';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'users.db');

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

const usersDb = new Database(DB_PATH);
usersDb.pragma('journal_mode = WAL');

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function initUsersDb() {
  usersDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  usersDb.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
  `);

  // Create default admin if no users exist
  const count = usersDb.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (count.count === 0) {
    const adminHash = hashPassword('admin123');
    usersDb.prepare(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES (?, ?, ?, 'admin', 'active')
    `).run('Administrador', 'admin@misrravb.com', adminHash);
    console.log('Default admin user created: admin@misrravb.com / admin123');
  }
}

initUsersDb();

export function createUser(input: CreateUserInput): UserPublic {
  const passwordHash = hashPassword(input.password);
  const result = usersDb.prepare(`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(input.name, input.email, passwordHash, input.role, input.status || 'active');

  return getUserById(result.lastInsertRowid as number) as UserPublic;
}

export function getUserById(id: number): UserPublic | null {
  return usersDb.prepare(`
    SELECT id, name, email, role, status, created_at, updated_at
    FROM users WHERE id = ?
  `).get(id) as UserPublic | null;
}

export function getUserByEmail(email: string): User | null {
  return usersDb.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | null;
}

export function getUserByEmailWithPassword(email: string): User | null {
  return usersDb.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | null;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export function getUsers(filters?: UserFilters, limit: number = 100, offset: number = 0): { users: UserPublic[], total: number } {
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];

  if (filters?.search) {
    whereClause += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters?.role) {
    whereClause += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters?.status) {
    whereClause += ' AND status = ?';
    params.push(filters.status);
  }

  const countResult = usersDb.prepare(`SELECT COUNT(*) as total FROM users ${whereClause}`).get(...params) as { total: number };

  const users = usersDb.prepare(`
    SELECT id, name, email, role, status, created_at, updated_at
    FROM users ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as unknown as UserPublic[];

  return { users, total: countResult.total };
}

export function updateUser(id: number, input: UpdateUserInput): UserPublic | null {
  const sets: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    sets.push('name = ?');
    values.push(input.name);
  }
  if (input.email !== undefined) {
    sets.push('email = ?');
    values.push(input.email);
  }
  if (input.role !== undefined) {
    sets.push('role = ?');
    values.push(input.role);
  }
  if (input.status !== undefined) {
    sets.push('status = ?');
    values.push(input.status);
  }

  if (sets.length === 0) return getUserById(id);

  sets.push('updated_at = datetime("now")');
  values.push(id);

  usersDb.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return getUserById(id);
}

export function updateUserPassword(id: number, newPassword: string): boolean {
  const passwordHash = hashPassword(newPassword);
  const result = usersDb.prepare(`
    UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?
  `).run(passwordHash, id);
  return result.changes > 0;
}

export function deactivateUser(id: number): boolean {
  const result = usersDb.prepare(`
    UPDATE users SET status = 'inactive', updated_at = datetime('now') WHERE id = ?
  `).run(id);
  return result.changes > 0;
}

export function activateUser(id: number): boolean {
  const result = usersDb.prepare(`
    UPDATE users SET status = 'active', updated_at = datetime('now') WHERE id = ?
  `).run(id);
  return result.changes > 0;
}

export function deleteUser(id: number): boolean {
  const result = usersDb.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

export function loginUser(email: string, password: string): UserPublic | null {
  const user = getUserByEmailWithPassword(email);
  if (!user || user.status !== 'active') return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

export default usersDb;
