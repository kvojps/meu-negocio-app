import type { BackupData, ExportResult, ImportResult } from '@shared/ipc/api';
import { IPC_CHANNELS } from '@shared/ipc/channels';
import type Database from 'better-sqlite3';
import {
  BrowserWindow,
  type IpcMainInvokeEvent,
  dialog,
  ipcMain,
} from 'electron';
import fs from 'node:fs/promises';
import { z } from 'zod';
import { BACKUP_VERSION, exportData, importData } from '../db/backupRepository';

const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  unitCost: z.number().optional().default(0),
});

const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  items: z.array(orderItemSchema),
  manualTotal: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  supplier: z.string(),
  costPrice: z.number(),
  salePrice: z.number(),
  stock: z.number(),
  minStock: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const settingsSchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  phone: z.string(),
  address: z.string(),
});

const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  products: z.array(productSchema),
  orders: z.array(orderSchema),
  settings: settingsSchema,
});

function windowFor(event: IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) {
    throw new Error('No BrowserWindow associated with this IPC event');
  }
  return window;
}

export function registerBackupHandlers(db: Database.Database): void {
  ipcMain.handle(
    IPC_CHANNELS.dataExport,
    async (event): Promise<ExportResult> => {
      const defaultPath = `meu-negocio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const result = await dialog.showSaveDialog(windowFor(event), {
        title: 'Exportar dados',
        defaultPath,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: 'canceled' };
      }

      const data = exportData(db);
      await fs.writeFile(
        result.filePath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
      return { success: true, filePath: result.filePath };
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.dataImport,
    async (event): Promise<ImportResult> => {
      const result = await dialog.showOpenDialog(windowFor(event), {
        title: 'Importar dados',
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, error: 'canceled' };
      }

      let raw: string;
      try {
        raw = await fs.readFile(result.filePaths[0], 'utf-8');
      } catch {
        return { success: false, error: 'read-failed' };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { success: false, error: 'invalid-json' };
      }

      const validated = backupSchema.safeParse(parsed);
      if (!validated.success) {
        return { success: false, error: 'invalid-format' };
      }

      importData(db, validated.data as BackupData);
      return { success: true };
    },
  );
}
