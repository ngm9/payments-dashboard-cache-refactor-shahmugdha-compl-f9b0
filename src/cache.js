import { nowSeconds } from './utils.js';

export function createCache({ namespace } = {}) {
  const memoryStore = new Map();
  const storageKey = (key) => `${namespace || 'cache'}:${key}`;

  function readFromMemory(key) {
    if (!memoryStore.has(key)) {
      return null;
    }
    return memoryStore.get(key) || null;
  }

  function writeToMemory(key, value) {
    memoryStore.set(key, value);
  }

  function readFromStorage(key) {
    try {
      const raw = window.localStorage.getItem(storageKey(key));
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function writeToStorage(key, value) {
    try {
      const payload = JSON.stringify(value);
      window.localStorage.setItem(storageKey(key), payload);
    } catch (_) {
    }
  }

  function get(key) {
    const fromMemory = readFromMemory(key);
    if (fromMemory) {
      return fromMemory;
    }
    const fromStorage = readFromStorage(key);
    if (fromStorage) {
      writeToMemory(key, fromStorage);
      return fromStorage;
    }
    return null;
  }

  function set(key, value) {
    const record = { value, storedAt: nowSeconds() };
    writeToMemory(key, record);
    writeToStorage(key, record);
    return record;
  }

  function clear(key) {
    memoryStore.delete(key);
    try {
      window.localStorage.removeItem(storageKey(key));
    } catch (_) {
    }
  }

  return {
    get,
    set,
    clear
  };
}
