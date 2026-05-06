import { ipcMain, IpcMainInvokeEvent } from "electron";
import { ZodError } from "zod";
import { ApiResponse, formatError, formatSuccess } from "../../shared";
import { logger } from "./logging/logger";

export function typedIpcMainHandle<Req, Res>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, payload: Req) => Promise<Res> | Res,
) {
  ipcMain.handle(channel, async (event: IpcMainInvokeEvent, payload: Req) => {
    try {
      const result = await handler(event, payload);
      return formatSuccess(result) as ApiResponse<Res>;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;

      if (err instanceof ZodError) {
        logger.warn("IPC", `Validation error on channel ${channel}`, {
          message,
          issues: err.issues,
          payload,
        });
        return formatError(
          err.message,
          "VALIDATION",
          err.issues,
        ) as ApiResponse<Res>;
      }

      logger.error("IPC", `Error on channel ${channel}`, {
        message,
        stack,
        payload,
      });

      return formatError(message) as ApiResponse<Res>;
    }
  });
}

export default typedIpcMainHandle;

