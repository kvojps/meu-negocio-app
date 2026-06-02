import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("appInfo", {
  electronVersion: process.versions.electron,
  chromeVersion: process.versions.chrome,
});
