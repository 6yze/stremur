// Check if we're in a Bun environment with SQLite support
const isBunRuntime = typeof process !== 'undefined' && 
  process.versions && 
  'bun' in process.versions;

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

// Stub functions for non-Bun environments (Cloudflare Pages)
// These return empty data - actual persistence happens client-side via localStorage

export function updateWatchProgress(data: WatchProgressInput): void {
  if (!isBunRuntime) {
    console.log('[DB] Skipping server-side watch progress (not Bun runtime)');
    return;
  }
  // Dynamic import only in Bun
  getBunDb().then(db => {
    if (!db) return;
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
  });
}

export function getWatchHistory(limit?: number): WatchHistoryItem[] {
  // In non-Bun environments, return empty array (client handles via localStorage)
  return [];
}

export function getWatchProgress(
  mediaType: 'movie' | 'tv', 
  mediaId: number, 
  season?: number, 
  episode?: number
): WatchHistoryItem | null {
  // In non-Bun environments, return null (client handles via localStorage)
  return null;
}

export function addToWatchlist(data: WatchlistInput): void {
  // Stub for non-Bun
}

export function removeFromWatchlist(mediaType: 'movie' | 'tv', mediaId: number): void {
  // Stub for non-Bun
}

export function getWatchlist(): WatchlistItem[] {
  return [];
}

export function isInWatchlist(mediaType: 'movie' | 'tv', mediaId: number): boolean {
  return false;
}

// Lazy-load Bun SQLite only when needed
let bunDbPromise: Promise<any> | null = null;

async function getBunDb() {
  if (!isBunRuntime) return null;
  
  if (!bunDbPromise) {
    bunDbPromise = (async () => {
      try {
        const { Database } = await import('bun:sqlite');
        const path = await import('path');
        const fs = await import('fs');
        
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const dbPath = path.join(dataDir, 'stremur.db');
        const db = new Database(dbPath);
        db.exec('PRAGMA foreign_keys = ON');
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
        return db;
      } catch (e) {
        console.error('[DB] Failed to initialize Bun SQLite:', e);
        return null;
      }
    })();
  }
  return bunDbPromise;
}

export default { getBunDb };
