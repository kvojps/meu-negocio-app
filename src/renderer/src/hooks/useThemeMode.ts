import { ThemeModeContext } from '@theme/themeModeContext';
import { useContext } from 'react';

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx)
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
