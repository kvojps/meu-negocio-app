/// <reference types="vite/client" />
import type { ElectronApi } from '@shared/ipc/api';

declare global {
  interface Window {
    appInfo?: {
      electronVersion: string;
      chromeVersion: string;
    };
    api: ElectronApi;
  }
}

export {};
