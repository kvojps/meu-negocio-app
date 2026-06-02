/// <reference types="vite/client" />

declare global {
  interface Window {
    appInfo?: {
      electronVersion: string;
      chromeVersion: string;
    };
  }
}

export {};
