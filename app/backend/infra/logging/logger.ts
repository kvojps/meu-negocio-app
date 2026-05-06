import log from "electron-log";
import { app } from "electron";
import { join } from "path";

// Configure electron-log
// In Electron log v5, transports are accessed via log.transports
log.transports.file.level = "info";

// Set log file location: userData/logs/main.log
if (app.isReady()) {
  log.transports.file.resolvePathFn = () =>
    join(app.getPath("userData"), "logs", "main.log");
} else {
  app.whenReady().then(() => {
    log.transports.file.resolvePathFn = () =>
      join(app.getPath("userData"), "logs", "main.log");
  });
}

// Custom format to ensure consistency
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

export type LogModule = "DATABASE" | "IPC" | "BACKUP" | "APP" | "SYSTEM";

const formatPayload = (payload: unknown) => {
  if (payload === undefined) return undefined;
  try {
    return JSON.stringify(payload);
  } catch (err) {
    return "[Unserializable Payload]";
  }
};

export const logger = {
  error: (module: LogModule, event: string, payload?: unknown) => {
    log.error(`[${module}] ${event} | Payload: ${formatPayload(payload)}`);
  },
  warn: (module: LogModule, event: string, payload?: unknown) => {
    log.warn(`[${module}] ${event} | Payload: ${formatPayload(payload)}`);
  },
  info: (module: LogModule, event: string, payload?: unknown) => {
    log.info(`[${module}] ${event} | Payload: ${formatPayload(payload)}`);
  },
  debug: (module: LogModule, event: string, payload?: unknown) => {
    log.debug(`[${module}] ${event} | Payload: ${formatPayload(payload)}`);
  },
};


export default logger;
