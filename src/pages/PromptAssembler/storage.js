import { STORAGE_KEY } from './constants';

export function readStoredConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

export function writeStoredConfig(config) {
  try {
    const payload = { ...config, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / privacy errors
  }
}

