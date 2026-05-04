import { ipcMain, IpcMainInvokeEvent } from "electron";
import { ZodError } from "zod";
import { ApiResponse, formatError, formatSuccess } from "../../shared";

export function typedIpcMainHandle<Req, Res>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, payload: Req) => Promise<Res> | Res,
) {
  ipcMain.handle(channel, async (event: IpcMainInvokeEvent, payload: Req) => {
    try {
      const result = await handler(event, payload);
      return formatSuccess(result) as ApiResponse<Res>;
    } catch (err) {
      if (err instanceof ZodError) {
        return formatError(
          err.message,
          "VALIDATION",
          err.issues,
        ) as ApiResponse<Res>;
      }
      const message = err instanceof Error ? err.message : String(err);
      return formatError(message) as ApiResponse<Res>;
    }
  });
}

export default typedIpcMainHandle;
