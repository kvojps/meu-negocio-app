import { dialog } from "electron";
import { writeFileSync } from "fs";
import { typedIpcMainHandle } from "../infra/typedIpc";
import {
  exportAllData,
  importAllData,
} from "../repository/drizzleBackupRepository";
import type { BackupData } from "../../shared";
import { BrowserWindow } from "electron";

export function registerBackupHandlers() {
  typedIpcMainHandle<void, { path: string }>(
    "dados:exportar",
    async (event) => {
      const win = BrowserWindow.fromWebContents(
        event.sender,
      );

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const { filePath, canceled } = await dialog.showSaveDialog(
        win!,
        {
          title: "Exportar Backup",
          defaultPath: `backup-${today}.json`,
          filters: [{ name: "JSON", extensions: ["json"] }],
        },
      );

      if (canceled || !filePath) {
        throw new Error("Exportação cancelada pelo usuário.");
      }

      const data = exportAllData();
      writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

      return { path: filePath };
    },
  );

  typedIpcMainHandle<{ data: BackupData }, null>(
    "dados:importar",
    async (_event, payload) => {
      if (!payload?.data || payload.data.version !== 1) {
        throw new Error(
          "Arquivo de backup inválido ou incompatível com esta versão do app.",
        );
      }

      importAllData(payload.data);
      return null;
    },
  );
}
