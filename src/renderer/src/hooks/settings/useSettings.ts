import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'meu-negocio-settings';

export interface CompanySettings {
  name: string;
  cnpj: string;
  phone: string;
  address: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  cnpj: '',
  phone: '',
  address: '',
};

function loadSettings(): CompanySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: CompanySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<CompanySettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateField = useCallback(
    <K extends keyof CompanySettings>(field: K, value: CompanySettings[K]) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
      setSaved(false);
    },
    [],
  );

  const persist = useCallback(() => {
    saveSettings(settings);
    setSaved(true);
  }, [settings]);

  return { settings, updateField, persist, saved };
}
