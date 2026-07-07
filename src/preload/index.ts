import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronApi } from '@shared/ipc/api';
import { IPC_CHANNELS } from '@shared/ipc/channels';
import type { Order, OrderStatus } from '@shared/types/order';
import type { Product } from '@shared/types/product';
import type { CompanySettings } from '@shared/types/settings';

contextBridge.exposeInMainWorld('appInfo', {
  electronVersion: process.versions.electron,
  chromeVersion: process.versions.chrome,
});

const api: ElectronApi = {
  products: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.productsGetAll),
    add: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      ipcRenderer.invoke(IPC_CHANNELS.productsAdd, data),
    update: (id: string, data: Partial<Product>) =>
      ipcRenderer.invoke(IPC_CHANNELS.productsUpdate, id, data),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.productsDelete, id),
  },
  orders: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.ordersGetAll),
    add: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
      ipcRenderer.invoke(IPC_CHANNELS.ordersAdd, data),
    update: (id: string, data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) =>
      ipcRenderer.invoke(IPC_CHANNELS.ordersUpdate, id, data),
    setStatus: (id: string, newStatus: OrderStatus) =>
      ipcRenderer.invoke(IPC_CHANNELS.ordersSetStatus, id, newStatus),
    setPaymentAmount: (id: string, amountPaid: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.ordersSetPaymentAmount, id, amountPaid),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.ordersDelete, id),
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.settingsGet),
    update: (data: CompanySettings) => ipcRenderer.invoke(IPC_CHANNELS.settingsUpdate, data),
  },
  data: {
    export: () => ipcRenderer.invoke(IPC_CHANNELS.dataExport),
    import: () => ipcRenderer.invoke(IPC_CHANNELS.dataImport),
  },
};

contextBridge.exposeInMainWorld('api', api);
