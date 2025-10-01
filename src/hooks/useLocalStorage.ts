// hooks/useLocalStorage.ts - Custom hook per gestione localStorage

import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

/**
 * Custom hook per sincronizzare stato con localStorage
 * @param key - Chiave del localStorage
 * @param defaultValue - Valore di default se non esiste nel localStorage
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Inizializza lo stato caricando dal localStorage
  const [value, setValue] = useState<T>(() => {
    return loadFromStorage<T>(key, defaultValue);
  });

  // Sincronizza con localStorage quando il valore cambia
  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  // Wrapper per setValue che supporta anche funzioni
  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    try {
      // Permette di passare una funzione come in useState
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}
