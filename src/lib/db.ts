import { Database } from 'bun:sqlite';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dataDir, 'stremur.db');
const db = new Database(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Create tables on initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS watch_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    media_id INTEGER NOT NULL,
    season INTEGER,
    episode INTEGER,
    progress REAL NOT NULL CHECK (progress >= 0 AND progress <= 100),
    duration INTEGER NOT NULL,
    last_watched TEXT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    UNIQUE(media_type, media_id, season, episode)
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    media_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    added_at TEXT NOT NULL,
    UNIQUE(media_type, media_id)
  );

  CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON watch_history(last_watched DESC);
  CREATE INDEX IF NOT EXISTS idx_watchlist_added_at ON watchlist(added_at DESC);
`);

// Types
export interface WatchProgressInput {
  media_type: 'movie' | 'tv';
  media_id: number;
  season?: number;
  episode?: number;
  progress: number;
  duration: number;
  title: string;
  poster_path?: string;
}

export interface WatchHistoryItem {
  id: number;
  media_type: 'movie' | 'tv';
  media_id: number;
  season: number | null;
  episode: number | null;
  progress: number;
  duration: number;
  last_watched: string;
  title: string;
  poster_path: string | null;
}

export interface WatchlistInput {
  media_type: 'movie' | 'tv';
  media_id: number;
  title: string;
  poster_path?: string;
}

export interface WatchlistItem {
  id: number;
  media_type: 'movie' | 'tv';
  media_id: number;
  title: string;
  poster_path: string | null;
  added_at: string;
}

// Watch History Functions
export function updateWatchProgress(data: WatchProgressInput): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO watch_history (
      media_type, media_id, season, episode, progress, duration, 
      last_watched, title, poster_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    data.media_type,
    data.media_id,
    data.season ?? null,
    data.episode ?? null,
    data.progress,
    data.duration,
    new Date().toISOString(),
    data.title,
    data.poster_path ?? null
  );
}

export function getWatchHistory(limit?: number): WatchHistoryItem[] {
  if (limit) {
    const stmt = db.prepare('SELECT * FROM watch_history ORDER BY last_watched DESC LIMIT ?');
    return stmt.all(limit) as WatchHistoryItem[];
  }
  const stmt = db.prepare('SELECT * FROM watch_history ORDER BY last_watched DESC');
  return stmt.all() as WatchHistoryItem[];
}

export function getWatchProgress(
  mediaType: 'movie' | 'tv', 
  mediaId: number, 
  season?: number, 
  episode?: number
): WatchHistoryItem | null {
  if (season === undefined && episode === undefined) {
    const stmt = db.prepare(`
      SELECT * FROM watch_history 
      WHERE media_type = ? AND media_id = ? 
      AND season IS NULL AND episode IS NULL
    `);
    return stmt.get(mediaType, mediaId) as WatchHistoryItem | null;
  }
  
  const stmt = db.prepare(`
    SELECT * FROM watch_history 
    WHERE media_type = ? AND media_id = ? 
    AND season = ? AND episode = ?
  `);
  return stmt.get(mediaType, mediaId, season ?? null, episode ?? null) as WatchHistoryItem | null;
}

// Watchlist Functions
export function addToWatchlist(data: WatchlistInput): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO watchlist (
      media_type, media_id, title, poster_path, added_at
    ) VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    data.media_type,
    data.media_id,
    data.title,
    data.poster_path ?? null,
    new Date().toISOString()
  );
}

export function removeFromWatchlist(mediaType: 'movie' | 'tv', mediaId: number): void {
  const stmt = db.prepare('DELETE FROM watchlist WHERE media_type = ? AND media_id = ?');
  stmt.run(mediaType, mediaId);
}

export function getWatchlist(): WatchlistItem[] {
  const stmt = db.prepare('SELECT * FROM watchlist ORDER BY added_at DESC');
  return stmt.all() as WatchlistItem[];
}

export function isInWatchlist(mediaType: 'movie' | 'tv', mediaId: number): boolean {
  const stmt = db.prepare('SELECT 1 FROM watchlist WHERE media_type = ? AND media_id = ? LIMIT 1');
  return !!stmt.get(mediaType, mediaId);
}

export default db;
