import { INITIAL_VEHICLES, INITIAL_MAINTENANCE, INITIAL_EXPENSES, INITIAL_SETTINGS } from '../data/demoData';

const STORAGE_KEYS = {
  VEHICLES: 'autocare_vehicles',
  MAINTENANCE: 'autocare_maintenance',
  EXPENSES: 'autocare_expenses',
  SETTINGS: 'autocare_settings',
  INITIALIZED: 'autocare_initialized'
};

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null ? parsed : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

/**
 * Safely save item to localStorage
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
    return false;
  }
}

/**
 * Initialize storage with demo data if first launch
 */
export function initializeStorage() {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    safeSet(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    safeSet(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    safeSet(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function getStoredVehicles() {
  return safeGet(STORAGE_KEYS.VEHICLES, []);
}

export function saveStoredVehicles(vehicles) {
  return safeSet(STORAGE_KEYS.VEHICLES, vehicles);
}

export function getStoredMaintenance() {
  return safeGet(STORAGE_KEYS.MAINTENANCE, []);
}

export function saveStoredMaintenance(tasks) {
  return safeSet(STORAGE_KEYS.MAINTENANCE, tasks);
}

export function getStoredExpenses() {
  return safeGet(STORAGE_KEYS.EXPENSES, []);
}

export function saveStoredExpenses(expenses) {
  return safeSet(STORAGE_KEYS.EXPENSES, expenses);
}

export function getStoredSettings() {
  return safeGet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveStoredSettings(settings) {
  return safeSet(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Reset all data back to the original demo dataset
 */
export function resetDemoData() {
  safeSet(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  safeSet(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
  safeSet(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return {
    vehicles: INITIAL_VEHICLES,
    maintenance: INITIAL_MAINTENANCE,
    expenses: INITIAL_EXPENSES,
    settings: INITIAL_SETTINGS
  };
}

/**
 * Clear all data (empty garage, zero tasks, zero expenses)
 */
export function clearAllData() {
  safeSet(STORAGE_KEYS.VEHICLES, []);
  safeSet(STORAGE_KEYS.MAINTENANCE, []);
  safeSet(STORAGE_KEYS.EXPENSES, []);
  const cleanSettings = { ...INITIAL_SETTINGS, isDemoActive: false };
  safeSet(STORAGE_KEYS.SETTINGS, cleanSettings);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return {
    vehicles: [],
    maintenance: [],
    expenses: [],
    settings: cleanSettings
  };
}

/**
 * Export all application data as downloadable JSON
 */
export function exportBackup() {
  const data = {
    appName: 'AutoCare Hub',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    vehicles: getStoredVehicles(),
    maintenance: getStoredMaintenance(),
    expenses: getStoredExpenses(),
    settings: getStoredSettings()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `autocare_hub_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate imported JSON backup structure
 */
export function validateImportData(imported) {
  if (!imported || typeof imported !== 'object') {
    return { valid: false, message: 'Invalid JSON file: Root object missing.' };
  }
  if (!Array.isArray(imported.vehicles)) {
    return { valid: false, message: 'Invalid backup: vehicles list is missing or invalid.' };
  }
  if (!Array.isArray(imported.maintenance)) {
    return { valid: false, message: 'Invalid backup: maintenance list is missing or invalid.' };
  }
  if (!Array.isArray(imported.expenses)) {
    return { valid: false, message: 'Invalid backup: expenses list is missing or invalid.' };
  }
  return { valid: true };
}
