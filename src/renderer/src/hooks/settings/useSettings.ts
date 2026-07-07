import { useCallback, useEffect, useState } from 'react';
import type { CompanySettings } from '@shared/types/settings';
import { call } from '@/api/client';
import { useToast } from '@/contexts/ToastContext';

export type { CompanySettings };

const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  cnpj: '',
  phone: '',
  address: '',
};

export function useSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    call(() => window.api.settings.get())
      .then(setSettings)
      .catch(() => showToast('Erro ao carregar as configurações.', 'error'));
  }, [showToast]);

  const updateField = useCallback(
    <K extends keyof CompanySettings>(field: K, value: CompanySettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [field]: value };
        call(() => window.api.settings.update(next)).catch(() =>
          showToast('Erro ao salvar as configurações.', 'error'),
        );
        return next;
      });
      setSaved(false);
    },
    [showToast],
  );

  const persist = useCallback(() => {
    call(() => window.api.settings.update(settings))
      .then(() => setSaved(true))
      .catch(() => showToast('Erro ao salvar as configurações.', 'error'));
  }, [settings, showToast]);

  return { settings, updateField, persist, saved };
}
