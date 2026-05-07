import type { AppApi } from "../../shared";

declare global {
  interface Window {
    api: AppApi;
  }
}

export {};
