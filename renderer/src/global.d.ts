import type { AppApi } from '../../shared/ipcApi';

declare global {
  interface Window {
    api: AppApi;
  }
}

export {};
