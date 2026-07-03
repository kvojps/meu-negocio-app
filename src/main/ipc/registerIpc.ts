import { IPC_CHANNELS } from '@shared/ipc/channels';
import type { Order, OrderStatus } from '@shared/types/order';
import type { Product } from '@shared/types/product';
import type { CompanySettings } from '@shared/types/settings';
import type Database from 'better-sqlite3';
import { ipcMain } from 'electron';
import {
  addOrder,
  deleteOrder,
  getAllOrders,
  setOrderStatus,
  updateOrder,
} from '../db/ordersRepository';
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../db/productsRepository';
import { getSettings, updateSettings } from '../db/settingsRepository';

export function registerIpcHandlers(db: Database.Database): void {
  ipcMain.handle(IPC_CHANNELS.productsGetAll, () => getAllProducts(db));
  ipcMain.handle(
    IPC_CHANNELS.productsAdd,
    (_event, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      addProduct(db, data),
  );
  ipcMain.handle(
    IPC_CHANNELS.productsUpdate,
    (_event, id: string, data: Partial<Product>) => updateProduct(db, id, data),
  );
  ipcMain.handle(IPC_CHANNELS.productsDelete, (_event, id: string) =>
    deleteProduct(db, id),
  );

  ipcMain.handle(IPC_CHANNELS.ordersGetAll, () => getAllOrders(db));
  ipcMain.handle(
    IPC_CHANNELS.ordersAdd,
    (_event, data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
      addOrder(db, data),
  );
  ipcMain.handle(
    IPC_CHANNELS.ordersUpdate,
    (
      _event,
      id: string,
      data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    ) => updateOrder(db, id, data),
  );
  ipcMain.handle(
    IPC_CHANNELS.ordersSetStatus,
    (_event, id: string, newStatus: OrderStatus) =>
      setOrderStatus(db, id, newStatus),
  );
  ipcMain.handle(IPC_CHANNELS.ordersDelete, (_event, id: string) =>
    deleteOrder(db, id),
  );

  ipcMain.handle(IPC_CHANNELS.settingsGet, () => getSettings(db));
  ipcMain.handle(IPC_CHANNELS.settingsUpdate, (_event, data: CompanySettings) =>
    updateSettings(db, data),
  );
}
