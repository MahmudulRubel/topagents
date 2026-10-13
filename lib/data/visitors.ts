import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface VisitorStats {
  activeNow: number;
  today: number;
  weekly: number;
  monthly: number;
  todayPageviews: number;
  weeklyPageviews: number;
  monthlyPageviews: number;
  updatedAt: string;
}

interface VisitorRecord {
  firstSeen: number;
  lastSeen: number;
  lastDayScored?: string;
}

interface DailyMetric {
  uniqueIds: string[];
  pageviews: number;
}

interface VisitorStoreData {
  /** Map of visitorId -> { firstSeen, lastSeen } */
  visitors: Record<string, VisitorRecord>;
  /** Map of YYYY-MM-DD -> { uniqueIds, pageviews } */
  daily: Record<string, DailyMetric>;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');

// Active window: 2 minutes (120 seconds)
const ACTIVE_WINDOW_MS = 2 * 60 * 1000;
// 7 days in ms
const WEEKLY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
// 30 days in ms
const MONTHLY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
// Retention window: 35 days
const RETENTION_WINDOW_MS = 35 * 24 * 60 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __topagentsVisitorStore: VisitorStoreData | undefined;
  // eslint-disable-next-line no-var
  var __topagentsVisitorWritePromise: Promise<void> | undefined;
}

function getDateKey(timestamp = Date.now()): string {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRecentDateKeys(days: number, now = Date.now()): string[] {
  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    keys.push(getDateKey(now - i * 24 * 60 * 60 * 1000));
  }
  return keys;
}

async function loadStore(): Promise<VisitorStoreData> {
  if (globalThis.__topagentsVisitorStore) {
    return globalThis.__topagentsVisitorStore;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(VISITORS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as VisitorStoreData;
    if (parsed && typeof parsed.visitors === 'object' && typeof parsed.daily === 'object') {
      globalThis.__topagentsVisitorStore = parsed;
      return parsed;
    }
  } catch {
    // File does not exist yet or is invalid; initialize empty store
  }

  const initial: VisitorStoreData = {
    visitors: {},
    daily: {},
    updatedAt: new Date().toISOString(),
  };
  globalThis.__topagentsVisitorStore = initial;
  return initial;
}

async function persistStore(store: VisitorStoreData): Promise<void> {
  store.updatedAt = new Date().toISOString();
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const payload = JSON.stringify(store, null, 2);
    await fs.writeFile(VISITORS_FILE, payload, 'utf-8');
  } catch (err) {
    console.error('[Visitor Tracker] Failed to write visitors.json:', err);
  }
}

function pruneOldEntries(store: VisitorStoreData, now: number): void {
  const cutoff = now - RETENTION_WINDOW_MS;
  for (const [id, rec] of Object.entries(store.visitors)) {
    if (rec.lastSeen < cutoff) {
      delete store.visitors[id];
    }
  }

  const validDays = new Set(getRecentDateKeys(35, now));
  for (const dayKey of Object.keys(store.daily)) {
    if (!validDays.has(dayKey)) {
      delete store.daily[dayKey];
    }
  }
}

function computeStatsFromStore(store: VisitorStoreData, now = Date.now()): VisitorStats {
  const todayKey = getDateKey(now);
  const weekKeys = new Set(getRecentDateKeys(7, now));
  const monthKeys = new Set(getRecentDateKeys(30, now));

  let activeNow = 0;
  let weeklyUniques = 0;
  let monthlyUniques = 0;

  for (const rec of Object.values(store.visitors)) {
    const age = now - rec.lastSeen;
    if (age <= ACTIVE_WINDOW_MS) {
      activeNow++;
    }
    if (age <= WEEKLY_WINDOW_MS) {
      weeklyUniques++;
    }
    if (age <= MONTHLY_WINDOW_MS) {
      monthlyUniques++;
    }
  }

  const todayBucket = store.daily[todayKey];
  const todayUniques = todayBucket ? todayBucket.uniqueIds.length : 0;
  const todayPageviews = todayBucket ? todayBucket.pageviews : 0;

  let weeklyPageviews = 0;
  let monthlyPageviews = 0;
  const weeklyDayUniqueSet = new Set<string>();
  const monthlyDayUniqueSet = new Set<string>();

  for (const [dayKey, metric] of Object.entries(store.daily)) {
    if (weekKeys.has(dayKey)) {
      weeklyPageviews += metric.pageviews;
      for (const uid of metric.uniqueIds) weeklyDayUniqueSet.add(uid);
    }
    if (monthKeys.has(dayKey)) {
      monthlyPageviews += metric.pageviews;
      for (const uid of metric.uniqueIds) monthlyDayUniqueSet.add(uid);
    }
  }

  const today = Math.max(todayUniques, activeNow);
  const weekly = Math.max(weeklyUniques, weeklyDayUniqueSet.size, today);
  const monthly = Math.max(monthlyUniques, monthlyDayUniqueSet.size, weekly);

  return {
    activeNow,
    today,
    weekly,
    monthly,
    todayPageviews: Math.max(todayPageviews, today),
    weeklyPageviews: Math.max(weeklyPageviews, weekly),
    monthlyPageviews: Math.max(monthlyPageviews, monthly),
    updatedAt: new Date(now).toISOString(),
  };
}

/**
 * Generates a deterministic anonymous visitor ID from IP + User-Agent when client ID is absent.
 */
export function deriveFallbackVisitorId(ip: string, userAgent: string): string {
  return 'v_' + crypto.createHash('sha256').update(`${ip}|${userAgent}`).digest('hex').slice(0, 20);
}

/**
 * Records a real visitor heartbeat or pageview and returns current live + today + weekly + monthly stats.
 */
export async function recordVisitorHeartbeat(
  visitorId: string,
  isPageview = false
): Promise<VisitorStats> {
  const store = await loadStore();
  const now = Date.now();
  const todayKey = getDateKey(now);

  const sanitizedId = visitorId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'anon_default';

  const existing = store.visitors[sanitizedId];
  if (existing) {
    existing.lastSeen = now;
  } else {
    store.visitors[sanitizedId] = {
      firstSeen: now,
      lastSeen: now,
      lastDayScored: todayKey,
    };
  }

  if (!store.daily[todayKey]) {
    store.daily[todayKey] = {
      uniqueIds: [],
      pageviews: 0,
    };
  }

  const todayMetric = store.daily[todayKey];
  const isNewToday = !todayMetric.uniqueIds.includes(sanitizedId);
  if (isNewToday) {
    todayMetric.uniqueIds.push(sanitizedId);
  }

  if (isPageview || isNewToday) {
    todayMetric.pageviews += 1;
  }

  pruneOldEntries(store, now);
  await persistStore(store);

  return computeStatsFromStore(store, now);
}

/**
 * Reads the current real visitor statistics without mutating state.
 */
export async function getVisitorStats(): Promise<VisitorStats> {
  const store = await loadStore();
  return computeStatsFromStore(store, Date.now());
}
