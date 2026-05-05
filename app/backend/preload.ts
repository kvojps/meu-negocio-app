import { contextBridge, ipcRenderer } from "electron";
import type { AppApi } from "../../shared";

type ApiResult<T extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<T>
>;

function invoke<T>(channel: string, payload?: unknown) {
  return ipcRenderer.invoke(channel, payload) as Promise<T>;
}

const api: AppApi = {
  createProduct: (product) =>
    invoke<ApiResult<AppApi["createProduct"]>>("products:create", product),
  listProducts: () =>
    invoke<ApiResult<AppApi["listProducts"]>>("products:list"),
  updateProduct: (product) =>
    invoke<ApiResult<AppApi["updateProduct"]>>("products:update", product),
  deleteProduct: (payload) =>
    invoke<ApiResult<AppApi["deleteProduct"]>>("products:delete", payload),
  createSale: (sale) =>
    invoke<ApiResult<AppApi["createSale"]>>("sales:create", sale),
  listSales: () => invoke<ApiResult<AppApi["listSales"]>>("sales:list"),
  getSaleById: (payload) =>
    invoke<ApiResult<AppApi["getSaleById"]>>("sales:getById", payload),
  deleteSale: (payload) =>
    invoke<ApiResult<AppApi["deleteSale"]>>("sales:delete", payload),
};

contextBridge.exposeInMainWorld("api", api);
