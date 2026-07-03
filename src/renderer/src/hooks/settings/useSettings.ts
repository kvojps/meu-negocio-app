import type { CompanySettings } from '@shared/types/settings';
import { useCallback, useEffect, useState } from 'react';

export type { CompanySettings };

const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  cnpj: '',
  phone: '',
  address: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.api.settings.get().then(setSettings);
  }, []);

  const updateField = useCallback(
    <K extends keyof CompanySettings>(field: K, value: CompanySettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [field]: value };
        window.api.settings.update(next);
        return next;
      });
      setSaved(false);
    },
    [],
  );

  const persist = useCallback(() => {
    window.api.settings.update(settings).then(() => setSaved(true));
  }, [settings]);

  return { settings, updateField, persist, saved };
}
