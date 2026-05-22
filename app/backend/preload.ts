import { contextBridge, ipcRenderer } from "electron";
import type { AppApi } from "../shared";

function invoke<T>(channel: string, payload?: unknown) {
  return ipcRenderer.invoke(channel, payload) as Promise<T>;
}

const api: AppApi = {
  createProduct: (product) => invoke("products:create", product),
  listProducts: () => invoke("products:list"),
  getProductStats: () => invoke("products:stats"),
  updateProduct: (product) => invoke("products:update", product),
  deleteProduct: (payload) => invoke("products:delete", payload),
  createSale: (sale) => invoke("sales:create", sale),
  listSales: () => invoke("sales:list"),
  getSaleById: (payload) => invoke("sales:getById", payload),
  deleteSale: (payload) => invoke("sales:delete", payload),
  exportData: () => invoke("dados:exportar"),
  importData: (payload) => invoke("dados:importar", payload),
};

contextBridge.exposeInMainWorld("api", api);
