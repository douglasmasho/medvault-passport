/**
 * Safe localStorage utility functions to prevent errors when values don't exist
 */

/**
 * Safely get and parse a JSON value from localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or is invalid
 * @returns {any} The parsed value or defaultValue
 */
export const safeGetFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set a JSON value to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 */
export const safeSetToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

/**
 * Safely remove a value from localStorage
 * @param {string} key - The localStorage key
 */
export const safeRemoveFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Check if a localStorage value exists and is valid
 * @param {string} key - The localStorage key
 * @returns {boolean} True if the value exists and is valid
 */
export const hasValidStorageValue = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return false;
    }
    JSON.parse(item); // Test if it's valid JSON
    return true;
  } catch (error) {
    return false;
  }
};
