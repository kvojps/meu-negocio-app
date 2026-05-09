import { app, BrowserWindow } from "electron";
import { join } from "path";
import { initializeDrizzle } from "./backend/infra/database/config";
import { migrateLegacyDatabase } from "./backend/infra/database/migration";
import { registerProductHandlers } from "./backend/controllers/productsController";
import { registerSaleHandlers } from "./backend/controllers/salesController";
import { registerBackupHandlers } from "./backend/controllers/backupController";
import { logger } from "./backend/infra/logging/logger";

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, "backend", "preload.js"),
    },
  });

  const indexPath = join(__dirname, "renderer", "index.html");
  win.loadFile(indexPath);
  logger.info("APP", "Main window created");
}

app.whenReady().then(async () => {
  logger.info("APP", "Application starting...");

  // 1. Inicializa o Drizzle (cria tabelas e aplica migrations)
  await initializeDrizzle();

  // 2. Extrai dados do banco antigo (se existir) ANTES do Drizzle inicializar
  await migrateLegacyDatabase();

  // 4. Registra handlers de IPC
  registerProductHandlers();
  registerSaleHandlers();
  registerBackupHandlers();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  logger.info("APP", "All windows closed");
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  logger.info("APP", "Application quitting");
});
